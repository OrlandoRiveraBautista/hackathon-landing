"use client";

import { ArrowUpRight, MapPin } from "lucide-react";
import Link from "next/link";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { BrandLogo } from "@/components/BrandLogo";
import { PeserosCredit } from "@/components/PeserosCredit";
import { localizedPath, onsiteSelectionPath } from "@/lib/i18n";
import { montserrat, outfit } from "@/lib/theme";

type SiteFooterProps = {
  onSponsorClick?: () => void;
};

function FooterNavLink({
  href,
  label,
  onClick,
}: {
  href?: string;
  label: string;
  onClick?: () => void;
}) {
  const className =
    "group inline-flex items-center gap-1.5 text-sm text-white/45 transition-colors duration-200 hover:text-[#aaff00]";

  const content = (
    <>
      <span
        className="relative after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-0 after:bg-[#aaff00]/60 after:transition-all after:duration-300 group-hover:after:w-full"
        style={{ fontFamily: outfit }}
      >
        {label}
      </span>
      <ArrowUpRight
        size={13}
        strokeWidth={2.5}
        className="opacity-0 transition-all duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-70"
      />
    </>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={className}>
        {content}
      </button>
    );
  }

  if (href?.startsWith("#")) {
    return (
      <a href={href} className={className}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href ?? "#"} className={className}>
      {content}
    </Link>
  );
}

