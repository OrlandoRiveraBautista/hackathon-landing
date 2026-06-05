"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getWaitlistCount } from "@/lib/waitlist";

type WaitlistCountContextValue = {
  count: number | null;
  refresh: () => Promise<void>;
};

const WaitlistCountContext = createContext<WaitlistCountContextValue | null>(
  null,
);

const POLL_MS = 30_000;

export function WaitlistCountProvider({ children }: { children: ReactNode }) {
  const [count, setCount] = useState<number | null>(null);

  const refresh = useCallback(async () => {
    try {
      const next = await getWaitlistCount();
      setCount(next);
    } catch (error) {
      console.error("Failed to fetch waitlist count:", error);
    }
  }, []);

  useEffect(() => {
    refresh();
    const interval = window.setInterval(refresh, POLL_MS);
    return () => window.clearInterval(interval);
  }, [refresh]);

  return (
    <WaitlistCountContext.Provider value={{ count, refresh }}>
      {children}
    </WaitlistCountContext.Provider>
  );
}

export function useWaitlistCount() {
  const context = useContext(WaitlistCountContext);
  if (!context) {
    throw new Error("useWaitlistCount must be used within WaitlistCountProvider");
  }
  return context;
}
