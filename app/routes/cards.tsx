import type { Route } from "./+types/cards";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button/button";
import { Link } from "react-router";
import styles from "./cards.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Okanos Card Family - Credit Cards That Teach and Reward" },
    {
      name: "description",
      content:
        "Discover the Okanos Card Family - credit cards designed to teach healthy credit behavior while offering meaningful rewards and no junk fees.",
    },
  ];
}

export default function Cards() {
  return (
    <div className={styles.container}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Okanos Card Family</h1>
          <p className={styles.heroSubtitle}>
            Credit cards that teach healthy behavior, reward smart decisions, and grow with you—all without junk fees or
            penalty traps.
          </p>
        </div>
      </section>

      {/* Product Philosophy Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Our Philosophy</h2>
        <p className={styles.sectionSubtitle}>
          Every Okanos card is built on four core principles that put your financial success first.
        </p>

        <div className={styles.philosophyGrid}>
          <div className={styles.philosophyItem}>
            <span className={styles.philosophyIcon}>🎯</span>
            <h3 className={styles.philosophyTitle}>Teach & Reward</h3>
            <p className={styles.philosophyDescription}>
              Every feature is designed to teach healthy credit behavior and reward you for making smart decisions.
            </p>
          </div>
          <div className={styles.philosophyItem}>
            <span className={styles.philosophyIcon}>🚫</span>
            <h3 className={styles.philosophyTitle}>No Junk Fees</h3>
            <p className={styles.philosophyDescription}>
              Zero late fees, zero penalty APRs, zero foreign transaction fees. We profit from your success, not your
              mistakes.
            </p>
          </div>
          <div className={styles.philosophyItem}>
            <span className={styles.philosophyIcon}>💎</span>
            <h3 className={styles.philosophyTitle}>Meaningful Rewards</h3>
            <p className={styles.philosophyDescription}>
              Rewards that actually matter for students and learners—education expenses, transit, and everyday
              purchases.
            </p>
          </div>
          <div className={styles.philosophyItem}>
            <span className={styles.philosophyIcon}>📊</span>
            <h3 className={styles.philosophyTitle}>Sustainable Economics</h3>
            <p className={styles.philosophyDescription}>
              Built on honest unit economics through interchange and responsible lending, not predatory practices.
            </p>
          </div>
        </div>
      </section>

      {/* Cards Overview Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Choose Your Card</h2>
        <p className={styles.sectionSubtitle}>
          Four cards designed for different stages of your credit journey, all with the same commitment to your
          financial education.
        </p>

        <div className={styles.cardsGrid}>
          {/* Build Card */}
          <div className={styles.cardItem}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>Okanos Build</h3>
              <p className={styles.cardTarget}>For new-to-credit & rebuilders</p>
              <p className={styles.cardFee}>$0 Annual Fee</p>
            </div>
            <div className={styles.cardRewards}>
              <h4 className={styles.cardRewardsTitle}>Rewards</h4>
              <p className={styles.cardRewardsText}>1% back on all purchases</p>
            </div>
            <div className={styles.cardPerks}>
              <h4 className={styles.cardPerksTitle}>Key Features</h4>
              <ul className={styles.cardPerksList}>
                <li className={styles.cardPerkItem}>Secured card with $200-$2,500 deposit</li>
                <li className={styles.cardPerkItem}>Graduates to unsecured after 12 on-time payments</li>
                <li className={styles.cardPerkItem}>Utilization coaching and insights</li>
                <li className={styles.cardPerkItem}>Free FICO score monitoring</li>
                <li className={styles.cardPerkItem}>Virtual cards and spending controls</li>
              </ul>
            </div>
            <div className={styles.cardNetwork}>Mastercard Standard</div>
          </div>

          {/* Student Card */}
          <div className={styles.cardItem}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>Okanos Student</h3>
              <p className={styles.cardTarget}>For students 18+ with fair credit</p>
              <p className={styles.cardFee}>$0 Annual Fee</p>
            </div>
            <div className={styles.cardRewards}>
              <h4 className={styles.cardRewardsTitle}>Rewards</h4>
              <p className={styles.cardRewardsText}>
                5% on education expenses (up to $1,000/month)
                <br />
                1.5% on all other purchases
              </p>
            </div>
            <div className={styles.cardPerks}>
              <h4 className={styles.cardPerksTitle}>Key Features</h4>
              <ul className={styles.cardPerksList}>
                <li className={styles.cardPerkItem}>Streak Boost: +0.5% for completing lessons</li>
                <li className={styles.cardPerkItem}>LoanPay top-up: +10% on student loan payments</li>
                <li className={styles.cardPerkItem}>Purchase protection and extended warranty</li>
                <li className={styles.cardPerkItem}>24/7 phone and chat support</li>
                <li className={styles.cardPerkItem}>Credit lines: $500-$5,000</li>
              </ul>
            </div>
            <div className={styles.cardNetwork}>Mastercard World</div>
          </div>

          {/* Everyday Card */}
          <div className={styles.cardItem}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>Okanos Everyday</h3>
              <p className={styles.cardTarget}>For prime credit users</p>
              <p className={styles.cardFee}>$0 Annual Fee</p>
            </div>
            <div className={styles.cardRewards}>
              <h4 className={styles.cardRewardsTitle}>Rewards</h4>
              <p className={styles.cardRewardsText}>
                3% on dining, transit & groceries
                <br />
                2% on all other purchases
              </p>
            </div>
            <div className={styles.cardPerks}>
              <h4 className={styles.cardPerksTitle}>Key Features</h4>
              <ul className={styles.cardPerksList}>
                <li className={styles.cardPerkItem}>Cell phone protection ($500 coverage)</li>
                <li className={styles.cardPerkItem}>Autopay APR-Down: -1% APR after 6 months</li>
                <li className={styles.cardPerkItem}>Low-utilization bonus: $5/month credit</li>
                <li className={styles.cardPerkItem}>Purchase protection and extended warranty</li>
                <li className={styles.cardPerkItem}>Credit lines: $2,000-$25,000</li>
              </ul>
            </div>
            <div className={styles.cardNetwork}>Mastercard World</div>
          </div>

          {/* Pro Card */}
          <div className={styles.cardItem}>
            <div className={styles.cardHeader}>
              <h3 className={styles.cardName}>Okanos Pro</h3>
              <p className={styles.cardTarget}>For excellent credit users</p>
              <p className={styles.cardFee}>$95 Annual Fee</p>
            </div>
            <div className={styles.cardRewards}>
              <h4 className={styles.cardRewardsTitle}>Rewards</h4>
              <p className={styles.cardRewardsText}>
                5% on education & transit
                <br />
                3% on dining & travel
                <br />
                2% on all other purchases
              </p>
            </div>
            <div className={styles.cardPerks}>
              <h4 className={styles.cardPerksTitle}>Key Features</h4>
              <ul className={styles.cardPerksList}>
                <li className={styles.cardPerkItem}>2 lounge passes per year</li>
                <li className={styles.cardPerkItem}>Primary rental car coverage</li>
                <li className={styles.cardPerkItem}>Return protection and purchase protection</li>
                <li className={styles.cardPerkItem}>LoanPay top-up: +10% (up to $50/month)</li>
                <li className={styles.cardPerkItem}>Credit lines: $5,000-$50,000</li>
              </ul>
            </div>
            <div className={styles.cardNetwork}>Mastercard World Elite</div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Quick Comparison</h2>
        <div className={styles.comparisonTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Card</th>
                <th className={styles.tableHeaderCell}>Target FICO</th>
                <th className={styles.tableHeaderCell}>Annual Fee</th>
                <th className={styles.tableHeaderCell}>Base Rewards</th>
                <th className={styles.tableHeaderCell}>Signature Perk</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Okanos Build</td>
                <td className={styles.tableCell}>0-629 or thin file</td>
                <td className={styles.tableCell}>$0</td>
                <td className={styles.tableCell}>1% all spend</td>
                <td className={styles.tableCell}>Graduates to unsecured</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Okanos Student</td>
                <td className={styles.tableCell}>630-739 (students)</td>
                <td className={styles.tableCell}>$0</td>
                <td className={styles.tableCell}>1.5% all spend</td>
                <td className={styles.tableCell}>5% education + Streak Boosts</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Okanos Everyday</td>
                <td className={styles.tableCell}>680-759</td>
                <td className={styles.tableCell}>$0</td>
                <td className={styles.tableCell}>2% all spend</td>
                <td className={styles.tableCell}>3% dining/transit/groceries</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Okanos Pro</td>
                <td className={styles.tableCell}>720+</td>
                <td className={styles.tableCell}>$95</td>
                <td className={styles.tableCell}>2% all spend</td>
                <td className={styles.tableCell}>5% education/transit + lounges</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* App Features Section */}
      <section className={styles.section}>
        <div className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>Apple-Grade App Experience</h2>
          <p className={styles.sectionSubtitle}>
            Every Okanos card comes with a beautifully designed app that makes managing credit simple and
            educational.
          </p>

          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Instant Apple Pay Provisioning</h3>
              <p className={styles.featureDescription}>
                Add your card to Apple Pay immediately after approval for instant, secure payments.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Utilization Guard</h3>
              <p className={styles.featureDescription}>
                Soft cap at 30% of your limit with override option—nudging healthier credit behavior by default.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Smart Autopay</h3>
              <p className={styles.featureDescription}>
                Choose statement, minimum, or "interest-optimized" payments with projected interest calculations.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Simulated Score Sync</h3>
              <p className={styles.featureDescription}>
                Visualize how your current behavior would affect a real credit score in real-time.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Category Locks</h3>
              <p className={styles.featureDescription}>
                Toggle merchants and categories on/off, with "No cash-like transactions" enabled by default.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Privacy Controls</h3>
              <p className={styles.featureDescription}>
                Per-merchant virtual numbers, one-tap freeze, and real-time receipts for complete transaction control.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* No Junk Fees Highlight */}
      <section className={styles.section}>
        <div className={styles.highlightBox}>
          <h2 className={styles.highlightTitle}>Zero Junk Fees, Always</h2>
          <p className={styles.highlightText}>
            No late fees. No penalty APRs. No foreign transaction fees. No returned payment fees. We believe in
            transparent, honest pricing that helps you succeed, not profit from your mistakes.
          </p>
        </div>
      </section>

      {/* Education Integration */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Education That Actually Matters</h2>
        <p className={styles.sectionSubtitle}>
          Your Okanos card isn't just a payment method—it's a learning tool that grows with your knowledge.
        </p>

        <div className={styles.featuresSection}>
          <ul className={styles.featuresList}>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Lesson Completion Rewards</h3>
              <p className={styles.featureDescription}>
                Complete in-app lessons to unlock permanent feature upgrades like higher Streak Boost caps and earlier
                secured card graduation.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Reality Quests</h3>
              <p className={styles.featureDescription}>
                Monthly challenges that mirror real-life scenarios—unexpected expenses, utilization spikes, rate
                changes—with real rewards and educational outcomes.
              </p>
            </li>
            <li className={styles.featureItem}>
              <h3 className={styles.featureTitle}>Behavior-Based Benefits</h3>
              <p className={styles.featureDescription}>
                The more you learn and demonstrate healthy credit habits, the better your card benefits become over
                time.
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* Launch Timeline */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Coming Soon</h2>
        <p className={styles.sectionSubtitle}>
          The Okanos Card Family will launch in phases, starting with our foundational learning cards.
        </p>

        <div className={styles.comparisonTable}>
          <table className={styles.table}>
            <thead className={styles.tableHeader}>
              <tr>
                <th className={styles.tableHeaderCell}>Phase</th>
                <th className={styles.tableHeaderCell}>Cards</th>
                <th className={styles.tableHeaderCell}>Key Features</th>
                <th className={styles.tableHeaderCell}>Timeline</th>
              </tr>
            </thead>
            <tbody>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Beta</td>
                <td className={styles.tableCell}>Build + Student</td>
                <td className={styles.tableCell}>Core rewards, Utilization Guard, Okanos integration</td>
                <td className={styles.tableCell}>2027</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Scale</td>
                <td className={styles.tableCell}>Everyday</td>
                <td className={styles.tableCell}>Cell phone protection, broader perks, higher limits</td>
                <td className={styles.tableCell}>Late 2027</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Premium</td>
                <td className={styles.tableCell}>Pro</td>
                <td className={styles.tableCell}>Lounge passes, travel protections, premium rewards</td>
                <td className={styles.tableCell}>2028</td>
              </tr>
              <tr className={styles.tableRow}>
                <td className={`${styles.tableCell} ${styles.tableCellStrong}`}>Ecosystem</td>
                <td className={styles.tableCell}>All Cards</td>
                <td className={styles.tableCell}>LoanPay partnerships, merchant offers, course completion unlocks</td>
                <td className={styles.tableCell}>Post-2028</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className={styles.section}>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to Transform Your Credit Journey?</h2>
          <p className={styles.ctaSubtitle}>
            Start learning with Okanos today and be first in line when our revolutionary card family launches.
          </p>
          <div className={styles.ctaActions}>
            <Button size="lg" asChild>
              <a href="https://apps.apple.com/app/okanos" target="_blank" rel="noopener noreferrer">
                Download Okanos App
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/how-it-works">Learn How It Works</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
