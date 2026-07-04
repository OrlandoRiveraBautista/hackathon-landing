import type { ReactNode } from "react";
import { GithubIcon, PlatformBadge } from "@/components/platform";
import { montserrat, outfit } from "@/lib/theme";

type MemberWelcomeHeroProps = {
  avatar: ReactNode;
  title: string;
  subtitle: string;
  openToTeams?: boolean;
  openToTeamsLabel?: string;
  githubHandle?: string | null;
};

export function MemberWelcomeHero({
  avatar,
  title,
  subtitle,
  openToTeams,
  openToTeamsLabel,
  githubHandle,
}: MemberWelcomeHeroProps) {
  return (
    <div className="auth-item-in-1 relative mb-8 overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(170,255,0,0.12) 0%, rgba(0,220,130,0.06) 40%, rgba(5,5,5,0) 70%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          border: "1px solid rgba(170,255,0,0.10)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03) inset, 0 24px 80px rgba(0,0,0,0.55)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(rgba(170,255,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.6) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative flex flex-col gap-6 px-6 py-7 sm:flex-row sm:items-center sm:gap-8 sm:px-8 sm:py-8">
        <div className="relative flex-shrink-0">
          <div
            className="absolute -inset-1.5 rounded-2xl opacity-40"
            style={{
              background:
                "radial-gradient(circle, rgba(170,255,0,0.5) 0%, transparent 70%)",
              filter: "blur(10px)",
            }}
          />
          <div className="relative">{avatar}</div>
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-2">
            {openToTeams && openToTeamsLabel && (
              <PlatformBadge active label={openToTeamsLabel} pulse />
            )}
            {githubHandle && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.04] px-3 py-1 text-[10px] font-medium tracking-wide text-white/40"
                style={{ fontFamily: outfit }}
              >
                <GithubIcon className="h-3 w-3" />
                @{githubHandle}
              </span>
            )}
          </div>

          <h1
            className="text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: montserrat }}
          >
            {title}
          </h1>
          <p
            className="mt-2.5 max-w-lg text-sm leading-relaxed text-white/45"
            style={{ fontFamily: outfit }}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
