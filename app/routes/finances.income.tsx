import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.income";
import type { IncomeSource, PayType, PayFrequency } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";
import { incomeService } from "~/lib/services/income.service";
import { calculateTotalMonthlyIncome, calculateMonthlyIncome } from "~/lib/utils/calculations";
import { formatCurrency } from "~/lib/utils/helpers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { Button } from "~/components/ui/button/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "~/components/ui/dialog/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog/alert-dialog";
import { Input } from "~/components/ui/input/input";
import { Label } from "~/components/ui/label/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select/select";
import { Skeleton } from "~/components/ui/skeleton/skeleton";
import { DollarSign, Plus, Briefcase, Trash2, Edit } from "lucide-react";
import styles from "./finances.income.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Income - Okanos" },
    { name: "description", content: "Track your incoming tides" },
  ];
}

export default function FinancesIncome() {
  const [incomeSources, setIncomeSources] = useState<IncomeSource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState<IncomeSource | null>(null);
  const [deleteIncomeId, setDeleteIncomeId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    payType: "salary" as PayType,
    hourlyRate: "",
    hoursPerWeek: "",
    fixedMonthly: "",
    payFrequency: "monthly" as PayFrequency,
  });

  useEffect(() => {
    loadIncome();
  }, []);

  const loadIncome = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const sources = incomeService.getActiveIncomeSources(user.id);
    setIncomeSources(sources);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingIncome(null);
    setFormData({
      name: "",
      payType: "salary",
      hourlyRate: "",
      hoursPerWeek: "",
      fixedMonthly: "",
      payFrequency: "monthly",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (income: IncomeSource) => {
    setEditingIncome(income);
    setFormData({
      name: income.name,
      payType: income.payType,
      hourlyRate: income.hourlyRate?.toString() || "",
      hoursPerWeek: income.expectedHoursPerWeek?.toString() || "",
      fixedMonthly: income.fixedMonthlyAmount?.toString() || "",
      payFrequency: income.payFrequency,
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingIncome(null);
  };

  const handleSaveIncome = () => {
    const user = authService.getCurrentUser();
    if (!user || !formData.name.trim()) return;

    const incomeData = {
      name: formData.name,
      payType: formData.payType,
      hourlyRate: formData.payType === "hourly" ? parseFloat(formData.hourlyRate) || undefined : undefined,
      expectedHoursPerWeek: formData.payType === "hourly" ? parseFloat(formData.hoursPerWeek) || undefined : undefined,
      fixedMonthlyAmount: formData.payType === "fixed_monthly" ? parseFloat(formData.fixedMonthly) || undefined : parseFloat(formData.fixedMonthly) || undefined,
      payFrequency: formData.payFrequency,
      isActive: true,
    };

    try {
      if (editingIncome) {
        incomeService.updateIncomeSource(editingIncome.id, user.id, incomeData);
      } else {
        incomeService.createIncomeSource(user.id, incomeData);
      }
    } catch {
      return;
    }

    closeDialog();
    loadIncome();
  };

  const handleDeleteIncome = () => {
    const user = authService.getCurrentUser();
    if (!deleteIncomeId || !user) return;
    incomeService.deleteIncomeSource(deleteIncomeId, user.id);
    setDeleteIncomeId(null);
    loadIncome();
  };

  const totalMonthlyIncome = calculateTotalMonthlyIncome(incomeSources);

  // Scenarios for hourly workers
  const hourlySource = incomeSources.find(s => s.payType === "hourly");
  const scenarios = hourlySource
    ? [
        { hours: 20, label: "Part-time (20 hrs/wk)" },
        { hours: 30, label: "3/4 Time (30 hrs/wk)" },
        { hours: 40, label: "Full-time (40 hrs/wk)" },
        { hours: 50, label: "With Overtime (50 hrs/wk)" },
      ]
    : [];

  const user = authService.getCurrentUser();
  const taxRate = (user?.settings.taxRate ?? 0.25) * 100;

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Skeleton style={{ height: '40px', width: '200px' }} />
          <Skeleton style={{ height: '40px', width: '150px' }} />
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
          <h1 className={styles.title}>Income Sources</h1>
          <p className={styles.subtitle}>Manage your income and model scenarios</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className={styles.buttonIcon} />
          Add Income Source
        </Button>
      </header>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingIncome ? "Edit Income Source" : "Add Income Source"}</DialogTitle>
            <DialogDescription>Enter your income details</DialogDescription>
          </DialogHeader>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="name">Income Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Primary Job"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="payType">Pay Type</Label>
              <Select value={formData.payType} onValueChange={(value) => setFormData({ ...formData, payType: value as PayType })}>
                <SelectTrigger id="payType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hourly">Hourly</SelectItem>
                  <SelectItem value="salary">Salary</SelectItem>
                  <SelectItem value="fixed_monthly">Fixed Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.payType === "hourly" && (
              <>
                <div className={styles.formGroup}>
                  <Label htmlFor="hourlyRate">Hourly Rate</Label>
                  <Input
                    id="hourlyRate"
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                    placeholder="25"
                  />
                </div>
                <div className={styles.formGroup}>
                  <Label htmlFor="hoursPerWeek">Hours per Week</Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    value={formData.hoursPerWeek}
                    onChange={(e) => setFormData({ ...formData, hoursPerWeek: e.target.value })}
                    placeholder="40"
                  />
                </div>
              </>
            )}
            {formData.payType === "salary" && (
              <div className={styles.formGroup}>
                <Label htmlFor="fixedMonthly">Annual Salary</Label>
                <Input
                  id="fixedMonthly"
                  type="number"
                  value={formData.fixedMonthly}
                  onChange={(e) => setFormData({ ...formData, fixedMonthly: e.target.value })}
                  placeholder="75000"
                />
              </div>
            )}
            {formData.payType === "fixed_monthly" && (
              <div className={styles.formGroup}>
                <Label htmlFor="fixedMonthly">Monthly Amount</Label>
                <Input
                  id="fixedMonthly"
                  type="number"
                  value={formData.fixedMonthly}
                  onChange={(e) => setFormData({ ...formData, fixedMonthly: e.target.value })}
                  placeholder="5000"
                />
              </div>
            )}
            {formData.payType !== "fixed_monthly" && (
              <div className={styles.formGroup}>
                <Label htmlFor="payFrequency">Pay Frequency</Label>
                <Select value={formData.payFrequency} onValueChange={(value) => setFormData({ ...formData, payFrequency: value as PayFrequency })}>
                  <SelectTrigger id="payFrequency">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="biweekly">Bi-weekly</SelectItem>
                    <SelectItem value="semi_monthly">Semi-monthly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <Button onClick={handleSaveIncome} className={styles.submitButton}>
            {editingIncome ? "Save Changes" : "Add Income"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteIncomeId} onOpenChange={(open) => !open && setDeleteIncomeId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Income Source?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this income source from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteIncome}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Card */}
      <Card className={styles.summaryCard}>
        <CardHeader>
          <CardTitle>
            <DollarSign className={styles.cardIcon} />
            Total Monthly Income
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.totalIncome}>{formatCurrency(totalMonthlyIncome)}</div>
          <div className={styles.netIncome}>
            After {taxRate}% tax: {formatCurrency(totalMonthlyIncome * (1 - taxRate / 100))}
          </div>
        </CardContent>
      </Card>

      {/* Income Sources List */}
      <div className={styles.incomeList}>
        {incomeSources.length === 0 ? (
          <Card>
            <CardContent className={styles.emptyState}>
              <Briefcase className={styles.emptyIcon} />
              <h3>No income sources yet</h3>
              <p>Add your first income source to start tracking your earnings</p>
            </CardContent>
          </Card>
        ) : (
          incomeSources.map((source) => {
            const monthly = calculateTotalMonthlyIncome([source]);
            return (
              <Card key={source.id} className={styles.incomeItem}>
                <CardHeader>
                  <div className={styles.incomeHeaderContent}>
                    <CardTitle>
                      <Briefcase className={styles.incomeIcon} />
                      {source.name}
                    </CardTitle>
                    <div className={styles.incomeActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(source)}
                      >
                        <Edit className={styles.actionIcon} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteIncomeId(source.id)}
                      >
                        <Trash2 className={styles.actionIcon} />
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    {source.payType === "hourly" && `${formatCurrency(source.hourlyRate || 0)}/hr • ${source.expectedHoursPerWeek || 0} hrs/week`}
                    {source.payType === "salary" && `${formatCurrency(source.fixedMonthlyAmount || 0)}/year • ${source.payFrequency}`}
                    {source.payType === "fixed_monthly" && `${formatCurrency(source.fixedMonthlyAmount || 0)}/month`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className={styles.incomeMetrics}>
                    <div className={styles.incomeMetric}>
                      <div className={styles.metricLabel}>Monthly Gross</div>
                      <div className={styles.metricValue}>{formatCurrency(monthly)}</div>
                    </div>
                    <div className={styles.incomeMetric}>
                      <div className={styles.metricLabel}>Monthly Net ({taxRate}% tax)</div>
                      <div className={styles.metricValue}>{formatCurrency(monthly * (1 - taxRate / 100))}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Scenarios Section */}
      {scenarios.length > 0 && hourlySource && (
        <Card className={styles.scenariosCard}>
          <CardHeader>
            <CardTitle>Income Scenarios</CardTitle>
            <CardDescription>
              See how different work hours affect your income
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.scenariosGrid}>
              {scenarios.map((scenario) => {
                const grossMonthly = calculateMonthlyIncome({ ...hourlySource!, expectedHoursPerWeek: scenario.hours });
                const netMonthly = grossMonthly * (1 - taxRate / 100);

                return (
                  <div key={scenario.hours} className={styles.scenarioCard}>
                    <h4 className={styles.scenarioLabel}>{scenario.label}</h4>
                    <div className={styles.scenarioMetrics}>
                      <div className={styles.scenarioMetric}>
                        <span className={styles.scenarioMetricLabel}>Gross:</span>
                        <span className={styles.scenarioMetricValue}>{formatCurrency(grossMonthly)}</span>
                      </div>
                      <div className={styles.scenarioMetric}>
                        <span className={styles.scenarioMetricLabel}>Net:</span>
                        <span className={styles.scenarioMetricValue}>{formatCurrency(netMonthly)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
