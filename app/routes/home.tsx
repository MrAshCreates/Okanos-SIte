import type { Route } from "./+types/home";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button/button";
import { Link } from "react-router";
import styles from "./home.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Okanos - Navigate the Sea of Your Finances" },
    {
      name: "description",
      content:
        "Stay ahead of the currents and avoid the tides of finance. Okanos teaches you to navigate credit, budgeting, and debt with confidence.",
    },
  ];
}

export default function Home() {
  return (
    <div className={styles.container}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Navigate the Sea of Your Finances.</h1>
          <p className={styles.heroSubtitle}>
            Stay ahead of the currents, avoid the tides, and chart your course to financial freedom.
          </p>
          <div className={styles.heroActions}>
            <Button className={styles.heroPrimary} asChild>
              <a href="https://apps.apple.com/app/okanos" target="_blank" rel="noopener noreferrer">
                Dive In Free
              </a>
            </Button>
            <Button className={styles.heroSecondary} asChild>
              <Link to="/roadmap">View Roadmap</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Okanos Section */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <h2 className={styles.sectionTitle}>The ocean of finance doesn't have to drown you.</h2>
        <div className={styles.whyContent}>
          <div>
            <p className={styles.whyText}>
              From your first paycheck to major loans, money flows like water. Okanos makes it simple—turning
              financial literacy into an exploration you can actually enjoy.
            </p>
            <ul className={styles.whyFeatures}>
              <li>Interactive lessons that flow naturally</li>
              <li>Real-world scenarios with simulated credit depths</li>
              <li>Learn from mistakes in safe waters before diving into the real ocean</li>
            </ul>
          </div>
          <div className={styles.whyVisual}>
            <div className={styles.mockupContainer}>
              <div className={styles.mockupPhone}>
                <div className={styles.mockupScreen}>
                  <div className={styles.scoreDisplay}>750</div>
                  <div style={{ fontSize: "12px", color: "var(--color-base-text-subtle)", textAlign: "center" }}>
                    Ocean Health Score
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Chart. Navigate. Discover.</h2>
        <p className={styles.sectionSubtitle}>
          Okanos teaches you the currents of credit through bite-sized lessons, interactive challenges, and a
          simulated financial ocean that reacts to your decisions.
        </p>

        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🌊</span>
            <h3 className={styles.featureTitle}>Tidal Lessons</h3>
            <p className={styles.featureDescription}>
              Simple, flowing learning modules that make credit concepts as natural as ocean waves.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>🧭</span>
            <h3 className={styles.featureTitle}>Ocean Health Score</h3>
            <p className={styles.featureDescription}>
              A simulated 300–850 score that ebbs and flows with your actions, teaching you how real credit decisions
              create ripples.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>⚓</span>
            <h3 className={styles.featureTitle}>Voyages & Discoveries</h3>
            <p className={styles.featureDescription}>
              Complete financial scenarios, unlock treasures, and earn experience as you master navigating the depths.
            </p>
          </div>

          <div className={styles.featureCard}>
            <span className={styles.featureIcon}>💎</span>
            <h3 className={styles.featureTitle}>Navigator's Compass</h3>
            <p className={styles.featureDescription}>
              Practical strategies and insights for real-world financial success, delivered like messages in bottles.
            </p>
          </div>
        </div>
      </section>

      {/* Built for Everyone Section */}
      <section className={`${styles.section} ${styles.whySection}`}>
        <h2 className={styles.sectionTitle}>From first voyage to financial recovery.</h2>
        <p className={styles.sectionSubtitle}>
          Whether you're 16 and preparing for your first financial journey or 36 and navigating troubled waters, Okanos is built
          for you.
        </p>

        <div className={styles.audienceGrid}>
          <div className={styles.audienceCard}>
            <h3 className={styles.audienceTitle}>New Navigators</h3>
            <p className={styles.audienceDescription}>
              Start in calm waters. Learn the fundamentals before venturing into deeper currents, building confidence for your
              financial voyage.
            </p>
          </div>

          <div className={styles.audienceCard}>
            <h3 className={styles.audienceTitle}>Young Explorers</h3>
            <p className={styles.audienceDescription}>
              Chart your course without shipwrecks. Practice with real scenarios in safe harbors before setting sail on
              actual financial seas.
            </p>
          </div>

          <div className={styles.audienceCard}>
            <h3 className={styles.audienceTitle}>Storm Survivors</h3>
            <p className={styles.audienceDescription}>
              Learn to read the tides and rebuild your vessel. Understand what caused the storm and develop strategies for
              calmer waters.
            </p>
          </div>
        </div>
      </section>

      {/* Okanos Cards Teaser Section */}
      <section className={styles.section}>
        <div className={`${styles.section} ${styles.whySection}`}>
          <h2 className={styles.sectionTitle}>Coming Soon: Okanos Cards</h2>
          <p className={styles.sectionSubtitle}>
            Complete your financial voyage and unlock access to credit cards designed to reward healthy behavior—with no
            hidden depths or junk fees, ever.
          </p>
          <div className={styles.heroActions}>
            <Button size="lg" asChild>
              <Link to="/cards">Explore Card Fleet</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Join the Movement Section */}
      <section className={styles.section}>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Your future self will navigate with confidence.</h2>
          <p className={styles.ctaSubtitle}>
            Start exploring today. Build confidence, master the financial seas, and prepare for real-world success.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" asChild>
              <a href="https://apps.apple.com/app/okanos" target="_blank" rel="noopener noreferrer">
                Dive In Free
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/finances/login">Try Okanos Beta</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
