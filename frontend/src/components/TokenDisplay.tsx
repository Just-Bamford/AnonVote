import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  token: string;
  ballotId: string;
}

export default function TokenDisplay({ token, ballotId }: Props) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const copy = async () => {
    await navigator.clipboard.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const proceedToVote = async () => {
    // Copy token to clipboard then navigate with token pre-filled
    try {
      await navigator.clipboard.writeText(token);
    } catch {}
    navigate(`/vote/${ballotId}`, { state: { token } });
  };

  return (
    <div className="card border-primary/50 p-6 space-y-4">
      <div className="flex items-center gap-2 text-primary">
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
            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
          />
        </svg>
        <span className="font-semibold">Your Voting Token</span>
      </div>

      <div className="bg-gray-950 dark:bg-gray-900 border border-gray-700 dark:border-gray-600 rounded-lg p-4">
        <p className="font-mono text-sm text-green-400 dark:text-green-500 break-all select-all">
          {token}
        </p>
      </div>

      <button
        onClick={copy}
        className={`w-full py-2.5 rounded-lg font-semibold text-sm transition ${copied ? "bg-green-600 dark:bg-green-700 text-white" : "bg-primary hover:bg-primary-hover text-white"}`}
      >
        {copied ? "✓ Copied!" : "Copy Token"}
      </button>

      <div className="bg-yellow-100 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-lg px-4 py-3 text-yellow-800 dark:text-yellow-200 text-xs">
        <div className="flex items-center gap-2">
          <svg
            className="w-4 h-4"
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
          <span>
            Store this token securely. It cannot be recovered. You will need it
            to cast your vote.
          </span>
        </div>
      </div>

      <div style={{ display: "flex", gap: "var(--space-3)" }}>
        <button
          onClick={copy}
          className={`py-2.5 rounded-lg font-semibold text-sm transition ${copied ? "bg-green-600 dark:bg-green-700 text-white" : "btn-ghost"}`}
          style={{ flex: 1 }}
        >
          {copied ? "✓ Copied!" : "Copy Token"}
        </button>
        <button
          onClick={proceedToVote}
          className="btn-primary py-2.5 rounded-lg font-semibold text-sm"
          style={{ flex: 2 }}
        >
          Proceed to Vote →
        </button>
      </div>
    </div>
  );
}
