"use client";

import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { PeserosCredit } from "@/components/PeserosCredit";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";
import { SiteFooter } from "./SiteFooter";

type LegalLayoutProps = {
  title: string;
  lastUpdated: string;
  lastUpdatedLabel: string;
  children: React.ReactNode;
};

export function LegalLayout({
  title,
  lastUpdated,
  lastUpdatedLabel,
  children,
}: LegalLayoutProps) {
  const { locale } = useLocale();
  const dictionary = useDictionary();

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="border-b border-[#aaff00]/15 px-4 py-5 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-between gap-3 sm:gap-4">
          <Link
            href={localizedPath(locale)}
            className="group flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-80"
            style={{ fontFamily: montserrat }}
          >
            <BrandLogo size={28} />
            <span className="truncate text-base font-black tracking-tight text-white group-hover:text-[#aaff00] sm:text-lg">
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
              {dictionary.legal.back}
            </Link>
          </div>
        </div>
      </header>

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <article className="legal-content mx-auto max-w-3xl">
          <p
            className="text-xs tracking-[0.35em] text-[#aaff00]/75"
            style={{ fontFamily: outfit }}
          >
            {dictionary.legal.label}
          </p>
          <h1
            className="mt-3 text-3xl font-black tracking-tight sm:text-4xl md:text-5xl"
            style={{ fontFamily: montserrat }}
          >
            {title}
          </h1>
          <p
            className="mt-4 text-sm text-white/45"
            style={{ fontFamily: outfit }}
          >
            {lastUpdatedLabel} {lastUpdated}
          </p>
          <div className="mt-6">
            <PeserosCredit variant="inline" />
          </div>
          <div
            className="mt-12 space-y-8 text-white/75"
            style={{ fontFamily: outfit }}
          >
            {children}
          </div>
        </article>
      </main>

      <SiteFooter />
    </div>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2
        className="text-xl font-bold text-white"
        style={{ fontFamily: montserrat }}
      >
        {title}
      </h2>
      <div className="mt-4 space-y-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}
