// Dashboard Metrics Service

import type { Account, BudgetLine, BudgetSummary, Category, DashboardMetrics, StrategyType } from "../types";
import { authService } from "./auth.service";
import { accountService } from "./account.service";
import { incomeService } from "./income.service";
import { budgetService } from "./budget.service";
import { tipService } from "./tip.service";
import {
  calculateTotalMonthlyIncome,
  calculateOverallUtilization,
  calculateDTI,
  calculateTotalMonthlyInterest,
  calculateMockCreditScore,
  calculateBudgetAllocations,
} from "../utils/calculations";
import { addMonths } from "../utils/helpers";

class DashboardService {
  /**
   * Get comprehensive dashboard metrics
   */
  getDashboardMetrics(): DashboardMetrics | null {
    const user = authService.getCurrentUser();
    if (!user) return null;

    const accounts = accountService.getAccounts(user.id);
    const incomeSources = incomeService.getActiveIncomeSources(user.id);
    const budgetPeriod = budgetService.getCurrentBudgetPeriod(user.id, user.settings.selectedStrategy);
    const categories = budgetService.getCategories(user.id);
    const budgetLines = budgetService.getBudgetLines(budgetPeriod.id, user.id);

    // Calculate income
    const monthlyIncome = calculateTotalMonthlyIncome(incomeSources);

    // Calculate credit metrics
    const totalUtilization = calculateOverallUtilization(accounts);
    const dtiRatio = calculateDTI(accounts, monthlyIncome);
    const monthlyInterest = calculateTotalMonthlyInterest(accounts, true);

    // Calculate mock credit score
    const onTimePaymentRatio = 100; // Simplified - assume perfect payment history
    const averageAccountAgeMonths = this.calculateAverageAccountAge(accounts);
    const mockCreditScore = calculateMockCreditScore(
      totalUtilization,
      dtiRatio,
      onTimePaymentRatio,
      averageAccountAgeMonths
    );

    // Calculate budget status
    const budgetStatus = this.calculateBudgetSummary(
      monthlyIncome,
      budgetPeriod.strategyType,
      categories,
      budgetLines
    );

    // Calculate monthly spending
    const monthlySpending = budgetStatus.needs.actual + budgetStatus.wants.actual + budgetStatus.savings.actual + budgetStatus.debt.actual;

    // Get upcoming due dates
    const upcomingDueDates = this.getUpcomingDueDates(accounts);

    // Get expiring promos
    const expiringPromos = this.getExpiringPromos(accounts);

    // Get tip of the day
    const tipOfTheDay = tipService.getTipOfTheDay(user.id);

    return {
      mockCreditScore,
      dtiRatio,
      totalUtilization,
      monthlyInterestAccrual: monthlyInterest,
      monthlyIncome,
      monthlySpending,
      budgetStatus,
      upcomingDueDates,
      expiringPromos,
      tipOfTheDay: tipOfTheDay || undefined,
    };
  }

  /**
   * Calculate budget summary
   */
  private calculateBudgetSummary(
    monthlyIncome: number,
    strategyType: StrategyType,
    categories: Category[],
    budgetLines: BudgetLine[],
  ): BudgetSummary {
    const allocations = calculateBudgetAllocations(monthlyIncome, strategyType);

    const calculateGroupTotals = (group: string) => {
      const groupCategories = categories.filter(c => c.group === group);
      const groupLines = budgetLines.filter(bl => 
        groupCategories.some(c => c.id === bl.categoryId)
      );

      const planned = groupLines.reduce((sum, line) => sum + line.plannedAmount, 0);
      const actual = groupLines.reduce((sum, line) => sum + line.actualAmount, 0);
      const remaining = planned - actual;

      return { planned, actual, remaining };
    };

    const needs = calculateGroupTotals("Needs");
    const wants = calculateGroupTotals("Wants");
    const savings = calculateGroupTotals("Savings");
    const debt = calculateGroupTotals("Debt");

    return {
      totalIncome: monthlyIncome,
      needs: {
        ...needs,
        percentage: monthlyIncome > 0 ? (needs.planned / monthlyIncome) * 100 : 0,
      },
      wants: {
        ...wants,
        percentage: monthlyIncome > 0 ? (wants.planned / monthlyIncome) * 100 : 0,
      },
      savings: {
        ...savings,
        percentage: monthlyIncome > 0 ? (savings.planned / monthlyIncome) * 100 : 0,
      },
      debt: {
        ...debt,
        percentage: monthlyIncome > 0 ? (debt.planned / monthlyIncome) * 100 : 0,
      },
    };
  }

  /**
   * Get upcoming due dates
   */
  private getUpcomingDueDates(accounts: Account[]) {
    const now = new Date();
    const thirtyDaysFromNow = addMonths(now, 1);

    return accounts
      .filter((a): a is Account & { dueDayOfMonth: number; minimumPayment: number } =>
        a.dueDayOfMonth != null && a.minimumPayment != null,
      )
      .map((account) => {
        const dueDate = new Date(now.getFullYear(), now.getMonth(), account.dueDayOfMonth);
        if (dueDate < now) {
          dueDate.setMonth(dueDate.getMonth() + 1);
        }

        return {
          accountId: account.id,
          accountName: account.name,
          dueDate: dueDate.toISOString(),
          minimumPayment: account.minimumPayment,
        };
      })
      .filter(item => new Date(item.dueDate) <= thirtyDaysFromNow)
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  /**
   * Get expiring promotional APRs
   */
  private getExpiringPromos(accounts: Account[]) {
    const now = new Date();
    const ninetyDaysFromNow = addMonths(now, 3);

    return accounts
      .filter((a): a is Account & { promoAprEndDate: string } => a.promoAprRate !== undefined && Boolean(a.promoAprEndDate))
      .map((account) => ({
        accountId: account.id,
        accountName: account.name,
        promoEndDate: account.promoAprEndDate,
        regularRate: account.interestRateAnnual || 0,
      }))
      .filter(item => {
        const endDate = new Date(item.promoEndDate);
        return endDate <= ninetyDaysFromNow && endDate >= now;
      })
      .sort((a, b) => new Date(a.promoEndDate).getTime() - new Date(b.promoEndDate).getTime());
  }

  /**
   * Calculate average account age in months
   */
  private calculateAverageAccountAge(accounts: Account[]): number {
    if (accounts.length === 0) return 0;

    const now = new Date();
    const totalMonths = accounts.reduce((sum, account) => {
      const createdDate = new Date(account.createdAt);
      const months = (now.getFullYear() - createdDate.getFullYear()) * 12 + 
                     (now.getMonth() - createdDate.getMonth());
      return sum + Math.max(0, months);
    }, 0);

    return totalMonths / accounts.length;
  }
}

export const dashboardService = new DashboardService();
