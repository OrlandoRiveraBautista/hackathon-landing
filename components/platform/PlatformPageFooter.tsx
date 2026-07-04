import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type PlatformPageFooterProps = {
  locale: Locale;
  backLabel: string;
  backHref?: string;
  /** Optional caption shown beside the back link */
  trailing?: string;
};

export function PlatformPageFooter({
  locale,
  backLabel,
  backHref,
  trailing,
}: PlatformPageFooterProps) {
  return (
    <div className="mt-12 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link
        href={backHref ?? localizedPath(locale)}
        className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.02] px-5 py-3.5 transition-all duration-200 hover:border-[#aaff00]/20 hover:bg-[#aaff00]/[0.04] hover:shadow-[0_0_24px_rgba(170,255,0,0.06)]"
        style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.02) inset" }}
      >
        <span
          className="inline-flex items-center gap-2.5 text-sm font-medium text-white/45 transition-colors duration-200 group-hover:text-[#aaff00]"
          style={{ fontFamily: outfit }}
        >
          <ArrowLeft
            size={15}
            strokeWidth={2.5}
            className="transition-transform duration-200 group-hover:-translate-x-0.5"
          />
          {backLabel}
        </span>
      </Link>
      {trailing && (
        <p
          className="text-[10px] font-black tracking-[0.24em] text-white/20"
          style={{ fontFamily: montserrat }}
        >
          {trailing}
        </p>
      )}
    </div>
  );
}
