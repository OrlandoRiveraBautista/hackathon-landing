"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import {
  OnsiteAnnouncedList,
  OnsiteComingSoonList,
} from "@/components/onsite/OnsiteList";
import { OnsiteBoostPanel } from "@/components/onsite/OnsiteBoostPanel";
import { HackathonShirtCard } from "@/components/shirt/HackathonShirtCard";
import type { ShirtSize } from "@/lib/shirt-size";
import { getDiscordUrl, getWhatsAppUrl } from "@/lib/community";
import {
  localizedPath,
  memberLoginPath,
  onsiteSelectionPath,
} from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type SelectionResponse = {
  announced: boolean;
  capacity: number;
  interestedCount: number;
  waitlistCount: number;
  selected: Array<{
    name: string;
    school: string | null;
    github: string | null;
  }>;
};

type UserStatusResponse = {
  announced: boolean;
  onSiteInterested: boolean;
  onSiteBoostTapCount: number;
  onSiteStatus: "pending" | "selected" | "remote";
  name: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.08, ease: "easeOut" as const },
  }),
};

export function OnsiteSelectionPageClient() {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const copy = dictionary.onsiteSelection;
  const shirtCopy = dictionary.shirt;
  const [selection, setSelection] = useState<SelectionResponse | null>(null);
  const [userStatus, setUserStatus] = useState<UserStatusResponse | null>(null);
  const [statusChecked, setStatusChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [boostTapCount, setBoostTapCount] = useState(0);
  const [boostDone, setBoostDone] = useState(false);
  const [shirtSize, setShirtSize] = useState<ShirtSize | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [shirtSaving, setShirtSaving] = useState(false);
  const [shirtSaved, setShirtSaved] = useState(false);
  const [error, setError] = useState("");

  const discordUrl = getDiscordUrl();
  const whatsappUrl = getWhatsAppUrl();

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setError("");

      try {
        const selectionRes = await fetch("/api/onsite/selection");
        if (!selectionRes.ok) {
          throw new Error("selection");
        }

        const selectionData = (await selectionRes.json()) as SelectionResponse;
        if (cancelled) return;

        setSelection(selectionData);

        const statusRes = await fetch("/api/onsite/status", {
          headers: { "x-locale": locale },
        });

        if (cancelled) return;

        if (statusRes.ok) {
          const statusData = (await statusRes.json()) as UserStatusResponse;
          setUserStatus(statusData);
          setBoostTapCount(statusData.onSiteBoostTapCount ?? 0);
          if (statusData.onSiteInterested) {
            setBoostDone(true);
          }
        } else {
          setUserStatus(null);
        }

        const shirtRes = await fetch("/api/profile/shirt-size", {
          headers: { "x-locale": locale },
        });

        if (!cancelled && shirtRes.ok) {
          const shirtData = (await shirtRes.json()) as {
            shirtSize: ShirtSize | null;
          };
          setShirtSize(shirtData.shirtSize ?? null);
          setSelectedSize(shirtData.shirtSize ?? "");
        }
      } catch {
        if (!cancelled) {
          setError(copy.loadFailed);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setStatusChecked(true);
        }
      }
    }

    setLoading(true);
    void load();

    return () => {
      cancelled = true;
    };
  }, [copy.loadFailed, locale]);

  function recordBoostTap() {
    setBoostTapCount((count) => count + 1);
    setError("");

    void fetch("/api/onsite/status", {
      method: "POST",
      headers: { "x-locale": locale },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? copy.errors.generic);
        }

        if (typeof data.tapCount === "number") {
          setBoostTapCount(data.tapCount);
        }
        if (data.onSiteInterested) {
          setBoostDone(true);
          setUserStatus((current) =>
            current
              ? {
                  ...current,
                  onSiteInterested: true,
                  onSiteBoostTapCount:
                    typeof data.tapCount === "number"
                      ? data.tapCount
                      : current.onSiteBoostTapCount,
                }
              : current,
          );
        }
      })
      .catch((err) => {
        setBoostTapCount((count) => Math.max(0, count - 1));
        setError(err instanceof Error ? err.message : copy.errors.generic);
      });
  }

  function saveShirtSize() {
    if (!selectedSize) return;

    setShirtSaving(true);
    setShirtSaved(false);
    setError("");

    void fetch("/api/profile/shirt-size", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "x-locale": locale,
      },
      body: JSON.stringify({ shirtSize: selectedSize }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error ?? copy.errors.generic);
        }

        const saved = selectedSize as ShirtSize;
        setShirtSize(saved);
        setShirtSaved(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : copy.errors.generic);
      })
      .finally(() => {
        setShirtSaving(false);
      });
  }

  const announced = selection?.announced ?? false;
  const interested = userStatus?.onSiteInterested || boostDone;

  const listLabels = {
    tableRank: copy.tableRank,
    tableName: copy.tableName,
    tableSchool: copy.tableSchool,
    tableGithub: copy.tableGithub,
    listComingSoonBadge: copy.listComingSoonBadge,
    pendingTitle: copy.pendingTitle,
    listLoadingHint: copy.listLoadingHint,
    capacityBadge: copy.capacityBadge,
  };

  const onsitePath = onsiteSelectionPath(locale);
  const onsiteLoginPath = memberLoginPath(locale, onsitePath);

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#aaff00]/15 px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 sm:gap-4">
          <Link
            href={localizedPath(locale)}
            className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
            style={{ fontFamily: montserrat }}
          >
            <svg
              width="26"
              height="26"
              viewBox="0 0 32 32"
              aria-hidden="true"
              className="shrink-0 drop-shadow-[0_0_7px_rgba(170,255,0,0.55)]"
            >
              <rect width="32" height="32" rx="7" fill="#000" />
              <polygon points="16,4 28,10.5 16,17 4,10.5" fill="#aaff00" />
              <polygon points="4,10.5 16,17 16,28 4,21.5" fill="#55aa00" />
              <polygon points="28,10.5 16,17 16,28 28,21.5" fill="#77cc00" />
            </svg>
            <span className="text-sm font-black tracking-tight text-white">
              Build Pa&apos;l Norte
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <LanguageSwitcher />
            <Link
              href={localizedPath(locale)}
              className="text-[10px] tracking-[0.2em] text-white/45 transition-colors hover:text-[#aaff00] sm:text-xs sm:tracking-[0.25em]"
              style={{ fontFamily: outfit }}
            >
              {copy.back}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16">
        <motion.div initial="hidden" animate="visible" variants={fadeUp}>
          <h1
            className="mt-6 text-4xl font-black tracking-tight sm:text-5xl"
            style={{ fontFamily: montserrat }}
          >
            {copy.title}{" "}
            <span className="text-[#aaff00]">{copy.accentWord}</span>
          </h1>

          <p
            className="mt-4 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg"
            style={{ fontFamily: outfit }}
          >
            {copy.subtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-xs font-black tracking-[0.2em] text-white/70">
            <Users size={14} className="text-[#aaff00]" />
            {copy.capacityBadge}
          </div>
        </motion.div>

        {error && (
          <p
            className="mt-8 text-sm text-red-400"
            style={{ fontFamily: outfit }}
          >
            {error}
          </p>
        )}

        {!announced && (
          <section className="mt-10 space-y-6 sm:mt-12">
            <OnsiteBoostPanel
              eyebrow={copy.boostEyebrow}
              title={copy.boostTitle}
              multiplier={copy.boostMultiplier}
              multiplierLabel={copy.boostMultiplierLabel}
              actionLine={copy.boostActionLine}
              body={copy.boostBody}
              steps={copy.boostSteps}
              boostButton={copy.boostButton}
              boostButtonBoosted={copy.boostButtonBoosted}
              boostTapHint={copy.boostTapHint}
              boosting={copy.boosting}
              boostSignInPrompt={copy.boostSignInPrompt}
              boostSignIn={copy.boostSignIn}
              boostSignInReturn={copy.boostSignInReturn}
              loginHref={onsiteLoginPath}
              loading={loading && !statusChecked}
              interested={interested}
              signedIn={statusChecked ? userStatus !== null : null}
              tapCount={boostTapCount}
              onBoost={recordBoostTap}
            />

            <HackathonShirtCard
              copy={shirtCopy}
              variant="boost"
              shirtSize={shirtSize}
              selectedSize={selectedSize}
              onSelectSize={(size) => {
                setSelectedSize(size);
                setShirtSaved(false);
              }}
              onSave={saveShirtSize}
              saving={shirtSaving}
              saved={shirtSaved}
              signedIn={statusChecked ? userStatus !== null : null}
              loginHref={onsiteLoginPath}
            />

            {!loading && selection && (
              <motion.div
                className="grid gap-4 sm:grid-cols-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.1 }}
              >
                <div className="rounded-2xl border border-[#aaff00]/20 bg-[#aaff00]/5 px-5 py-4">
                  <p
                    className="text-2xl font-black text-[#aaff00]"
                    style={{ fontFamily: montserrat }}
                  >
                    {selection.interestedCount}
                  </p>
                  <p
                    className="mt-1 text-xs text-white/50"
                    style={{ fontFamily: outfit }}
                  >
                    {copy.pendingStatsInterested}
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4">
                  <p
                    className="text-2xl font-black text-white"
                    style={{ fontFamily: montserrat }}
                  >
                    {selection.waitlistCount}
                  </p>
                  <p
                    className="mt-1 text-xs text-white/50"
                    style={{ fontFamily: outfit }}
                  >
                    {copy.pendingStatsWaitlist}
                  </p>
                </div>
              </motion.div>
            )}

            <OnsiteComingSoonList labels={listLabels} />

            <motion.p
              className="max-w-2xl text-sm leading-relaxed text-white/45"
              style={{ fontFamily: outfit }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.25 }}
            >
              {copy.pendingBody}
            </motion.p>
          </section>
        )}

        {!loading && selection && announced && (
          <motion.section
            className="mt-12"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
          >
            <div className="mb-6">
              <h2
                className="text-2xl font-black"
                style={{ fontFamily: montserrat }}
              >
                {copy.announcedTitle}
              </h2>
            </div>

            {userStatus && (
              <div
                className={`mb-6 rounded-2xl border px-5 py-4 ${
                  userStatus.onSiteStatus === "selected"
                    ? "border-[#aaff00]/30 bg-[#aaff00]/10 text-[#d8ff80]"
                    : userStatus.onSiteStatus === "remote"
                      ? "border-white/10 bg-white/[0.03] text-white/70"
                      : "border-white/10 bg-white/[0.03] text-white/60"
                }`}
              >
                <p className="text-sm" style={{ fontFamily: outfit }}>
                  {userStatus.onSiteStatus === "selected"
                    ? copy.yourStatusSelected
                    : userStatus.onSiteStatus === "remote"
                      ? copy.yourStatusRemote
                      : copy.yourStatusPending}
                </p>
              </div>
            )}

            {selection.selected.length > 0 ? (
              <OnsiteAnnouncedList
                labels={listLabels}
                participants={selection.selected}
                subtitle={copy.announcedSubtitle.replace(
                  "{count}",
                  String(selection.selected.length),
                )}
              />
            ) : (
              <p
                className="text-sm text-white/45"
                style={{ fontFamily: outfit }}
              >
                {copy.emptySelected}
              </p>
            )}
          </motion.section>
        )}

        {announced && (
          <motion.section
            className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-6 sm:p-8"
            initial="hidden"
            animate="visible"
            custom={2}
            variants={fadeUp}
          >
            <h2
              className="text-2xl font-black"
              style={{ fontFamily: montserrat }}
            >
              {copy.remoteTitle}
            </h2>
            <p
              className="mt-3 max-w-2xl text-sm leading-relaxed text-white/55 sm:text-base"
              style={{ fontFamily: outfit }}
            >
              {copy.remoteBody}
            </p>

            <div className="mt-8 rounded-2xl border border-[#aaff00]/15 bg-[#aaff00]/[0.04] p-5 sm:p-6">
              <h3
                className="text-lg font-black text-[#aaff00]"
                style={{ fontFamily: montserrat }}
              >
                {copy.remoteClubTitle}
              </h3>
              <p
                className="mt-2 text-sm text-white/55"
                style={{ fontFamily: outfit }}
              >
                {copy.remoteClubBody}
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  href={onsiteLoginPath}
                  className="inline-flex items-center gap-2 rounded-full border border-[#aaff00]/35 bg-[#aaff00]/10 px-4 py-2.5 text-xs font-black tracking-[0.14em] text-[#aaff00] transition-all hover:bg-[#aaff00]/15"
                  style={{ fontFamily: montserrat }}
                >
                  {copy.remoteClubCta}
                  <ArrowUpRight size={14} />
                </Link>
                {discordUrl && (
                  <a
                    href={discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-black tracking-[0.14em] text-white/75 transition-all hover:border-white/30 hover:text-white"
                    style={{ fontFamily: montserrat }}
                  >
                    {copy.remoteDiscordCta}
                    <ArrowUpRight size={14} />
                  </a>
                )}
                {whatsappUrl && (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-xs font-black tracking-[0.14em] text-white/75 transition-all hover:border-white/30 hover:text-white"
                    style={{ fontFamily: montserrat }}
                  >
                    {copy.remoteWhatsappCta}
                    <ArrowUpRight size={14} />
                  </a>
                )}
              </div>
            </div>
          </motion.section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
