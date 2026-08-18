// Financial calculation utilities

import type {
  Account,
  IncomeSource,
  BudgetSummary,
  UtilizationData,
  DebtPaymentProjection,
  IncomeScenario,
  StrategyType,
} from "../types";
import { addMonths } from "./helpers";

/**
 * Calculate monthly income from an income source
 */
export function calculateMonthlyIncome(source: IncomeSource): number {
  if (source.payType === "fixed_monthly") {
    return source.fixedMonthlyAmount || 0;
  }

  if (source.payType === "hourly") {
    const hourlyRate = source.hourlyRate || 0;
    const hoursPerWeek = source.expectedHoursPerWeek || 0;
    const weeksPerYear = 52;
    const monthsPerYear = 12;

    return (hourlyRate * hoursPerWeek * weeksPerYear) / monthsPerYear;
  }

  if (source.payType === "salary") {
    return source.fixedMonthlyAmount || 0;
  }

  return 0;
}

/**
 * Calculate total monthly income from all active sources
 */
export function calculateTotalMonthlyIncome(sources: IncomeSource[]): number {
  return sources.filter((s) => s.isActive).reduce((sum, source) => sum + calculateMonthlyIncome(source), 0);
}

/**
 * Calculate net income after taxes
 */
export function calculateNetIncome(grossIncome: number, taxRate: number): number {
  return grossIncome * (1 - taxRate);
}

/**
 * Calculate credit card utilization
 */
export function calculateUtilization(balance: number, limit: number): number {
  if (limit <= 0) return 0;
  return (balance / limit) * 100;
}

/**
 * Get utilization data for all credit cards
 */
export function getUtilizationData(accounts: Account[]): UtilizationData[] {
  return accounts
    .filter((a) => a.type === "credit_card" && a.creditLimit)
    .map((account) => ({
      accountId: account.id,
      accountName: account.name,
      balance: account.currentBalance,
      limit: account.creditLimit || 0,
      utilization: calculateUtilization(account.currentBalance, account.creditLimit || 0),
    }));
}

/**
 * Calculate overall credit utilization
 */
export function calculateOverallUtilization(accounts: Account[]): number {
  const creditCards = accounts.filter((a) => a.type === "credit_card" && a.creditLimit);

  const totalBalance = creditCards.reduce((sum, acc) => sum + acc.currentBalance, 0);
  const totalLimit = creditCards.reduce((sum, acc) => sum + (acc.creditLimit || 0), 0);

  return calculateUtilization(totalBalance, totalLimit);
}

/**
 * Calculate monthly interest for a credit card or loan
 */
export function calculateMonthlyInterest(balance: number, annualRate: number, useDailyCompounding = false): number {
  if (balance <= 0 || annualRate <= 0) return 0;

  if (useDailyCompounding) {
    const dailyRate = annualRate / 365 / 100;
    const daysInMonth = 30; // Average
    return balance * dailyRate * daysInMonth;
  }

  // Simple monthly approximation
  const monthlyRate = annualRate / 12 / 100;
  return balance * monthlyRate;
}

/**
 * Calculate total monthly interest across all accounts
 */
export function calculateTotalMonthlyInterest(accounts: Account[], useDailyCompounding = false): number {
  return accounts
    .filter((a) => a.currentBalance > 0 && a.interestRateAnnual)
    .reduce((sum, account) => {
      const rate = account.interestRateAnnual || 0;
      return sum + calculateMonthlyInterest(account.currentBalance, rate, useDailyCompounding);
    }, 0);
}

/**
 * Calculate debt-to-income ratio
 */
export function calculateDTI(accounts: Account[], monthlyIncome: number): number {
  if (monthlyIncome <= 0) return 0;

  const totalMonthlyDebt = accounts
    .filter((a) => (a.type === "credit_card" || a.type === "loan") && a.minimumPayment)
    .reduce((sum, acc) => sum + (acc.minimumPayment || 0), 0);

  return (totalMonthlyDebt / monthlyIncome) * 100;
}

/**
 * Calculate debt payoff projection
 */
