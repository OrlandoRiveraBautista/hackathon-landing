"use client";

import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { localizedPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

export function SiteFooter() {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-[#aaff00]/15 bg-black px-6 py-14">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 text-center">
        <p
          className="text-2xl font-black tracking-tight text-white"
          style={{ fontFamily: montserrat }}
        >
          Build Pa&apos;l Norte
        </p>

        <nav
          className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm tracking-[0.2em] text-white/50"
          style={{ fontFamily: outfit }}
          aria-label="Footer"
        >
          <Link
            href={localizedPath(locale, "/terms")}
            className="transition-colors hover:text-[#aaff00]"
          >
            {dictionary.footer.terms}
          </Link>
          <Link
            href={localizedPath(locale, "/privacy")}
            className="transition-colors hover:text-[#aaff00]"
          >
            {dictionary.footer.privacy}
          </Link>
          <a
            href="mailto:hello@buildpalnorte.com"
            className="transition-colors hover:text-[#aaff00]"
          >
            {dictionary.footer.contact}
          </a>
        </nav>

        <div className="flex w-full max-w-xs items-center gap-4">
          <div className="h-px flex-1 bg-[#aaff00]/30" />
          <svg
            width="10"
            height="10"
            viewBox="-12 -12 24 24"
            className="text-[#aaff00]/60"
            aria-hidden="true"
          >
            <path
              d="M0,-12 L1.5,-1.5 L12,0 L1.5,1.5 L0,12 L-1.5,1.5 L-12,0 L-1.5,-1.5 Z"
              fill="currentColor"
            />
          </svg>
          <div className="h-px flex-1 bg-[#aaff00]/30" />
        </div>

        <p
          className="text-xs tracking-wide text-white/35"
          style={{ fontFamily: outfit }}
        >
          © {year} Build Pa&apos;l Norte. {dictionary.footer.copyright}
        </p>
      </div>
    </footer>
  );
}
