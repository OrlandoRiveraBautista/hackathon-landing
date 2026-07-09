"use client";

import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import {
  ProfileEditForm,
  ProfileHeroCard,
  ProfileViewGrid,
  ContactVisibilityBadge,
  type ProfileFormState,
} from "@/components/profile";
import {
  CalendarIcon,
  CheckIcon,
  FeedbackBanner,
  LogOutIcon,
  MemberAppShell,
  MemberAvatar,
  PencilIcon,
  PlatformBadge,
  PlatformButton,
  PlatformLinkChip,
  PlatformPageFooter,
} from "@/components/platform";
import { authClient } from "@/lib/auth/client";
import { localizedPath, memberHomePath, membersDirectoryPath } from "@/lib/i18n";
import {
  formatMemberDate,
  parseGithubUrl,
  parseMemberFromJson,
  type MemberProfileJson,
} from "@/lib/members/shared";
import type { MemberProfile, PublicMemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";

type MemberProfileScreenProps =
  | {
      isOwnProfile: true;
      member: MemberProfile;
      userImage?: string | null;
    }
  | {
      isOwnProfile: false;
      member: PublicMemberProfile;
      userImage?: null;
    };

function formFromMember(member: MemberProfile): ProfileFormState {
  return {
    school: member.school ?? "",
    github: member.github ?? "",
    interests: member.interests ?? "",
    bio: member.bio ?? "",
    skills: [...member.skills],
    openToTeams: member.openToTeams,
    showEmail: member.showEmail,
    showPhone: member.showPhone,
  };
}

export function MemberProfileScreen(props: MemberProfileScreenProps) {
  if (props.isOwnProfile) {
    return (
      <OwnMemberProfileScreen
        member={props.member}
        userImage={props.userImage}
      />
    );
  }

  return <PublicMemberProfileScreen member={props.member} />;
}

function OwnMemberProfileScreen({
  member: initialMember,
  userImage,
}: {
  member: MemberProfile;
  userImage?: string | null;
}) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { profile, waitlist } = dictionary;
  const [member, setMember] = useState(initialMember);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormState>(() => formFromMember(initialMember));
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const { handle: githubHandle, href: githubHref } = parseGithubUrl(member.github);
  const busy = saving || signingOut;

  function updateForm<K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function startEditing() {
    setForm(formFromMember(member));
    setError("");
    setSuccess("");
    setEditing(true);
  }

  function cancelEditing() {
    setForm(formFromMember(member));
    setError("");
    setSuccess("");
    setEditing(false);
  }

  async function saveProfile() {
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const response = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-locale": locale },
        body: JSON.stringify({
          school: form.school,
          github: form.github,
          interests: form.interests,
          bio: form.bio,
          skills: form.skills,
          openToTeams: form.openToTeams,
          showEmail: form.showEmail,
          showPhone: form.showPhone,
        }),
      });

      const payload = (await response.json()) as {
        member?: MemberProfileJson;
        error?: string;
      };

      if (!response.ok || !payload.member) {
        throw new Error(payload.error ?? profile.errors.saveFailed);
      }

      const parsed = parseMemberFromJson(payload.member);
      setMember(parsed);
      setForm(formFromMember(parsed));
      setSuccess(profile.saveSuccess);
      setEditing(false);
    } catch (saveError) {
      setError(
        saveError instanceof Error ? saveError.message : profile.errors.saveFailed,
      );
    } finally {
      setSaving(false);
    }
  }

  async function signOut() {
    setError("");
    setSuccess("");
    setSigningOut(true);

    try {
      await authClient.signOut();
      window.location.href = localizedPath(locale, "/login");
    } catch {
      setError(profile.signOutFailed);
      setSigningOut(false);
    }
  }

  return (
    <MemberAppShell
      locale={locale}
      eyebrow={profile.eyebrow}
      headerActions={
        <>
          {!editing && (
            <PlatformButton
              onClick={startEditing}
              disabled={busy}
              variant="primary"
              icon={<PencilIcon className="h-3 w-3" />}
            >
              {profile.editProfile}
            </PlatformButton>
          )}
          <PlatformButton
            onClick={signOut}
            disabled={busy}
            variant="ghost"
            icon={<LogOutIcon className="h-3.5 w-3.5" />}
          >
            {signingOut ? profile.signingOut : profile.signOut}
          </PlatformButton>
        </>
      }
    >
      <ProfileHeroCard
        avatar={<MemberAvatar name={member.name} imageUrl={userImage} size="xl" />}
        badges={
          member.openToTeams ? (
            <PlatformBadge active label={profile.openToTeams} />
          ) : undefined
        }
        name={
          <h1
            className="text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: montserrat }}
          >
            {member.name}
          </h1>
        }
        meta={
          <>
            <div className="flex flex-wrap items-center gap-2.5">
              <span
                className="inline-flex flex-wrap items-center gap-2 text-sm text-white/40"
                style={{ fontFamily: outfit }}
              >
                {member.email}
                <ContactVisibilityBadge
                  isPublic={member.showEmail}
                  publicLabel={profile.contactPublic}
                  privateLabel={profile.contactPrivate}
                />
              </span>
              {member.school && (
                <>
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                  <span className="text-sm text-white/40" style={{ fontFamily: outfit }}>
                    {member.school}
                  </span>
                </>
              )}
            </div>
            <p
              className="mt-0.5 flex items-center gap-1.5 text-[11px] text-white/20"
              style={{ fontFamily: outfit }}
            >
              <CalendarIcon className="h-3 w-3" />
              {profile.memberSince} {formatMemberDate(member.createdAt, locale)}
            </p>
          </>
        }
        footer={
          githubHref && githubHandle ? (
            <div className="mt-5">
              <PlatformLinkChip href={githubHref} label={githubHandle} />
            </div>
          ) : undefined
        }
      />

      {error && <FeedbackBanner variant="error" message={error} />}
      {success && (
        <FeedbackBanner
          variant="success"
          message={success}
          icon={<CheckIcon className="mt-0.5 h-4 w-4 flex-shrink-0 text-[#aaff00]" />}
        />
      )}

      {editing ? (
        <ProfileEditForm
          form={form}
          onChange={updateForm}
          labels={{
            school: waitlist.school,
            schoolPlaceholder: waitlist.schoolPlaceholder,
            github: waitlist.github,
            githubPlaceholder: waitlist.githubPlaceholder,
            interests: waitlist.interests,
            interestsPlaceholder: waitlist.interestsPlaceholder,
            bio: profile.bio,
            bioPlaceholder: profile.bioPlaceholder,
            skills: profile.skills,
            skillsPlaceholder: profile.skillsPlaceholder,
            skillsHint: profile.skillsHint,
            openToTeams: profile.openToTeams,
            openToTeamsHint: profile.openToTeamsHint,
            showEmail: profile.showEmail,
            showEmailHint: profile.showEmailHint,
            showPhone: profile.showPhone,
            showPhoneHint: profile.showPhoneHint,
            showPhoneDisabledHint: profile.showPhoneDisabledHint,
            contactVisibilitySection: profile.contactVisibilitySection,
            editSection: profile.editSection,
            saveProfile: profile.saveProfile,
            savingProfile: profile.savingProfile,
            cancelEdit: profile.cancelEdit,
          }}
          hasPhone={Boolean(member.phone?.trim())}
          onSave={saveProfile}
          onCancel={cancelEditing}
          saving={saving}
          disabled={signingOut}
        />
      ) : (
        <ProfileViewGrid
          member={{
            bio: member.bio,
            skills: member.skills,
            interests: member.interests,
            school: member.school,
            createdAt: member.createdAt,
            openToTeams: member.openToTeams,
            github: member.github,
            email: member.email,
            phone: member.phone,
            age: member.age,
            sex: member.sex ? waitlist.sexOptions[member.sex] : null,
          }}
          labels={{
            aboutSection: profile.aboutSection,
            bioEmpty: profile.bioEmpty,
            skills: profile.skills,
            skillsEmpty: profile.skillsEmpty,
            interests: profile.interests,
            detailsSection: profile.detailsSection,
            school: profile.school,
            memberSince: profile.memberSince.toUpperCase(),
            email: profile.email,
            phone: profile.phone,
            github: profile.github,
            age: waitlist.age,
            sex: waitlist.sex,
            openToTeams: profile.openToTeams,
            notOpenToTeams: profile.notOpenToTeams,
            openToTeamsHint: profile.openToTeamsHint,
            contactPublic: profile.contactPublic,
            contactPrivate: profile.contactPrivate,
          }}
          locale={locale}
          showPrivateFields
          ownerContact={{
            emailPublic: member.showEmail,
            phonePublic: member.showPhone,
          }}
        />
      )}

      <PlatformPageFooter
        locale={locale}
        backLabel={profile.backToHome}
        backHref={memberHomePath(locale)}
      />
    </MemberAppShell>
  );
}

