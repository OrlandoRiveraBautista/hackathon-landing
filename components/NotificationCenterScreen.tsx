"use client";

import { useEffect } from "react";
import { NotificationInviteList } from "@/components/notifications/NotificationInviteList";
import { useTeamInvites } from "@/components/notifications/useTeamInvites";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import {
  MemberAppShell,
  PlatformPageFooter,
} from "@/components/platform";
import { memberHomePath } from "@/lib/i18n";
import type { TeamInvite } from "@/lib/teams/types";
import { montserrat, outfit } from "@/lib/theme";

type NotificationCenterScreenProps = {
  initialInvites: TeamInvite[];
};

export function NotificationCenterScreen({
  initialInvites,
}: NotificationCenterScreenProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { notifications: n } = dictionary;

  const {
    invites,
    busyId,
    action,
    banner,
    error,
    respond,
    setInvites,
    setCount,
  } = useTeamInvites(n.errors, initialInvites);

  useEffect(() => {
    setInvites(initialInvites);
    setCount(initialInvites.length);
  }, [initialInvites, setInvites, setCount]);

  async function handleRespond(inviteId: string, type: "accept" | "decline") {
    await respond(inviteId, type, {
      accepted: n.acceptedBanner,
      declined: n.declinedBanner,
    });
  }

  return (
    <MemberAppShell locale={locale} eyebrow={n.eyebrow} maxWidth="4xl">
      <div className="auth-item-in-1 mb-8">
        <h1
          className="text-2xl font-black tracking-tight text-white"
          style={{ fontFamily: montserrat }}
        >
          {n.title}
        </h1>
        <p className="mt-1 text-sm text-white/45" style={{ fontFamily: outfit }}>
          {n.subtitle}
        </p>
      </div>

      <NotificationInviteList
        invites={invites}
        locale={locale}
        busyId={busyId}
        action={action}
        banner={banner}
        error={error}
        labels={{
          inviteMessage: n.inviteMessage,
          accept: n.accept,
          decline: n.decline,
          accepting: n.accepting,
          declining: n.declining,
          emptyTitle: n.emptyTitle,
          emptySubtitle: n.emptySubtitle,
        }}
        onRespond={handleRespond}
      />

      <PlatformPageFooter
        locale={locale}
        backLabel={n.backToHome}
        backHref={memberHomePath(locale)}
      />
    </MemberAppShell>
  );
}
