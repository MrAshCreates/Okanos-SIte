// Core Data Models for Okanos - Navigate the Sea of Your Finances

export type UXMode = "normal" | "simple" | "advanced";

export type StrategyType =
  | "all_cash"
  | "only_credit"
  | "50_30_20"
  | "buy_borrow_die"
  | "investing_focused";

export type AccountType = "checking" | "savings" | "credit_card" | "loan" | "investment" | "other";

export type PayType = "hourly" | "salary" | "fixed_monthly";

export type PayFrequency = "weekly" | "biweekly" | "semi_monthly" | "monthly";

export type PeriodType = "monthly";

export type CategoryGroup = "Needs" | "Wants" | "Savings" | "Debt";

export type TipSeverity = "warning" | "info" | "praise";

export interface User {
  id: string;
  displayName: string;
  email: string;
  settings: UserSettings;
}

export interface UserSettings {
  theme: "light" | "dark" | "auto";
  mode: UXMode;
  currency: string;
  selectedStrategy?: StrategyType;
  taxRate?: number; // Default tax assumption (e.g., 0.25 for 25%)
}

export interface Account {
  id: string;
  userId: string;
  type: AccountType;
  name: string;
  institutionName?: string;
  last4?: string;
  creditLimit?: number; // For credit cards
  currentBalance: number;
  interestRateAnnual?: number;
  minimumPayment?: number;
  dueDayOfMonth?: number; // For revolving debt
  termMonths?: number; // For loans
  startDate?: string; // ISO date string for loans
  promoAprRate?: number;
  promoAprEndDate?: string; // ISO date string
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncomeSource {
  id: string;
  userId: string;
  name: string;
  payType: PayType;
  hourlyRate?: number;
  expectedHoursPerWeek?: number;
  fixedMonthlyAmount?: number;
  payFrequency: PayFrequency;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string; // Nullable for cash transactions
  date: string; // ISO date string
  amount: number; // Positive for inflow, negative for outflow
  categoryId: string;
  description: string;
  isPlanned: boolean;
  isSettled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  group: CategoryGroup;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetPeriod {
  id: string;
  userId: string;
  periodType: PeriodType;
  year: number;
  month: number; // 1-12
  strategyType: StrategyType;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetLine {
  id: string;
  budgetPeriodId: string;
  categoryId: string;
  plannedAmount: number;
  actualAmount: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StrategyConfig {
  id: string;
  userId: string;
  strategyType: StrategyType;
  configJson: Record<string, unknown>; // Strategy-specific parameters
  createdAt: string;
  updatedAt: string;
}

export interface Tip {
  id: string;
  userId: string;
  severity: TipSeverity;
  shortText: string;
  longExplanation: string;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreditProfileSnapshot {
  id: string;
  userId: string;
  date: string; // ISO date string
  mockScore: number; // 0-850 scale simulation
  totalUtilization: number; // Percentage
  dtiRatio: number; // Percentage
  onTimePaymentRatio: number; // Percentage
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// Utility types for calculations
export interface UtilizationData {
  accountId: string;
  accountName: string;
  balance: number;
  limit: number;
  utilization: number; // Percentage
}

export interface DebtPaymentProjection {
  accountId: string;
  accountName: string;
  currentBalance: number;
  monthlyInterest: number;
  lifetimeInterest: number;
  payoffMonths: number;
  payoffDate: string; // ISO date string
}

export interface IncomeScenario {
  name: string;
  hoursPerWeek?: number;
  monthlyIncome: number;
  netIncome: number;
  availableBudget: number;
  savingsCapacity: number;
  impactOnDTI: number;
}

export interface BudgetSummary {
  totalIncome: number;
  needs: {
    planned: number;
    actual: number;
    remaining: number;
    percentage: number;
  };
  wants: {
    planned: number;
    actual: number;
    remaining: number;
    percentage: number;
  };
  savings: {
    planned: number;
    actual: number;
    remaining: number;
    percentage: number;
  };
  debt: {
    planned: number;
    actual: number;
    remaining: number;
    percentage: number;
  };
}

export interface DashboardMetrics {
  mockCreditScore: number;
  dtiRatio: number;
  totalUtilization: number;
  monthlyInterestAccrual: number;
  monthlyIncome: number;
  monthlySpending: number;
  budgetStatus: BudgetSummary;
  upcomingDueDates: Array<{
    accountId: string;
    accountName: string;
    dueDate: string;
    minimumPayment: number;
  }>;
  expiringPromos: Array<{
    accountId: string;
    accountName: string;
    promoEndDate: string;
    regularRate: number;
  }>;
  tipOfTheDay?: Tip;
}
