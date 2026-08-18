// Budget Management Service

import type { BudgetPeriod, BudgetLine, Category, StrategyType, CategoryGroup } from "../types";
import { storage } from "../utils/storage";
import { generateId, getCurrentISODate, getCurrentMonthYear } from "../utils/helpers";
import { parseNonNegativeNumber, sanitizeText } from "../utils/validation";

class BudgetService {
  private readonly BUDGET_PERIODS_KEY = "budget_periods";
  private readonly BUDGET_LINES_KEY = "budget_lines";
  private readonly CATEGORIES_KEY = "categories";

  /**
   * Get or create current budget period
   */
  getCurrentBudgetPeriod(userId: string, strategyType?: StrategyType): BudgetPeriod {
    const { year, month } = getCurrentMonthYear();

    const existing = this.getBudgetPeriod(userId, year, month);
    if (existing) return existing;

    return this.createBudgetPeriod(userId, year, month, strategyType || "50_30_20");
  }

  /**
   * Get budget period by year and month
   */
  getBudgetPeriod(userId: string, year: number, month: number): BudgetPeriod | null {
    const all = storage.get<BudgetPeriod[]>(this.BUDGET_PERIODS_KEY) || [];
    return all.find((bp) => bp.userId === userId && bp.year === year && bp.month === month) || null;
  }

  /**
   * Create budget period
   */
  createBudgetPeriod(userId: string, year: number, month: number, strategyType: StrategyType): BudgetPeriod {
    const all = storage.get<BudgetPeriod[]>(this.BUDGET_PERIODS_KEY) || [];

    const newPeriod: BudgetPeriod = {
      id: generateId(),
      userId,
      periodType: "monthly",
      year,
      month,
      strategyType,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newPeriod);
    storage.set(this.BUDGET_PERIODS_KEY, all);

    return newPeriod;
  }

  /**
   * Update budget period strategy
   */
  updateBudgetPeriodStrategy(periodId: string, userId: string, strategyType: StrategyType): BudgetPeriod | null {
    const all = storage.get<BudgetPeriod[]>(this.BUDGET_PERIODS_KEY) || [];
    const index = all.findIndex((bp) => bp.id === periodId && bp.userId === userId);

    if (index === -1) return null;

    all[index] = {
      ...all[index],
      strategyType,
      updatedAt: getCurrentISODate(),
    };

    storage.set(this.BUDGET_PERIODS_KEY, all);
    return all[index];
  }

  /**
   * Get all categories for a user
   */
  getCategories(userId: string): Category[] {
    const all = storage.get<Category[]>(this.CATEGORIES_KEY) || [];
    let userCategories = all.filter((c) => c.userId === userId);

    if (userCategories.length === 0) {
      userCategories = this.initializeDefaultCategories(userId);
    }

    return userCategories;
  }

  /**
   * Initialize default categories
   */
  private initializeDefaultCategories(userId: string): Category[] {
    const defaults: Array<{ name: string; group: CategoryGroup }> = [
      { name: "Housing", group: "Needs" },
      { name: "Utilities", group: "Needs" },
      { name: "Groceries", group: "Needs" },
      { name: "Transportation", group: "Needs" },
      { name: "Insurance", group: "Needs" },
      { name: "Healthcare", group: "Needs" },
      { name: "Dining Out", group: "Wants" },
      { name: "Entertainment", group: "Wants" },
      { name: "Shopping", group: "Wants" },
      { name: "Hobbies", group: "Wants" },
      { name: "Emergency Fund", group: "Savings" },
      { name: "Retirement", group: "Savings" },
      { name: "Investments", group: "Savings" },
      { name: "Credit Cards", group: "Debt" },
      { name: "Loans", group: "Debt" },
    ];

    const all = storage.get<Category[]>(this.CATEGORIES_KEY) || [];
    const newCategories: Category[] = [];

    defaults.forEach((def) => {
      const category: Category = {
        id: generateId(),
        userId,
        name: def.name,
        group: def.group,
        createdAt: getCurrentISODate(),
        updatedAt: getCurrentISODate(),
      };
      newCategories.push(category);
      all.push(category);
    });

    storage.set(this.CATEGORIES_KEY, all);
    return newCategories;
  }