export function calculateDebtPayoff(
  account: Account,
  extraPayment = 0,
  useDailyCompounding = false
): DebtPaymentProjection | null {
  if (!account.interestRateAnnual || account.currentBalance <= 0) return null;

  const balance = account.currentBalance;
  const annualRate = account.interestRateAnnual;
  const minimumPayment = account.minimumPayment || balance * 0.02; // 2% minimum if not set
  const totalPayment = minimumPayment + extraPayment;

  let remainingBalance = balance;
  let totalInterest = 0;
  let months = 0;
  const maxMonths = 600; // 50 years cap

  while (remainingBalance > 0 && months < maxMonths) {
    const monthlyInterest = calculateMonthlyInterest(remainingBalance, annualRate, useDailyCompounding);
    totalInterest += monthlyInterest;

    const principal = totalPayment - monthlyInterest;
    remainingBalance -= principal;

    months++;

    if (principal <= 0) {
      // Payment doesn't cover interest
      return null;
    }
  }

  const payoffDate = addMonths(new Date(), months).toISOString();

  return {
    accountId: account.id,
    accountName: account.name,
    currentBalance: balance,
    monthlyInterest: calculateMonthlyInterest(balance, annualRate, useDailyCompounding),
    lifetimeInterest: totalInterest,
    payoffMonths: months,
    payoffDate,
  };
}

/**
 * Calculate mock credit score (simplified simulation)
 */
export function calculateMockCreditScore(
  utilization: number,
  dtiRatio: number,
  onTimePaymentRatio: number,
  averageAccountAgeMonths: number
): number {
  let score = 300; // Start at minimum

  // Utilization impact (30% weight)
  if (utilization === 0) {
    score += 150; // Excellent
  } else if (utilization < 10) {
    score += 140;
  } else if (utilization < 30) {
    score += 120;
  } else if (utilization < 50) {
    score += 80;
  } else if (utilization < 75) {
    score += 40;
  } else {
    score += 10; // Poor
  }

  // Payment history (35% weight)
  score += onTimePaymentRatio * 1.8;

  // DTI impact (15% weight)
  if (dtiRatio < 20) {
    score += 80;
  } else if (dtiRatio < 36) {
    score += 60;
  } else if (dtiRatio < 43) {
    score += 40;
  } else {
    score += 10;
  }

  // Account age (15% weight - simplified)
  if (averageAccountAgeMonths >= 84) {
    // 7+ years
    score += 80;
  } else if (averageAccountAgeMonths >= 60) {
    // 5+ years
    score += 60;
  } else if (averageAccountAgeMonths >= 36) {
    // 3+ years
    score += 40;
  } else {
    score += 20;
  }

  // Account mix bonus (5% weight - simplified)
  score += 20;

  return Math.min(850, Math.max(300, Math.round(score)));
}

/**
 * Calculate budget allocations based on strategy
 */
export function calculateBudgetAllocations(
  monthlyIncome: number,
  strategy: StrategyType
): { needs: number; wants: number; savings: number; debt: number } {
  switch (strategy) {
    case "50_30_20":
      return {
        needs: monthlyIncome * 0.5,
        wants: monthlyIncome * 0.3,
        savings: monthlyIncome * 0.2,
        debt: 0,
      };

    case "all_cash":
      return {
        needs: monthlyIncome * 0.7,
        wants: monthlyIncome * 0.2,
        savings: monthlyIncome * 0.1,
        debt: 0,
      };

    case "only_credit":
      return {
        needs: monthlyIncome * 0.4,
        wants: monthlyIncome * 0.3,
        savings: monthlyIncome * 0.2,
        debt: monthlyIncome * 0.1,
      };

    case "investing_focused":
      return {
        needs: monthlyIncome * 0.4,
        wants: monthlyIncome * 0.2,
        savings: monthlyIncome * 0.4,
        debt: 0,
      };

    case "buy_borrow_die":
      return {
        needs: monthlyIncome * 0.3,
        wants: monthlyIncome * 0.4,
        savings: monthlyIncome * 0.2,
        debt: monthlyIncome * 0.1,
      };

    default:
      return {
        needs: monthlyIncome * 0.5,
        wants: monthlyIncome * 0.3,
        savings: monthlyIncome * 0.2,
        debt: 0,
      };
  }
}

/**
 * Generate income scenarios
 */
export function generateIncomeScenarios(
  source: IncomeSource,
  hoursOptions: number[],
  taxRate: number
): IncomeScenario[] {
  if (source.payType !== "hourly") return [];

  return hoursOptions.map((hours) => {
    const hourlyRate = source.hourlyRate || 0;
    const weeksPerYear = 52;
    const monthsPerYear = 12;

    const grossMonthly = (hourlyRate * hours * weeksPerYear) / monthsPerYear;
    const netMonthly = calculateNetIncome(grossMonthly, taxRate);

    return {
      name: `${hours} hrs/week`,
      hoursPerWeek: hours,
      monthlyIncome: grossMonthly,
      netIncome: netMonthly,
      availableBudget: netMonthly,
      savingsCapacity: netMonthly * 0.2, // Simplified
      impactOnDTI: 0, // Would need full calculation
    };
  });
}
