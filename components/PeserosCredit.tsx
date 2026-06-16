"use client";

import Link from "next/link";
import { useDictionary } from "@/components/LocaleProvider";
import { PESEROS_LOGO, PESEROS_URL } from "@/lib/brand";
import { montserrat, outfit } from "@/lib/theme";

type PeserosCreditProps = {
  variant?: "inline" | "stacked" | "banner";
  className?: string;
};

const logoHeights = {
  inline: 28,
  stacked: 36,
  banner: 44,
} as const;

export function PeserosCredit({
  variant = "inline",
  className = "",
}: PeserosCreditProps) {
  const { brand } = useDictionary();
  const logoHeight = logoHeights[variant];

  const label = (
    <span
      className={`font-black uppercase tracking-[0.28em] text-white/40 ${
        variant === "banner" ? "text-[10px] sm:text-[11px]" : "text-[9px]"
      }`}
      style={{ fontFamily: montserrat }}
    >
      {brand.organizedBy}
    </span>
  );

  const logo = (
    <Link
      href={PESEROS_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex shrink-0 items-center rounded-md bg-white px-2 py-1 transition-opacity hover:opacity-85"
      aria-label="Peseros — peseros.com"
    >
      <img
        src={PESEROS_LOGO}
        alt=""
        width={1397}
        height={1397}
        className="object-contain"
        style={{ height: logoHeight, width: "auto", maxWidth: logoHeight * 3.5 }}
      />
    </Link>
  );

  if (variant === "stacked") {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        {label}
        {logo}
      </div>
    );
  }

  if (variant === "banner") {
    return (
      <div
        className={`flex flex-col items-center gap-3 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-6 py-4 sm:flex-row sm:justify-center ${className}`}
      >
        {label}
        {logo}
        <p
          className="max-w-sm text-center text-xs leading-relaxed text-white/35 sm:text-left"
          style={{ fontFamily: outfit }}
        >
          {brand.organizerNote}
        </p>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {label}
      {logo}
    </div>
  );
}
