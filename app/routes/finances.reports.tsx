import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.reports";
import type { DashboardMetrics } from "~/lib/types";
import { dashboardService } from "~/lib/services/dashboard.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Button } from "~/components/ui/button/button";
import { Skeleton } from "~/components/ui/skeleton/skeleton";
import { BarChart3, Download, FileText } from "lucide-react";
import styles from "./finances.reports.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Reports - Okanos" },
    { name: "description", content: "Deep dive into your financial ocean" },
  ];
}

export default function FinancesReports() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = () => {
    setLoading(true);
    const data = dashboardService.getDashboardMetrics();
    setMetrics(data);
    setLoading(false);
  };

  const handleExportCSV = () => {
    alert("CSV export functionality coming soon!");
  };

  const handleExportPDF = () => {
    alert("PDF export functionality coming soon!");
  };

  const handleExportExcel = () => {
    alert("Excel export functionality coming soon!");
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Reports & History</h1>
          <p className={styles.subtitle}>View your financial data over time</p>
        </div>
      </header>

      {/* Export Options */}
      <Card className={styles.exportCard}>
        <CardHeader>
          <CardTitle>
            <Download className={styles.cardIcon} />
            Export Data
          </CardTitle>
          <CardDescription>
            Download your financial data in various formats
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.exportButtons}>
            <Button onClick={handleExportCSV} variant="outline">
              <FileText className={styles.buttonIcon} />
              Export as CSV
            </Button>
            <Button onClick={handleExportExcel} variant="outline">
              <FileText className={styles.buttonIcon} />
              Export as Excel
            </Button>
            <Button onClick={handleExportPDF} variant="outline">
              <FileText className={styles.buttonIcon} />
              Export as PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Historical Charts Placeholder */}
      <Card className={styles.chartCard}>
        <CardHeader>
          <CardTitle>
            <BarChart3 className={styles.cardIcon} />
            Historical Trends
          </CardTitle>
          <CardDescription>
            Track your financial metrics over time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className={styles.chartPlaceholder}>
            <BarChart3 className={styles.placeholderIcon} />
            <h3>Historical Charts Coming Soon</h3>
            <p>
              We're building comprehensive charts to visualize your credit score, utilization, balances, and more over time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Snapshot */}
      <Card className={styles.snapshotCard}>
        <CardHeader>
          <CardTitle>Current Financial Snapshot</CardTitle>
          <CardDescription>Your latest metrics</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className={styles.snapshotGrid}>
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={styles.snapshotItem}>
                  <Skeleton style={{ height: '20px', width: '60%', marginBottom: '8px' }} />
                  <Skeleton style={{ height: '32px', width: '80%' }} />
                </div>
              ))}
            </div>
          ) : metrics ? (
            <div className={styles.snapshotGrid}>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Mock Credit Score</div>
                <div className={styles.snapshotValue}>{metrics.mockCreditScore}</div>
              </div>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Debt-to-Income Ratio</div>
                <div className={styles.snapshotValue}>{metrics.dtiRatio.toFixed(1)}%</div>
              </div>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Credit Utilization</div>
                <div className={styles.snapshotValue}>{metrics.totalUtilization.toFixed(1)}%</div>
              </div>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Monthly Interest</div>
                <div className={styles.snapshotValue}>${metrics.monthlyInterestAccrual.toFixed(2)}</div>
              </div>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Monthly Income</div>
                <div className={styles.snapshotValue}>${metrics.monthlyIncome.toFixed(2)}</div>
              </div>
              <div className={styles.snapshotItem}>
                <div className={styles.snapshotLabel}>Monthly Spending</div>
                <div className={styles.snapshotValue}>${metrics.monthlySpending.toFixed(2)}</div>
              </div>
            </div>
          ) : (
            <div>No data available</div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
