"use client";

import { useCallback, useState } from "react";
import type { TeamInvite } from "@/lib/teams/types";

type InviteErrors = {
  generic: string;
  alreadyInTeam: string;
  teamFull: string;
  inviteExpired: string;
};

export function useTeamInvites(
  errors: InviteErrors,
  initialInvites?: TeamInvite[],
) {
  const [invites, setInvites] = useState<TeamInvite[]>(initialInvites ?? []);
  const [count, setCount] = useState(initialInvites?.length ?? 0);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [action, setAction] = useState<"accept" | "decline" | null>(null);
  const [banner, setBanner] = useState("");
  const [error, setError] = useState("");

  const refreshCount = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications/count");
      if (!res.ok) return;
      const data = (await res.json()) as { count?: number };
      setCount(data.count ?? 0);
    } catch {
      // ignore
    }
  }, []);

  const loadInvites = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      if (!res.ok) return;
      const data = (await res.json()) as { invites?: TeamInvite[] };
      const next = data.invites ?? [];
      setInvites(next);
      setCount(next.length);
    } catch {
      // ignore
    }
  }, []);

  async function respond(
    inviteId: string,
    type: "accept" | "decline",
    banners: { accepted: string; declined: string },
  ) {
    setBusyId(inviteId);
    setAction(type);
    setError("");
    setBanner("");

    try {
      const res = await fetch(`/api/notifications/${inviteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: type }),
      });

      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        const msg = data.error ?? errors.generic;
        if (msg.toLowerCase().includes("team")) {
          throw new Error(errors.alreadyInTeam);
        }
        if (msg.toLowerCase().includes("full")) {
          throw new Error(errors.teamFull);
        }
        if (
          msg.toLowerCase().includes("pending") ||
          msg.toLowerCase().includes("available")
        ) {
          throw new Error(errors.inviteExpired);
        }
        throw new Error(msg);
      }

      setInvites((current) => current.filter((invite) => invite.id !== inviteId));
      setCount((current) => Math.max(0, current - 1));
      setBanner(type === "accept" ? banners.accepted : banners.declined);
    } catch (err) {
      setError(err instanceof Error ? err.message : errors.generic);
    } finally {
      setBusyId(null);
      setAction(null);
    }
  }

  return {
    invites,
    count,
    busyId,
    action,
    banner,
    error,
    respond,
    refreshCount,
    loadInvites,
    setInvites,
    setCount,
  };
}
