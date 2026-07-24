"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Link from "next/link";
import {
  Megaphone,
  Users,
  Wrench,
  Heart,
  DollarSign,
  UtensilsCrossed,
  Pizza,
  Cookie,
  Coffee,
  Droplets,
  Trophy,
  Printer,
  Wifi,
  Tv2,
  Camera,
  BookOpen,
  type LucideIcon,
} from "lucide-react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { PeserosCredit } from "@/components/PeserosCredit";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { SponsorModal } from "@/components/SponsorModal";
import { SponsorAvatar } from "@/components/SponsorAvatar";
import { localizedPath } from "@/lib/i18n";
import { CONFIRMED_SPONSORS } from "@/lib/confirmed-sponsors";
import { FULFILLED_CONTRIBUTIONS } from "@/lib/contribution-fulfillment";
import { montserrat, outfit } from "@/lib/theme";

const WHY_ICONS: LucideIcon[] = [Megaphone, Users, Wrench, Heart];

const CONTRIBUTION_ICONS: LucideIcon[] = [
  DollarSign,
  UtensilsCrossed,
  Pizza,
  Cookie,
  Coffee,
  Droplets,
  Trophy,
  Printer,
  Wifi,
  Tv2,
  Camera,
  BookOpen,
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const },
  }),
};

