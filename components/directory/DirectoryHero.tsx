import { SectionLabel } from "@/components/platform";
import { montserrat, outfit } from "@/lib/theme";

type DirectoryHeroProps = {
  sectionLabel: string;
  title: string;
  subtitle: string;
  statValue: string;
  statSuffix: string;
  isLoadingCount?: boolean;
  loadingLabel?: string;
  query?: string;
  showingResultsFor?: string;
  searchHint: string;
};

export function DirectoryHero({
  sectionLabel,
  title,
  subtitle,
  statValue,
  statSuffix,
  isLoadingCount = false,
  loadingLabel,
  query,
  showingResultsFor,
  searchHint,
}: DirectoryHeroProps) {
  const trimmedQuery = query?.trim();

  return (
    <div className="auth-item-in-1 relative mb-8 overflow-hidden rounded-3xl">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(170,255,0,0.10) 0%, rgba(0,220,130,0.05) 38%, rgba(5,5,5,0) 72%)",
        }}
      />
      <div
        className="absolute inset-0 rounded-3xl"
        style={{
          border: "1px solid rgba(170,255,0,0.08)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.03) inset, 0 24px 80px rgba(0,0,0,0.55)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 rounded-3xl opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(rgba(170,255,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(170,255,0,0.6) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative px-6 py-7 sm:px-8 sm:py-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0 max-w-2xl">
            <SectionLabel>{sectionLabel}</SectionLabel>
            <h1
              className="text-3xl font-black tracking-tight text-white sm:text-4xl"
              style={{ fontFamily: montserrat }}
            >
              {title}
            </h1>
            <p
              className="mt-3 text-sm leading-relaxed text-white/45"
              style={{ fontFamily: outfit }}
            >
              {subtitle}
            </p>
            <p
              className="mt-4 text-[11px] text-white/25"
              style={{ fontFamily: outfit }}
            >
              {searchHint}
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-start gap-3 lg:items-end">
            <div
              className="rounded-2xl border border-white/[0.08] bg-black/20 px-5 py-4 text-left lg:min-w-[132px] lg:text-right"
              style={{
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.03) inset",
              }}
            >
              <p
                className="text-[9px] font-black tracking-[0.28em] text-white/25"
                style={{ fontFamily: montserrat }}
              >
                {isLoadingCount && loadingLabel
                  ? loadingLabel.toUpperCase()
                  : statSuffix.toUpperCase()}
              </p>
              <p
                className={`mt-1 text-3xl font-black tracking-tight ${
                  isLoadingCount ? "text-white/20" : "text-[#aaff00]"
                }`}
                style={{ fontFamily: montserrat }}
              >
                {isLoadingCount ? "—" : statValue}
              </p>
            </div>

            {trimmedQuery && showingResultsFor && (
              <span
                className="inline-flex max-w-full items-center rounded-full border border-[#aaff00]/20 bg-[#aaff00]/[0.06] px-3.5 py-1.5 text-[11px] font-medium text-[#aaff00]/85"
                style={{ fontFamily: outfit }}
              >
                <span className="truncate">
                  {showingResultsFor.replace("{query}", trimmedQuery)}
                </span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
