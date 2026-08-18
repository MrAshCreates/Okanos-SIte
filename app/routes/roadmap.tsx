import type { Route } from "./+types/roadmap";
import { Navigation } from "~/components/navigation";
import { Button } from "~/components/ui/button/button";
import styles from "./roadmap.module.css";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Roadmap & Pricing - Okanos" },
    {
      name: "description",
      content:
        "Discover Okanos's development roadmap and choose the perfect plan for your financial literacy journey.",
    },
  ];
}

export default function Roadmap() {
  return (
    <div className={styles.container}>
      <Navigation />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>The Future of Financial Learning</h1>
          <p className={styles.heroSubtitle}>
            Discover our roadmap and find the perfect plan for your credit mastery journey.
          </p>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>This is just the beginning.</h2>
        <p className={styles.sectionSubtitle}>
          Okanos starts with the credit basics but grows with you. Our roadmap brings deeper lessons, new
          challenges, and potential real-world partnerships.
        </p>

        <div className={styles.roadmapTimeline}>
          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3 className={styles.phaseTitle}>Phase 1 – Launch</h3>
              <p className={styles.phaseDescription}>Credit basics with simulated score and gamified lessons.</p>
              <ul className={styles.phaseFeatures}>
                <li>Interactive credit education modules</li>
                <li>Simulated 300-850 credit score system</li>
                <li>Basic challenges and quests</li>
                <li>Essential tips and guides</li>
              </ul>
            </div>
            <div className={styles.timelineNumber}>1</div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3 className={styles.phaseTitle}>Phase 2 – Expansion</h3>
              <p className={styles.phaseDescription}>
                Advanced topics including loans, investments, and the Financial Command Center (Beta).
              </p>
              <ul className={styles.phaseFeatures}>
                <li><strong>Financial Command Center (Beta)</strong> – Comprehensive budgeting and debt management tool</li>
                <li>Loan and mortgage education</li>
                <li>Investment basics and strategies</li>
                <li>Advanced credit optimization</li>
                <li>Long-term wealth building concepts</li>
              </ul>
            </div>
            <div className={styles.timelineNumber}>2</div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3 className={styles.phaseTitle}>Phase 3 – Integrations</h3>
              <p className={styles.phaseDescription}>
                Partnerships with credit bureaus, banks, and card issuers for real-world data and rewards.
              </p>
              <ul className={styles.phaseFeatures}>
                <li>Real credit report integration</li>
                <li>Bank account connections</li>
                <li>Scoreology credit card access</li>
                <li>Personalized recommendations</li>
              </ul>
            </div>
            <div className={styles.timelineNumber}>3</div>
          </div>

          <div className={styles.timelineItem}>
            <div className={styles.timelineContent}>
              <h3 className={styles.phaseTitle}>Phase 4 – Ecosystem</h3>
              <p className={styles.phaseDescription}>
                Media expansion, competitions, and community features to make Scoreology a lifestyle brand.
              </p>
              <ul className={styles.phaseFeatures}>
                <li>Podcasts and video content</li>
                <li>Community challenges and leaderboards</li>
                <li>Influencer collaborations</li>
                <li>Educational partnerships</li>
              </ul>
            </div>
            <div className={styles.timelineNumber}>4</div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className={`${styles.section} ${styles.pricingSection}`}>
        <h2 className={styles.sectionTitle}>Financial literacy should be free.</h2>
        <p className={styles.sectionSubtitle}>
          Scoreology is free at its core. For those who want more, we offer affordable upgrades.
        </p>

        <div className={styles.pricingGrid}>
          <div className={styles.pricingCard}>
            <h3 className={styles.planName}>Free</h3>
            <div className={styles.planPrice}>$0</div>
            <div className={styles.planPeriod}>Forever</div>
            <p className={styles.planDescription}>All core lessons and score simulator to get you started.</p>
            <ul className={styles.planFeatures}>
              <li>Complete credit basics course</li>
              <li>Simulated credit score tracking</li>
              <li>Essential challenges and quests</li>
              <li>Basic tips and guides</li>
              <li>Progress tracking</li>
            </ul>
            <Button variant="outline" className={styles.planButton}>
              Get Started Free
            </Button>
          </div>

          <div className={`${styles.pricingCard} ${styles.featured}`}>
            <h3 className={styles.planName}>Okanos Plus</h3>
            <div className={styles.planPrice}>$4.99</div>
            <div className={styles.planPeriod}>per month</div>
            <p className={styles.planDescription}>Extra lessons, deeper analytics, and advanced challenges.</p>
            <ul className={styles.planFeatures}>
              <li>Everything in Free</li>
              <li>Advanced lesson modules</li>
              <li>Detailed score analytics</li>
              <li>Premium challenges</li>
              <li>Extended progress insights</li>
              <li>Priority customer support</li>
            </ul>
            <Button className={styles.planButton}>Start Plus Trial</Button>
          </div>

          <div className={styles.pricingCard}>
            <h3 className={styles.planName}>Okanos Pro</h3>
            <div className={styles.planPrice}>$9.99</div>
            <div className={styles.planPeriod}>per month</div>
            <p className={styles.planDescription}>Everything in Plus with exclusive guides and early access.</p>
            <ul className={styles.planFeatures}>
              <li>Everything in Plus</li>
              <li>Exclusive expert guides</li>
              <li>Premium benefits program</li>
              <li>Early access to new features</li>
              <li>Advanced financial strategies</li>
              <li>1-on-1 coaching sessions</li>
              <li>White-glove onboarding</li>
            </ul>
            <Button className={styles.planButton}>Start Pro Trial</Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.section}>
        <div className={styles.ctaSection}>
          <h2 className={styles.ctaTitle}>Ready to master the credit game?</h2>
          <p className={styles.ctaSubtitle}>
            Join thousands of learners building their financial confidence with Okanos.
          </p>
          <Button size="lg">Start Your Journey Today</Button>
        </div>
      </section>
    </div>
  );
}
