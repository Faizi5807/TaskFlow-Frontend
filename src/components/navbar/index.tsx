import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../store/auth-context";
import { getInitials } from "../../utils/helpers/helpers";
import styles from "./styles.module.css";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const displayName = user?.name || user?.email || "User";

  return (
    <nav className={styles.navbar}>
      <Link to="/dashboard" className={styles.brand}>
        <div className={styles.logoIcon}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
        </div>
        <span className={styles.brandText}>
          Task<span className={styles.brandAccent}>Flow</span>
        </span>
      </Link>

      <div className={styles.navActions}>
        <div className={styles.userPill}>
          <div className={styles.avatar}>{getInitials(displayName)}</div>
          <span className={styles.userName}>{displayName}</span>
        </div>
        <button
          className={styles.logoutBtn}
          onClick={handleLogout}
          title="Logout"
          aria-label="Logout"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>
    </nav>
  );
}
