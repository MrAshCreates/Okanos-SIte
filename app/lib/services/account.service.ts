// Account Management Service

import type { Account } from "../types";
import { storage } from "../utils/storage";
import { generateId, getCurrentISODate } from "../utils/helpers";
import { parseLast4, parseNonNegativeNumber, parseOptionalNonNegativeNumber, sanitizeText } from "../utils/validation";

class AccountService {
  private readonly ACCOUNTS_KEY = "accounts";

  /**
   * Get all accounts for a user
   */
  getAccounts(userId: string): Account[] {
    const all = storage.get<Account[]>(this.ACCOUNTS_KEY) || [];
    return all.filter((a) => a.userId === userId);
  }

  /**
   * Get account by ID for a specific user
   */
  getAccount(id: string, userId: string): Account | null {
    const all = storage.get<Account[]>(this.ACCOUNTS_KEY) || [];
    return all.find((a) => a.id === id && a.userId === userId) || null;
  }

  /**
   * Create new account
   */
  createAccount(userId: string, data: Omit<Account, "id" | "userId" | "createdAt" | "updatedAt">): Account {
    const all = storage.get<Account[]>(this.ACCOUNTS_KEY) || [];
    const name = sanitizeText(data.name, 80);
    if (!name) {
      throw new Error("Account name is required");
    }

    const newAccount: Account = {
      ...data,
      name,
      last4: parseLast4(data.last4),
      currentBalance: parseNonNegativeNumber(data.currentBalance),
      creditLimit: parseOptionalNonNegativeNumber(data.creditLimit),
      interestRateAnnual: parseOptionalNonNegativeNumber(data.interestRateAnnual),
      minimumPayment: parseOptionalNonNegativeNumber(data.minimumPayment),
      dueDayOfMonth: this.normalizeDueDay(data.dueDayOfMonth),
      termMonths: data.termMonths !== undefined ? Math.max(1, Math.round(parseNonNegativeNumber(data.termMonths))) : undefined,
      id: generateId(),
      userId,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newAccount);
    storage.set(this.ACCOUNTS_KEY, all);

    return newAccount;
  }

  /**
   * Update account owned by the current user
   */
  updateAccount(id: string, userId: string, updates: Partial<Omit<Account, "id" | "userId" | "createdAt">>): Account | null {
    const all = storage.get<Account[]>(this.ACCOUNTS_KEY) || [];
    const index = all.findIndex((a) => a.id === id && a.userId === userId);

    if (index === -1) return null;

    const nextUpdates = { ...updates };
    if (nextUpdates.name !== undefined) {
      nextUpdates.name = sanitizeText(nextUpdates.name, 80);
      if (!nextUpdates.name) return null;
    }
    if (nextUpdates.last4 !== undefined) {
      nextUpdates.last4 = parseLast4(nextUpdates.last4);
    }
    if (nextUpdates.currentBalance !== undefined) {
      nextUpdates.currentBalance = parseNonNegativeNumber(nextUpdates.currentBalance);
    }
    if (nextUpdates.creditLimit !== undefined) {
      nextUpdates.creditLimit = parseOptionalNonNegativeNumber(nextUpdates.creditLimit);
    }
    if (nextUpdates.interestRateAnnual !== undefined) {
      nextUpdates.interestRateAnnual = parseOptionalNonNegativeNumber(nextUpdates.interestRateAnnual);
    }
    if (nextUpdates.minimumPayment !== undefined) {
      nextUpdates.minimumPayment = parseOptionalNonNegativeNumber(nextUpdates.minimumPayment);
    }
    if (nextUpdates.dueDayOfMonth !== undefined) {
      nextUpdates.dueDayOfMonth = this.normalizeDueDay(nextUpdates.dueDayOfMonth);
    }
    if (nextUpdates.termMonths !== undefined) {
      nextUpdates.termMonths = Math.max(1, Math.round(parseNonNegativeNumber(nextUpdates.termMonths)));
    }

    all[index] = {
      ...all[index],
      ...nextUpdates,
      updatedAt: getCurrentISODate(),
    };

    storage.set(this.ACCOUNTS_KEY, all);

    return all[index];
  }

  /**
   * Delete account owned by the current user
   */
  deleteAccount(id: string, userId: string): boolean {
    const all = storage.get<Account[]>(this.ACCOUNTS_KEY) || [];
    const filtered = all.filter((a) => !(a.id === id && a.userId === userId));

    if (filtered.length === all.length) return false;

    storage.set(this.ACCOUNTS_KEY, filtered);
    return true;
  }

  /**
   * Get credit cards only
   */
  getCreditCards(userId: string): Account[] {
    return this.getAccounts(userId).filter((a) => a.type === "credit_card");
  }

  /**
   * Get loans only
   */
  getLoans(userId: string): Account[] {
    return this.getAccounts(userId).filter((a) => a.type === "loan");
  }

  private normalizeDueDay(value: number | undefined): number | undefined {
    if (value === undefined) return undefined;
    const day = Math.round(parseNonNegativeNumber(value));
    if (day < 1 || day > 31) return undefined;
    return day;
  }
}

export const accountService = new AccountService();