  /**
   * Create category
   */
  createCategory(userId: string, name: string, group: CategoryGroup): Category {
    const all = storage.get<Category[]>(this.CATEGORIES_KEY) || [];
    const safeName = sanitizeText(name, 60);
    if (!safeName) {
      throw new Error("Category name is required");
    }

    const newCategory: Category = {
      id: generateId(),
      userId,
      name: safeName,
      group,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newCategory);
    storage.set(this.CATEGORIES_KEY, all);

    return newCategory;
  }

  /**
   * Get budget lines for a period owned by the user
   */
  getBudgetLines(budgetPeriodId: string, userId: string): BudgetLine[] {
    if (!this.getPeriodForUser(budgetPeriodId, userId)) return [];
    const all = storage.get<BudgetLine[]>(this.BUDGET_LINES_KEY) || [];
    return all.filter((bl) => bl.budgetPeriodId === budgetPeriodId);
  }

  /**
   * Get or create budget line
   */
  getOrCreateBudgetLine(budgetPeriodId: string, userId: string, categoryId: string): BudgetLine | null {
    if (!this.getPeriodForUser(budgetPeriodId, userId)) return null;
    const existing = this.getBudgetLine(budgetPeriodId, categoryId);
    if (existing) return existing;

    return this.createBudgetLine(budgetPeriodId, userId, categoryId, 0);
  }

  /**
   * Get budget line
   */
  private getBudgetLine(budgetPeriodId: string, categoryId: string): BudgetLine | null {
    const all = storage.get<BudgetLine[]>(this.BUDGET_LINES_KEY) || [];
    return all.find((bl) => bl.budgetPeriodId === budgetPeriodId && bl.categoryId === categoryId) || null;
  }

  /**
   * Create budget line
   */
  createBudgetLine(budgetPeriodId: string, userId: string, categoryId: string, plannedAmount: number): BudgetLine | null {
    if (!this.getPeriodForUser(budgetPeriodId, userId)) return null;
    const all = storage.get<BudgetLine[]>(this.BUDGET_LINES_KEY) || [];

    const newLine: BudgetLine = {
      id: generateId(),
      budgetPeriodId,
      categoryId,
      plannedAmount: parseNonNegativeNumber(plannedAmount),
      actualAmount: 0,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newLine);
    storage.set(this.BUDGET_LINES_KEY, all);

    return newLine;
  }

  /**
   * Update budget line owned via the user's period
   */
  updateBudgetLine(
    id: string,
    userId: string,
    updates: Partial<Omit<BudgetLine, "id" | "budgetPeriodId" | "categoryId" | "createdAt">>,
  ): BudgetLine | null {
    const all = storage.get<BudgetLine[]>(this.BUDGET_LINES_KEY) || [];
    const index = all.findIndex((bl) => bl.id === id);

    if (index === -1) return null;
    if (!this.getPeriodForUser(all[index].budgetPeriodId, userId)) return null;

    const nextUpdates = { ...updates };
    if (nextUpdates.plannedAmount !== undefined) {
      nextUpdates.plannedAmount = parseNonNegativeNumber(nextUpdates.plannedAmount);
    }
    if (nextUpdates.actualAmount !== undefined) {
      nextUpdates.actualAmount = parseNonNegativeNumber(nextUpdates.actualAmount);
    }

    all[index] = {
      ...all[index],
      ...nextUpdates,
      updatedAt: getCurrentISODate(),
    };

    storage.set(this.BUDGET_LINES_KEY, all);
    return all[index];
  }

  private getPeriodForUser(periodId: string, userId: string): BudgetPeriod | null {
    const all = storage.get<BudgetPeriod[]>(this.BUDGET_PERIODS_KEY) || [];
    return all.find((bp) => bp.id === periodId && bp.userId === userId) || null;
  }
}

export const budgetService = new BudgetService();
