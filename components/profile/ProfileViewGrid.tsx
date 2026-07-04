import {
  CalendarIcon,
  DetailRow,
  ExternalLinkIcon,
  GlassCard,
  GithubIcon,
  PhoneIcon,
  SchoolIcon,
  SectionLabel,
  SkillPill,
  UserIcon,
} from "@/components/platform";
import { formatMemberDate, displayValue, parseGithubUrl } from "@/lib/members/shared";
import { outfit } from "@/lib/theme";
import { ProfileTeamStatusCard } from "./ProfileTeamStatusCard";

type ProfileViewLabels = {
  aboutSection: string;
  bioEmpty: string;
  skills: string;
  skillsEmpty: string;
  interests: string;
  detailsSection: string;
  school: string;
  memberSince: string;
  phone: string;
  age: string;
  sex: string;
  openToTeams: string;
  notOpenToTeams: string;
  openToTeamsHint: string;
};

type ProfileViewMember = {
  bio: string | null;
  skills: string[];
  interests: string | null;
  school: string | null;
  createdAt: Date;
  openToTeams: boolean;
  github: string | null;
  phone?: string | null;
  age?: number | null;
  sex?: string | null;
};

type ProfileViewGridProps = {
  member: ProfileViewMember;
  labels: ProfileViewLabels;
  locale: string;
  showPrivateFields?: boolean;
  animationClass?: string;
  className?: string;
};

export function ProfileViewGrid({
  member,
  labels,
  locale,
  showPrivateFields = false,
  animationClass = "auth-item-in-4",
  className = "mt-6",
}: ProfileViewGridProps) {
  const { handle: githubHandle, href: githubHref } = parseGithubUrl(member.github);

  return (
    <div className={`${animationClass} grid gap-4 lg:grid-cols-3 ${className}`}>
      <div className="space-y-4 lg:col-span-2">
        <GlassCard>
          <SectionLabel>{labels.aboutSection}</SectionLabel>
          {member.bio ? (
            <p className="text-sm leading-[1.85] text-white/55" style={{ fontFamily: outfit }}>
              {member.bio}
            </p>
          ) : (
            <p className="text-sm text-white/20" style={{ fontFamily: outfit }}>
              {labels.bioEmpty}
            </p>
          )}
        </GlassCard>

        <GlassCard>
          <SectionLabel>{labels.skills}</SectionLabel>
          {member.skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {member.skills.map((skill) => (
                <SkillPill key={skill} skill={skill} />
              ))}
            </div>
          ) : (
            <p className="text-sm text-white/20" style={{ fontFamily: outfit }}>
              {labels.skillsEmpty}
            </p>
          )}
        </GlassCard>

        {member.interests && (
          <GlassCard>
            <SectionLabel>{labels.interests}</SectionLabel>
            <p className="text-sm leading-[1.85] text-white/55" style={{ fontFamily: outfit }}>
              {member.interests}
            </p>
          </GlassCard>
        )}
      </div>

      <div className="space-y-4">
        <GlassCard>
          <SectionLabel>{labels.detailsSection}</SectionLabel>
          <div className="space-y-4">
            {member.school && (
              <DetailRow
                icon={<SchoolIcon className="h-4 w-4" />}
                label={labels.school}
                value={member.school}
              />
            )}
            <DetailRow
              icon={<CalendarIcon className="h-4 w-4" />}
              label={labels.memberSince}
              value={formatMemberDate(member.createdAt, locale)}
            />
            {showPrivateFields && (
              <DetailRow
                icon={<PhoneIcon className="h-4 w-4" />}
                label={labels.phone}
                value={displayValue(member.phone)}
              />
            )}
            {showPrivateFields && (
              <DetailRow
                icon={<UserIcon className="h-4 w-4" />}
                label={labels.age}
                value={member.age != null ? String(member.age) : "—"}
              />
            )}
            {showPrivateFields && (
              <DetailRow
                icon={<UserIcon className="h-4 w-4" />}
                label={labels.sex}
                value={member.sex ?? "—"}
              />
            )}
            {githubHref && githubHandle && (
              <DetailRow
                icon={<GithubIcon className="h-4 w-4" />}
                label="GITHUB"
                value={
                  <a
                    href={githubHref}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
                  >
                    {githubHandle}
                    <ExternalLinkIcon className="h-3 w-3 opacity-50" />
                  </a>
                }
              />
            )}
          </div>
        </GlassCard>

        <ProfileTeamStatusCard
          openToTeams={member.openToTeams}
          openLabel={labels.openToTeams}
          closedLabel={labels.notOpenToTeams}
          hint={labels.openToTeamsHint}
        />
      </div>
    </div>
  );
}
