import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.loans";
import type { Account } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";
import { accountService } from "~/lib/services/account.service";
import { calculateMonthlyInterest } from "~/lib/utils/calculations";
import { formatCurrency, formatPercent } from "~/lib/utils/helpers";
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
import { Skeleton } from "~/components/ui/skeleton/skeleton";
import { Building, Plus, TrendingDown, Trash2, Edit } from "lucide-react";
import styles from "./finances.loans.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Loans - Okanos" },
    { name: "description", content: "Stay afloat with your debt" },
  ];
}

export default function FinancesLoans() {
  const [loans, setLoans] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState<Account | null>(null);
  const [deleteLoanId, setDeleteLoanId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    principal: "",
    interestRate: "",
    termMonths: "",
    monthlyPayment: "",
  });

  useEffect(() => {
    loadLoans();
  }, []);

  const loadLoans = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const accounts = accountService.getLoans(user.id);
    setLoans(accounts);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingLoan(null);
    setFormData({
      name: "",
      principal: "",
      interestRate: "",
      termMonths: "",
      monthlyPayment: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (loan: Account) => {
    setEditingLoan(loan);
    setFormData({
      name: loan.name,
      principal: loan.currentBalance.toString(),
      interestRate: loan.interestRateAnnual?.toString() || "",
      termMonths: loan.termMonths?.toString() || "",
      monthlyPayment: loan.minimumPayment?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingLoan(null);
  };

  const handleSaveLoan = () => {
    const user = authService.getCurrentUser();
    if (!user || !formData.name.trim()) return;

    const loanData = {
      type: "loan" as const,
      name: formData.name,
      currentBalance: parseFloat(formData.principal) || 0,
      interestRateAnnual: parseFloat(formData.interestRate) || undefined,
      termMonths: parseInt(formData.termMonths) || undefined,
      minimumPayment: parseFloat(formData.monthlyPayment) || undefined,
    };

    try {
      if (editingLoan) {
        accountService.updateAccount(editingLoan.id, user.id, loanData);
      } else {
        accountService.createAccount(user.id, loanData);
      }
    } catch {
      return;
    }

    closeDialog();
    loadLoans();
  };

  const handleDeleteLoan = () => {
    const user = authService.getCurrentUser();
    if (!deleteLoanId || !user) return;
    accountService.deleteAccount(deleteLoanId, user.id);
    setDeleteLoanId(null);
    loadLoans();
  };

  const getTotalPrincipal = () => loans.reduce((sum, loan) => sum + loan.currentBalance, 0);
  const getTotalMonthlyPayment = () => loans.reduce((sum, loan) => sum + (loan.minimumPayment || 0), 0);

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Skeleton style={{ height: '40px', width: '200px' }} />
          <Skeleton style={{ height: '40px', width: '120px' }} />
        </header>
        <div className={styles.summaryGrid}>
          {[1, 2].map(i => (
            <Card key={i}>
              <CardContent>
                <Skeleton style={{ height: '60px', width: '100%' }} />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.title}>Loans</h1>
          <p className={styles.subtitle}>Track installment loans and payoff progress</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className={styles.buttonIcon} />
          Add Loan
        </Button>
      </header>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingLoan ? "Edit Loan" : "Add Loan"}</DialogTitle>
            <DialogDescription>Enter your loan details</DialogDescription>
          </DialogHeader>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="name">Loan Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Student Loan"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="principal">Principal Remaining</Label>
              <Input
                id="principal"
                type="number"
                value={formData.principal}
                onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                placeholder="25000"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="interestRate">Interest Rate (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="5.5"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="termMonths">Term (months)</Label>
              <Input
                id="termMonths"
                type="number"
                value={formData.termMonths}
                onChange={(e) => setFormData({ ...formData, termMonths: e.target.value })}
                placeholder="120"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="monthlyPayment">Monthly Payment</Label>
              <Input
                id="monthlyPayment"
                type="number"
                value={formData.monthlyPayment}
                onChange={(e) => setFormData({ ...formData, monthlyPayment: e.target.value })}
                placeholder="350"
              />
            </div>
          </div>
          <Button onClick={handleSaveLoan} className={styles.submitButton}>
            {editingLoan ? "Save Changes" : "Add Loan"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteLoanId} onOpenChange={(open) => !open && setDeleteLoanId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Loan?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this loan from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLoan}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Total Principal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryValue}>{formatCurrency(getTotalPrincipal())}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Monthly Payment</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryValue}>{formatCurrency(getTotalMonthlyPayment())}</div>
          </CardContent>
        </Card>
      </div>

      {/* Interest Breakdown */}
      {loans.length > 0 && (
        <Card className={styles.interestCard}>
          <CardHeader>
            <CardTitle>
              <TrendingDown className={styles.cardIcon} />
              Interest Breakdown
            </CardTitle>
            <CardDescription>Estimated interest costs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className={styles.interestGrid}>
              {loans.map((loan) => {
                if (!loan.interestRateAnnual) return null;
                
                const dailyInterest = calculateMonthlyInterest(loan.currentBalance, loan.interestRateAnnual, true) / 30;
                const monthlyInterest = calculateMonthlyInterest(loan.currentBalance, loan.interestRateAnnual, true);
                
                // Calculate total interest over loan life
                let totalInterest = 0;
                if (loan.termMonths && loan.minimumPayment) {
                  const monthsRemaining = loan.termMonths;
                  totalInterest = (loan.minimumPayment * monthsRemaining) - loan.currentBalance;
                }

                return (
                  <div key={loan.id} className={styles.interestItem}>
                    <h4 className={styles.interestLoanName}>{loan.name}</h4>
                    <div className={styles.interestMetrics}>
                      <div className={styles.interestMetric}>
                        <span className={styles.interestLabel}>Daily Interest:</span>
                        <span className={styles.interestValue}>{formatCurrency(dailyInterest)}</span>
                      </div>
                      <div className={styles.interestMetric}>
                        <span className={styles.interestLabel}>Monthly Interest:</span>
                        <span className={styles.interestValue}>{formatCurrency(monthlyInterest)}</span>
                      </div>
                      {totalInterest > 0 && (
                        <div className={styles.interestMetric}>
                          <span className={styles.interestLabel}>Total Interest (Life of Loan):</span>
                          <span className={styles.interestValue}>{formatCurrency(totalInterest)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loans List */}
      <div className={styles.loansList}>
        {loans.length === 0 ? (
          <Card>
            <CardContent className={styles.emptyState}>
              <Building className={styles.emptyIcon} />
              <h3>No loans yet</h3>
              <p>Add your first loan to track payments and interest</p>
            </CardContent>
          </Card>
        ) : (
          loans.map((loan) => {
            const monthlyInterest = loan.interestRateAnnual
              ? calculateMonthlyInterest(loan.currentBalance, loan.interestRateAnnual, true)
              : 0;

            return (
              <Card key={loan.id} className={styles.loanItem}>
                <CardHeader>
                  <div className={styles.loanHeaderContent}>
                    <CardTitle>
                      <Building className={styles.loanIcon} />
                      {loan.name}
                    </CardTitle>
                    <div className={styles.loanActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(loan)}
                      >
                        <Edit className={styles.actionIcon} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteLoanId(loan.id)}
                      >
                        <Trash2 className={styles.actionIcon} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={styles.loanGrid}>
                    <div className={styles.loanMetric}>
                      <div className={styles.metricLabel}>Principal</div>
                      <div className={styles.metricValue}>{formatCurrency(loan.currentBalance)}</div>
                    </div>
                    {loan.interestRateAnnual && (
                      <div className={styles.loanMetric}>
                        <div className={styles.metricLabel}>APR</div>
                        <div className={styles.metricValue}>{formatPercent(loan.interestRateAnnual)}</div>
                      </div>
                    )}
                    {loan.termMonths && (
                      <div className={styles.loanMetric}>
                        <div className={styles.metricLabel}>Term</div>
                        <div className={styles.metricValue}>{loan.termMonths} months</div>
                      </div>
                    )}
                    {loan.minimumPayment && (
                      <div className={styles.loanMetric}>
                        <div className={styles.metricLabel}>Monthly Payment</div>
                        <div className={styles.metricValue}>{formatCurrency(loan.minimumPayment)}</div>
                      </div>
                    )}
                    {monthlyInterest > 0 && (
                      <div className={styles.loanMetric}>
                        <div className={styles.metricLabel}>Monthly Interest</div>
                        <div className={styles.metricValue}>{formatCurrency(monthlyInterest)}</div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
