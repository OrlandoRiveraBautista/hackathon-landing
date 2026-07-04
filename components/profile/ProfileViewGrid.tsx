import type { ReactNode } from "react";
import {
  CalendarIcon,
  DetailRow,
  ExternalLinkIcon,
  GlassCard,
  GithubIcon,
  MailIcon,
  PhoneIcon,
  SchoolIcon,
  SectionLabel,
  SkillPill,
  UserIcon,
} from "@/components/platform";
import { displayValue, formatMemberDate, parseGithubUrl } from "@/lib/members/shared";
import { outfit } from "@/lib/theme";
import { ContactVisibilityBadge } from "./ContactVisibilityBadge";
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
  email: string;
  phone: string;
  github: string;
  age: string;
  sex: string;
  openToTeams: string;
  notOpenToTeams: string;
  openToTeamsHint: string;
  contactPublic: string;
  contactPrivate: string;
};

type OwnerContactVisibility = {
  emailPublic: boolean;
  phonePublic: boolean;
};

type ProfileViewMember = {
  bio: string | null;
  skills: string[];
  interests: string | null;
  school: string | null;
  createdAt: Date;
  openToTeams: boolean;
  github: string | null;
  email?: string | null;
  phone?: string | null;
  age?: number | null;
  sex?: string | null;
};

type ProfileViewGridProps = {
  member: ProfileViewMember;
  labels: ProfileViewLabels;
  locale: string;
  showPrivateFields?: boolean;
  ownerContact?: OwnerContactVisibility;
  animationClass?: string;
  className?: string;
};

function withVisibilityBadge(
  value: ReactNode,
  isPublic: boolean,
  publicLabel: string,
  privateLabel: string,
) {
  return (
    <span className="inline-flex flex-wrap items-center gap-2">
      {value}
      <ContactVisibilityBadge
        isPublic={isPublic}
        publicLabel={publicLabel}
        privateLabel={privateLabel}
      />
    </span>
  );
}

export function ProfileViewGrid({
  member,
  labels,
  locale,
  showPrivateFields = false,
  ownerContact,
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
            {ownerContact && member.email && (
              <DetailRow
                icon={<MailIcon className="h-4 w-4" />}
                label={labels.email}
                value={withVisibilityBadge(
                  member.email,
                  ownerContact.emailPublic,
                  labels.contactPublic,
                  labels.contactPrivate,
                )}
              />
            )}
            {ownerContact && (
              <DetailRow
                icon={<PhoneIcon className="h-4 w-4" />}
                label={labels.phone}
                value={withVisibilityBadge(
                  displayValue(member.phone),
                  ownerContact.phonePublic,
                  labels.contactPublic,
                  labels.contactPrivate,
                )}
              />
            )}
            {!ownerContact && member.email && (
              <DetailRow
                icon={<MailIcon className="h-4 w-4" />}
                label={labels.email}
                value={
                  <a
                    href={`mailto:${member.email}`}
                    className="text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
                  >
                    {member.email}
                  </a>
                }
              />
            )}
            {!ownerContact && member.phone && (
              <DetailRow
                icon={<PhoneIcon className="h-4 w-4" />}
                label={labels.phone}
                value={
                  <a
                    href={`tel:${member.phone}`}
                    className="text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
                  >
                    {member.phone}
                  </a>
                }
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
                label={labels.github}
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
