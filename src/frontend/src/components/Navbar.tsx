import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export function Navbar() {
  const { identity, login, clear, isLoggingIn } = useInternetIdentity();
  const isAuthenticated = identity && !identity.getPrincipal().isAnonymous();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    document.documentElement.classList.contains("dark"),
  );

  const toggleDark = () => {
    document.documentElement.classList.toggle("dark");
    setDark((d) => !d);
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#0B1220]/95 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🚀</span>
            <span className="font-bold text-xl bg-gradient-to-r from-orange-400 to-purple-500 bg-clip-text text-transparent">
              ResumeForge
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 hover:text-white text-sm transition-colors"
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  Transactions
                </Link>
              </>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDark}
              className="text-gray-400 hover:text-white p-2 rounded-lg transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? "☀️" : "🌙"}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/builder"
                  className="hidden sm:block px-4 py-2 text-sm font-medium bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  + New Resume
                </Link>
                <button
                  type="button"
                  onClick={clear}
                  className="px-3 py-2 text-sm text-gray-300 hover:text-white border border-white/20 rounded-lg transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="text-sm text-gray-300 hover:text-white transition-colors"
                >
                  Log In
                </button>
                <button
                  type="button"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="px-4 py-2 text-sm font-semibold bg-gradient-to-r from-orange-500 to-purple-600 text-white rounded-full hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isLoggingIn ? "Connecting..." : "Get Started"}
                </button>
              </div>
            )}

            <button
              type="button"
              className="md:hidden text-gray-300 hover:text-white p-2"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-white/10 flex flex-col gap-3">
            <Link
              to="/"
              className="text-gray-300 py-2 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-gray-300 py-2 text-sm"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  to="/dashboard"
                  className="text-gray-300 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/transactions"
                  className="text-gray-300 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  Transactions
                </Link>
                <Link
                  to="/builder"
                  className="text-gray-300 py-2 text-sm"
                  onClick={() => setMenuOpen(false)}
                >
                  + New Resume
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
