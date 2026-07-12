import type { ReactNode } from "react";
import { montserrat } from "@/lib/theme";

export const platformControlBase =
  "group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-xl px-4 py-2 text-xs font-black tracking-[0.12em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-50";

export const platformControlVariants = {
  primary:
    "border border-[#aaff00]/30 bg-[#aaff00]/12 text-[#aaff00] hover:border-[#aaff00]/55 hover:bg-[#aaff00]/20 hover:shadow-[0_0_20px_rgba(170,255,0,0.15),0_4px_12px_rgba(0,0,0,0.4)]",
  ghost:
    "border border-white/[0.08] bg-white/[0.04] text-white/50 hover:border-white/15 hover:bg-white/[0.07] hover:text-white/75",
  danger:
    "border border-red-500/20 bg-red-500/8 text-red-400 hover:border-red-500/40 hover:bg-red-500/14",
} as const;

export type PlatformControlVariant = keyof typeof platformControlVariants;

export function PlatformControlShine() {
  return (
    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent transition-transform duration-500 group-hover:translate-x-full" />
  );
}

export function PlatformControlContent({
  icon,
  children,
}: {
  icon?: ReactNode;
  children: ReactNode;
}) {
  return (
    <>
      <PlatformControlShine />
      {icon && <span className="relative">{icon}</span>}
      <span className="relative">{children}</span>
    </>
  );
}

export const platformControlFont = { fontFamily: montserrat } as const;
