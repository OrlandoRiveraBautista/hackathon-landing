import Link from "next/link";
import type { ReactNode } from "react";
import { montserrat, outfit } from "@/lib/theme";

type PlatformActionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  href?: string;
  comingSoon?: boolean;
  comingSoonLabel?: string;
  openLabel?: string;
};

export function PlatformActionCard({
  title,
  description,
  icon,
  href,
  comingSoon = false,
  comingSoonLabel,
  openLabel = "Open",
}: PlatformActionCardProps) {
  const content = (
    <div className="flex h-full flex-col">
      {/* Icon */}
      <div
        className={`mb-5 flex h-11 w-11 items-center justify-center rounded-xl border transition-colors duration-200 ${
          comingSoon
            ? "border-white/[0.05] bg-white/[0.025] text-white/15"
            : "border-[#aaff00]/15 bg-[#aaff00]/8 text-[#aaff00] group-hover:border-[#aaff00]/30 group-hover:bg-[#aaff00]/14"
        }`}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex-1">
        <p
          className={`text-sm font-black leading-tight tracking-tight ${
            comingSoon ? "text-white/25" : "text-white/85"
          }`}
          style={{ fontFamily: montserrat }}
        >
          {title}
        </p>
        <p
          className="mt-1.5 text-[11px] leading-relaxed text-white/30"
          style={{ fontFamily: outfit }}
        >
          {description}
        </p>
      </div>

      {/* Footer */}
      {comingSoon && comingSoonLabel && (
        <div className="mt-4">
          <span
            className="rounded-full border border-white/[0.07] bg-white/[0.03] px-2 py-0.5 text-[8px] font-black tracking-[0.22em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {comingSoonLabel}
          </span>
        </div>
      )}
      {!comingSoon && href && (
        <div className="mt-4 flex items-center gap-1 text-[11px] font-semibold text-[#aaff00]/50 transition-colors duration-200 group-hover:text-[#aaff00]/80" style={{ fontFamily: outfit }}>
          {openLabel}
          <svg viewBox="0 0 16 16" fill="none" className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );

  const base = `group relative flex flex-col overflow-hidden rounded-2xl border p-5 transition-all duration-200`;

  const styles = comingSoon
    ? `${base} cursor-default border-white/[0.05] bg-white/[0.012]`
    : `${base} border-white/[0.07] bg-white/[0.018] hover:border-[#aaff00]/20 hover:bg-[#aaff00]/[0.025] hover:shadow-[0_0_28px_rgba(170,255,0,0.06),0_8px_32px_rgba(0,0,0,0.4)]`;

  const cardStyle = {
    backdropFilter: "blur(8px) saturate(160%)",
    WebkitBackdropFilter: "blur(8px) saturate(160%)",
    boxShadow: comingSoon
      ? "0 0 0 1px rgba(255,255,255,0.02) inset"
      : "0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 24px rgba(0,0,0,0.35)",
  } as const;

  if (comingSoon || !href) {
    return (
      <div className={styles} style={cardStyle}>
        {content}
      </div>
    );
  }

  return (
    <Link href={href} className={styles} style={cardStyle}>
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      <div className="relative flex h-full flex-col">{content}</div>
    </Link>
  );
}
