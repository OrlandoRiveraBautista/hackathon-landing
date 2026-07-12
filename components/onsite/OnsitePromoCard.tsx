import type { ReactNode } from "react";
import {
  GlassCard,
  PlatformBadge,
  PlatformLinkButton,
  SectionLabel,
  UsersIcon,
} from "@/components/platform";
import { montserrat, outfit } from "@/lib/theme";

export type OnsitePromoBadge = {
  label: string;
  active?: boolean;
  pulse?: boolean;
};

export type OnsitePromoCardProps = {
  label?: string;
  title: string;
  body: string;
  stat: string;
  cta: string;
  href: string;
  accent?: boolean;
  badges?: OnsitePromoBadge[];
  className?: string;
  ctaIcon?: ReactNode;
};

export function OnsitePromoCard({
  label,
  title,
  body,
  stat,
  cta,
  href,
  accent = true,
  badges = [],
  className = "",
  ctaIcon,
}: OnsitePromoCardProps) {
  return (
    <GlassCard accent={accent} className={className}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          {label && (
            <SectionLabel>{label}</SectionLabel>
          )}

          {badges.length > 0 && (
            <div className="-mt-2 mb-3 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <PlatformBadge
                  key={badge.label}
                  active={badge.active ?? true}
                  pulse={badge.pulse}
                  label={badge.label}
                />
              ))}
            </div>
          )}

          <p
            className="text-sm font-black tracking-tight text-white/90"
            style={{ fontFamily: montserrat }}
          >
            {title}
          </p>

          <p
            className="mt-1.5 text-xs leading-relaxed text-white/35"
            style={{ fontFamily: outfit }}
          >
            {body}
          </p>

          <p
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.14em] text-white/30"
            style={{ fontFamily: montserrat }}
          >
            <UsersIcon className="h-3 w-3 shrink-0 text-[#aaff00]/60" />
            {stat}
          </p>
        </div>

        <PlatformLinkButton
          href={href}
          icon={ctaIcon}
          className="shrink-0 self-start px-5 py-2.5 sm:self-center"
        >
          {cta}
        </PlatformLinkButton>
      </div>
    </GlassCard>
  );
}
