import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../context/ThemeContext";
import "./Navbar.css";

export default function Navbar() {
  const { isAuthenticated, orgName, logout, loading } = useAuth();
  const { theme, toggleTheme } = useTheme();

  // Show skeleton while auth state is loading
  if (loading) {
    return (
      <nav className="navbar">
        <div className="navbar-logo">
          <div className="hexagon-icon">
            <svg viewBox="0 0 24 24">
              <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" />
            </svg>
          </div>
          <span className="opacity-50">AnonVote</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="navbar-network font-mono opacity-50">...</span>
          <button className="theme-toggle opacity-50" disabled>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          </button>
        </div>
      </nav>
    );
  }

  return (
    <nav className="navbar">
      <Link
        to={isAuthenticated ? "/dashboard" : "/login"}
        className="navbar-logo"
      >
        <div className="hexagon-icon">
          <svg viewBox="0 0 24 24">
            <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" />
          </svg>
        </div>
        <span>AnonVote</span>
      </Link>

      <div className="flex items-center gap-4">
        <span className="navbar-network font-mono">STELLAR TESTNET</span>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          )}
        </button>

        {isAuthenticated ? (
          <div className="flex items-center gap-4">
            <span className="font-dm-sans text-sm text-gray-600 dark:text-gray-300">
              {orgName}
            </span>
            <button
              onClick={logout}
              className="btn-primary"
              style={{ padding: "8px 16px" }}
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="font-dm-sans text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn-primary"
              style={{ padding: "8px 16px" }}
            >
              Register
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
