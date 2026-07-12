"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { SITE_LOGO } from "@/lib/brand";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type SiteNavProps = {
  onRegisterClick: () => void;
};

function NavLogo({ size }: { size: number }) {
  return (
    <div className="relative shrink-0">
      <div className="absolute inset-0 rounded-xl bg-[#aaff00]/20 blur-md transition-all duration-300 group-hover:bg-[#aaff00]/35 group-hover:blur-lg" />
      <Image
        src={SITE_LOGO}
        alt=""
        width={size}
        height={size}
        className="relative rounded-xl"
        aria-hidden
      />
    </div>
  );
}

export function SiteNav({ onRegisterClick }: SiteNavProps) {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");

  const links = [
    { href: "#about", label: dictionary.nav.about },
    { href: "#highlights", label: dictionary.nav.whyJoin },
    { href: "#how-it-works", label: dictionary.nav.howItWorks },
    { href: "#faq", label: dictionary.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 64);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Active section tracking via IntersectionObserver */
  useEffect(() => {
    const ids = links.map((l) => l.href.slice(1));
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveSection(id);
        },
        { rootMargin: "-40% 0px -55% 0px" },
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  return (
    <motion.header
      className="site-nav-mount fixed top-0 right-0 left-0 z-[60] flex flex-col items-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Vertical accent lines */}
      <AnimatePresence>
        {!scrolled && !menuOpen && (
          <motion.div
            key="accent-lines"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="pointer-events-none absolute inset-x-0 top-0"
          >
            <div className="absolute left-[22%] top-0 h-20 w-px bg-gradient-to-b from-[#aaff00]/25 to-transparent" />
            <div className="absolute left-1/2 top-0 h-24 w-px bg-gradient-to-b from-[#aaff00]/15 to-transparent" />
            <div className="absolute left-[78%] top-0 h-20 w-px bg-gradient-to-b from-[#aaff00]/20 to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── DESKTOP pill nav ─────────────────────────────────────────── */}
      <nav
        aria-label="Main"
        className={`
          relative mx-auto hidden w-full items-center justify-between
          gap-4 px-2 transition-all duration-500 md:flex
          ${
            scrolled
              ? "mt-3 max-w-4xl rounded-full border border-white/[0.08] bg-black/75 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
              : "mt-0 max-w-5xl rounded-none border-transparent bg-transparent py-4"
          }
        `}
      >
        {/* Subtle inner glow on the top edge — only when scrolled */}
        {scrolled && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-[#aaff00]/20 to-transparent" />
        )}

        {/* Logo */}
        <Link
          href={localizedPath(locale)}
          className="group flex shrink-0 items-center gap-2.5 rounded-full px-3 py-1.5"
          style={{ fontFamily: montserrat }}
        >
          <NavLogo size={32} />
          <span className="text-sm font-black tracking-tight text-white transition-colors duration-300 group-hover:text-[#aaff00]">
            Build Pa&apos;l Norte
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1" style={{ fontFamily: outfit }}>
          {links.map((link) => {
            const id = link.href.slice(1);
            const isActive = activeSection === id;
            return (
              <a
                key={link.href}
                href={link.href}
                className={`
                  relative rounded-full px-3.5 py-2 text-[11px] tracking-[0.1em] transition-all duration-200
                  ${
                    isActive
                      ? "text-[#aaff00]"
                      : "text-white/50 hover:text-white/90"
                  }
                `}
              >
                {isActive && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-[#aaff00]/10 ring-1 ring-[#aaff00]/20"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </a>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex shrink-0 items-center gap-2">
          <LanguageSwitcher />

          <motion.button
            type="button"
            onClick={onRegisterClick}
            className={`
              rounded-full px-5 py-2 text-[11px] font-black tracking-[0.12em] transition-all duration-500
              ${
                scrolled
                  ? "bg-[#aaff00] text-black shadow-[0_0_18px_rgba(170,255,0,0.35)] hover:bg-[#c8ff40] hover:shadow-[0_0_28px_rgba(170,255,0,0.55)]"
                  : "border border-[#aaff00]/40 bg-[#aaff00]/10 text-[#aaff00] hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20"
              }
            `}
            style={{ fontFamily: montserrat }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
          >
            {dictionary.hero.registerNow}
          </motion.button>
        </div>
      </nav>

      {/* ── MOBILE pill nav ──────────────────────────────────────────── */}
      <div className="relative mx-auto w-full max-w-lg px-3 md:hidden">
        <div
          className={`
            relative flex w-full items-center justify-between gap-2 transition-all duration-500
            ${
              scrolled || menuOpen
                ? "mt-3 rounded-full border border-white/[0.08] bg-black/75 px-3 py-2 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
                : "mt-0 rounded-none border-transparent bg-transparent py-3 px-1"
            }
          `}
        >
          {(scrolled || menuOpen) && (
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px rounded-full bg-gradient-to-r from-transparent via-[#aaff00]/20 to-transparent" />
          )}

          <Link
            href={localizedPath(locale)}
            className="group flex min-w-0 items-center gap-2 rounded-full py-1 pl-1 pr-2"
            style={{ fontFamily: montserrat }}
          >
            <NavLogo size={26} />
            <span className="truncate text-xs font-black tracking-tight text-white group-hover:text-[#aaff00]">
              Build Pa&apos;l Norte
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2">
            <LanguageSwitcher />
            <button
              type="button"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/60 transition-colors hover:border-[#aaff00]/30 hover:text-[#aaff00]"
              onClick={() => setMenuOpen((o) => !o)}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav-menu"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              <span className="flex h-3.5 w-4 flex-col justify-between">
                <span
                  className={`block h-0.5 w-full bg-current transition-transform duration-300 ${menuOpen ? "translate-y-[6px] rotate-45" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : ""}`}
                />
                <span
                  className={`block h-0.5 w-full bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-[6px] -rotate-45" : ""}`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* ── MOBILE menu panel ──────────────────────────────────────── */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              id="mobile-nav-menu"
              key="mobile-menu"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
              className="mt-2 overflow-hidden rounded-2xl border border-white/[0.08] bg-black/90 shadow-[0_8px_32px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-2xl"
              aria-hidden={!menuOpen}
            >
              <div
                className="flex flex-col gap-1 px-3 pb-3 pt-2"
                style={{ fontFamily: outfit }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    onRegisterClick();
                  }}
                  className="mb-1 mt-1 w-full rounded-full bg-[#aaff00] py-3 text-xs font-black tracking-[0.15em] text-black shadow-[0_0_20px_rgba(170,255,0,0.3)] transition-all hover:bg-[#c8ff40]"
                  style={{ fontFamily: montserrat }}
                >
                  {dictionary.hero.registerNow}
                </button>

                {links.map((link, i) => (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 rounded-xl px-2 py-3 text-sm tracking-[0.16em] text-white/55 transition-colors hover:bg-white/[0.03] hover:text-[#aaff00]"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.22, delay: i * 0.05 }}
                  >
                    <span className="h-px w-3 shrink-0 bg-[#aaff00]/30" />
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
