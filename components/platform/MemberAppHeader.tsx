import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { SITE_LOGO } from "@/lib/brand";
import { memberHomePath, type Locale } from "@/lib/i18n";
import { montserrat } from "@/lib/theme";

type MemberAppHeaderProps = {
  locale: Locale;
  eyebrow: string;
  rightSlot?: ReactNode;
};

export function MemberAppHeader({ locale, eyebrow, rightSlot }: MemberAppHeaderProps) {
  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 flex items-center justify-between gap-4 px-5 py-4 sm:px-8"
        style={{
          background: "rgba(5,5,5,0.72)",
          backdropFilter: "blur(20px) saturate(180%)",
          WebkitBackdropFilter: "blur(20px) saturate(180%)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          boxShadow: "0 1px 0 rgba(255,255,255,0.03)",
        }}
      >
        <Link
          href={memberHomePath(locale)}
          className="group flex items-center gap-3 transition-opacity hover:opacity-75"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-xl bg-[#aaff00]/20 blur-md transition-all duration-300 group-hover:bg-[#aaff00]/35 group-hover:blur-lg" />
            <Image
              src={SITE_LOGO}
              alt="Build Pa'l Norte"
              width={34}
              height={34}
              className="relative rounded-xl"
            />
          </div>
          <div className="hidden sm:block">
            <p
              className="text-[13px] font-black tracking-tight text-white"
              style={{ fontFamily: montserrat }}
            >
              Build Pa&apos;l Norte
            </p>
            <p
              className="text-[10px] font-semibold tracking-[0.18em] text-white/35"
              style={{ fontFamily: montserrat }}
            >
              {eyebrow}
            </p>
          </div>
        </Link>
        {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
      </header>
      <div className="h-[65px] shrink-0" aria-hidden />
    </>
  );
}