export function SponsorsPageClient() {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const { sponsorsPage } = dictionary;
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ── Header ─────────────────────────────────────────────────────── */}
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
            <PeserosCredit variant="inline" className="hidden sm:flex" />
            <LanguageSwitcher />
            <Link
              href={localizedPath(locale)}
              className="text-[10px] tracking-[0.2em] text-white/45 transition-colors hover:text-[#aaff00] sm:text-xs sm:tracking-[0.25em]"
              style={{ fontFamily: outfit }}
            >
              {sponsorsPage.back}
            </Link>
          </div>
        </div>
      </header>

      <main>
        {/* ── Hero ───────────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-28">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-1/2 top-0 h-64 w-px -translate-x-1/2 bg-gradient-to-b from-[#aaff00]/30 to-transparent" />
            <div className="absolute left-[20%] top-0 h-40 w-px bg-gradient-to-b from-[#aaff00]/15 to-transparent" />
            <div className="absolute left-[80%] top-0 h-40 w-px bg-gradient-to-b from-[#aaff00]/15 to-transparent" />
            <div className="absolute left-1/2 top-32 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[#aaff00]/4 blur-[100px]" />
            <div
              className="absolute inset-0 opacity-[0.025]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)",
                backgroundSize: "48px 48px",
              }}
            />
          </div>

          <div className="relative mx-auto max-w-3xl text-center">
            <motion.p
              className="text-xs tracking-[0.4em] text-[#aaff00]/70"
              style={{ fontFamily: outfit }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={0}
            >
              {sponsorsPage.label}
            </motion.p>

            <motion.h1
              className="mt-4 text-4xl font-black leading-none tracking-tight sm:text-6xl md:text-7xl"
              style={{ fontFamily: montserrat }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              {sponsorsPage.title.replace(sponsorsPage.accentWord, "").trim()}{" "}
              <span className="text-[#aaff00]">{sponsorsPage.accentWord}</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg"
              style={{ fontFamily: outfit }}
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
            >
              {sponsorsPage.subtitle}
            </motion.p>

            <motion.div
              className="mt-8 flex justify-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2.5}
            >
              <PeserosCredit variant="stacked" />
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
            >
              <motion.button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-[#aaff00] px-8 py-3.5 text-sm font-black tracking-[0.12em] text-black shadow-[0_0_28px_rgba(170,255,0,0.35)] transition-all hover:bg-[#c8ff40] hover:shadow-[0_0_40px_rgba(170,255,0,0.5)]"
                style={{ fontFamily: montserrat }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {sponsorsPage.ctaButton}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── Confirmed Sponsors ────────────────────────────────────────── */}
        <section className="border-t border-white/[0.06] px-4 py-10 sm:px-6 sm:py-14">
          <div className="mx-auto max-w-5xl">
            <motion.p
              className="mb-8 text-center text-[10px] tracking-[0.4em] text-white/25"
              style={{ fontFamily: outfit }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              CONFIRMED SPONSORS
            </motion.p>

            <div className="flex flex-wrap items-stretch justify-center gap-4">
              {CONFIRMED_SPONSORS.map((sponsor, i) => (
                <motion.a
                  key={sponsor.name}
                  href={sponsor.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex h-32 w-40 flex-col items-center justify-center gap-1.5 overflow-hidden rounded-2xl border border-[#aaff00]/20 bg-white/[0.03] px-3 py-3 transition-all duration-300 hover:border-[#aaff00]/35 hover:bg-white/[0.05]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/40 to-transparent" />
                  <SponsorAvatar
                    name={sponsor.name}
                    logo={sponsor.logo}
                    size={48}
                  />
                  <div className="flex min-h-[52px] flex-col items-center justify-center text-center">
                    <p
                      className="text-[11px] font-black leading-tight text-white transition-colors group-hover:text-[#aaff00]"
                      style={{ fontFamily: montserrat }}
                    >
                      {sponsor.name}
                    </p>
                    <p
                      className="mt-0.5 min-h-[26px] max-w-[136px] text-[9px] leading-snug text-white/35"
                      style={{ fontFamily: outfit }}
                    >
                      {sponsor.role?.[locale] ?? "\u00A0"}
                    </p>
                    <p
                      className="text-[10px] text-[#aaff00]/60"
                      style={{ fontFamily: outfit }}
                    >
                      {sponsor.contribution}
                    </p>
                  </div>
                </motion.a>
              ))}

              {/* Open slots */}
              {[...Array(3)].map((_, i) => (
                <motion.button
                  key={`open-${i}`}
                  type="button"
                  onClick={() => setModalOpen(true)}
                  className="group flex h-32 w-40 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/[0.08] bg-white/[0.015] transition-all duration-300 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/[0.03]"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    duration: 0.45,
                    delay: (CONFIRMED_SPONSORS.length + i) * 0.08,
                  }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span
                    className="text-[9px] tracking-[0.25em] text-white/15 transition-colors duration-300 group-hover:text-[#aaff00]/40"
                    style={{ fontFamily: montserrat }}
                  >
                    YOUR LOGO
                  </span>
                  <span
                    className="text-[9px] tracking-[0.15em] text-white/10 transition-colors duration-300 group-hover:text-[#aaff00]/30"
                    style={{ fontFamily: outfit }}
                  >
                    Become a sponsor
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Sponsor ───────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-[10px] tracking-[0.4em] text-[#aaff00]/60"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.whyLabel}
              </p>
              <h2
                className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
                style={{ fontFamily: montserrat }}
              >
                {sponsorsPage.whyTitle}
              </h2>
              <p
                className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/50"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.whySubtitle}
              </p>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {sponsorsPage.whyItems.map((item, i) => {
                const Icon = WHY_ICONS[i % WHY_ICONS.length];
                return (
                  <motion.div
                    key={item.title}
                    className="group rounded-2xl border border-white/[0.07] bg-white/[0.025] p-6 transition-all duration-300 hover:border-[#aaff00]/20 hover:bg-white/[0.04]"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                  >
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl border border-[#aaff00]/20 bg-[#aaff00]/8 text-[#aaff00]">
                      <Icon
                        size={18}
                        strokeWidth={1.75}
                        className="drop-shadow-[0_0_6px_rgba(170,255,0,0.5)]"
                      />
                    </div>
                    <h3
                      className="mb-2 text-sm font-black tracking-wide text-white"
                      style={{ fontFamily: montserrat }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="text-sm leading-relaxed text-white/45"
                      style={{ fontFamily: outfit }}
                    >
                      {item.body}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── What We Need ──────────────────────────────────────────────── */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(170,255,0,0.05)_0%,transparent_70%)]" />
          <div className="relative mx-auto max-w-5xl">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-[10px] tracking-[0.4em] text-[#aaff00]/60"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.contributionsLabel}
              </p>
              <h2
                className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
                style={{ fontFamily: montserrat }}
              >
                {sponsorsPage.contributionsTitle}
              </h2>
              <p
                className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-white/50"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.contributionsSubtitle}
              </p>
            </motion.div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {sponsorsPage.contributions.map((item, i) => {
                const Icon = CONTRIBUTION_ICONS[i % CONTRIBUTION_ICONS.length];
                const fulfilled = FULFILLED_CONTRIBUTIONS[item.id];
                const struck = fulfilled ? "line-through decoration-[#aaff00]/40 decoration-2" : "";

                return (
                  <motion.div
                    key={item.id}
                    className={`group relative flex gap-4 overflow-hidden rounded-2xl border p-5 transition-all duration-300 ${
                      fulfilled
                        ? "border-[#aaff00]/25 bg-[#aaff00]/[0.04]"
                        : "border-white/[0.07] bg-white/[0.02] hover:border-[#aaff00]/20 hover:bg-white/[0.035]"
                    }`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.04 }}
                  >
                    {fulfilled && (
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/50 to-transparent" />
                    )}

                    {fulfilled ? (
                      <a
                        href={fulfilled.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-0.5 shrink-0"
                        aria-label={fulfilled.name}
                      >
                        <SponsorAvatar name={fulfilled.name} logo={fulfilled.logo} size={36} />
                      </a>
                    ) : (
                      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#aaff00]/15 bg-[#aaff00]/6 text-[#aaff00]/70 transition-colors duration-300 group-hover:border-[#aaff00]/30 group-hover:text-[#aaff00]">
                        <Icon size={16} strokeWidth={1.75} />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`text-sm font-black ${fulfilled ? `${struck} text-white/35` : "text-white"}`}
                        style={{ fontFamily: montserrat }}
                      >
                        {item.category}
                      </p>
                      <p
                        className={`mt-0.5 text-xs ${fulfilled ? `${struck} text-white/25` : "text-white/50"}`}
                        style={{ fontFamily: outfit }}
                      >
                        {item.examples}
                      </p>
                      <p
                        className={`mt-1.5 text-[11px] tracking-wide ${fulfilled ? `${struck} text-[#aaff00]/30` : "text-[#aaff00]/50"}`}
                        style={{ fontFamily: outfit }}
                      >
                        {item.who}
                      </p>

                      {fulfilled && (
                        <a
                          href={fulfilled.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/20 bg-[#aaff00]/8 px-2.5 py-1 transition-colors hover:border-[#aaff00]/40 hover:bg-[#aaff00]/15"
                        >
                          <SponsorAvatar name={fulfilled.name} logo={fulfilled.logo} size={22} />
                          <span className="text-[10px] text-white/40" style={{ fontFamily: outfit }}>
                            {sponsorsPage.coveredLabel}
                          </span>
                          <span
                            className="text-[11px] font-black text-[#aaff00]"
                            style={{ fontFamily: montserrat }}
                          >
                            {fulfilled.name}
                          </span>
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <motion.button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full bg-[#aaff00] px-8 py-3.5 text-sm font-black tracking-[0.12em] text-black shadow-[0_0_24px_rgba(170,255,0,0.3)] transition-all hover:bg-[#c8ff40]"
                style={{ fontFamily: montserrat }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {sponsorsPage.ctaButton}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── Workshops ─────────────────────────────────────────────────── */}
        <section className="relative px-4 py-16 sm:px-6 sm:py-24">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute bottom-0 left-1/2 h-64 w-[500px] -translate-x-1/2 rounded-full bg-[#aaff00]/5 blur-[90px]" />
          </div>

          <div className="relative mx-auto max-w-5xl">
            <motion.div
              className="mb-12 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <p
                className="text-[10px] tracking-[0.4em] text-[#aaff00]/60"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.workshopsLabel}
              </p>
              <h2
                className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
                style={{ fontFamily: montserrat }}
              >
                {sponsorsPage.workshopsTitle}
              </h2>
              <p
                className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-white/50"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.workshopsSubtitle}
              </p>

              <motion.div
                className="mx-auto mt-6 max-w-2xl rounded-2xl border border-[#aaff00]/25 bg-[#aaff00]/[0.06] px-5 py-4"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <p
                  className="text-sm leading-relaxed text-[#aaff00]/85"
                  style={{ fontFamily: outfit }}
                >
                  {sponsorsPage.workshopsCallout}
                </p>
              </motion.div>
            </motion.div>

            <motion.p
              className="mb-5 text-center text-[10px] tracking-[0.35em] text-white/30"
              style={{ fontFamily: outfit }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              {sponsorsPage.workshopIdeasLabel}
            </motion.p>

            <div className="grid gap-4 sm:grid-cols-2">
              {sponsorsPage.workshops.map((ws, i) => (
                <motion.div
                  key={ws.id}
                  className="group relative overflow-hidden rounded-2xl border border-dashed border-white/[0.12] bg-white/[0.015] p-6 transition-all duration-300 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/[0.03]"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.06 }}
                >
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <h3
                      className="text-sm font-black leading-tight text-white/80"
                      style={{ fontFamily: montserrat }}
                    >
                      {ws.title}
                    </h3>
                    <span
                      className="shrink-0 rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-0.5 text-[9px] font-black tracking-[0.2em] text-white/35"
                      style={{ fontFamily: montserrat }}
                    >
                      {sponsorsPage.workshopExampleTag}
                    </span>
                  </div>

                  <p
                    className="mb-4 text-xs leading-relaxed text-white/40"
                    style={{ fontFamily: outfit }}
                  >
                    {ws.theme}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {ws.topics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-white/[0.06] bg-white/[0.02] px-2.5 py-1 text-[10px] text-white/30"
                        style={{ fontFamily: outfit }}
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  <div className="border-t border-white/[0.06] pt-3">
                    <div
                      className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px]"
                      style={{ fontFamily: outfit }}
                    >
                      <span className="text-white/35">
                        <span className="text-white/20">{sponsorsPage.idealForLabel} </span>
                        {ws.idealFor}
                      </span>
                    </div>
                    <p
                      className="mt-1 text-[11px] text-white/25"
                      style={{ fontFamily: outfit }}
                    >
                      <span className="text-white/15">{sponsorsPage.speakersLabel} </span>
                      {ws.speakers}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Keynote ideas */}
            <motion.div
              className="mt-12"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.2 }}
            >
              <p
                className="mb-2 text-center text-[10px] tracking-[0.4em] text-[#aaff00]/50"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.keynotesLabel}
              </p>
              <p
                className="mx-auto mb-5 max-w-lg text-center text-xs text-white/35"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.keynotesSubtitle}
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                {sponsorsPage.keynotes.map((keynote, i) => (
                  <motion.div
                    key={keynote.title}
                    className="rounded-2xl border border-dashed border-[#aaff00]/15 bg-[#aaff00]/[0.02] p-5 transition-all duration-300 hover:border-[#aaff00]/25 hover:bg-[#aaff00]/[0.04]"
                    initial={{ opacity: 0, scale: 0.96 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: i * 0.08 }}
                  >
                    <p
                      className="mb-1 text-[9px] tracking-[0.3em] text-white/25"
                      style={{ fontFamily: montserrat }}
                    >
                      {sponsorsPage.workshopExampleTag} {String(i + 1).padStart(2, "0")}
                    </p>
                    <h4
                      className="text-sm font-black leading-snug text-white/80"
                      style={{ fontFamily: montserrat }}
                    >
                      {keynote.title}
                    </h4>
                    <p
                      className="mt-2 text-xs leading-relaxed text-white/40"
                      style={{ fontFamily: outfit }}
                    >
                      {keynote.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="mt-10 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <p
                className="mb-5 text-sm text-white/40"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.workshopsHostCta}
              </p>
              <motion.button
                type="button"
                onClick={() => setModalOpen(true)}
                className="rounded-full border border-[#aaff00]/30 bg-[#aaff00]/8 px-7 py-3 text-xs font-black tracking-[0.14em] text-[#aaff00] transition-all hover:border-[#aaff00]/60 hover:bg-[#aaff00]/15"
                style={{ fontFamily: montserrat }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {sponsorsPage.ctaButton}
              </motion.button>
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section className="px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            className="relative mx-auto max-w-3xl overflow-hidden rounded-3xl border border-[#aaff00]/20 bg-[#aaff00]/[0.04] px-8 py-14 text-center sm:px-14"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/50 to-transparent" />
            <div className="pointer-events-none absolute left-1/2 top-0 h-48 w-72 -translate-x-1/2 rounded-full bg-[#aaff00]/8 blur-[70px]" />

            <div className="relative">
              <p
                className="text-[10px] tracking-[0.4em] text-[#aaff00]/60"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.ctaLabel}
              </p>
              <h2
                className="mt-3 text-2xl font-black tracking-tight sm:text-3xl"
                style={{ fontFamily: montserrat }}
              >
                {sponsorsPage.ctaTitle}
              </h2>
              <p
                className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-white/50"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.ctaSubtitle}
              </p>

              <motion.button
                type="button"
                onClick={() => setModalOpen(true)}
                className="mt-8 rounded-full bg-[#aaff00] px-9 py-3.5 text-sm font-black tracking-[0.12em] text-black shadow-[0_0_30px_rgba(170,255,0,0.35)] transition-all hover:bg-[#c8ff40] hover:shadow-[0_0_45px_rgba(170,255,0,0.5)]"
                style={{ fontFamily: montserrat }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
              >
                {sponsorsPage.ctaButton}
              </motion.button>

              <p
                className="mt-5 text-[11px] tracking-wide text-white/25"
                style={{ fontFamily: outfit }}
              >
                {sponsorsPage.ctaNote}
              </p>
            </div>
          </motion.div>
        </section>
      </main>

      <SiteFooter onSponsorClick={() => setModalOpen(true)} />

      <SponsorModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
