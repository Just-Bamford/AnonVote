import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getResult, getBallot, getAudit } from "../api/client";
import Navbar from "../components/Navbar";
import ResultChart from "../components/ResultChart";
import type { Ballot, Result, AuditCounts, TallyEntry } from "../types";

export default function ResultsPage() {
  const { ballotId } = useParams<{ ballotId: string }>();
  const [ballot, setBallot] = useState<Ballot | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [audit, setAudit] = useState<AuditCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!ballotId) return;
    Promise.all([
      getBallot(ballotId).catch(() => null),
      getResult(ballotId).catch(() => null),
      getAudit(ballotId).catch(() => null),
    ]).then(([b, r, a]) => {
      if (b) setBallot(b.data.data);
      if (r) setResult(r.data.data);
      else setNotFound(true);
      if (a) setAudit(a.data.data);
      setLoading(false);
    });
  }, [ballotId]);

  const buildTallyEntries = (): TallyEntry[] => {
    if (!result || !ballot) return [];
    const tally: Record<string, number> = JSON.parse(result.tallyJson);
    return ballot.options.map((opt) => {
      const count = tally[opt.id] ?? 0;
      const pct = result.totalVotes > 0 ? (count / result.totalVotes) * 100 : 0;
      return { optionId: opt.id, optionText: opt.text, count, percentage: pct };
    });
  };

  return (
    <div className="page-wrapper">
      <Navbar />
      <div
        style={{
          maxWidth: "860px",
          margin: "0 auto",
          padding: "var(--space-10) 0",
          width: "100%",
        }}
      >
        {/* Header */}
        <div className="text-eyebrow mb-3">Results</div>
        <h1
          className="font-space-grotesk font-bold mb-2"
          style={{ fontSize: "var(--text-2xl)", color: "var(--ink-primary)" }}
        >
          Results
        </h1>
        {ballot && (
          <p
            style={{
              color: "var(--ink-muted)",
              fontSize: "var(--text-base)",
              marginBottom: "var(--space-8)",
            }}
          >
            {ballot.topic}
          </p>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ height: "64px", borderRadius: "var(--radius-lg)" }}
              />
            ))}
          </div>
        ) : notFound ? (
          <div className="card p-8" style={{ textAlign: "center" }}>
            <p style={{ color: "var(--ink-muted)" }}>
              No published results found for this ballot yet.
            </p>
            {ballot?.status === "OPEN" && (
              <p
                style={{
                  color: "var(--ink-muted)",
                  fontSize: "var(--text-sm)",
                  marginTop: "var(--space-2)",
                }}
              >
                Results will be published after the voting deadline.
              </p>
            )}
          </div>
        ) : result ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-6)",
            }}
          >
            {/* Inconsistency Warning */}
            {!result.isConsistent && (
              <div className="message message-warning">
                <span className="message-icon">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                </span>
                <span>
                  Inconsistency detected in this result. Vote count may not
                  match issued tokens.
                </span>
              </div>
            )}

            {/* Vote Breakdown */}
            <div className="card p-6">
              <h2
                className="font-space-grotesk font-semibold mb-4"
                style={{
                  fontSize: "var(--text-lg)",
                  color: "var(--ink-primary)",
                }}
              >
                Vote Breakdown
              </h2>
              <ResultChart entries={buildTallyEntries()} />
              <div
                style={{
                  marginTop: "var(--space-4)",
                  paddingTop: "var(--space-4)",
                  borderTop: "1px solid var(--border-soft)",
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "var(--text-sm)",
                }}
              >
                <span style={{ color: "var(--ink-muted)" }}>Total votes</span>
                <span
                  style={{
                    color: "var(--ink-primary)",
                    fontWeight: "var(--weight-semibold)",
                  }}
                >
                  {result.totalVotes}
                </span>
              </div>
            </div>

            {/* Blockchain Verification */}
            {result.stellarTxId && (
              <div className="card p-6">
                <h2
                  className="font-space-grotesk font-semibold mb-2"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--ink-primary)",
                  }}
                >
                  Blockchain Verification
                </h2>
                <p
                  style={{
                    color: "var(--ink-muted)",
                    fontSize: "var(--text-sm)",
                    marginBottom: "var(--space-3)",
                  }}
                >
                  This result is permanently recorded on the Stellar blockchain.
                </p>
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${result.stellarTxId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chip-mono"
                  style={{ display: "inline-flex", wordBreak: "break-all" }}
                >
                  <svg
                    width="14"
                    height="14"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    style={{ flexShrink: 0 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                  {result.stellarTxId}
                </a>
              </div>
            )}

            {/* Audit Summary */}
            {audit && (
              <div className="card p-6">
                <h2
                  className="font-space-grotesk font-semibold mb-4"
                  style={{
                    fontSize: "var(--text-lg)",
                    color: "var(--ink-primary)",
                  }}
                >
                  Audit Summary
                </h2>
                <div
                  style={{
                    display: "flex",
                    gap: "var(--space-6)",
                    marginBottom: "var(--space-4)",
                  }}
                >
                  <div>
                    <span
                      style={{
                        color: "var(--ink-muted)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      Tokens issued{" "}
                    </span>
                    <span
                      style={{
                        color: "var(--ink-primary)",
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {audit.tokensIssued}
                    </span>
                  </div>
                  <div>
                    <span
                      style={{
                        color: "var(--ink-muted)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      Votes cast{" "}
                    </span>
                    <span
                      style={{
                        color: "var(--ink-primary)",
                        fontWeight: "var(--weight-semibold)",
                        fontSize: "var(--text-sm)",
                      }}
                    >
                      {audit.votesCast}
                    </span>
                  </div>
                </div>
                <Link
                  to={`/audit/${ballotId}`}
                  className="link-dark"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  View full audit log →
                </Link>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
