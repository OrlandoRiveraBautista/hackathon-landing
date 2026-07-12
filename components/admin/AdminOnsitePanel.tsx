"use client";

import { useCallback, useEffect, useState } from "react";

const montserrat = "var(--font-montserrat), Montserrat, sans-serif";
const outfit = "var(--font-outfit), Outfit, sans-serif";

type OnsiteAdminSnapshot = {
  announced: boolean;
  capacity: number;
  interestedCount: number;
  waitlistCount: number;
  lotteryRunAt: string | null;
  selectedAt: string | null;
  selectedCount: number;
};

export function AdminOnsitePanel() {
  const [snapshot, setSnapshot] = useState<OnsiteAdminSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadSnapshot = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/onsite/selection");
      if (!response.ok) {
        throw new Error("Failed to load on-site snapshot.");
      }

      const data = await response.json();
      setSnapshot({
        announced: data.announced,
        capacity: data.capacity,
        interestedCount: data.interestedCount,
        waitlistCount: data.waitlistCount,
        lotteryRunAt: data.lotteryRunAt,
        selectedAt: data.selectedAt,
        selectedCount:
          typeof data.selectedCount === "number"
            ? data.selectedCount
            : Array.isArray(data.selected)
              ? data.selected.length
              : 0,
      });
    } catch (err) {
      setSnapshot(null);
      setError(err instanceof Error ? err.message : "Failed to load on-site snapshot.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSnapshot();
  }, [loadSnapshot]);

  async function runAction(action: "lottery" | "announce" | "reset") {
    const confirmMessages = {
      lottery:
        "Run the weighted random draw for 30 on-site spots? This assigns selected/remote status to everyone on the waitlist.",
      announce:
        "Publish the on-site list publicly? Make sure you've reviewed the lottery results first.",
      reset:
        "Reset all on-site statuses and hide the public list? This cannot be undone lightly.",
    };

    if (!window.confirm(confirmMessages[action])) {
      return;
    }

    setActing(action);
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/admin/onsite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error ?? "Action failed.");
      }

      if (action === "lottery") {
        setMessage(
          `Lottery complete: ${data.selectedCount} selected, ${data.remoteCount} remote (${data.interestedSelected} boosted builders selected).`,
        );
      } else if (action === "announce") {
        setMessage("On-site list is now public.");
      } else {
        setMessage("On-site selection reset.");
      }

      await loadSnapshot();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action failed.");
    } finally {
      setActing(null);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black" style={{ fontFamily: montserrat }}>
            On-site selection
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/50" style={{ fontFamily: outfit }}>
            Plaza 11-11 fits 30 builders. Run a weighted lottery (3× weight for boosted
            participants), review results, then announce the public table.
          </p>
        </div>
        <button
          type="button"
          onClick={loadSnapshot}
          disabled={loading}
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-opacity hover:opacity-80 disabled:opacity-40"
          style={{ fontFamily: outfit }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {snapshot && (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Waitlist" value={String(snapshot.waitlistCount)} />
          <StatCard label="Boosted" value={String(snapshot.interestedCount)} />
          <StatCard
            label="Selected"
            value={snapshot.lotteryRunAt ? String(snapshot.selectedCount) : "—"}
          />
          <StatCard label="Public" value={snapshot.announced ? "Live" : "Hidden"} />
        </div>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => runAction("lottery")}
          disabled={acting !== null}
          className="rounded-xl bg-[#aaff00] px-4 py-2.5 text-sm font-black text-black transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: montserrat }}
        >
          {acting === "lottery" ? "Running lottery..." : "Run lottery"}
        </button>
        <button
          type="button"
          onClick={() => runAction("announce")}
          disabled={acting !== null || !snapshot?.lotteryRunAt || snapshot.announced}
          className="rounded-xl border border-[#aaff00]/40 px-4 py-2.5 text-sm font-black text-[#aaff00] transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: montserrat }}
        >
          {acting === "announce" ? "Publishing..." : "Announce results"}
        </button>
        <button
          type="button"
          onClick={() => runAction("reset")}
          disabled={acting !== null}
          className="rounded-xl border border-red-400/30 px-4 py-2.5 text-sm text-red-300 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
          style={{ fontFamily: outfit }}
        >
          {acting === "reset" ? "Resetting..." : "Reset selection"}
        </button>
      </div>

      {message && (
        <p className="mt-4 text-sm text-[#aaff00]" style={{ fontFamily: outfit }}>
          {message}
        </p>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400" style={{ fontFamily: outfit }}>
          {error}
        </p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 px-4 py-4">
      <p className="text-xs text-white/45" style={{ fontFamily: outfit }}>
        {label}
      </p>
      <p className="mt-1 text-2xl font-black text-white" style={{ fontFamily: montserrat }}>
        {value}
      </p>
    </div>
  );
}
