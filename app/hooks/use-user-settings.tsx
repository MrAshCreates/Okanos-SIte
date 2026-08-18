// Custom hook for accessing user settings and triggering re-renders on changes
import { useState, useEffect } from "react";
import type { User, UXMode, StrategyType } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";

export function useUserSettings() {
  const [user, setUser] = useState<User | null>(authService.getCurrentUser());

  useEffect(() => {
    // Check for settings updates (could be triggered by storage events)
    const handleStorageChange = () => {
      setUser(authService.getCurrentUser());
    };

    window.addEventListener("storage", handleStorageChange);
    
    // Custom event for same-window updates
    window.addEventListener("user-settings-updated", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("user-settings-updated", handleStorageChange);
    };
  }, []);

  const mode: UXMode = user?.settings.mode || "normal";
  const strategy: StrategyType = user?.settings.selectedStrategy || "50_30_20";
  const taxRate: number = user?.settings.taxRate || 0.25;
  const currency: string = user?.settings.currency || "USD";

  return {
    user,
    mode,
    strategy,
    taxRate,
    currency,
    isSimple: mode === "simple",
    isNormal: mode === "normal",
    isAdvanced: mode === "advanced",
  };
}
