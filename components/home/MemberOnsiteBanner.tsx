"use client";

import { useEffect, useState } from "react";
import { OnsitePromoCard } from "@/components/onsite/OnsitePromoCard";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { GlassCard } from "@/components/platform";
import { onsiteSelectionPath } from "@/lib/i18n";
import {
  clampOnsiteBoostTapCount,
  getOnsiteLotteryWeight,
  type OnsiteParticipant,
} from "@/lib/onsite-selection";

type SelectionPreview = {
  announced: boolean;
  selectedCount: number;
  interestedCount: number;
  waitlistCount: number;
};

type UserOnsiteStatus = {
  onSiteInterested: boolean;
  onSiteBoostTapCount: number;
  onSiteStatus: "pending" | "selected" | "remote";
};

function getDrawWeight(taps: number, interested: boolean): number {
  const participant: OnsiteParticipant = {
    id: "",
    name: "",
    school: "",
    github: "",
    onSiteInterested: interested,
    onSiteBoostTapCount: clampOnsiteBoostTapCount(taps),
    onSiteStatus: "pending",
  };

  return getOnsiteLotteryWeight(participant);
}

export function MemberOnsiteBanner() {
  const { locale } = useLocale();
  const { members } = useDictionary();
  const copy = members.onsitePromo;

  const [selection, setSelection] = useState<SelectionPreview | null>(null);
  const [userStatus, setUserStatus] = useState<UserOnsiteStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [selectionRes, statusRes] = await Promise.all([
          fetch("/api/onsite/selection"),
          fetch("/api/onsite/status", { headers: { "x-locale": locale } }),
        ]);

        if (cancelled) return;

        if (selectionRes.ok) {
          const data = await selectionRes.json();
          setSelection({
            announced: data.announced === true,
            selectedCount:
              typeof data.selectedCount === "number"
                ? data.selectedCount
                : Array.isArray(data.selected)
                  ? data.selected.length
                  : 0,
            interestedCount:
              typeof data.interestedCount === "number"
                ? data.interestedCount
                : 0,
            waitlistCount:
              typeof data.waitlistCount === "number" ? data.waitlistCount : 0,
          });
        }

        if (statusRes.ok) {
          const data = await statusRes.json();
          setUserStatus({
            onSiteInterested: data.onSiteInterested === true,
            onSiteBoostTapCount:
              typeof data.onSiteBoostTapCount === "number"
                ? data.onSiteBoostTapCount
                : 0,
            onSiteStatus: data.onSiteStatus ?? "pending",
          });
        }
      } catch {
        if (!cancelled) {
          setSelection(null);
          setUserStatus(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (loading) {
    return (
      <GlassCard className="auth-item-in-2 mb-8 animate-pulse">
        <div className="h-28" aria-hidden />
      </GlassCard>
    );
  }

  if (!selection) {
    return null;
  }

  const href = onsiteSelectionPath(locale);
  const boosted = userStatus?.onSiteInterested === true;
  const taps = userStatus?.onSiteBoostTapCount ?? 0;
  const weight = getDrawWeight(taps, boosted);
  const announced = selection.announced;
  const selected = userStatus?.onSiteStatus === "selected";
  const remote = userStatus?.onSiteStatus === "remote";

  let title = copy.titlePending;
  let body = copy.bodyPending;
  let cta = copy.ctaPending;
  let stat = copy.statPending.replace(
    "{count}",
    String(selection.interestedCount),
  );
  let accent = true;

  if (announced) {
    title = selected
      ? copy.titleSelected
      : remote
        ? copy.titleRemote
        : copy.titleAnnounced;
    body = selected
      ? copy.bodySelected
      : remote
        ? copy.bodyRemote
        : copy.bodyAnnounced.replace(
            "{count}",
            String(selection.selectedCount),
          );
    cta = copy.ctaViewList;
    stat = copy.statAnnounced
      .replace("{count}", String(selection.selectedCount))
      .replace("{waitlist}", String(selection.waitlistCount));
    accent = selected || !remote;
  } else if (boosted) {
    title = copy.titleBoosted;
    body = copy.bodyBoosted
      .replace("{taps}", String(taps))
      .replace("{weight}", String(weight));
    cta = copy.ctaBoosted;
  }

  return (
    <OnsitePromoCard
      className="auth-item-in-2 mb-8"
      title={title}
      body={body}
      stat={stat}
      cta={cta}
      href={href}
      accent={accent}
    />
  );
}
