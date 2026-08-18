import { Link, useLocation } from "react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "~/components/ui/button/button";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import styles from "./navigation.module.css";

export function Navigation() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navContainer}>
        <Link to="/" className={styles.navBrand} onClick={closeMobileMenu}>
          <img src="/okanos-logo.png" alt="Okanos Logo" className={styles.logoImage} />
          Okanos
        </Link>

        <ul className={styles.navLinks}>
          <li>
            <Link to="/cards" className={`${styles.navLink} ${location.pathname === "/cards" ? styles.active : ""}`}>
              Cards
            </Link>
          </li>
          <li>
            <Link
              to="/roadmap"
              className={`${styles.navLink} ${location.pathname === "/roadmap" ? styles.active : ""}`}
            >
              Roadmap
            </Link>
          </li>
          <li>
            <Link
              to="/finances/login"
              className={`${styles.navLink} ${location.pathname.startsWith("/finances") ? styles.active : ""}`}
            >
              Okanos <span style={{ fontSize: "0.75em", opacity: 0.7 }}>(Beta)</span>
            </Link>
          </li>
        </ul>

        <div className={styles.navActions}>
          <ColorSchemeToggle />
          <Button size="sm" asChild>
            <a href="https://apps.apple.com/app/okanos" target="_blank" rel="noopener noreferrer">
              Dive In
            </a>
          </Button>
        </div>

        <button className={styles.mobileMenuButton} onClick={toggleMobileMenu} aria-label="Toggle menu">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`${styles.mobileMenu} ${isMobileMenuOpen ? styles.open : ""}`}>
        <ul className={styles.mobileMenuLinks}>
          <li>
            <Link
              to="/cards"
              className={`${styles.mobileMenuLink} ${location.pathname === "/cards" ? styles.active : ""}`}
              onClick={closeMobileMenu}
            >
              Cards
            </Link>
          </li>
          <li>
            <Link
              to="/roadmap"
              className={`${styles.mobileMenuLink} ${location.pathname === "/roadmap" ? styles.active : ""}`}
              onClick={closeMobileMenu}
            >
              Roadmap
            </Link>
          </li>
          <li>
            <Link
              to="/finances/login"
              className={`${styles.mobileMenuLink} ${location.pathname.startsWith("/finances") ? styles.active : ""}`}
              onClick={closeMobileMenu}
            >
              Okanos (Beta)
            </Link>
          </li>
        </ul>

        <div className={styles.mobileActions}>
          <ColorSchemeToggle />
          <Button size="lg" asChild>
            <a href="https://apps.apple.com/app/okanos" target="_blank" rel="noopener noreferrer">
              Dive In
            </a>
          </Button>
        </div>
      </div>
    </nav>
  );
}
