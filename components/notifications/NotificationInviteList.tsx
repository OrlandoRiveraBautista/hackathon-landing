"use client";

import {
  FeedbackBanner,
  MemberAvatar,
  PlatformButton,
} from "@/components/platform";
import type { TeamInvite } from "@/lib/teams/types";
import { montserrat, outfit } from "@/lib/theme";

type NotificationInviteListProps = {
  invites: TeamInvite[];
  locale: string;
  compact?: boolean;
  busyId: string | null;
  action: "accept" | "decline" | null;
  banner: string;
  error: string;
  labels: {
    inviteMessage: string;
    accept: string;
    decline: string;
    accepting: string;
    declining: string;
    emptyTitle: string;
    emptySubtitle: string;
  };
  onRespond: (inviteId: string, type: "accept" | "decline") => void;
};

export function NotificationInviteList({
  invites,
  locale,
  compact = false,
  busyId,
  action,
  banner,
  error,
  labels,
  onRespond,
}: NotificationInviteListProps) {
  if (invites.length === 0) {
    return (
      <div className={`text-center ${compact ? "px-4 py-8" : "py-14"}`}>
        <p
          className={`font-black text-white/75 ${compact ? "text-sm" : "text-lg"}`}
          style={{ fontFamily: montserrat }}
        >
          {labels.emptyTitle}
        </p>
        <p
          className={`mx-auto mt-1.5 text-white/35 ${compact ? "max-w-[220px] text-xs" : "max-w-sm text-sm"}`}
          style={{ fontFamily: outfit }}
        >
          {labels.emptySubtitle}
        </p>
      </div>
    );
  }

  return (
    <div className={compact ? "divide-y divide-white/[0.06]" : "space-y-4"}>
      {banner && (
        <div className={compact ? "border-b border-white/[0.06] p-3" : "mb-4"}>
          <FeedbackBanner variant="success" message={banner} />
        </div>
      )}
      {error && (
        <div className={compact ? "border-b border-white/[0.06] p-3" : "mb-4"}>
          <FeedbackBanner variant="error" message={error} />
        </div>
      )}

      {invites.map((invite) => (
        <div
          key={invite.id}
          className={
            compact
              ? "flex flex-col gap-3 p-4"
              : "rounded-2xl border border-white/[0.07] bg-white/[0.018] p-6"
          }
        >
          <div className="flex items-start gap-3">
            <MemberAvatar
              name={invite.fromUserName}
              imageUrl={invite.fromUserImageUrl}
              size={compact ? "sm" : "md"}
            />
            <div className="min-w-0 flex-1">
              <p
                className={`leading-snug text-white/70 ${compact ? "text-xs" : "text-sm"}`}
                style={{ fontFamily: outfit }}
              >
                {labels.inviteMessage
                  .replace("{captain}", invite.fromUserName)
                  .replace("{team}", invite.teamName)}
              </p>
              {!compact && (
                <p
                  className="mt-1 text-[11px] text-white/25"
                  style={{ fontFamily: outfit }}
                >
                  {new Intl.DateTimeFormat(locale, {
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  }).format(new Date(invite.createdAt))}
                </p>
              )}
            </div>
          </div>

          <div className={`flex items-center gap-2 ${compact ? "" : "sm:justify-end"}`}>
            <PlatformButton
              onClick={() => onRespond(invite.id, "accept")}
              disabled={busyId === invite.id}
              variant="primary"
            >
              {busyId === invite.id && action === "accept"
                ? labels.accepting
                : labels.accept}
            </PlatformButton>
            <PlatformButton
              onClick={() => onRespond(invite.id, "decline")}
              disabled={busyId === invite.id}
              variant="ghost"
            >
              {busyId === invite.id && action === "decline"
                ? labels.declining
                : labels.decline}
            </PlatformButton>
          </div>
        </div>
      ))}
    </div>
  );
}
