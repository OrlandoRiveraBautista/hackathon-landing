"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import { ArrowUpRight, MapPin, Users } from "lucide-react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import {
  OnsiteAnnouncedList,
  OnsiteComingSoonList,
} from "@/components/onsite/OnsiteList";
import { OnsiteCollapsibleSection } from "@/components/onsite/OnsiteCollapsibleSection";
import { OnsiteSchedule } from "@/components/onsite/OnsiteSchedule";
import { OnsiteBoostPanel } from "@/components/onsite/OnsiteBoostPanel";
import { HackathonShirtCard } from "@/components/shirt/HackathonShirtCard";
import type { ShirtSize } from "@/lib/shirt-size";
import { getDiscordUrl, getWhatsAppUrl } from "@/lib/community";
import {
  localizedPath,
  memberLoginPath,
  onsiteSelectionPath,
} from "@/lib/i18n";
import { ONSITE_BOOST_DAILY_TAP_LIMIT } from "@/lib/onsite/shared";
import { montserrat, outfit } from "@/lib/theme";

type SelectionResponse = {
  announced: boolean;
  boostOpen: boolean;
  capacity: number;
  interestedCount: number;
  waitlistCount: number;
  selected: Array<{
    name: string;
  }>;
};

type UserStatusResponse = {
  announced: boolean;
  onSiteInterested: boolean;
  onSiteBoostTapCount: number;
  dailyTapCount: number;
  dailyTapLimit: number;
  dailyLimitReached: boolean;
  cooldownUntil: string | null;
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
  const [dailyTapCount, setDailyTapCount] = useState(0);
  const [dailyTapLimit, setDailyTapLimit] = useState(ONSITE_BOOST_DAILY_TAP_LIMIT);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
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
          setDailyTapCount(statusData.dailyTapCount ?? 0);
          setDailyTapLimit(statusData.dailyTapLimit ?? ONSITE_BOOST_DAILY_TAP_LIMIT);
          setDailyLimitReached(statusData.dailyLimitReached === true);
          setCooldownUntil(statusData.cooldownUntil ?? null);
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
    if (!selection?.boostOpen || dailyLimitReached) return;

    setBoostTapCount((count) => count + 1);
    setDailyTapCount((count) => count + 1);
    setError("");

    void fetch("/api/onsite/status", {
      method: "POST",
      headers: { "x-locale": locale },
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          if (response.status === 429) {
            setDailyLimitReached(true);
            setBoostTapCount((count) => Math.max(0, count - 1));
            setDailyTapCount(dailyTapLimit);
            if (typeof data.cooldownUntil === "string") {
              setCooldownUntil(data.cooldownUntil);
            }
            return;
          }
          if (response.status === 409) {
            setBoostTapCount((count) => Math.max(0, count - 1));
            setDailyTapCount((count) => Math.max(0, count - 1));
            setError(data.error ?? copy.errors.selectionClosed);
            return;
          }
          throw new Error(data.error ?? copy.errors.generic);
        }

        if (typeof data.tapCount === "number") {
          setBoostTapCount(data.tapCount);
        }
        if (typeof data.dailyTapCount === "number") {
          setDailyTapCount(data.dailyTapCount);
        }
        if (typeof data.dailyTapLimit === "number") {
          setDailyTapLimit(data.dailyTapLimit);
        }
        if (typeof data.dailyLimitReached === "boolean") {
          setDailyLimitReached(data.dailyLimitReached);
        }
        if (typeof data.cooldownUntil === "string" || data.cooldownUntil === null) {
          setCooldownUntil(data.cooldownUntil ?? null);
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
                  dailyTapCount:
                    typeof data.dailyTapCount === "number"
                      ? data.dailyTapCount
                      : current.dailyTapCount,
                  dailyTapLimit:
                    typeof data.dailyTapLimit === "number"
                      ? data.dailyTapLimit
                      : current.dailyTapLimit,
                  dailyLimitReached:
                    typeof data.dailyLimitReached === "boolean"
                      ? data.dailyLimitReached
                      : current.dailyLimitReached,
                  cooldownUntil:
                    typeof data.cooldownUntil === "string" || data.cooldownUntil === null
                      ? (data.cooldownUntil ?? null)
                      : current.cooldownUntil,
                }
              : current,
          );
        }
      })
      .catch((err) => {
        setBoostTapCount((count) => Math.max(0, count - 1));
        setDailyTapCount((count) => Math.max(0, count - 1));
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
  const boostOpen = selection?.boostOpen ?? false;
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
            className="group flex items-center gap-2.5 transition-opacity hover:opacity-80"
            style={{ fontFamily: montserrat }}
          >
            <BrandLogo size={26} />
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
            {boostOpen && (
              <>
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
              boostButtonMaxed={copy.boostButtonMaxed}
              boostTapHint={copy.boostTapHint}
              boostDailyProgress={copy.boostDailyProgress}
              boostCooldownHint={copy.boostCooldownHint}
              boostLimitReached={copy.errors.boostLimitReached}
              boosting={copy.boosting}
              boostSignInPrompt={copy.boostSignInPrompt}
              boostSignIn={copy.boostSignIn}
              boostSignInReturn={copy.boostSignInReturn}
              loginHref={onsiteLoginPath}
              loading={loading && !statusChecked}
              interested={interested}
              signedIn={statusChecked ? userStatus !== null : null}
              tapCount={boostTapCount}
              dailyTapCount={dailyTapCount}
              dailyTapLimit={dailyTapLimit}
              dailyLimitReached={dailyLimitReached}
              cooldownUntil={cooldownUntil}
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
              </>
            )}

            {!loading && selection && boostOpen && (
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

            <OnsiteCollapsibleSection
              title={copy.waitlistSectionTitle}
              defaultOpen={false}
              className="mt-6"
            >
              <OnsiteComingSoonList labels={listLabels} embedded />
            </OnsiteCollapsibleSection>

            <OnsiteCollapsibleSection
              title={copy.schedule.title}
              defaultOpen={false}
              className="mt-6"
            >
              <OnsiteSchedule />
            </OnsiteCollapsibleSection>

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
          <motion.div
            className="mt-12"
            initial="hidden"
            animate="visible"
            custom={1}
            variants={fadeUp}
          >
            <OnsiteCollapsibleSection title={copy.announcedTitle} defaultOpen={false}>
              <div className="px-5 py-5 sm:px-6 sm:py-6">
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
                    embedded
                  />
                ) : (
                  <p
                    className="text-sm text-white/45"
                    style={{ fontFamily: outfit }}
                  >
                    {copy.emptySelected}
                  </p>
                )}
              </div>
            </OnsiteCollapsibleSection>

            <OnsiteCollapsibleSection
              title={copy.schedule.title}
              defaultOpen={false}
              className="mt-6"
            >
              <OnsiteSchedule />
            </OnsiteCollapsibleSection>
          </motion.div>
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