export function SiteFooter({ onSponsorClick }: SiteFooterProps) {
  const { locale } = useLocale();
  const dictionary = useDictionary();
  const year = new Date().getFullYear();

  const eventLinks = [
    { href: localizedPath(locale, "/login"), label: dictionary.nav.signIn },
    { href: onsiteSelectionPath(locale), label: dictionary.nav.onsite },
    { href: "#about", label: dictionary.nav.about },
    { href: "#highlights", label: dictionary.nav.whyJoin },
    { href: "#how-it-works", label: dictionary.nav.howItWorks },
  ];

  const legalLinks = [
    { href: localizedPath(locale, "/terms"), label: dictionary.footer.terms },
    { href: localizedPath(locale, "/privacy"), label: dictionary.footer.privacy },
  ];

  const sponsorsHref = localizedPath(locale, "/sponsors");

  return (
    <footer className="footer-shell relative overflow-hidden bg-black">
      <div className="footer-shimmer-track pointer-events-none absolute inset-x-0 top-0">
        <div className="footer-shimmer-bar" />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_0%,rgba(170,255,0,0.14)_0%,transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_100%,rgba(0,220,130,0.08)_0%,transparent_60%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(170,255,0,1) 2px, rgba(170,255,0,1) 3px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="pointer-events-none absolute top-0 left-0 h-28 w-28">
        <div className="absolute top-0 left-0 h-px w-20 bg-gradient-to-r from-[#aaff00]/55 to-transparent" />
        <div className="absolute top-0 left-0 h-20 w-px bg-gradient-to-b from-[#aaff00]/55 to-transparent" />
      </div>
      <div className="pointer-events-none absolute top-0 right-0 h-28 w-28">
        <div className="absolute top-0 right-0 h-px w-20 bg-gradient-to-l from-[#aaff00]/55 to-transparent" />
        <div className="absolute top-0 right-0 h-20 w-px bg-gradient-to-b from-[#aaff00]/55 to-transparent" />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden"
      >
        <p
          className="select-none text-[clamp(4rem,18vw,11rem)] leading-[0.85] font-black tracking-[-0.04em] whitespace-nowrap text-transparent"
          style={{
            fontFamily: montserrat,
            WebkitTextStroke: "1px rgba(170,255,0,0.06)",
            maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 85%)",
            WebkitMaskImage:
              "linear-gradient(to bottom, rgba(0,0,0,0.35) 0%, transparent 85%)",
          }}
        >
          BUILD PA&apos;L NORTE
        </p>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pt-16 pb-10 sm:px-6 sm:pt-20 sm:pb-12">
        <div className="mb-12 flex flex-col items-center text-center sm:mb-14">
          <span
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/[0.07] px-4 py-1.5 text-[10px] font-black tracking-[0.35em] text-[#aaff00]"
            style={{ fontFamily: montserrat }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#aaff00] shadow-[0_0_8px_#aaff00]" />
            {dictionary.footer.locationTag}
          </span>
          <p
            className="max-w-md text-sm leading-relaxed text-white/40 sm:text-base"
            style={{ fontFamily: outfit }}
          >
            {dictionary.footer.copyright}
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-12 md:gap-8 lg:gap-12">
          <div className="md:col-span-5 lg:col-span-6">
            <Link
              href={localizedPath(locale)}
              className="group flex items-center gap-3 transition-opacity hover:opacity-90"
            >
              <BrandLogo size={36} />
              <div>
                <p
                  className="text-xl font-black tracking-tight text-white sm:text-2xl"
                  style={{ fontFamily: montserrat }}
                >
                  Build Pa&apos;l Norte
                </p>
                <p
                  className="mt-0.5 flex items-center gap-1.5 text-[11px] tracking-[0.2em] text-white/30"
                  style={{ fontFamily: montserrat }}
                >
                  <MapPin size={11} strokeWidth={2.5} className="text-[#aaff00]/60" />
                  2026
                </p>
              </div>
            </Link>

            <div className="mt-8">
              <PeserosCredit variant="banner" className="w-full sm:max-w-md" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:gap-10 md:col-span-7 lg:col-span-6 lg:grid-cols-2">
            <div>
              <p
                className="mb-5 flex items-center gap-2 text-[10px] font-black tracking-[0.32em] text-white/25"
                style={{ fontFamily: montserrat }}
              >
                <span className="h-px w-4 bg-[#aaff00]/40" />
                {dictionary.footer.eventHeading}
              </p>
              <nav className="flex flex-col gap-3.5" aria-label="Footer event">
                {eventLinks.map((link) => (
                  <FooterNavLink key={link.href} href={link.href} label={link.label} />
                ))}
              </nav>
            </div>

            <div>
              <p
                className="mb-5 flex items-center gap-2 text-[10px] font-black tracking-[0.32em] text-white/25"
                style={{ fontFamily: montserrat }}
              >
                <span className="h-px w-4 bg-[#aaff00]/40" />
                {dictionary.footer.legalHeading}
              </p>
              <nav className="flex flex-col gap-3.5" aria-label="Footer legal">
                {legalLinks.map((item) => (
                  <FooterNavLink key={item.href} href={item.href} label={item.label} />
                ))}
                <FooterNavLink
                  label={dictionary.footer.sponsor}
                  href={onSponsorClick ? undefined : sponsorsHref}
                  onClick={onSponsorClick}
                />
              </nav>
            </div>
          </div>
        </div>

        <div className="relative mt-12 overflow-hidden rounded-2xl sm:mt-14">
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background:
                "linear-gradient(135deg, rgba(170,255,0,0.10) 0%, rgba(0,220,130,0.04) 50%, rgba(170,255,0,0.02) 100%)",
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl border border-[#aaff00]/15"
            style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset" }}
          />
          <div className="relative flex flex-col items-start justify-between gap-4 px-5 py-5 sm:flex-row sm:items-center sm:px-7 sm:py-6">
            <div>
              <p
                className="text-[10px] font-black tracking-[0.3em] text-[#aaff00]/70"
                style={{ fontFamily: montserrat }}
              >
                {dictionary.sponsorsSection.label}
              </p>
              <p
                className="mt-1.5 text-base font-black tracking-tight text-white sm:text-lg"
                style={{ fontFamily: montserrat }}
              >
                {dictionary.sponsorsSection.title}
              </p>
              <p
                className="mt-2 max-w-lg text-xs leading-relaxed text-white/40 sm:text-sm"
                style={{ fontFamily: outfit }}
              >
                {dictionary.sponsorsSection.note}
              </p>
            </div>
            {onSponsorClick ? (
              <button
                type="button"
                onClick={onSponsorClick}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#aaff00]/35 bg-[#aaff00]/10 px-5 py-2.5 text-xs font-black tracking-[0.18em] text-[#aaff00] transition-all duration-200 hover:border-[#aaff00]/60 hover:bg-[#aaff00]/15 hover:shadow-[0_0_24px_rgba(170,255,0,0.15)]"
                style={{ fontFamily: montserrat }}
              >
                {dictionary.footer.sponsor}
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </button>
            ) : (
              <Link
                href={sponsorsHref}
                className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[#aaff00]/35 bg-[#aaff00]/10 px-5 py-2.5 text-xs font-black tracking-[0.18em] text-[#aaff00] transition-all duration-200 hover:border-[#aaff00]/60 hover:bg-[#aaff00]/15 hover:shadow-[0_0_24px_rgba(170,255,0,0.15)]"
                style={{ fontFamily: montserrat }}
              >
                {dictionary.footer.sponsor}
                <ArrowUpRight size={14} strokeWidth={2.5} />
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/[0.06] bg-[#030303]">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/25 to-transparent" />
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:flex-row sm:px-6 sm:text-left">
          <p className="text-xs text-white/25" style={{ fontFamily: outfit }}>
            © {year} Build Pa&apos;l Norte. {dictionary.footer.rightsReserved}
          </p>
          <p
            className="text-[10px] font-black tracking-[0.28em] text-white/20"
            style={{ fontFamily: montserrat }}
          >
            {dictionary.footer.locationTag}
          </p>
        </div>
      </div>
    </footer>
  );
}
