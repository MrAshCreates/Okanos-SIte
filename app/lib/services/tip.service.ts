// Tips & Accountability Service

import type { Tip, TipSeverity } from "../types";
import { storage } from "../utils/storage";
import { generateId, getCurrentISODate } from "../utils/helpers";
import { sanitizeText } from "../utils/validation";

class TipService {
  private readonly TIPS_KEY = "tips";

  /**
   * Get all tips for a user
   */
  getTips(userId: string): Tip[] {
    const all = storage.get<Tip[]>(this.TIPS_KEY) || [];
    return all.filter((t) => t.userId === userId);
  }

  /**
   * Get unresolved tips
   */
  getUnresolvedTips(userId: string): Tip[] {
    return this.getTips(userId).filter((t) => !t.resolved);
  }

  /**
   * Get tip of the day (most recent unresolved)
   */
  getTipOfTheDay(userId: string): Tip | null {
    const unresolved = this.getUnresolvedTips(userId);
    if (unresolved.length === 0) return null;

    unresolved.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return unresolved[0];
  }

  /**
   * Create tip
   */
  createTip(userId: string, severity: TipSeverity, shortText: string, longExplanation: string): Tip {
    const all = storage.get<Tip[]>(this.TIPS_KEY) || [];
    const safeShort = sanitizeText(shortText, 160);
    const safeLong = sanitizeText(longExplanation, 600);

    const newTip: Tip = {
      id: generateId(),
      userId,
      severity,
      shortText: safeShort,
      longExplanation: safeLong,
      resolved: false,
      createdAt: getCurrentISODate(),
      updatedAt: getCurrentISODate(),
    };

    all.push(newTip);
    storage.set(this.TIPS_KEY, all);

    return newTip;
  }

  /**
   * Mark tip as resolved
   */
  resolveTip(id: string, userId: string): Tip | null {
    const all = storage.get<Tip[]>(this.TIPS_KEY) || [];
    const index = all.findIndex((t) => t.id === id && t.userId === userId);

    if (index === -1) return null;

    all[index] = {
      ...all[index],
      resolved: true,
      updatedAt: getCurrentISODate(),
    };

    storage.set(this.TIPS_KEY, all);
    return all[index];
  }

  /**
   * Generate tips based on financial data
   */
  generateDynamicTips(
    userId: string,
    data: {
      utilization: number;
      dtiRatio: number;
      budgetOverspend?: number;
      positiveProgress?: boolean;
    },
  ): void {
    const { utilization, dtiRatio, budgetOverspend, positiveProgress } = data;

    if (utilization > 75) {
      this.createTipOnce(
        userId,
        "warning",
        "Your credit utilization is too high!",
        `At ${utilization.toFixed(1)}%, you're hurting your credit score. Aim to keep utilization below 30%. Pay down your balances or request credit limit increases.`,
      );
    }

    if (dtiRatio > 43) {
      this.createTipOnce(
        userId,
        "warning",
        "Your debt-to-income ratio is concerning.",
        `At ${dtiRatio.toFixed(1)}%, lenders may view you as high-risk. Try to reduce monthly debt payments or increase your income. Aim for below 36%.`,
      );
    }

    if (budgetOverspend && budgetOverspend > 0) {
      this.createTipOnce(
        userId,
        "warning",
        "You're overspending this month!",
        `You've exceeded your budget by $${budgetOverspend.toFixed(2)}. Review your spending in the Budget section and cut back on non-essentials.`,
      );
    }

    if (positiveProgress) {
      this.createTipOnce(
        userId,
        "praise",
        "Great job! You're making progress.",
        "Your financial metrics are improving. Keep up the good work with consistent payments and smart budgeting!",
      );
    }

    if (utilization > 30 && utilization <= 75) {
      this.createTipOnce(
        userId,
        "info",
        "Consider reducing your credit utilization.",
        `At ${utilization.toFixed(1)}%, your utilization is moderate but could be better. Aim for below 30% to maximize your credit score potential.`,
      );
    }
  }

  private createTipOnce(userId: string, severity: TipSeverity, shortText: string, longExplanation: string): void {
    const exists = this.getUnresolvedTips(userId).some((tip) => tip.shortText === shortText);
    if (exists) return;
    this.createTip(userId, severity, shortText, longExplanation);
  }
}

export const tipService = new TipService();
