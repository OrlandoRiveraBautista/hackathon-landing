import { outfit } from "@/lib/theme";
import { ExternalLinkIcon, GithubIcon } from "./icons";

type PlatformLinkChipProps = {
  href: string;
  label: string;
  icon?: "github";
};

export function PlatformLinkChip({ href, label, icon = "github" }: PlatformLinkChipProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="group inline-flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-2 text-sm text-white/45 transition-all duration-200 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/8 hover:text-white/80 hover:shadow-[0_0_16px_rgba(170,255,0,0.1)]"
      style={{ fontFamily: outfit }}
    >
      {icon === "github" && (
        <GithubIcon className="h-4 w-4 flex-shrink-0 transition-colors group-hover:text-[#aaff00]" />
      )}
      <span>{label}</span>
      <ExternalLinkIcon className="h-3 w-3 opacity-35 transition-opacity group-hover:opacity-65" />
    </a>
  );
}
