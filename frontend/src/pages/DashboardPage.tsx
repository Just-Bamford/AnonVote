import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getBallots } from "../api/client";
import { useAuth } from "../hooks/useAuth";
import Navbar from "../components/Navbar";
import BallotCard from "../components/BallotCard";
import type { Ballot } from "../types";

export default function DashboardPage() {
  const { isAuthenticated, loading: authLoading, orgName } = useAuth();
  const navigate = useNavigate();
  const [ballots, setBallots] = useState<Ballot[]>([]);

  const fetchBallots = async () => {
    try {
      const res = await getBallots();
      setBallots(res.data.data);
    } catch {
      // 401 handled by interceptor
    } finally {
      // setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/login");
      return;
    }
    if (!authLoading) fetchBallots();
  }, [authLoading, isAuthenticated]);

  if (authLoading) {
    return (
      <div className="page-wrapper">
        <Navbar />
        <div className="page-content">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div
              className="skeleton"
              style={{
                height: "40px",
                width: "280px",
                marginBottom: "var(--space-8)",
              }}
            />
            <div
              style={{
                display: "flex",
                gap: "var(--space-4)",
                marginBottom: "var(--space-8)",
              }}
            >
              <div className="skeleton" style={{ height: "100px", flex: 1 }} />
              <div className="skeleton" style={{ height: "100px", flex: 1 }} />
              <div className="skeleton" style={{ height: "100px", flex: 1 }} />
            </div>
            <div
              className="skeleton"
              style={{ height: "200px", width: "100%" }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Auto-refresh every 60s
  useEffect(() => {
    const interval = setInterval(fetchBallots, 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page-wrapper">
      <Navbar />
      <div className="page-content">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-space-grotesk font-bold mb-1">
                Good morning,
              </h1>
              {orgName && (
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  {orgName}
                </p>
              )}
            </div>
            <Link
              to="/ballots/new"
              className="btn-primary"
              style={{ padding: "10px 20px" }}
            >
              + Create Ballot
            </Link>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-dm-sans">
                  Total Ballots
                </span>
                <svg
                  className="w-6 h-6 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <p className="text-3xl font-space-grotesk font-bold text-gray-900 dark:text-white">
                {ballots.length}
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-dm-sans">
                  Active Ballots
                </span>
                <svg
                  className="w-6 h-6 text-green-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-space-grotesk font-bold text-gray-900 dark:text-white">
                {ballots.filter((b) => b.status === "OPEN").length}
              </p>
            </div>
            <div className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-400 text-sm font-dm-sans">
                  Total Votes Cast
                </span>
                <svg
                  className="w-6 h-6 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-3xl font-space-grotesk font-bold text-gray-900 dark:text-white">
                {ballots.reduce((sum, b) => sum + (b.votesCast || 0), 0)}
              </p>
            </div>
          </div>

          {ballots.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
                No ballots yet.
              </p>
              <Link
                to="/ballots/new"
                className="text-primary hover:text-primary-hover font-medium"
              >
                Create your first ballot →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {ballots.map((b) => (
                <BallotCard key={b.id} ballot={b} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
