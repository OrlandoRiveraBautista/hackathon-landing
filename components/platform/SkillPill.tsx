import { montserrat, outfit } from "@/lib/theme";

type SkillPillProps = {
  skill: string;
};

export function SkillPill({ skill }: SkillPillProps) {
  return (
    <span
      className="group inline-flex items-center rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-white/55 transition-all duration-200 hover:border-[#aaff00]/35 hover:bg-[#aaff00]/8 hover:text-[#aaff00] hover:shadow-[0_0_12px_rgba(170,255,0,0.08)]"
      style={{ fontFamily: outfit }}
    >
      {skill}
    </span>
  );
}
