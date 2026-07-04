import {
  GlassCard,
  SectionLabel,
  UsersIcon,
} from "@/components/platform";
import { outfit } from "@/lib/theme";

type ProfileTeamStatusCardProps = {
  openToTeams: boolean;
  openLabel: string;
  closedLabel: string;
  hint?: string;
};

export function ProfileTeamStatusCard({
  openToTeams,
  openLabel,
  closedLabel,
  hint,
}: ProfileTeamStatusCardProps) {
  return (
    <GlassCard accent={openToTeams}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 flex-shrink-0 ${openToTeams ? "text-[#aaff00]" : "text-white/20"}`}>
          <UsersIcon className="h-4 w-4" />
        </div>
        <div>
          <p
            className={`text-sm font-semibold ${openToTeams ? "text-[#aaff00]/85" : "text-white/30"}`}
            style={{ fontFamily: outfit }}
          >
            {openToTeams ? openLabel : closedLabel}
          </p>
          {openToTeams && hint && (
            <p className="mt-1 text-xs text-white/30" style={{ fontFamily: outfit }}>
              {hint}
            </p>
          )}
        </div>
      </div>
    </GlassCard>
  );
}
