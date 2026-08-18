// Income Source Management Service

import type { IncomeSource } from "../types";
import { storage } from "../utils/storage";
import { generateId, getCurrentISODate } from "../utils/helpers";
import { parseOptionalNonNegativeNumber, sanitizeText } from "../utils/validation";

class IncomeService {
  private readonly INCOME_KEY = "income_sources";

  /**
   * Get all income sources for a user
   */
  getIncomeSources(userId: string): IncomeSource[] {
    const all = storage.get<IncomeSource[]>(this.INCOME_KEY) || [];
    return all.filter((i) => i.userId === userId);
  }

  /**
   * Get active income sources
   */
  getActiveIncomeSources(userId: string): IncomeSource[] {
    return this.getIncomeSources(userId).filter((i) => i.isActive);
  }

  /**
   * Get income source by ID for a specific user
   */
  getIncomeSource(id: string, userId: string): IncomeSource | null {
    const all = storage.get<IncomeSource[]>(this.INCOME_KEY) || [];
    return all.find((i) => i.id === id && i.userId === userId) || null;
  }

  /**
   * Create new income source
   */
  createIncomeSource(userId: string, data: Omit<IncomeSource, "id" | "userId" | "createdAt" | "updatedAt">): IncomeSource {
    const all = storage.get<IncomeSource[]>(this.INCOME_KEY) || [];
    const name = sanitizeText(data.name, 80);
    if (!name) {
      throw new Error("Income source name is required");
    }

    const newSource: IncomeSource = {
      ...data,
      name,
      hourlyRate: parseOptionalNonNegativeNumber(data.hourlyRate),
      expectedHoursPerWeek: parseOptionalNonNegativeNumber(data.expectedHoursPerWeek),
      fixedMonthlyAmount: parseOptionalNonNegativeNumber(data.fixedMonthlyAmount),
      id: generateId(),
      userId,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newSource);
    storage.set(this.INCOME_KEY, all);

    return newSource;
  }

  /**
   * Update income source owned by the current user
   */
  updateIncomeSource(
    id: string,
    userId: string,
    updates: Partial<Omit<IncomeSource, "id" | "userId" | "createdAt">>,
  ): IncomeSource | null {
    const all = storage.get<IncomeSource[]>(this.INCOME_KEY) || [];
    const index = all.findIndex((i) => i.id === id && i.userId === userId);

    if (index === -1) return null;

    const nextUpdates = { ...updates };
    if (nextUpdates.name !== undefined) {
      nextUpdates.name = sanitizeText(nextUpdates.name, 80);
      if (!nextUpdates.name) return null;
    }
    if (nextUpdates.hourlyRate !== undefined) {
      nextUpdates.hourlyRate = parseOptionalNonNegativeNumber(nextUpdates.hourlyRate);
    }
    if (nextUpdates.expectedHoursPerWeek !== undefined) {
      nextUpdates.expectedHoursPerWeek = parseOptionalNonNegativeNumber(nextUpdates.expectedHoursPerWeek);
    }
    if (nextUpdates.fixedMonthlyAmount !== undefined) {
      nextUpdates.fixedMonthlyAmount = parseOptionalNonNegativeNumber(nextUpdates.fixedMonthlyAmount);
    }

    all[index] = {
      ...all[index],
      ...nextUpdates,
      updatedAt: getCurrentISODate(),
    };

    storage.set(this.INCOME_KEY, all);

    return all[index];
  }

  /**
   * Delete income source owned by the current user
   */
  deleteIncomeSource(id: string, userId: string): boolean {
    const all = storage.get<IncomeSource[]>(this.INCOME_KEY) || [];
    const filtered = all.filter((i) => !(i.id === id && i.userId === userId));

    if (filtered.length === all.length) return false;

    storage.set(this.INCOME_KEY, filtered);
    return true;
  }
}

export const incomeService = new IncomeService();
