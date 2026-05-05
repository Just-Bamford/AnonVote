import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { getBallots, getAudit } from "../api/client";

export type NotificationType =
  | "ballot_created"
  | "ballot_closed"
  | "results_published"
  | "vote_cast"
  | "warning";

export interface Notification {
  id: number;
  title: string;
  message: string;
  time: Date;
  read: boolean;
  type: NotificationType;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAllAsRead: () => void;
  addNotification: (
    notification: Omit<Notification, "id" | "time" | "read">,
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "anonvote-notifications-v2";

// Track vote counts per ballot so we can detect new votes
const VOTE_COUNTS_KEY = "anonvote-vote-counts";

function loadVoteCounts(): Record<string, number> {
  try {
    return JSON.parse(localStorage.getItem(VOTE_COUNTS_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveVoteCounts(counts: Record<string, number>) {
  localStorage.setItem(VOTE_COUNTS_KEY, JSON.stringify(counts));
}

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Restore Date objects
        return parsed.map((n: any) => ({ ...n, time: new Date(n.time) }));
      }
    } catch {}
    return [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const addNotification = useCallback(
    (notification: Omit<Notification, "id" | "time" | "read">) => {
      setNotifications((prev) => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now(),
          time: new Date(),
          read: false,
        };
        return [newNotification, ...prev].slice(0, 50); // keep last 50
      });
    },
    [],
  );

  // Poll for real events every 30 seconds
  useEffect(() => {
    let cancelled = false;

    async function poll() {
      if (cancelled) return;
      try {
        const res = await getBallots();
        const ballots = res.data.data;
        if (!ballots?.length) return;

        const voteCounts = loadVoteCounts();
        const updatedCounts: Record<string, number> = { ...voteCounts };

        for (const ballot of ballots) {
          if (ballot.status !== "OPEN") continue;
          try {
            const auditRes = await getAudit(ballot.id);
            const { votesCast } = auditRes.data.data;
            const prev = voteCounts[ballot.id] ?? votesCast; // initialise silently

            if (voteCounts[ballot.id] !== undefined && votesCast > prev) {
              const newVotes = votesCast - prev;
              addNotification({
                type: "vote_cast",
                title: "New vote cast",
                message: `${newVotes} new vote${newVotes > 1 ? "s" : ""} on "${ballot.topic}" — ${votesCast} total`,
              });
            }

            updatedCounts[ballot.id] = votesCast;
          } catch {}
        }

        saveVoteCounts(updatedCounts);
      } catch {}
    }

    poll();
    const interval = setInterval(poll, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [addNotification]);

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, markAllAsRead, addNotification }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider",
    );
  }
  return context;
}
