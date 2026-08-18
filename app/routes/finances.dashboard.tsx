import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.dashboard";
import type { DashboardMetrics } from "~/lib/types";
import { dashboardService } from "~/lib/services/dashboard.service";
import { useUserSettings } from "~/hooks/use-user-settings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert/alert";
import { Skeleton } from "~/components/ui/skeleton/skeleton";
import { TrendingUp, TrendingDown, Calendar, Clock, LightbulbIcon } from "lucide-react";
import { formatCurrency, formatPercent, formatDate } from "~/lib/utils/helpers";
import styles from "./finances.dashboard.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Okanos" },
    { name: "description", content: "Chart Your Financial Course" },
  ];
}

export default function FinancesDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { mode, isSimple, isAdvanced } = useUserSettings();

  useEffect(() => {
    loadMetrics();

    const handleSettingsUpdate = () => loadMetrics();
    window.addEventListener("user-settings-updated", handleSettingsUpdate);
    return () => window.removeEventListener("user-settings-updated", handleSettingsUpdate);
  }, []);

  const loadMetrics = () => {
    const data = dashboardService.getDashboardMetrics();
    setMetrics(data);
    setIsLoading(false);
  };

  if (isLoading || !metrics) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <Skeleton className={styles.skeletonTitle} />
            <Skeleton className={styles.skeletonSubtitle} />
          </div>
        </header>
        <div className={styles.metricsGrid}>
          {[...Array(isSimple ? 3 : 6)].map((_, i) => (
            <Card key={i} className={styles.metricCard}>
              <CardHeader>
                <Skeleton className={styles.skeletonCardTitle} />
                <Skeleton className={styles.skeletonCardDescription} />
              </CardHeader>
              <CardContent>
                <Skeleton className={styles.skeletonValue} />
                <Skeleton className={styles.skeletonLabel} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 750) return "var(--color-success-bg)";
    if (score >= 670) return "var(--color-accent-bg)";
    if (score >= 580) return "var(--color-pop-bg)";
    return "var(--color-danger-bg)";
  };

  const getUtilizationColor = (util: number) => {
    if (util < 30) return "var(--color-success-bg)";
    if (util < 50) return "var(--color-pop-bg)";
    return "var(--color-danger-bg)";
  };

  const getDtiColor = (dti: number) => {
    if (dti < 20) return "var(--color-success-bg)";
    if (dti < 36) return "var(--color-accent-bg)";
    if (dti < 43) return "var(--color-pop-bg)";
    return "var(--color-danger-bg)";
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>
            Your complete financial overview {isSimple && "(Simplified)"} {isAdvanced && "(Detailed)"}
          </p>
        </div>
      </header>

      {/* Tip of the Day */}
      {metrics.tipOfTheDay && (
        <Alert className={styles.tipAlert}>
          <LightbulbIcon className={styles.tipIcon} />
          <AlertTitle>Financial Tip</AlertTitle>
          <AlertDescription>
            <strong>{metrics.tipOfTheDay.shortText}</strong>
            {!isSimple && <p className={styles.tipExpanded}>{metrics.tipOfTheDay.longExplanation}</p>}
          </AlertDescription>
        </Alert>
      )}

      {/* Key Metrics Grid */}
      <div className={styles.metricsGrid} data-mode={mode}>
        {/* SIMPLE MODE: Show only essential metrics */}
        {isSimple && (
          <>
            {/* Total Income */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Monthly Income</CardTitle>
                <CardDescription>Total income this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.currencyValue} style={{ color: "var(--color-success-bg)" }}>
                  {formatCurrency(metrics.monthlyIncome)}
                </div>
                <div className={styles.metricLabel}>Net income available</div>
              </CardContent>
            </Card>

            {/* Simplified Budget Status */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Budget Overview</CardTitle>
                <CardDescription>Spending breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.budgetBreakdown}>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-danger-bg)" }} />
                      Needs
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.needs.planned)}</span>
                  </div>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-pop-bg)" }} />
                      Wants
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.wants.planned)}</span>
                  </div>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-success-bg)" }} />
                      Savings
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.savings.planned)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Credit Utilization */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Credit Utilization</CardTitle>
                <CardDescription>Overall credit usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.percentValue} style={{ color: getUtilizationColor(metrics.totalUtilization) }}>
                  {formatPercent(metrics.totalUtilization)}
                </div>
                <div className={styles.metricLabel}>
                  {metrics.totalUtilization < 30 ? "Healthy" : metrics.totalUtilization < 50 ? "Moderate" : "Too High"}
                </div>
              </CardContent>
            </Card>
          </>
        )}

        {/* NORMAL & ADVANCED MODES: Show all metrics */}
        {!isSimple && (
          <>
            {/* Mock Credit Score */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Mock Credit Score</CardTitle>
                <CardDescription>Simulated FICO score</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.scoreValue} style={{ color: getScoreColor(metrics.mockCreditScore) }}>
                  {metrics.mockCreditScore}
                </div>
                <div className={styles.scoreRange}>300 - 850</div>
                <div className={styles.scoreBar}>
                  <div
                    className={styles.scoreBarFill}
                    style={{
                      width: `${((metrics.mockCreditScore - 300) / 550) * 100}%`,
                      backgroundColor: getScoreColor(metrics.mockCreditScore),
                    }}
                  />
                </div>
              </CardContent>
            </Card>

            {/* DTI Ratio */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Debt-to-Income</CardTitle>
                <CardDescription>Monthly debt vs. income</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.percentValue} style={{ color: getDtiColor(metrics.dtiRatio) }}>
                  {formatPercent(metrics.dtiRatio)}
                </div>
                <div className={styles.metricLabel}>
                  {metrics.dtiRatio < 20
                    ? "Excellent"
                    : metrics.dtiRatio < 36
                      ? "Good"
                      : metrics.dtiRatio < 43
                        ? "Fair"
                        : "High"}
                </div>
              </CardContent>
            </Card>

            {/* Total Utilization */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Credit Utilization</CardTitle>
                <CardDescription>Overall credit usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.percentValue} style={{ color: getUtilizationColor(metrics.totalUtilization) }}>
                  {formatPercent(metrics.totalUtilization)}
                </div>
                <div className={styles.metricLabel}>
                  {metrics.totalUtilization < 30 ? "Healthy" : metrics.totalUtilization < 50 ? "Moderate" : "Too High"}
                </div>
              </CardContent>
            </Card>

            {/* Monthly Interest */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Estimated Monthly Interest</CardTitle>
                <CardDescription>Interest accruing this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.currencyValue}>{formatCurrency(metrics.monthlyInterestAccrual)}</div>
                <div className={styles.metricLabel}>{formatCurrency(metrics.monthlyInterestAccrual * 12)} / year</div>
              </CardContent>
            </Card>

            {/* Income vs Spending */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Income vs. Spending</CardTitle>
                <CardDescription>This month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.comparisonRow}>
                  <div className={styles.comparisonItem}>
                    <TrendingUp className={styles.comparisonIcon} style={{ color: "var(--color-success-bg)" }} />
                    <div>
                      <div className={styles.comparisonLabel}>Income</div>
                      <div className={styles.comparisonValue}>{formatCurrency(metrics.monthlyIncome)}</div>
                    </div>
                  </div>
                  <div className={styles.comparisonItem}>
                    <TrendingDown className={styles.comparisonIcon} style={{ color: "var(--color-danger-bg)" }} />
                    <div>
                      <div className={styles.comparisonLabel}>Spending</div>
                      <div className={styles.comparisonValue}>{formatCurrency(metrics.monthlySpending)}</div>
                    </div>
                  </div>
                </div>
                <div className={styles.netIncome}>
                  Net:  {formatCurrency(metrics.monthlyIncome - metrics.monthlySpending)}
                </div>
              </CardContent>
            </Card>

            {/* Budget Status */}
            <Card className={styles.metricCard}>
              <CardHeader>
                <CardTitle className={styles.metricTitle}>Monthly Budget</CardTitle>
                <CardDescription>Budget breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <div className={styles.budgetBreakdown}>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-danger-bg)" }} />
                      Needs ({formatPercent(metrics.budgetStatus.needs.percentage, 0)})
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.needs.planned)}</span>
                  </div>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-pop-bg)" }} />
                      Wants ({formatPercent(metrics.budgetStatus.wants.percentage, 0)})
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.wants.planned)}</span>
                  </div>
                  <div className={styles.budgetRow}>
                    <span className={styles.budgetLabel}>
                      <span className={styles.budgetDot} style={{ backgroundColor: "var(--color-success-bg)" }} />
                      Savings ({formatPercent(metrics.budgetStatus.savings.percentage, 0)})
                    </span>
                    <span className={styles.budgetValue}>{formatCurrency(metrics.budgetStatus.savings.planned)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Upcoming Due Dates - Hide in Simple Mode */}
      {!isSimple && metrics.upcomingDueDates.length > 0 && (
        <Card className={styles.alertCard}>
          <CardHeader>
            <CardTitle>
              <Calendar className={styles.cardIcon} />
              Upcoming Due Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.alertList}>
              {metrics.upcomingDueDates.map((item) => (
                <div key={item.accountId} className={styles.alertItem}>
                  <div className={styles.alertItemTitle}>{item.accountName}</div>
                  <div className={styles.alertItemDetails}>
                    Due: {formatDate(item.dueDate)} • Minimum: {formatCurrency(item.minimumPayment)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Expiring Promo APRs - Hide in Simple Mode */}
      {!isSimple && metrics.expiringPromos.length > 0 && (
        <Card className={styles.alertCard}>
          <CardHeader>
            <CardTitle>
              <Clock className={styles.cardIcon} />
              Expiring Promotional Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.alertList}>
              {metrics.expiringPromos.map((item) => (
                <div key={item.accountId} className={styles.alertItem}>
                  <div className={styles.alertItemTitle}>{item.accountName}</div>
                  <div className={styles.alertItemDetails}>
                    Expires: {formatDate(item.promoEndDate)} • Regular rate: {formatPercent(item.regularRate)}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Advanced Mode: Additional Insights */}
      {isAdvanced && (
        <Card className={styles.alertCard}>
          <CardHeader>
            <CardTitle>Advanced Financial Insights</CardTitle>
            <CardDescription>Detailed analysis and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.insightsList}>
              <div className={styles.insightItem}>
                <strong>Savings Rate:</strong>{" "}
                {formatPercent((metrics.budgetStatus.savings.planned / metrics.monthlyIncome) * 100)}
              </div>
              <div className={styles.insightItem}>
                <strong>Discretionary Income:</strong>{" "}
                {formatCurrency(
                  metrics.monthlyIncome - metrics.budgetStatus.needs.planned - metrics.budgetStatus.debt.planned,
                )}
              </div>
              <div className={styles.insightItem}>
                <strong>Emergency Fund Target:</strong> {formatCurrency(metrics.budgetStatus.needs.planned * 6)} (6
                months expenses)
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
