import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/finances.onboarding";
import type { StrategyType, UXMode } from "~/lib/types";
import { Button } from "~/components/ui/button/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card/card";
import { authService } from "~/lib/services/auth.service";
import { budgetService } from "~/lib/services/budget.service";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import styles from "./finances.onboarding.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Onboarding - Okanos" },
    { name: "description", content: "Chart your course with Okanos" },
  ];
}

interface StrategyInfo {
  id: StrategyType;
  name: string;
  description: string;
  tradeoffs: string;
  targetUser: string;
}

const strategies: StrategyInfo[] = [
  {
    id: "50_30_20",
    name: "50/30/20 Rule",
    description: "Balanced approach: 50% Needs, 30% Wants, 20% Savings",
    tradeoffs: "Well-rounded but may not optimize for specific goals",
    targetUser: "Most people seeking balanced financial health",
  },
  {
    id: "all_cash",
    name: "All Cash",
    description: "Avoid credit completely, pay for everything with cash/debit",
    tradeoffs: "No credit building, miss rewards, but zero debt risk",
    targetUser: "People who struggle with credit discipline",
  },
  {
    id: "only_credit",
    name: "Only Credit",
    description: "Use credit for everything, pay off monthly for rewards",
    tradeoffs: "Requires discipline and excellent payment habits",
    targetUser: "Responsible users who maximize rewards",
  },
  {
    id: "investing_focused",
    name: "Investing Focused",
    description: "Prioritize long-term investing and wealth building",
    tradeoffs: "Higher savings rate, less for wants",
    targetUser: "People focused on building wealth and FI/RE",
  },
  {
    id: "buy_borrow_die",
    name: "Buy, Borrow, Die",
    description: "Leverage assets and debt strategically for wealth",
    tradeoffs: "Complex, requires significant assets and knowledge",
    targetUser: "High net worth individuals with asset portfolios",
  },
];

export default function FinancesOnboarding() {
  const navigate = useNavigate();
  const user = authService.getCurrentUser();
  
  const [step, setStep] = useState(1);
  const [selectedStrategy, setSelectedStrategy] = useState<StrategyType>("50_30_20");
  const [selectedMode, setSelectedMode] = useState<UXMode>("normal");

  const totalSteps = 4;

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate("/finances/login");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleComplete = () => {
    authService.updateUserSettings({
      selectedStrategy,
      mode: selectedMode,
    });

    // Initialize budget period
    budgetService.getCurrentBudgetPeriod(user.id, selectedStrategy);

    // Navigate to dashboard
    navigate("/finances");
  };

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleComplete();
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Card className={styles.card}>
          <CardHeader>
            <CardTitle>Welcome to Okanos (Beta)</CardTitle>
            <CardDescription>
              Let's set up your financial dashboard in just a few steps
            </CardDescription>
            <div className={styles.progressBar}>
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`${styles.progressStep} ${i + 1 <= step ? styles.progressStepActive : ""}`}
                />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            {/* Step 1: Welcome & Basic Info */}
            {step === 1 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Welcome, {user?.displayName}!</h2>
                <p className={styles.stepDescription}>
                  Okanos helps you navigate the sea of your finances—manage budgets, track credit currents, and stay ahead of the tides.
                  This tool is in <strong>Beta</strong>, which means we're actively developing new features and improvements.
                </p>
                <div className={styles.featureList}>
                  <div className={styles.feature}>
                    <CheckCircle2 className={styles.featureIcon} />
                    <div>
                      <strong>Track Everything:</strong> Credit cards, loans, income, and budgets
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <CheckCircle2 className={styles.featureIcon} />
                    <div>
                      <strong>See Your Score:</strong> Mock credit score simulation based on your data
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <CheckCircle2 className={styles.featureIcon} />
                    <div>
                      <strong>Get Tips:</strong> Personalized, actionable financial advice
                    </div>
                  </div>
                  <div className={styles.feature}>
                    <CheckCircle2 className={styles.featureIcon} />
                    <div>
                      <strong>Plan Ahead:</strong> Simulate scenarios and optimize payoff strategies
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Select Financial Strategy */}
            {step === 2 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Choose Your Financial Strategy</h2>
                <p className={styles.stepDescription}>
                  Select the approach that best fits your financial goals and lifestyle.
                </p>
                <div className={styles.strategyGrid}>
                  {strategies.map((strategy) => (
                    <button
                      key={strategy.id}
                      className={`${styles.strategyCard} ${
                        selectedStrategy === strategy.id ? styles.strategyCardSelected : ""
                      }`}
                      onClick={() => setSelectedStrategy(strategy.id)}
                    >
                      <h3 className={styles.strategyName}>{strategy.name}</h3>
                      <p className={styles.strategyDescription}>{strategy.description}</p>
                      <div className={styles.strategyDetails}>
                        <p><strong>Tradeoffs:</strong> {strategy.tradeoffs}</p>
                        <p><strong>Best for:</strong> {strategy.targetUser}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Select UX Mode */}
            {step === 3 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>Choose Your Experience Mode</h2>
                <p className={styles.stepDescription}>
                  Customize the interface complexity based on your comfort level.
                </p>
                <div className={styles.modeGrid}>
                  <button
                    className={`${styles.modeCard} ${selectedMode === "simple" ? styles.modeCardSelected : ""}`}
                    onClick={() => setSelectedMode("simple")}
                  >
                    <h3 className={styles.modeName}>Simple</h3>
                    <p className={styles.modeDescription}>
                      Essential metrics only. Perfect for beginners who want a clean, easy-to-understand view.
                    </p>
                  </button>

                  <button
                    className={`${styles.modeCard} ${selectedMode === "normal" ? styles.modeCardSelected : ""}`}
                    onClick={() => setSelectedMode("normal")}
                  >
                    <h3 className={styles.modeName}>Normal</h3>
                    <p className={styles.modeDescription}>
                      Balanced detail. Shows most important metrics and helpful insights.
                    </p>
                  </button>

                  <button
                    className={`${styles.modeCard} ${selectedMode === "advanced" ? styles.modeCardSelected : ""}`}
                    onClick={() => setSelectedMode("advanced")}
                  >
                    <h3 className={styles.modeName}>Advanced</h3>
                    <p className={styles.modeDescription}>
                      All the data. For power users who want complete visibility and control.
                    </p>
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Summary & Completion */}
            {step === 4 && (
              <div className={styles.stepContent}>
                <h2 className={styles.stepTitle}>You're All Set!</h2>
                <p className={styles.stepDescription}>
                  Here's a summary of your setup. You can change these settings anytime.
                </p>
                <div className={styles.summary}>
                  <div className={styles.summaryItem}>
                    <strong>Financial Strategy:</strong>
                    <span>{strategies.find(s => s.id === selectedStrategy)?.name}</span>
                  </div>
                  <div className={styles.summaryItem}>
                    <strong>Experience Mode:</strong>
                    <span>{selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)}</span>
                  </div>
                </div>
                <div className={styles.nextSteps}>
                  <h3>Next Steps:</h3>
                  <ol>
                    <li>Add your accounts (credit cards, loans, etc.)</li>
                    <li>Enter your income sources</li>
                    <li>Set up your monthly budget</li>
                    <li>Review your dashboard and personalized tips</li>
                  </ol>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className={styles.buttonGroup}>
              {step > 1 && (
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className={styles.buttonIcon} />
                  Previous
                </Button>
              )}
              <Button onClick={nextStep} className={styles.nextButton}>
                {step === totalSteps ? "Complete Setup" : "Next"}
                {step < totalSteps && <ArrowRight className={styles.buttonIcon} />}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
