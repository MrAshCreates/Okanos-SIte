import { Outlet, Link, useNavigate, useLocation } from "react-router";
import { useEffect, useState } from "react";
import { 
  LayoutDashboard, 
  Wallet, 
  CreditCard, 
  Building, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { authService } from "~/lib/services/auth.service";
import { Button } from "~/components/ui/button/button";
import { ColorSchemeToggle } from "~/components/ui/color-scheme-toggle/color-scheme-toggle";
import styles from "./finances.layout.module.css";

export default function FinancesLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const isAuthenticated = Boolean(user);

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);

    if (!currentUser) {
      navigate("/finances/login");
      return;
    }

    if (!authService.hasCompletedOnboarding() && !location.pathname.includes("/onboarding")) {
      navigate("/finances/onboarding");
    }
  }, [navigate, location]);

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/finances/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const navItems = [
    { path: "/finances", label: "Dashboard", icon: LayoutDashboard },
    { path: "/finances/budget", label: "Budget", icon: Wallet },
    { path: "/finances/credit-cards", label: "Credit Cards", icon: CreditCard },
    { path: "/finances/loans", label: "Loans", icon: Building },
    { path: "/finances/income", label: "Income", icon: DollarSign },
    { path: "/finances/reports", label: "Reports", icon: BarChart3 },
    { path: "/finances/settings", label: "Settings", icon: Settings },
  ];

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={styles.container}>
      {/* Mobile Header */}
      <header className={styles.mobileHeader}>
        <button onClick={toggleSidebar} className={styles.menuButton} aria-label="Toggle menu">
          {isSidebarOpen ? <X /> : <Menu />}
        </button>
        <div className={styles.headerTitle}>
          <img src="/okanos-logo.png" alt="Okanos Logo" className={styles.logoImage} />
          <span>Okanos <span className={styles.beta}>(Beta)</span></span>
        </div>
        <ColorSchemeToggle />
      </header>

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.sidebarOpen : ""}`}>
        <div className={styles.sidebarHeader}>
          <Link to="/" className={styles.logo} onClick={closeSidebar}>
            <img src="/okanos-logo.png" alt="Okanos Logo" className={styles.logoImage} />
            <div className={styles.logoText}>
              <span className={styles.brandName}>Okanos</span>
              <span className={styles.productName}>Navigate the Sea of Your Finances <span className={styles.beta}>(Beta)</span></span>
            </div>
          </Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              const Icon = item.icon;
              // For dashboard, match both /finances and /finances exactly
              const isActive = item.path === "/finances" 
                ? location.pathname === "/finances" || location.pathname === "/finances/"
                : location.pathname === item.path;
              
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`${styles.navLink} ${isActive ? styles.active : ""}`}
                    onClick={closeSidebar}
                  >
                    <Icon className={styles.navIcon} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          {user && (
            <div className={styles.userInfo}>
              <div className={styles.userName}>{user.displayName}</div>
              <div className={styles.userEmail}>{user.email}</div>
            </div>
          )}
          <Button
            variant="outline"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            <LogOut className={styles.navIcon} />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={closeSidebar} />
      )}

      {/* Main Content */}
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
