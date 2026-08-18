// Authentication and User Management Service

import type { User, UserSettings } from "../types";
import { storage } from "../utils/storage";
import { generateId } from "../utils/helpers";
import { clampRatio, isValidEmail, normalizeEmail, sanitizeText } from "../utils/validation";

class AuthService {
  private readonly USER_KEY = "current_user";
  private readonly USERS_KEY = "users";

  /**
   * Get current logged-in user
   */
  getCurrentUser(): User | null {
    return storage.get<User>(this.USER_KEY);
  }

  /**
   * Create or login user (simplified for V1 - no real auth)
   */
  login(email: string, displayName: string): User {
    const normalizedEmail = normalizeEmail(email);
    const safeName = sanitizeText(displayName, 80);

    if (!isValidEmail(normalizedEmail) || !safeName) {
      throw new Error("A valid email and display name are required");
    }

    const existingUser = this.getUserByEmail(normalizedEmail);

    if (existingUser) {
      const currentUser: User = {
        ...existingUser,
        email: normalizedEmail,
        displayName: safeName || existingUser.displayName,
        settings: {
          ...existingUser.settings,
          taxRate: clampRatio(existingUser.settings.taxRate ?? 0.25),
        },
      };
      storage.set(this.USER_KEY, currentUser);
      return currentUser;
    }

    const newUser: User = {
      id: generateId(),
      email: normalizedEmail,
      displayName: safeName,
      settings: {
        theme: "dark",
        mode: "normal",
        currency: "USD",
        taxRate: 0.25,
      },
    };

    const users = storage.get<User[]>(this.USERS_KEY) || [];
    users.push(newUser);
    storage.set(this.USERS_KEY, users);
    storage.set(this.USER_KEY, newUser);

    return newUser;
  }

  /**
   * Logout current user
   */
  logout(): void {
    storage.remove(this.USER_KEY);
  }

  /**
   * Update user settings
   */
  updateUserSettings(updates: Partial<UserSettings>): User | null {
    const user = this.getCurrentUser();
    if (!user) return null;

    const nextSettings: UserSettings = {
      ...user.settings,
      ...updates,
    };

    if (updates.taxRate !== undefined) {
      nextSettings.taxRate = clampRatio(updates.taxRate);
    }

    user.settings = nextSettings;

    const users = storage.get<User[]>(this.USERS_KEY) || [];
    const index = users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      users[index] = user;
      storage.set(this.USERS_KEY, users);
    }

    storage.set(this.USER_KEY, user);

    return user;
  }

  /**
   * Get user by email
   */
  private getUserByEmail(email: string): User | null {
    const users = storage.get<User[]>(this.USERS_KEY) || [];
    return users.find((u) => u.email === email) || null;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Check if user has completed onboarding
   */
  hasCompletedOnboarding(): boolean {
    const user = this.getCurrentUser();
    return !!user?.settings.selectedStrategy;
  }
}

export const authService = new AuthService();
