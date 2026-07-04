import type { ReactNode } from "react";
import { montserrat } from "@/lib/theme";

type GlassCardProps = {
  children: ReactNode;
  className?: string;
  accent?: boolean;
};

export function GlassCard({ children, className = "", accent = false }: GlassCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-6 ${
        accent
          ? "border-[#aaff00]/15 bg-[#aaff00]/[0.025]"
          : "border-white/[0.07] bg-white/[0.018]"
      } ${className}`}
      style={{
        backdropFilter: "blur(8px) saturate(160%)",
        WebkitBackdropFilter: "blur(8px) saturate(160%)",
        boxShadow: accent
          ? "0 0 0 1px rgba(170,255,0,0.06) inset, 0 4px 24px rgba(0,0,0,0.4)"
          : "0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 24px rgba(0,0,0,0.4)",
      }}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background: accent
            ? "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.3) 50%, transparent 100%)"
            : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)",
        }}
      />
      {children}
    </div>
  );
}
