"use client";

import { useCallback, useEffect, useState } from "react";

const montserrat = "var(--font-montserrat), Montserrat, sans-serif";
const outfit = "var(--font-outfit), Outfit, sans-serif";

type LotteryPreviewParticipant = {
  id: string;
  name: string;
  email: string;
  school: string;
  github: string;
  isPlatformMember: boolean;
  onSiteBoostTapCount: number;
  onSiteInterested: boolean;
};

type LotteryPreview = {
  selected: LotteryPreviewParticipant[];
  remote: LotteryPreviewParticipant[];
  guaranteedMemberCount: number;
  lotteryWinnerCount: number;
  platformMemberInPool: number;
  platformMemberTotal: number;
  waitlistOnlyInPool: number;
  duplicateMembersExcluded: string[];
  shadowWaitlistDropped: Array<{ email: string; memberEmail: string }>;
};

type OnsiteAdminSnapshot = {
  announced: boolean;
  capacity: number;
  interestedCount: number;
  waitlistCount: number;
  lotteryRunAt: string | null;
  selectedAt: string | null;
  preview: LotteryPreview | null;
};

function sortSelectedForDisplay(selected: LotteryPreviewParticipant[]) {
  return [...selected].sort((a, b) => {
    if (a.isPlatformMember !== b.isPlatformMember) {
      return a.isPlatformMember ? -1 : 1;
    }

    return a.name.localeCompare(b.name, "es");
  });
}

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
      const response = await fetch("/api/admin/onsite");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to load on-site snapshot.");
      }

      setSnapshot((await response.json()) as OnsiteAdminSnapshot);
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
        "Run the on-site draw? Platform members are guaranteed; remaining spots go to waitlist-only signups. Results stay internal until you announce.",
      announce:
        "Publish the on-site list publicly? This writes selected/remote status to the waitlist.",
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
          `Internal preview ready: ${data.guaranteedMemberCount} members guaranteed + ${data.lotteryWinnerCount} waitlist lottery spot(s). Review the list below, then announce when ready.`,
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

  const preview = snapshot?.preview ?? null;
  const selectedCount = preview?.selected.length ?? 0;
  const waitlistSpots = preview
    ? snapshot!.capacity - preview.guaranteedMemberCount
    : 0;

  return (
    <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-black" style={{ fontFamily: montserrat }}>
            On-site selection
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-white/50" style={{ fontFamily: outfit }}>
            Plaza 11-11 fits 30 builders. All platform members get a guaranteed spot;
            remaining seats are filled by a weighted lottery among waitlist-only signups.
            Run the draw to preview results internally, then announce when ready.
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
            label="Selected (preview)"
            value={snapshot.lotteryRunAt ? String(selectedCount) : "—"}
          />
          <StatCard label="Public" value={snapshot.announced ? "Live" : "Hidden"} />
        </div>
      )}

      {preview && (
        <div className="mt-6 space-y-3 text-sm text-white/55" style={{ fontFamily: outfit }}>
          <p>
            Internal preview: {preview.guaranteedMemberCount} platform members guaranteed
            + {preview.lotteryWinnerCount}/{waitlistSpots || 0} waitlist lottery spot(s)
          </p>
          {preview.duplicateMembersExcluded.length > 0 && (
            <p>
              Duplicate member accounts excluded:{" "}
              {preview.duplicateMembersExcluded.join(", ")}
            </p>
          )}
          {preview.shadowWaitlistDropped.length > 0 && (
            <p>
              Duplicate waitlist entries dropped:{" "}
              {preview.shadowWaitlistDropped
                .map((entry) => `${entry.email} → ${entry.memberEmail}`)
                .join(", ")}
            </p>
          )}
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

      {preview && preview.selected.length > 0 && (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
          <div className="border-b border-white/10 px-4 py-3">
            <p className="text-sm font-black text-white" style={{ fontFamily: montserrat }}>
              Internal preview — selected ({preview.selected.length})
            </p>
            <p className="mt-1 text-xs text-white/45" style={{ fontFamily: outfit }}>
              Not public until you click Announce results.
            </p>
          </div>
          <table className="w-full min-w-[920px] text-left text-sm">
            <thead className="bg-white/[0.03] text-white/50">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Member</th>
                <th className="px-4 py-3 font-medium">Boosts</th>
                <th className="px-4 py-3 font-medium">Interested</th>
              </tr>
            </thead>
            <tbody>
              {sortSelectedForDisplay(preview.selected).map((participant, index) => (
                <tr
                  key={participant.id}
                  className="border-t border-white/8 text-white/85"
                >
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {index + 1}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {participant.name}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {participant.email}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {participant.isPlatformMember ? "yes" : "no"}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {participant.onSiteBoostTapCount}
                  </td>
                  <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                    {participant.onSiteInterested ? "yes" : "no"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
