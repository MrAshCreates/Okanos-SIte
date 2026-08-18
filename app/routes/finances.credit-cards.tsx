import { useEffect, useState } from "react";
import type { Route } from "./+types/finances.credit-cards";
import type { Account } from "~/lib/types";
import { authService } from "~/lib/services/auth.service";
import { accountService } from "~/lib/services/account.service";
import { calculateUtilization, calculateMonthlyInterest, calculateOverallUtilization } from "~/lib/utils/calculations";
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
import { CreditCard, Plus, Trash2, Edit } from "lucide-react";
import styles from "./finances.credit-cards.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Credit Cards - Okanos" },
    { name: "description", content: "Navigate your credit currents" },
  ];
}

export default function FinancesCreditCards() {
  const [creditCards, setCreditCards] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Account | null>(null);
  const [deleteCardId, setDeleteCardId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    last4: "",
    creditLimit: "",
    currentBalance: "",
    interestRate: "",
    minimumPayment: "",
    dueDay: "",
  });

  useEffect(() => {
    loadCreditCards();
  }, []);

  const loadCreditCards = () => {
    setLoading(true);
    const user = authService.getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    const cards = accountService.getCreditCards(user.id);
    setCreditCards(cards);
    setLoading(false);
  };

  const openAddDialog = () => {
    setEditingCard(null);
    setFormData({
      name: "",
      last4: "",
      creditLimit: "",
      currentBalance: "",
      interestRate: "",
      minimumPayment: "",
      dueDay: "",
    });
    setIsDialogOpen(true);
  };

  const openEditDialog = (card: Account) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      last4: card.last4 || "",
      creditLimit: card.creditLimit?.toString() || "",
      currentBalance: card.currentBalance.toString(),
      interestRate: card.interestRateAnnual?.toString() || "",
      minimumPayment: card.minimumPayment?.toString() || "",
      dueDay: card.dueDayOfMonth?.toString() || "",
    });
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCard(null);
  };

  const handleSaveCard = () => {
    const user = authService.getCurrentUser();
    if (!user || !formData.name.trim()) return;

    const cardData = {
      type: "credit_card" as const,
      name: formData.name,
      last4: formData.last4,
      creditLimit: parseFloat(formData.creditLimit) || 0,
      currentBalance: parseFloat(formData.currentBalance) || 0,
      interestRateAnnual: parseFloat(formData.interestRate) || undefined,
      minimumPayment: parseFloat(formData.minimumPayment) || undefined,
      dueDayOfMonth: parseInt(formData.dueDay) || undefined,
    };

    try {
      if (editingCard) {
        accountService.updateAccount(editingCard.id, user.id, cardData);
      } else {
        accountService.createAccount(user.id, cardData);
      }
    } catch {
      return;
    }

    closeDialog();
    loadCreditCards();
  };

  const handleDeleteCard = () => {
    const user = authService.getCurrentUser();
    if (!deleteCardId || !user) return;
    accountService.deleteAccount(deleteCardId, user.id);
    setDeleteCardId(null);
    loadCreditCards();
  };

  const getTotalLimits = () => creditCards.reduce((sum, card) => sum + (card.creditLimit || 0), 0);
  const getTotalBalances = () => creditCards.reduce((sum, card) => sum + card.currentBalance, 0);
  const overallUtilization = calculateOverallUtilization(creditCards);

  const getUtilizationColor = (util: number) => {
    if (util < 30) return "var(--color-success-bg)";
    if (util < 50) return "var(--color-pop-bg)";
    return "var(--color-danger-bg)";
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Skeleton style={{ height: '40px', width: '200px' }} />
          <Skeleton style={{ height: '40px', width: '150px' }} />
        </header>
        <div className={styles.summaryGrid}>
          {[1, 2, 3].map(i => (
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
          <h1 className={styles.title}>Credit Cards</h1>
          <p className={styles.subtitle}>Manage and track your credit card accounts</p>
        </div>
        <Button onClick={openAddDialog}>
          <Plus className={styles.buttonIcon} />
          Add Credit Card
        </Button>
      </header>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCard ? "Edit Credit Card" : "Add Credit Card"}</DialogTitle>
            <DialogDescription>Enter your credit card details</DialogDescription>
          </DialogHeader>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <Label htmlFor="name">Card Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Chase Sapphire"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="last4">Last 4 Digits</Label>
              <Input
                id="last4"
                value={formData.last4}
                onChange={(e) => setFormData({ ...formData, last4: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                placeholder="1234"
                maxLength={4}
                inputMode="numeric"
                autoComplete="off"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="creditLimit">Credit Limit</Label>
              <Input
                id="creditLimit"
                type="number"
                value={formData.creditLimit}
                onChange={(e) => setFormData({ ...formData, creditLimit: e.target.value })}
                placeholder="10000"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="currentBalance">Current Balance</Label>
              <Input
                id="currentBalance"
                type="number"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                placeholder="2500"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="interestRate">APR (%)</Label>
              <Input
                id="interestRate"
                type="number"
                value={formData.interestRate}
                onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                placeholder="18.99"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="minimumPayment">Minimum Payment</Label>
              <Input
                id="minimumPayment"
                type="number"
                value={formData.minimumPayment}
                onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                placeholder="50"
              />
            </div>
            <div className={styles.formGroup}>
              <Label htmlFor="dueDay">Due Day of Month</Label>
              <Input
                id="dueDay"
                type="number"
                value={formData.dueDay}
                onChange={(e) => setFormData({ ...formData, dueDay: e.target.value })}
                placeholder="15"
                min="1"
                max="31"
              />
            </div>
          </div>
          <Button onClick={handleSaveCard} className={styles.submitButton}>
            {editingCard ? "Save Changes" : "Add Card"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteCardId} onOpenChange={(open) => !open && setDeleteCardId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Credit Card?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this credit card from your account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCard}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <Card>
          <CardHeader>
            <CardTitle>Total Credit Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryValue}>{formatCurrency(getTotalLimits())}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryValue}>{formatCurrency(getTotalBalances())}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overall Utilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={styles.summaryValue} style={{ color: getUtilizationColor(overallUtilization) }}>
              {formatPercent(overallUtilization)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Cards List */}
      <div className={styles.cardsList}>
        {creditCards.length === 0 ? (
          <Card>
            <CardContent className={styles.emptyState}>
              <CreditCard className={styles.emptyIcon} />
              <h3>No credit cards yet</h3>
              <p>Add your first credit card to start tracking utilization and payments</p>
            </CardContent>
          </Card>
        ) : (
          creditCards.map((card) => {
            const utilization = calculateUtilization(card.currentBalance, card.creditLimit || 0);
            const monthlyInterest = card.interestRateAnnual
              ? calculateMonthlyInterest(card.currentBalance, card.interestRateAnnual, true)
              : 0;

            return (
              <Card key={card.id} className={styles.cardItem}>
                <CardHeader>
                  <div className={styles.cardHeaderContent}>
                    <CardTitle>
                      <CreditCard className={styles.cardIcon} />
                      {card.name}
                      {card.last4 && <span className={styles.last4}>••••{card.last4}</span>}
                    </CardTitle>
                    <div className={styles.cardActions}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(card)}
                      >
                        <Edit className={styles.actionIcon} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteCardId(card.id)}
                      >
                        <Trash2 className={styles.actionIcon} />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={styles.cardGrid}>
                    <div className={styles.cardMetric}>
                      <div className={styles.metricLabel}>Balance</div>
                      <div className={styles.metricValue}>{formatCurrency(card.currentBalance)}</div>
                    </div>
                    <div className={styles.cardMetric}>
                      <div className={styles.metricLabel}>Limit</div>
                      <div className={styles.metricValue}>{formatCurrency(card.creditLimit || 0)}</div>
                    </div>
                    <div className={styles.cardMetric}>
                      <div className={styles.metricLabel}>Utilization</div>
                      <div className={styles.metricValue} style={{ color: getUtilizationColor(utilization) }}>
                        {formatPercent(utilization)}
                      </div>
                    </div>
                    {card.minimumPayment && (
                      <div className={styles.cardMetric}>
                        <div className={styles.metricLabel}>Minimum Payment</div>
                        <div className={styles.metricValue}>{formatCurrency(card.minimumPayment)}</div>
                      </div>
                    )}
                    {card.interestRateAnnual && (
                      <div className={styles.cardMetric}>
                        <div className={styles.metricLabel}>APR</div>
                        <div className={styles.metricValue}>{formatPercent(card.interestRateAnnual)}</div>
                      </div>
                    )}
                    {monthlyInterest > 0 && (
                      <div className={styles.cardMetric}>
                        <div className={styles.metricLabel}>Monthly Interest</div>
                        <div className={styles.metricValue}>{formatCurrency(monthlyInterest)}</div>
                      </div>
                    )}
                  </div>
                  <div className={styles.utilizationBar}>
                    <div
                      className={styles.utilizationBarFill}
                      style={{
                        width: `${Math.min(100, utilization)}%`,
                        backgroundColor: getUtilizationColor(utilization),
                      }}
                    />
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
