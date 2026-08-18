import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.budget";
import type { BudgetPeriod, Category, BudgetLine, StrategyType } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";
import { budgetService } from "~/lib/services/budget.service";
import { incomeService } from "~/lib/services/income.service";
import { useUserSettings } from "~/hooks/use-user-settings";
import { calculateTotalMonthlyIncome, calculateBudgetAllocations } from "~/lib/utils/calculations";
import { formatCurrency } from "~/lib/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Input } from "~/components/ui/input/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import { Skeleton } from "~/components/ui/skeleton/skeleton";
import { PieChart, Wallet, Info } from "lucide-react";
import styles from "./finances.budget.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Budget - Okanos" },
    { name: "description", content: "Manage your financial tides" },
  ];
}

interface BudgetLineWithCategory extends BudgetLine {
  category: Category;
}

export default function FinancesBudget() {
  const [budgetPeriod, setBudgetPeriod] = useState<BudgetPeriod | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgetLines, setBudgetLines] = useState<BudgetLineWithCategory[]>([]);
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>("50_30_20");
  const [loading, setLoading] = useState(true);
  const { mode, isSimple, isAdvanced } = useUserSettings();

  useEffect(() => {
    loadBudgetData();
  }, []);

  // Reload budget when settings change
  useEffect(() => {
    const handleSettingsUpdate = () => loadBudgetData();
    window.addEventListener("user-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("user-settings-updated", handleSettingsUpdate);
  }, []);

  const loadBudgetData = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const period = budgetService.getCurrentBudgetPeriod(user.id, user.settings.selectedStrategy);
    setBudgetPeriod(period);
    setSelectedStrategy(period.strategyType);

    const cats = budgetService.getCategories(user.id);
    setCategories(cats);

    const lines = budgetService.getBudgetLines(period.id, user.id);
    const linesWithCategories = lines.map(line => ({
      ...line,
      category: cats.find(c => c.id === line.categoryId)!,
    })).filter(line => line.category);

    // Initialize budget lines for all categories
    cats.forEach(cat => {
      if (!lines.find(l => l.categoryId === cat.id)) {
        const newLine = budgetService.getOrCreateBudgetLine(period.id, user.id, cat.id);
        if (!newLine) return;
        linesWithCategories.push({
          ...newLine,
          category: cat,
        });
      }
    });

    setBudgetLines(linesWithCategories);

    const sources = incomeService.getActiveIncomeSources(user.id);
    const income = calculateTotalMonthlyIncome(sources);
    setMonthlyIncome(income);
    setLoading(false);
  };

  const handleStrategyChange = (newStrategy: StrategyType) => {
    if (!budgetPeriod) return;
    const user = authService.getCurrentUser();
    if (!user) return;

    setSelectedStrategy(newStrategy);
    budgetService.updateBudgetPeriodStrategy(budgetPeriod.id, user.id, newStrategy);
    
    // Update user settings
    authService.updateUserSettings({ selectedStrategy: newStrategy });
    
    // Dispatch event to notify other components
    window.dispatchEvent(new Event("user-settings-updated"));
    
    loadBudgetData();
  };

  const handlePlannedAmountChange = (lineId: string, value: string) => {
    const user = authService.getCurrentUser();
    if (!user) return;
    const amount = parseFloat(value) || 0;
    budgetService.updateBudgetLine(lineId, user.id, { plannedAmount: amount });
    loadBudgetData();
  };

  const calculateGroupTotals = (group: string) => {
    const groupLines = budgetLines.filter(l => l.category.group === group);
    const planned = groupLines.reduce((sum, line) => sum + line.plannedAmount, 0);
    const actual = groupLines.reduce((sum, line) => sum + line.actualAmount, 0);
    const remaining = planned - actual;
    return { planned, actual, remaining };
  };

  const allocations = calculateBudgetAllocations(monthlyIncome, selectedStrategy);

  const groups = [
    { name: "Needs", target: allocations.needs, color: "var(--color-danger-bg)" },
    { name: "Wants", target: allocations.wants, color: "var(--color-pop-bg)" },
    { name: "Savings", target: allocations.savings, color: "var(--color-success-bg)" },
    { name: "Debt", target: allocations.debt, color: "var(--color-base-text-muted)" },
  ];

  // Filter groups for simple mode (only show groups with targets > 0)
  const visibleGroups = isSimple 
    ? groups.filter(g => g.target > 0 && g.name !== "Debt")
    : groups;

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Skeleton style={{ height: '40px', width: '200px' }} />
          <Skeleton style={{ height: '40px', width: '250px' }} />
        </header>
        <Card>
          <CardContent>
            <Skeleton style={{ height: '200px', width: '100%' }} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>
            Budget Management
            {isSimple && <span className={styles.modeTag}> (Simple)</span>}
            {isAdvanced && <span className={styles.modeTag}> (Advanced)</span>}
          </h1>
          <p className={styles.subtitle}>Plan and track your monthly spending</p>
        </div>
        {/* Hide strategy selector in simple mode */}
        {!isSimple && (
          <div className={styles.strategySelector}>
            <label className={styles.strategyLabel}>Financial Strategy:</label>
            <Select value={selectedStrategy} onValueChange={(value) => handleStrategyChange(value as StrategyType)}>
              <SelectTrigger className={styles.strategySelect}>
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
          </div>
        )}
      </header>

      {/* Strategy Visualization */}
      <Card className={styles.visualCard}>
        <CardHeader>
          <CardTitle>
            <PieChart className={styles.cardIcon} />
            Budget Allocation {!isSimple && "Target"}
          </CardTitle>
          <CardDescription>
            Monthly Income: {formatCurrency(monthlyIncome)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.allocationGrid} data-mode={mode}>
            {visibleGroups.map(group => {
              const totals = calculateGroupTotals(group.name);
              const targetPercentage = group.target > 0 ? (group.target / monthlyIncome) * 100 : 0;
              const actualPercentage = monthlyIncome > 0 ? (totals.planned / monthlyIncome) * 100 : 0;
              
              return (
                <div key={group.name} className={styles.allocationCard}>
                  <div className={styles.allocationHeader}>
                    <span className={styles.allocationName}>
                      <span className={styles.allocationDot} style={{ backgroundColor: group.color }} />
                      {group.name}
                    </span>
                    <span className={styles.allocationPercentage}>
                      {actualPercentage.toFixed(0)}%
                    </span>
                  </div>
                  {!isSimple && (
                    <div className={styles.allocationTarget}>
                      Target: {formatCurrency(group.target)} ({targetPercentage.toFixed(0)}%)
                    </div>
                  )}
                  <div className={styles.allocationPlanned}>
                    {isSimple ? "Budget" : "Planned"}: {formatCurrency(totals.planned)}
                  </div>
                  <div className={styles.allocationBar}>
                    <div
                      className={styles.allocationBarFill}
                      style={{
                        width: `${Math.min(100, actualPercentage)}%`,
                        backgroundColor: group.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Strategy Info - Advanced Mode Only */}
      {isAdvanced && (
        <Card className={styles.infoCard}>
          <CardHeader>
            <CardTitle>
              <Info className={styles.cardIcon} />
              Strategy Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.strategyInfo}>
              <div className={styles.strategyDetail}>
                <strong>Active Strategy:</strong> {selectedStrategy.replace(/_/g, " ").toUpperCase()}
              </div>
              <div className={styles.strategyDetail}>
                <strong>Budget Period:</strong> {budgetPeriod?.month}/{budgetPeriod?.year}
              </div>
              <div className={styles.strategyDetail}>
                <strong>Total Allocated:</strong> {formatCurrency(
                  budgetLines.reduce((sum, line) => sum + line.plannedAmount, 0)
                )}
              </div>
              <div className={styles.strategyDetail}>
                <strong>Unallocated:</strong> {formatCurrency(
                  monthlyIncome - budgetLines.reduce((sum, line) => sum + line.plannedAmount, 0)
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Budget Table by Category */}
      {visibleGroups.map(group => {
        const groupCategories = categories.filter(c => c.group === group.name);
        const groupLines = budgetLines.filter(l => l.category.group === group.name);
        
        // In simple mode, show only top 3 categories per group
        const displayedLines = isSimple ? groupLines.slice(0, 3) : groupLines;
        
        if (groupCategories.length === 0) return null;

        return (
          <Card key={group.name} className={styles.categoryCard}>
            <CardHeader>
              <CardTitle style={{ color: group.color }}>
                <Wallet className={styles.cardIcon} />
                {group.name}
                {isSimple && groupLines.length > 3 && (
                  <span className={styles.categoriesHidden}> (showing top 3)</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={styles.table}>
                <div className={styles.tableHeader}>
                  <div className={styles.tableCell}>Category</div>
                  <div className={styles.tableCell}>{isSimple ? "Budget" : "Planned"}</div>
                  {!isSimple && <div className={styles.tableCell}>Actual</div>}
                  {!isSimple && <div className={styles.tableCell}>Remaining</div>}
                </div>
                {displayedLines.map(line => (
                  <div key={line.id} className={styles.tableRow}>
                    <div className={styles.tableCell}>{line.category.name}</div>
                    <div className={styles.tableCell}>
                      {isAdvanced ? (
                        <Input
                          type="number"
                          value={line.plannedAmount}
                          onChange={(e) => handlePlannedAmountChange(line.id, e.target.value)}
                          className={styles.amountInput}
                        />
                      ) : (
                        formatCurrency(line.plannedAmount)
                      )}
                    </div>
                    {!isSimple && (
                      <>
                        <div className={styles.tableCell}>{formatCurrency(line.actualAmount)}</div>
                        <div className={styles.tableCell}>
                          <span className={line.plannedAmount - line.actualAmount >= 0 ? styles.positive : styles.negative}>
                            {formatCurrency(line.plannedAmount - line.actualAmount)}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
