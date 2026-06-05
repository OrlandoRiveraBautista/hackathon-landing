"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localizedPath } from "@/lib/i18n";
import { HERO_EASE, prefersReducedMotion } from "@/lib/motion";
import { montserrat, outfit } from "@/lib/theme";

type SiteNavProps = {
  onRegisterClick: () => void;
};

export function SiteNav({ onRegisterClick }: SiteNavProps) {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const headerRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { href: "#about", label: dictionary.nav.about },
    { href: "#highlights", label: dictionary.nav.whyJoin },
    { href: "#how-it-works", label: dictionary.nav.howItWorks },
    { href: "#faq", label: dictionary.nav.faq },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const header = headerRef.current;
    if (!header) return;

    gsap.to(header, {
      opacity: 1,
      y: 0,
      duration: 0.75,
      delay: 0.2,
      ease: HERO_EASE,
    });
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={`site-nav-mount fixed top-0 right-0 left-0 z-[60] transition-all duration-500 ${
        scrolled || menuOpen
          ? "border-b border-[#aaff00]/15 bg-black/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4"
        aria-label="Main"
      >
        <Link
          href={localizedPath(locale)}
          className="min-w-0 truncate text-xs font-black tracking-tight text-white transition-colors hover:text-[#aaff00] sm:text-sm"
          style={{ fontFamily: montserrat }}
        >
          Build Pa&apos;l Norte
        </Link>

        <div className="flex shrink-0 items-center gap-3 sm:gap-6">
          <div
            className="hidden items-center gap-6 text-xs tracking-[0.2em] text-white/50 md:flex"
            style={{ fontFamily: outfit }}
          >
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-[#aaff00]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <LanguageSwitcher />

          <button
            type="button"
            onClick={onRegisterClick}
            className="shrink-0 rounded border border-[#aaff00]/35 bg-[#aaff00]/10 px-2.5 py-1.5 text-[10px] font-black tracking-[0.12em] text-[#aaff00] shadow-[0_0_20px_rgba(170,255,0,0.12)] transition-all hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20 hover:shadow-[0_0_24px_rgba(170,255,0,0.25)] sm:px-3.5 sm:py-2 sm:text-xs sm:tracking-[0.15em]"
            style={{ fontFamily: montserrat }}
          >
            {dictionary.hero.registerNow}
          </button>

          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white/70 transition-colors hover:border-[#aaff00]/30 hover:text-[#aaff00] md:hidden"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
            <span className="flex h-3.5 w-4 flex-col justify-between">
              <span
                className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "translate-y-[6px] rotate-45" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block h-0.5 w-full bg-current transition-transform duration-300 ${
                  menuOpen ? "-translate-y-[6px] -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </div>
      </nav>

      <div
        id="mobile-nav-menu"
        className={`overflow-hidden border-t border-[#aaff00]/10 bg-black/95 backdrop-blur-md transition-[max-height,opacity] duration-300 md:hidden ${
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="mx-auto flex max-w-5xl flex-col px-4 py-2"
          style={{ fontFamily: outfit }}
        >
          <button
            type="button"
            onClick={() => {
              handleNavClick();
              onRegisterClick();
            }}
            className="mb-2 mt-1 w-full rounded border border-[#aaff00]/35 bg-[#aaff00]/10 py-3 text-xs font-black tracking-[0.15em] text-[#aaff00] shadow-[0_0_20px_rgba(170,255,0,0.12)] transition-all hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20"
            style={{ fontFamily: montserrat }}
          >
            {dictionary.hero.registerNow}
          </button>

          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="border-b border-white/5 py-4 text-sm tracking-[0.2em] text-white/60 transition-colors last:border-b-0 hover:text-[#aaff00] active:text-[#aaff00]"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
