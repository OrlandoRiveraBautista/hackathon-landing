"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDictionary } from "@/components/LocaleProvider";
import { SITE_LOGO } from "@/lib/brand";
import {
  localizedPath,
  memberHomePath,
  memberNotificationsPath,
  memberTeamPath,
  membersDirectoryPath,
  type Locale,
} from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type PlatformAppFooterProps = {
  locale: Locale;
};

function FooterNavLink({ href, label }: { href: string; label: string }) {
  const isAnchor = href.startsWith("#");

  const className =
    "group inline-flex items-center gap-1 py-0.5 text-[13px] text-white/30 transition-colors duration-200 hover:text-white/70";

  const content = (
    <>
      <span style={{ fontFamily: outfit }}>{label}</span>
      <ArrowUpRight
        size={11}
        strokeWidth={2}
        className="opacity-0 transition-all duration-150 group-hover:opacity-35 group-hover:translate-x-px group-hover:-translate-y-px"
      />
    </>
  );

  if (isAnchor) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {content}
    </Link>
  );
}

export function PlatformAppFooter({ locale }: PlatformAppFooterProps) {
  const dictionary = useDictionary();
  const { members, footer } = dictionary;
  const { platformFooter } = members;
  const year = new Date().getFullYear();

  const platformLinks = [
    { href: memberHomePath(locale), label: platformFooter.home },
    { href: membersDirectoryPath(locale), label: platformFooter.directory },
    { href: memberTeamPath(locale), label: platformFooter.team },
    { href: memberNotificationsPath(locale), label: platformFooter.notifications },
  ];

  const legalLinks = [
    { href: localizedPath(locale, "/terms"), label: footer.terms },
    { href: localizedPath(locale, "/privacy"), label: footer.privacy },
  ];

  return (
    <footer className="footer-shell relative z-10 mt-auto overflow-hidden">
      <div className="footer-shimmer-track pointer-events-none absolute inset-x-0 top-0">
        <div className="footer-shimmer-bar opacity-30" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(170,255,0,0.07)_0%,transparent_70%)]" />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-center overflow-hidden"
      >
        <p
          className="select-none whitespace-nowrap font-black leading-[0.82] tracking-[-0.05em] text-transparent"
          style={{
            fontFamily: montserrat,
            fontSize: "clamp(3.5rem, 15vw, 9rem)",
            WebkitTextStroke: "1px rgba(170,255,0,0.035)",
            maskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 88%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 88%)",
          }}
        >
          BUILD PA&apos;L NORTE
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pt-14 pb-0 sm:px-8 sm:pt-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <div className="flex flex-col gap-6 md:col-span-6 lg:col-span-7">
            <Link
              href={memberHomePath(locale)}
              className="group inline-flex items-center gap-3.5 self-start transition-opacity hover:opacity-75"
            >
              <Image
                src={SITE_LOGO}
                alt="Build Pa'l Norte"
                width={38}
                height={38}
                className="rounded-xl"
              />
              <div>
                <p
                  className="text-lg font-black leading-none tracking-tight text-white"
                  style={{ fontFamily: montserrat }}
                >
                  Build Pa&apos;l Norte
                </p>
                <p
                  className="mt-1 text-[10px] tracking-[0.22em] text-white/25"
                  style={{ fontFamily: montserrat }}
                >
                  {members.eyebrow}
                </p>
              </div>
            </Link>

            <p
              className="max-w-xs text-[13px] leading-relaxed text-white/30"
              style={{ fontFamily: outfit }}
            >
              {platformFooter.tagline}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-8 md:col-span-6 lg:col-span-5">
            <div>
              <p
                className="mb-4 text-[9px] font-black tracking-[0.36em] text-white/18"
                style={{ fontFamily: montserrat }}
              >
                {platformFooter.platformHeading}
              </p>
              <nav
                className="flex flex-col gap-0.5"
                aria-label={platformFooter.platformHeading}
              >
                {platformLinks.map((l) => (
                  <FooterNavLink key={l.href} href={l.href} label={l.label} />
                ))}
              </nav>
            </div>

            <div>
              <p
                className="mb-4 text-[9px] font-black tracking-[0.36em] text-white/18"
                style={{ fontFamily: montserrat }}
              >
                {platformFooter.legalHeading}
              </p>
              <nav
                className="flex flex-col gap-0.5"
                aria-label={platformFooter.legalHeading}
              >
                {legalLinks.map((l) => (
                  <FooterNavLink key={l.href} href={l.href} label={l.label} />
                ))}
              </nav>
            </div>
          </div>
        </div>

        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative border-t border-white/[0.05] bg-[#030303]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-5 py-5 text-center sm:flex-row sm:px-8 sm:text-left">
          <p
            className="text-[11px] text-white/20"
            style={{ fontFamily: outfit }}
          >
            © {year} Build Pa&apos;l Norte
          </p>
          <p
            className="text-[10px] tracking-[0.18em] text-white/15"
            style={{ fontFamily: outfit }}
          >
            {platformFooter.madeBy}
          </p>
        </div>
      </div>
    </footer>
  );
}
