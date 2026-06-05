"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

export function SiteNav() {
  const { locale } = useLocale();
  const dictionary = useDictionary();
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
      className={`fixed top-0 right-0 left-0 z-[60] transition-all duration-500 ${
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
          menuOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"
        }`}
        aria-hidden={!menuOpen}
      >
        <div
          className="mx-auto flex max-w-5xl flex-col px-4 py-2"
          style={{ fontFamily: outfit }}
        >
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
