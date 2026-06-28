"use client";

import { useCallback, useEffect, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { getSponsorSignups, type SponsorSignup } from "@/lib/sponsors-admin";
import { getWaitlistSignups, type WaitlistSignup } from "@/lib/waitlist-admin";

const montserrat = "var(--font-montserrat), Montserrat, sans-serif";
const outfit = "var(--font-outfit), Outfit, sans-serif";

type AdminTab = "participants" | "sponsors";

function formatDate(date: Date | null) {
  if (!date) return "—";
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function firestoreErrorMessage(err: unknown) {
  const code =
    err && typeof err === "object" && "code" in err ? String(err.code) : "";

  if (code === "permission-denied") {
    return "Firestore blocked reads. Publish the updated rules in Firebase Console → Firestore → Rules.";
  }

  return err instanceof Error ? err.message : "Failed to load signups.";
}

export default function AdminPage() {
  const { data: session } = authClient.useSession();
  const [tab, setTab] = useState<AdminTab>("participants");
  const [participants, setParticipants] = useState<WaitlistSignup[]>([]);
  const [sponsors, setSponsors] = useState<SponsorSignup[]>([]);
  const [loading, setLoading] = useState(true);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [participantRows, sponsorRows] = await Promise.all([
        getWaitlistSignups(),
        getSponsorSignups(),
      ]);
      setParticipants(participantRows);
      setSponsors(sponsorRows);
    } catch (err) {
      setParticipants([]);
      setSponsors([]);
      setError(firestoreErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function signOut() {
    setSigningOut(true);

    try {
      await authClient.signOut();
      window.location.href = "/admin/login";
    } catch {
      setError("Sign out failed. Try again.");
      setSigningOut(false);
    }
  }

  const activeRows = tab === "participants" ? participants : sponsors;
  const activeCount = activeRows.length;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p
              className="text-xs tracking-[0.35em] text-[#aaff00]/80"
              style={{ fontFamily: outfit }}
            >
              BUILD PA&apos;L NORTE
            </p>
            <h1
              className="mt-2 text-3xl font-black"
              style={{ fontFamily: montserrat }}
            >
              Registration Admin
            </h1>
          </div>

          {session?.user && (
            <div className="text-right">
              <p className="text-sm text-white/50" style={{ fontFamily: outfit }}>
                {session.user.email}
              </p>
              <button
                type="button"
                onClick={signOut}
                disabled={signingOut}
                className="mt-2 cursor-pointer rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-opacity hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-40"
                style={{ fontFamily: outfit }}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setTab("participants")}
            className={`rounded-xl border px-4 py-2 text-sm transition-opacity hover:opacity-80 ${
              tab === "participants"
                ? "border-[#aaff00]/50 bg-[#aaff00]/10 text-[#aaff00]"
                : "border-white/15 text-white/60"
            }`}
            style={{ fontFamily: outfit }}
          >
            Participants ({loading ? "…" : participants.length})
          </button>
          <button
            type="button"
            onClick={() => setTab("sponsors")}
            className={`rounded-xl border px-4 py-2 text-sm transition-opacity hover:opacity-80 ${
              tab === "sponsors"
                ? "border-[#aaff00]/50 bg-[#aaff00]/10 text-[#aaff00]"
                : "border-white/15 text-white/60"
            }`}
            style={{ fontFamily: outfit }}
          >
            Sponsors ({loading ? "…" : sponsors.length})
          </button>
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-4">
          <div className="rounded-2xl border border-[#aaff00]/25 bg-[#aaff00]/5 px-6 py-4">
            <p className="text-sm text-white/50" style={{ fontFamily: outfit }}>
              Total {tab}
            </p>
            <p
              className="mt-1 text-4xl font-black text-[#aaff00]"
              style={{ fontFamily: montserrat }}
            >
              {loading ? "…" : activeCount}
            </p>
          </div>
          <button
            type="button"
            onClick={loadData}
            disabled={loading}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/70 transition-opacity hover:opacity-80 disabled:opacity-40"
            style={{ fontFamily: outfit }}
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>

        {error && (
          <p className="mt-6 text-sm text-red-400" style={{ fontFamily: outfit }}>
            {error}
          </p>
        )}

        {!loading && !error && tab === "participants" && participants.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Age</th>
                  <th className="px-4 py-3 font-medium">Sex</th>
                  <th className="px-4 py-3 font-medium">School</th>
                  <th className="px-4 py-3 font-medium">GitHub</th>
                  <th className="px-4 py-3 font-medium">Interests</th>
                  <th className="px-4 py-3 font-medium">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((signup) => (
                  <tr
                    key={signup.id}
                    className="border-t border-white/8 text-white/85"
                  >
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.name}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.email}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.phone}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.age ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.sex ?? "—"}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.school}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.github}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.interests}
                    </td>
                    <td
                      className="px-4 py-3 text-white/50"
                      style={{ fontFamily: outfit }}
                    >
                      {formatDate(signup.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && tab === "sponsors" && sponsors.length > 0 && (
          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-white/[0.03] text-white/50">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Phone</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Sponsorship</th>
                  <th className="px-4 py-3 font-medium">Problem</th>
                  <th className="px-4 py-3 font-medium">Workshop</th>
                  <th className="px-4 py-3 font-medium">Signed up</th>
                </tr>
              </thead>
              <tbody>
                {sponsors.map((signup) => (
                  <tr
                    key={signup.id}
                    className="border-t border-white/8 text-white/85"
                  >
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.name}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.email}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.phone}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.company}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.sponsorship}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.problem}
                    </td>
                    <td className="px-4 py-3" style={{ fontFamily: outfit }}>
                      {signup.wantsWorkshop ? "Yes" : "No"}
                    </td>
                    <td
                      className="px-4 py-3 text-white/50"
                      style={{ fontFamily: outfit }}
                    >
                      {formatDate(signup.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && activeRows.length === 0 && (
          <p className="mt-8 text-white/50" style={{ fontFamily: outfit }}>
            No {tab} yet.
          </p>
        )}
      </div>
    </main>
  );
}
