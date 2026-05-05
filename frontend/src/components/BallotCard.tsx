import { Link } from "react-router-dom";
import { useState } from "react";
import type { Ballot } from "../types";
import Toast from "./Toast";
import { deleteBallot, tallyBallot } from "../api/client";
import { useNotifications } from "../context/NotificationContext";

interface Props {
  ballot: Ballot;
  onBallotDeleted: () => void;
}

export default function BallotCard({ ballot, onBallotDeleted }: Props) {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isTallying, setIsTallying] = useState(false);

  const { addNotification } = useNotifications();
  const isOpen = ballot.status === "OPEN";
  const deadline = new Date(ballot.deadline);
  const tokenLink = `${window.location.origin}/vote/${ballot.id}/token`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(tokenLink);
      setToast({ message: "Voter link copied to clipboard!", type: "success" });
    } catch (err) {
      console.error("Failed to copy:", err);
      setToast({
        message: "Failed to copy link. Please try again.",
        type: "error",
      });
    }
  };

  const handleTally = async () => {
    if (
      !confirm(
        "This will close the ballot and publish results. Voting will end immediately. Continue?",
      )
    )
      return;
    setIsTallying(true);
    try {
      await tallyBallot(ballot.id);
      addNotification({
        type: "results_published",
        title: "Results published",
        message: `"${ballot.topic}" has been closed and results are ready`,
      });
      setToast({
        message: "Ballot closed and results published.",
        type: "success",
      });
      onBallotDeleted(); // refresh dashboard
    } catch (err: any) {
      setToast({
        message: err?.response?.data?.message || "Failed to tally ballot.",
        type: "error",
      });
    } finally {
      setIsTallying(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this ballot?")) return;

    setIsDeleting(true);
    try {
      await deleteBallot(ballot.id);
      setToast({ message: "Ballot deleted successfully", type: "success" });
      onBallotDeleted();
    } catch (err: any) {
      console.error("Failed to delete:", err);
      const errorMessage =
        err?.response?.data?.message ||
        "Failed to delete ballot. Please try again.";
      setToast({
        message: errorMessage,
        type: "error",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div
      className="card p-6"
      style={{
        transition:
          "border-color var(--transition-base), box-shadow var(--transition-base)",
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <h3
          className="font-space-grotesk font-semibold text-lg leading-snug"
          style={{ color: "var(--ink-primary)" }}
        >
          {ballot.topic}
        </h3>
        <span className={isOpen ? "badge badge-open" : "badge badge-closed"}>
          {isOpen ? "OPEN" : "CLOSED"}
        </span>
      </div>

      {/* Inconsistency Warning */}
      {ballot.result && !ballot.result.isConsistent && (
        <div className="message message-warning mb-4">
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
          <span style={{ fontSize: "var(--text-sm)" }}>
            Inconsistency detected: vote count does not match issued tokens.
          </span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        <div
          style={{
            background: "var(--surface-base)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--ink-muted)",
              fontSize: "var(--text-xs)",
              marginBottom: "var(--space-1)",
            }}
          >
            Eligible
          </p>
          <p
            style={{
              color: "var(--ink-primary)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-base)",
            }}
          >
            {ballot.eligibleVoters ?? "—"}
          </p>
        </div>
        <div
          style={{
            background: "var(--surface-base)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--ink-muted)",
              fontSize: "var(--text-xs)",
              marginBottom: "var(--space-1)",
            }}
          >
            Tokens
          </p>
          <p
            style={{
              color: "var(--brand-primary)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-base)",
              fontFamily: "var(--font-mono)",
            }}
          >
            {ballot.tokensIssued ?? "—"}
          </p>
        </div>
        <div
          style={{
            background: "var(--surface-base)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--ink-muted)",
              fontSize: "var(--text-xs)",
              marginBottom: "var(--space-1)",
            }}
          >
            Votes
          </p>
          <p
            style={{
              color: "var(--ink-primary)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-base)",
            }}
          >
            {ballot.votesCast ?? "—"}
          </p>
        </div>
        <div
          style={{
            background: "var(--surface-base)",
            borderRadius: "var(--radius-md)",
            padding: "var(--space-3)",
            textAlign: "center",
          }}
        >
          <p
            style={{
              color: "var(--ink-muted)",
              fontSize: "var(--text-xs)",
              marginBottom: "var(--space-1)",
            }}
          >
            Deadline
          </p>
          <p
            style={{
              color: "var(--ink-primary)",
              fontWeight: "var(--weight-semibold)",
              fontSize: "var(--text-xs)",
            }}
          >
            {deadline.toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div
        className="flex flex-wrap gap-2"
        role="group"
        aria-label={`Actions for ${ballot.topic}`}
      >
        {isOpen && (
          <button
            onClick={copyLink}
            className="btn-primary"
            aria-label={`Copy voter link for ${ballot.topic}`}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: "var(--text-sm)",
              padding: "8px 12px",
            }}
          >
            Copy Voter Link
          </button>
        )}
        {isOpen && (
          <button
            onClick={handleTally}
            disabled={isTallying}
            className="btn-ghost"
            aria-label={`Close and tally ${ballot.topic}`}
            style={{
              fontSize: "var(--text-sm)",
              padding: "8px 12px",
              minWidth: "auto",
            }}
            title="Close ballot and publish results now"
          >
            {isTallying ? "Tallying…" : "Close & Tally"}
          </button>
        )}
        {!isOpen && ballot.result && (
          <Link
            to={`/results/${ballot.id}`}
            className="btn-ghost"
            aria-label={`View results for ${ballot.topic}`}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: "var(--text-sm)",
              padding: "8px 12px",
              textAlign: "center",
            }}
          >
            View Results
          </Link>
        )}
        <Link
          to={`/ballots/${ballot.id}/edit`}
          className="btn-ghost"
          aria-label={`Edit ${ballot.topic}`}
          style={{
            fontSize: "var(--text-sm)",
            padding: "8px 12px",
            minWidth: "auto",
          }}
        >
          Edit
        </Link>
        <Link
          to={`/audit/${ballot.id}`}
          className="btn-ghost"
          aria-label={`View audit log for ${ballot.topic}`}
          style={{
            fontSize: "var(--text-sm)",
            padding: "8px 12px",
            minWidth: "auto",
          }}
        >
          Audit
        </Link>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="btn-danger"
          aria-label={`Delete ${ballot.topic}`}
          style={{
            fontSize: "var(--text-sm)",
            padding: "8px 12px",
            minWidth: "auto",
          }}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
