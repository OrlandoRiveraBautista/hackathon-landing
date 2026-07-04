import type { ReactNode } from "react";
import type { Locale } from "@/lib/i18n";
import { MemberAppHeader } from "./MemberAppHeader";
import { PlatformAppFooter } from "./PlatformAppFooter";
import { PlatformBackground } from "./PlatformBackground";

type MemberAppShellProps = {
  locale: Locale;
  eyebrow: string;
  headerActions?: ReactNode;
  children: ReactNode;
  maxWidth?: "4xl" | "6xl";
};

const maxWidthClasses = {
  "4xl": "max-w-4xl",
  "6xl": "max-w-6xl",
} as const;

export function MemberAppShell({
  locale,
  eyebrow,
  headerActions,
  children,
  maxWidth = "4xl",
}: MemberAppShellProps) {
  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-x-hidden bg-[#050505] text-white">
      <PlatformBackground />
      <MemberAppHeader locale={locale} eyebrow={eyebrow} rightSlot={headerActions} />
      {/* pb-8: PlatformAppFooter provides bottom spacing (was pb-16 before global footer) */}
      <div
        className={`relative z-10 mx-auto w-full flex-1 px-5 pt-8 pb-8 sm:px-8 sm:pt-10 ${maxWidthClasses[maxWidth]}`}
      >
        {children}
      </div>
      <PlatformAppFooter locale={locale} />
    </main>
  );
}