function PublicMemberProfileScreen({ member }: { member: PublicMemberProfile }) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { profile } = dictionary;
  const { handle: githubHandle, href: githubHref } = parseGithubUrl(member.github);

  return (
    <MemberAppShell locale={locale} eyebrow={profile.memberEyebrow}>
      <ProfileHeroCard
        avatar={<MemberAvatar name={member.name} imageUrl={member.imageUrl} size="xl" />}
        badges={
          member.openToTeams ? (
            <PlatformBadge active label={profile.openToTeams} pulse />
          ) : (
            <PlatformBadge active={false} label={profile.notOpenToTeams} />
          )
        }
        name={
          <h1
            className="text-3xl font-black tracking-tight text-white sm:text-4xl"
            style={{ fontFamily: montserrat }}
          >
            {member.name}
          </h1>
        }
        meta={
          <div className="flex flex-col gap-1">
            {member.school && (
              <span className="text-sm text-white/40" style={{ fontFamily: outfit }}>
                {member.school}
              </span>
            )}
            <p
              className="flex items-center gap-1.5 text-[11px] text-white/20"
              style={{ fontFamily: outfit }}
            >
              <CalendarIcon className="h-3 w-3" />
              {profile.memberSince} {formatMemberDate(member.createdAt, locale)}
            </p>
          </div>
        }
        footer={
          githubHref && githubHandle ? (
            <div className="mt-5">
              <PlatformLinkChip href={githubHref} label={githubHandle} />
            </div>
          ) : undefined
        }
        animationClass="auth-item-in-1"
      />

      <ProfileViewGrid
        member={{
          bio: member.bio,
          skills: member.skills,
          interests: member.interests,
          school: member.school,
          createdAt: member.createdAt,
          openToTeams: member.openToTeams,
          github: member.github,
          email: member.email,
          phone: member.phone,
        }}
        labels={{
          aboutSection: profile.aboutSection,
          bioEmpty: profile.bioEmpty,
          skills: profile.skills,
          skillsEmpty: profile.skillsEmpty,
          interests: profile.interests,
          detailsSection: profile.detailsSection,
          school: profile.school,
          memberSince: profile.memberSince.toUpperCase(),
          email: profile.email,
          phone: profile.phone,
          github: profile.github,
          age: "",
          sex: "",
          openToTeams: profile.openToTeams,
          notOpenToTeams: profile.notOpenToTeams,
          openToTeamsHint: profile.openToTeamsHint,
          contactPublic: profile.contactPublic,
          contactPrivate: profile.contactPrivate,
        }}
        locale={locale}
        animationClass="auth-item-in-2"
        className="mt-5"
      />

      <PlatformPageFooter
        locale={locale}
        backLabel={profile.backToDirectory}
        backHref={membersDirectoryPath(locale)}
      />
    </MemberAppShell>
  );
}
