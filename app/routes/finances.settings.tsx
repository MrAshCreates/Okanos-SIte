import { useState } from "react";
import type { Route } from "./+types/finances.settings";
import type { UXMode, StrategyType } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Button } from "~/components/ui/button/button";
import { Label } from "~/components/ui/label/label";
import { Input } from "~/components/ui/input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import { Settings as SettingsIcon, Save } from "lucide-react";
import { clampRatio } from "~/lib/utils/validation";
import styles from "./finances.settings.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - Okanos" },
    { name: "description", content: "Customize your voyage" },
  ];
}

export default function FinancesSettings() {
  const [user, setUser] = useState(authService.getCurrentUser());
  const [mode, setMode] = useState<UXMode>(user?.settings.mode || "normal");
  const [strategy, setStrategy] = useState<StrategyType>(user?.settings.selectedStrategy || "50_30_20");
  const [taxRate, setTaxRate] = useState<string>(((user?.settings.taxRate || 0.25) * 100).toString());
  const [currency, setCurrency] = useState(user?.settings.currency || "USD");

  const handleSave = () => {
    authService.updateUserSettings({
      mode,
      selectedStrategy: strategy,
      taxRate: clampRatio(parseFloat(taxRate) / 100),
      currency,
    });

    setUser(authService.getCurrentUser());
    
    // Dispatch custom event to notify all components
    window.dispatchEvent(new Event("user-settings-updated"));
    
    alert("Settings saved successfully!");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Customize your Okanos experience</p>
        </div>
      </header>

      {/* User Profile */}
      <Card className={styles.settingsCard}>
        <CardHeader>
          <CardTitle>User Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.profileInfo}>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Name:</span>
              <span className={styles.profileValue}>{user?.displayName}</span>
            </div>
            <div className={styles.profileItem}>
              <span className={styles.profileLabel}>Email:</span>
              <span className={styles.profileValue}>{user?.email}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Experience Settings */}
      <Card className={styles.settingsCard}>
        <CardHeader>
          <CardTitle>
            <SettingsIcon className={styles.cardIcon} />
            Experience Settings
          </CardTitle>
          <CardDescription>Customize how you interact with the FCC</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.settingsGrid}>
            <div className={styles.settingItem}>
              <Label htmlFor="mode">UX Mode</Label>
              <Select value={mode} onValueChange={(value: UXMode) => setMode(value)}>
                <SelectTrigger id="mode">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="simple">Simple</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
              <p className={styles.settingDescription}>
                Controls the level of detail and complexity shown throughout the app
              </p>
            </div>

            <div className={styles.settingItem}>
              <Label htmlFor="strategy">Financial Strategy</Label>
              <Select value={strategy} onValueChange={(value: StrategyType) => setStrategy(value)}>
                <SelectTrigger id="strategy">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="50_30_20">50/30/20 Rule</SelectItem>
                  <SelectItem value="all_cash">All Cash</SelectItem>
                  <SelectItem value="only_credit">Only Credit</SelectItem>
                  <SelectItem value="investing_focused">Investing Focused</SelectItem>
                  <SelectItem value="buy_borrow_die">Buy, Borrow, Die</SelectItem>
                </SelectContent>
              </Select>
              <p className={styles.settingDescription}>
                Your default budgeting and financial planning approach
              </p>
            </div>

            <div className={styles.settingItem}>
              <Label htmlFor="taxRate">Estimated Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="25"
                min="0"
                max="100"
              />
              <p className={styles.settingDescription}>
                Used for net income calculations (e.g., 25 for 25%)
              </p>
            </div>

            <div className={styles.settingItem}>
              <Label htmlFor="currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="currency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD ($)</SelectItem>
                  <SelectItem value="EUR">EUR (€)</SelectItem>
                  <SelectItem value="GBP">GBP (£)</SelectItem>
                  <SelectItem value="CAD">CAD ($)</SelectItem>
                </SelectContent>
              </Select>
              <p className={styles.settingDescription}>
                Display currency for all monetary values
              </p>
            </div>
          </div>

          <Button onClick={handleSave} className={styles.saveButton}>
            <Save className={styles.buttonIcon} />
            Save Settings
          </Button>
        </CardContent>
      </Card>

      {/* Appearance Settings */}
      <Card className={styles.settingsCard}>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.appearanceSection}>
            <div className={styles.settingItem}>
              <Label>Theme</Label>
              <div className={styles.themeToggle}>
                <ColorSchemeToggle />
              </div>
              <p className={styles.settingDescription}>
                Switch between light, dark, and system theme
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About FCC Beta */}
      <Card className={styles.settingsCard}>
        <CardHeader>
          <CardTitle>About FCC Beta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.aboutSection}>
            <p className={styles.aboutText}>
              <strong>Okanos (Beta)</strong> - Navigate the sea of your finances
            </p>
            <p className={styles.aboutText}>
              Version 1.0.0 (Beta)
            </p>
            <p className={styles.aboutText}>
              The FCC is in active development. Features are being added and refined based on user feedback.
              Your data is stored locally in your browser.
            </p>
            <p className={styles.aboutText}>
              <a href="/" className={styles.aboutLink}>Learn more about Okanos</a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
