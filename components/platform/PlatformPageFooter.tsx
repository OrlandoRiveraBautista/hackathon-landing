import Link from "next/link";
import type { ReactNode } from "react";
import { localizedPath, type Locale } from "@/lib/i18n";
import { outfit } from "@/lib/theme";

type PlatformPageFooterProps = {
  locale: Locale;
  backLabel: string;
  backHref?: string;
  trailing?: ReactNode;
};

export function PlatformPageFooter({
  locale,
  backLabel,
  backHref,
  trailing,
}: PlatformPageFooterProps) {
  return (
    <div className="mt-12 flex items-center justify-between border-t border-white/[0.05] pt-8">
      <Link
        href={backHref ?? localizedPath(locale)}
        className="text-sm text-white/25 transition-colors duration-200 hover:text-white/55"
        style={{ fontFamily: outfit }}
      >
        {backLabel}
      </Link>
      {trailing}
    </div>
  );
}
