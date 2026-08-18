import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import type { Route } from "./+types/finances.login";
import { Button } from "~/components/ui/button/button";
import { Input } from "~/components/ui/input/input";
import { Label } from "~/components/ui/label/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "~/components/ui/card/card";
import { authService } from "~/lib/services/auth.service";
import { Navigation } from "~/components/navigation";
import { isValidEmail, sanitizeText } from "~/lib/utils/validation";
import styles from "./finances.login.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login - Okanos" },
    { name: "description", content: "Navigate the sea of your finances with Okanos." },
  ];
}

export default function FinancesLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (authService.isAuthenticated()) {
      if (authService.hasCompletedOnboarding()) {
        navigate("/finances");
      } else {
        navigate("/finances/onboarding");
      }
    }
  }, [navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const safeName = sanitizeText(displayName, 80);
    if (!isValidEmail(email) || !safeName) {
      setError("Enter a valid email address and display name.");
      return;
    }

    setIsLoading(true);

    try {
      authService.login(email, safeName);

      if (authService.hasCompletedOnboarding()) {
        navigate("/finances");
      } else {
        navigate("/finances/onboarding");
      }
    } catch {
      setError("Unable to sign in. Please check your details and try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Navigation />
      
      <div className={styles.content}>
        <Card className={styles.loginCard}>
          <CardHeader>
            <CardTitle>Okanos <span className={styles.beta}>(Beta)</span></CardTitle>
            <CardDescription>Navigate the sea of your finances
              Sign in to access your comprehensive budgeting, credit tracking, and debt management tools.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className={styles.form}>
              <div className={styles.formGroup}>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  autoComplete="email"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your Name"
                  autoComplete="name"
                  maxLength={80}
                  required
                />
              </div>

              {error ? <p className={styles.note} role="alert">{error}</p> : null}

              <Button type="submit" className={styles.submitButton} disabled={isLoading}>
                {isLoading ? "Signing In..." : "Sign In / Create Account"}
              </Button>

              <p className={styles.note}>
                <strong>Note:</strong> This is a demo version. No real authentication is required. Your data is stored
                locally in your browser.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
