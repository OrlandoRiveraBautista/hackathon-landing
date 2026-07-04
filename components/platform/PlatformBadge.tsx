import { montserrat } from "@/lib/theme";

type PlatformBadgeProps = {
  active: boolean;
  label: string;
  pulse?: boolean;
};

export function PlatformBadge({ active, label, pulse = false }: PlatformBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.2em] ${
        active
          ? "border-[#aaff00]/25 bg-[#aaff00]/10 text-[#aaff00]"
          : "border-white/[0.08] bg-white/[0.03] text-white/35"
      }`}
      style={{ fontFamily: montserrat }}
    >
      <span className={`relative h-1.5 w-1.5 flex-shrink-0 rounded-full ${active ? "bg-[#aaff00]" : "bg-white/20"}`}>
        {pulse && active && <span className="auth-badge-dot absolute inset-0 rounded-full" />}
      </span>
      {label}
    </span>
  );
}
