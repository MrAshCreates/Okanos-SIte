// LocalStorage utility with type safety and prototype-pollution guards

import { reviveJson } from "./validation";

class StorageService {
  private prefix = "okanos_";

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = window.localStorage.getItem(this.prefix + key);
      if (!item) return null;
      return JSON.parse(item, reviveJson) as T;
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error reading from localStorage (key: ${key}):`, error);
      }
      return null;
    }
  }

  set<T>(key: string, value: T): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.setItem(this.prefix + key, JSON.stringify(value));
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error writing to localStorage (key: ${key}):`, error);
      }
    }
  }

  remove(key: string): void {
    if (typeof window === "undefined") return;

    try {
      window.localStorage.removeItem(this.prefix + key);
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error(`Error removing from localStorage (key: ${key}):`, error);
      }
    }
  }

  clear(): void {
    if (typeof window === "undefined") return;

    try {
      const keys = Object.keys(window.localStorage);
      keys.forEach((key) => {
        if (key.startsWith(this.prefix)) {
          window.localStorage.removeItem(key);
        }
      });
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error("Error clearing localStorage:", error);
      }
    }
  }
}

export const storage = new StorageService();
