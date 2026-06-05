"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, type Locale } from "@/lib/i18n";
import { useLocale } from "@/components/LocaleProvider";
import { outfit } from "@/lib/theme";

function swapLocaleInPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");
  if (segments.length > 1 && locales.includes(segments[1] as Locale)) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }
  return `/${locale}${pathname === "/" ? "" : pathname}`;
}

export function LanguageSwitcher() {
  const { locale } = useLocale();
  const pathname = usePathname();

  return (
    <div
      className="flex items-center gap-1 rounded-full border border-white/10 bg-black/40 p-1"
      style={{ fontFamily: outfit }}
      role="group"
      aria-label="Language"
    >
      {locales.map((option) => {
        const isActive = option === locale;
        return (
          <Link
            key={option}
            href={swapLocaleInPath(pathname, option)}
            className={`rounded-full px-2.5 py-1 text-[10px] font-medium tracking-[0.15em] transition-colors sm:px-3 sm:text-xs ${
              isActive
                ? "bg-[#aaff00]/15 text-[#aaff00]"
                : "text-white/45 hover:text-white/80"
            }`}
            aria-current={isActive ? "page" : undefined}
          >
            {option.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
