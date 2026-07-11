"use client";

import { useState } from "react";
import {
  MemberEventCard,
  MemberProfileCompletion,
  MemberQuickActions,
  MemberWelcomeHero,
} from "@/components/home";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import {
  GithubIcon,
  LogOutIcon,
  MemberAppShell,
  MemberAvatar,
  PlatformButton,
  PlatformPageFooter,
  SkillPill,
  UserIcon,
  UsersIcon,
} from "@/components/platform";
import { authClient } from "@/lib/auth/client";
import { getEventCopy, getEventStartDate } from "@/lib/event";
import { localizedPath, memberProfilePath, memberTeamPath, membersDirectoryPath } from "@/lib/i18n";
import { getProfileCompletion, parseGithubUrl } from "@/lib/members/shared";
import type { MemberProfile } from "@/lib/members/types";

type MemberHomeScreenProps = {
  member: MemberProfile;
  userImage?: string | null;
};

// July 25, 2026 10:00 AM (Matamoros, UTC-6)
const EVENT_DATE = getEventStartDate();

export function MemberHomeScreen({ member, userImage }: MemberHomeScreenProps) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { members, profile } = dictionary;
  const event = getEventCopy(locale);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");

  const completion = getProfileCompletion(member);
  const profileHref = memberProfilePath(locale, member.userId);
  const { handle: githubHandle } = parseGithubUrl(member.github);

  const completionItems = [
    { id: "github", label: members.profileCompletion.items.github, done: completion.items.github },
    { id: "bio", label: members.profileCompletion.items.bio, done: completion.items.bio },
    { id: "skills", label: members.profileCompletion.items.skills, done: completion.items.skills },
    { id: "interests", label: members.profileCompletion.items.interests, done: completion.items.interests },
  ];

  const quickActions = members.quickActions.items.map((item) => {
    const icons = {
      profile: <UserIcon className="h-5 w-5" />,
      directory: <UsersIcon className="h-5 w-5" />,
      team: <UsersIcon className="h-5 w-5" />,
      submit: <GithubIcon className="h-5 w-5" />,
    } as const;

    return {
      id: item.id,
      title: item.title,
      description: item.description,
      icon: icons[item.id],
      href:
        item.id === "profile"
          ? profileHref
          : item.id === "directory"
            ? membersDirectoryPath(locale)
            : item.id === "team"
              ? memberTeamPath(locale)
              : undefined,
      comingSoon: item.id === "submit" ? item.comingSoon : false,
    };
  });

  async function signOut() {
    setError("");
    setSigningOut(true);
    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setError(members.signOutFailed);
      setSigningOut(false);
    }
  }

  return (
    <MemberAppShell
      locale={locale}
      eyebrow={members.eyebrow}
      maxWidth="6xl"
      headerActions={
        <PlatformButton
          onClick={signOut}
          disabled={signingOut}
          variant="ghost"
          icon={<LogOutIcon className="h-3.5 w-3.5" />}
        >
          {signingOut ? members.signingOut : members.signOut}
        </PlatformButton>
      }
    >
      {/* Hero */}
      <MemberWelcomeHero
        avatar={<MemberAvatar name={member.name} imageUrl={userImage} size="lg" />}
        title={members.title.replace("{name}", member.name.split(" ")[0] ?? member.name)}
        subtitle={members.subtitle}
        openToTeams={member.openToTeams}
        openToTeamsLabel={profile.openToTeams}
        githubHandle={githubHandle}
      />

      {/* Skills strip */}
      {member.skills.length > 0 && (
        <div className="auth-item-in-2 mb-8 flex flex-wrap gap-2">
          {[...new Set(member.skills)].map((skill) => (
            <SkillPill key={skill} skill={skill} />
          ))}
        </div>
      )}

      {/* Two-col info row */}
      <div className="grid gap-4 sm:grid-cols-2">
        <MemberEventCard
          label={members.event.label}
          title={members.event.title}
          dates={event.dateRangeWithYear}
          venue={event.venueShort}
          schedule={event.scheduleLine}
          targetDate={EVENT_DATE}
          countdownLabel={members.event.countdown}
        />

        <MemberProfileCompletion
          label={members.profileCompletion.label}
          title={members.profileCompletion.title}
          subtitle={members.profileCompletion.subtitle}
          completeLabel={members.profileCompletion.completeLabel}
          editLabel={members.profileCompletion.editLabel}
          items={completionItems}
          percent={completion.percent}
          editHref={profileHref}
        />
      </div>

      {/* Quick actions */}
      <MemberQuickActions
        label={members.quickActions.label}
        actions={quickActions}
        comingSoonLabel={members.comingSoon}
        openLabel={members.quickActions.openLabel}
      />

      {error && <p className="mt-4 text-sm text-red-400">{error}</p>}

      <PlatformPageFooter locale={locale} backLabel={members.backToHome} />
    </MemberAppShell>
  );
}
