import type { ReactNode } from "react";
import { montserrat } from "@/lib/theme";

type SectionLabelProps = {
  children: ReactNode;
  icon?: ReactNode;
};

export function SectionLabel({ children, icon }: SectionLabelProps) {
  return (
    <div className="mb-5 flex items-center gap-3">
      {icon && <span className="text-white/25">{icon}</span>}
      <p
        className="text-[9px] font-black tracking-[0.28em] text-white/25"
        style={{ fontFamily: montserrat }}
      >
        {children}
      </p>
      <div className="h-px flex-1 bg-gradient-to-r from-white/[0.08] to-transparent" />
    </div>
  );
}
