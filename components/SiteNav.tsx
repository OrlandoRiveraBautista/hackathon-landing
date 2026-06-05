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

  return (
    <header
      className={`fixed top-0 right-0 left-0 z-[60] transition-all duration-500 ${
        scrolled
          ? "border-b border-[#aaff00]/15 bg-black/80 backdrop-blur-md"
          : "bg-transparent"
      }`}
    >
      <nav
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4"
        aria-label="Main"
      >
        <Link
          href={localizedPath(locale)}
          className="text-sm font-black tracking-tight text-white transition-colors hover:text-[#aaff00]"
          style={{ fontFamily: montserrat }}
        >
          Build Pa&apos;l Norte
        </Link>

        <div className="flex items-center gap-4 sm:gap-6">
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
        </div>
      </nav>
    </header>
  );
}
