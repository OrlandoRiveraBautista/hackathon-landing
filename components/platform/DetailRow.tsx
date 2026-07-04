import type { ReactNode } from "react";
import { montserrat, outfit } from "@/lib/theme";

type DetailRowProps = {
  icon: ReactNode;
  label: string;
  value: ReactNode;
};

export function DetailRow({ icon, label, value }: DetailRowProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0 text-white/25">{icon}</div>
      <div className="min-w-0 flex-1">
        <p
          className="text-[9px] font-black tracking-[0.22em] text-white/25"
          style={{ fontFamily: montserrat }}
        >
          {label}
        </p>
        <div className="mt-0.5 text-sm text-white/60" style={{ fontFamily: outfit }}>
          {value}
        </div>
      </div>
    </div>
  );
}
