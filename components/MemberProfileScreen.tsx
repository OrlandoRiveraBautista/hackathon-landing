"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { authClient } from "@/lib/auth/client";
import { SITE_LOGO } from "@/lib/brand";
import { localizedPath, type Locale } from "@/lib/i18n";
import {
  displayValue,
  formatMemberDate,
  parseMemberFromJson,
  skillsFromInput,
  skillsToInput,
  type MemberProfileJson,
} from "@/lib/members/shared";
import type { MemberProfile, PublicMemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";
import type { WaitlistStatus } from "@/lib/waitlist-status";

type MemberProfileScreenProps =
  | {
      isOwnProfile: true;
      member: MemberProfile;
      waitlistStatus: WaitlistStatus;
      userImage?: string | null;
    }
  | {
      isOwnProfile: false;
      member: PublicMemberProfile;
      waitlistStatus: null;
      userImage?: null;
    };

type ProfileFormState = {
  school: string;
  github: string;
  interests: string;
  bio: string;
  skills: string;
  openToTeams: boolean;
};

function formFromMember(member: MemberProfile): ProfileFormState {
  return {
    school: member.school ?? "",
    github: member.github ?? "",
    interests: member.interests ?? "",
    bio: member.bio ?? "",
    skills: skillsToInput(member.skills),
    openToTeams: member.openToTeams,
  };
}

function ProfileInput({
  label,
  value,
  onChange,
  placeholder,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  multiline?: boolean;
}) {
  const inputClass =
    "mt-1.5 w-full rounded-lg border border-white/10 bg-[#0a0a0a] px-3 py-2.5 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-[#aaff00]/40";

  return (
    <label className="block rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
      <span
        className="text-[10px] font-black tracking-[0.22em] text-white/35"
        style={{ fontFamily: montserrat }}
      >
        {label}
      </span>
      {multiline ? (
        <textarea
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`${inputClass} min-h-[96px] resize-y`}
          style={{ fontFamily: outfit }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputClass}
          style={{ fontFamily: outfit }}
        />
      )}
    </label>
  );
}

function GithubIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function ExternalLinkIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M6 3H3a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-3M9 2h5m0 0v5m0-5L7 10" />
    </svg>
  );
}

function ShimmerButton({
  onClick,
  disabled,
  children,
  variant = "ghost",
  className = "",
  fontFamily,
}: {
  onClick?: () => void;
  disabled?: boolean;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "muted";
  className?: string;
  fontFamily?: string;
}) {
  const base =
    "group relative cursor-pointer overflow-hidden rounded-full px-4 py-2 text-xs font-black tracking-[0.12em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60";

  const variants = {
    primary:
      "border border-[#aaff00]/35 bg-[#aaff00]/10 text-[#aaff00] hover:border-[#aaff00]/60 hover:bg-[#aaff00]/18 hover:shadow-[0_0_16px_rgba(170,255,0,0.12)]",
    ghost:
      "border border-white/10 bg-white/[0.04] text-white/60 hover:border-white/20 hover:text-white/80",
    muted:
      "border border-white/8 bg-transparent text-white/40 hover:border-white/15 hover:text-white/60",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      style={fontFamily ? { fontFamily } : undefined}
    >
      <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/8 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
      <span className="relative">{children}</span>
    </button>
  );
}

function ProfileBackground() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="auth-blob-1 absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full opacity-22"
        style={{
          background:
            "radial-gradient(circle, rgba(170,255,0,0.55) 0%, rgba(100,200,0,0.2) 45%, transparent 70%)",
          filter: "blur(72px)",
        }}
      />
      <div
        className="auth-blob-2 absolute top-1/2 -right-32 h-[440px] w-[440px] rounded-full opacity-12"
        style={{
          background:
            "radial-gradient(circle, rgba(0,220,130,0.6) 0%, rgba(0,180,100,0.2) 50%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />
      <div
        className="auth-blob-3 absolute -bottom-32 left-1/3 h-[380px] w-[380px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle, rgba(170,255,0,0.4) 0%, rgba(50,150,0,0.15) 55%, transparent 72%)",
          filter: "blur(60px)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />
    </div>
  );
}

function ProfileHeader({
  locale,
  eyebrow,
  rightSlot,
}: {
  locale: Locale;
  eyebrow: string;
  rightSlot?: React.ReactNode;
}) {
  return (
    <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/8 px-5 py-4 sm:px-8">
      <Link
        href={localizedPath(locale)}
        className="flex items-center gap-3 transition-opacity hover:opacity-80"
      >
        <Image
          src={SITE_LOGO}
          alt="Build Pa'l Norte"
          width={36}
          height={36}
          className="rounded-lg shadow-[0_0_20px_rgba(170,255,0,0.3)]"
        />
        <div className="hidden sm:block">
          <p
            className="text-sm font-black tracking-tight"
            style={{ fontFamily: montserrat }}
          >
            Build Pa&apos;l Norte
          </p>
          <p
            className="text-[11px] text-white/40"
            style={{ fontFamily: outfit }}
          >
            {eyebrow}
          </p>
        </div>
      </Link>
      {rightSlot && <div className="flex items-center gap-2">{rightSlot}</div>}
    </header>
  );
}

function AvatarBlock({
  name,
  userImage,
  size = "lg",
}: {
  name: string;
  userImage?: string | null;
  size?: "lg" | "xl";
}) {
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join("");

  const dim = size === "xl" ? "h-28 w-28" : "h-20 w-20";
  const textSize = size === "xl" ? "text-3xl" : "text-2xl";

  if (userImage) {
    return (
      <div className={`relative z-10 shrink-0 overflow-hidden rounded-2xl bg-[#0a0a0a] ${dim}`}>
        <img
          src={userImage}
          alt={name}
          width={size === "xl" ? 112 : 80}
          height={size === "xl" ? 112 : 80}
          className={`${dim} border-2 border-white/10 object-cover shadow-[0_0_32px_rgba(170,255,0,0.18)]`}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative z-10 shrink-0 ${dim} flex items-center justify-center rounded-2xl border-2 border-[#aaff00]/25 bg-gradient-to-br from-[#aaff00]/20 to-[#00dc82]/10 ${textSize} font-black text-[#aaff00] shadow-[0_0_32px_rgba(170,255,0,0.18)]`}
      style={{ fontFamily: montserrat }}
    >
      {initials}
    </div>
  );
}

function ProfileHeroCover() {
  return (
    <div
      className="relative z-0 h-28 w-full overflow-hidden sm:h-32"
      style={{
        background:
          "linear-gradient(135deg, rgba(170,255,0,0.18) 0%, rgba(0,220,130,0.10) 40%, rgba(5,5,5,0) 100%)",
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(170,255,0,0.7) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />
      <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-[#0a0a0a] sm:h-14" />
    </div>
  );
}

function SkillPill({ skill }: { skill: string }) {
  return (
    <span
      className="inline-flex items-center rounded-lg border border-white/10 bg-white/[0.05] px-3 py-1 text-[11px] font-semibold text-white/70 transition-colors hover:border-[#aaff00]/30 hover:bg-[#aaff00]/8 hover:text-[#aaff00]"
      style={{ fontFamily: outfit }}
    >
      {skill}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <p
        className="text-[10px] font-black tracking-[0.22em] text-white/25"
        style={{ fontFamily: montserrat }}
      >
        {children}
      </p>
      <div className="h-px flex-1 bg-white/[0.06]" />
    </div>
  );
}

export function MemberProfileScreen(props: MemberProfileScreenProps) {
  if (props.isOwnProfile) {
    return (
      <OwnMemberProfileScreen
        member={props.member}
        waitlistStatus={props.waitlistStatus}
        userImage={props.userImage}
      />
    );
  }

  return <PublicMemberProfileScreen member={props.member} />;
}

function OwnMemberProfileScreen({
  member: initialMember,
  waitlistStatus,
  userImage,
}: {
  member: MemberProfile;
  waitlistStatus: WaitlistStatus;
  userImage?: string | null;
}) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { profile, waitlist } = dictionary;
  const [member, setMember] = useState(initialMember);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<ProfileFormState>(() =>
    formFromMember(initialMember),
  );
  const [saving, setSaving] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const statusLabel =
    waitlistStatus === "contacted"
      ? profile.statusContacted
      : profile.statusPending;

  const githubHandle = member.github
    ? member.github.replace(/^https?:\/\/(www\.)?github\.com\//, "").replace(/^@/, "")
    : null;
  const githubHref = githubHandle ? `https://github.com/${githubHandle}` : undefined;

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
        headers: {
          "Content-Type": "application/json",
          "x-locale": locale,
        },
        body: JSON.stringify({
          school: form.school,
          github: form.github,
          interests: form.interests,
          bio: form.bio,
          skills: skillsFromInput(form.skills),
          openToTeams: form.openToTeams,
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
        saveError instanceof Error
          ? saveError.message
          : profile.errors.saveFailed,
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
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#050505] text-white">
      <ProfileBackground />

      <ProfileHeader
        locale={locale}
        eyebrow={profile.eyebrow}
        rightSlot={
          <>
            {!editing && (
              <ShimmerButton
                onClick={startEditing}
                disabled={saving || signingOut}
                variant="primary"
                fontFamily={montserrat}
              >
                {profile.editProfile}
              </ShimmerButton>
            )}
            <ShimmerButton
              onClick={signOut}
              disabled={signingOut || saving}
              variant="ghost"
              fontFamily={montserrat}
            >
              {signingOut ? profile.signingOut : profile.signOut}
            </ShimmerButton>
          </>
        }
      />

      <div className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 sm:py-12">

        {/* ── Hero card ── */}
        <div className="auth-item-in-1 relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/30 to-transparent" />
          <ProfileHeroCover />

          <div className="relative z-10 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-10 mb-5 flex items-end justify-between sm:-mt-12">
              <AvatarBlock name={member.name} userImage={userImage} size="xl" />
              <div className="flex flex-wrap items-center gap-2 pb-1">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-[10px] font-black tracking-[0.18em] ${
                    waitlistStatus === "contacted"
                      ? "border-[#aaff00]/25 bg-[#aaff00]/8 text-[#aaff00]"
                      : "border-white/10 bg-white/[0.03] text-white/40"
                  }`}
                  style={{ fontFamily: montserrat }}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      waitlistStatus === "contacted" ? "bg-[#aaff00]" : "bg-white/25"
                    }`}
                  />
                  {statusLabel}
                </span>
                {member.openToTeams && (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#aaff00]/20 bg-[#aaff00]/6 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-[#aaff00]/80"
                    style={{ fontFamily: montserrat }}
                  >
                    {profile.openToTeams}
                  </span>
                )}
              </div>
            </div>

            <h1
              className="text-2xl font-black tracking-tight sm:text-3xl"
              style={{ fontFamily: montserrat }}
            >
              {member.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <p className="text-sm text-white/35" style={{ fontFamily: outfit }}>
                {member.email}
              </p>
              {member.school && (
                <>
                  <span className="text-white/15">·</span>
                  <p className="text-sm text-white/35" style={{ fontFamily: outfit }}>
                    {member.school}
                  </p>
                </>
              )}
            </div>
            <p className="mt-0.5 text-[11px] text-white/20" style={{ fontFamily: outfit }}>
              {profile.memberSince} {formatMemberDate(member.createdAt, locale)}
            </p>

            {githubHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm text-white/50 transition-all duration-200 hover:border-[#aaff00]/25 hover:bg-[#aaff00]/5 hover:text-white/80"
                style={{ fontFamily: outfit }}
              >
                <GithubIcon className="h-3.5 w-3.5 flex-shrink-0 transition-colors group-hover:text-[#aaff00]" />
                <span>{githubHandle}</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* ── Feedback banners ── */}
        {error && (
          <div className="auth-item-in-3 mt-4 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}
        {success && (
          <div className="auth-item-in-3 mt-4 flex items-start gap-2.5 rounded-xl border border-[#aaff00]/20 bg-[#aaff00]/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#aaff00]" />
            <p className="text-sm text-[#aaff00]">{success}</p>
          </div>
        )}

        {editing ? (
          /* ── Edit form ── */
          <section className="auth-item-in-4 mt-6 space-y-3">
            <ProfileInput
              label={waitlist.school}
              value={form.school}
              onChange={(v) => setForm((s) => ({ ...s, school: v }))}
              placeholder={waitlist.schoolPlaceholder}
            />
            <ProfileInput
              label={waitlist.github}
              value={form.github}
              onChange={(v) => setForm((s) => ({ ...s, github: v }))}
              placeholder={waitlist.githubPlaceholder}
            />
            <ProfileInput
              label={waitlist.interests}
              value={form.interests}
              onChange={(v) => setForm((s) => ({ ...s, interests: v }))}
              placeholder={waitlist.interestsPlaceholder}
            />
            <ProfileInput
              label={profile.bio}
              value={form.bio}
              onChange={(v) => setForm((s) => ({ ...s, bio: v }))}
              placeholder={profile.bioPlaceholder}
              multiline
            />
            <ProfileInput
              label={profile.skills}
              value={form.skills}
              onChange={(v) => setForm((s) => ({ ...s, skills: v }))}
              placeholder={profile.skillsPlaceholder}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <input
                type="checkbox"
                checked={form.openToTeams}
                onChange={(e) =>
                  setForm((s) => ({ ...s, openToTeams: e.target.checked }))
                }
                className="mt-0.5 h-4 w-4 rounded border-white/20 bg-transparent accent-[#aaff00]"
              />
              <span>
                <span
                  className="block text-[10px] font-black tracking-[0.22em] text-white/35"
                  style={{ fontFamily: montserrat }}
                >
                  {profile.openToTeams}
                </span>
                <span
                  className="mt-1 block text-sm text-white/55"
                  style={{ fontFamily: outfit }}
                >
                  {profile.openToTeamsHint}
                </span>
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <ShimmerButton
                onClick={saveProfile}
                disabled={saving || signingOut}
                variant="primary"
                className="px-6 py-2.5"
                fontFamily={montserrat}
              >
                {saving ? profile.savingProfile : profile.saveProfile}
              </ShimmerButton>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving || signingOut}
                className="cursor-pointer text-sm text-white/35 transition-colors hover:text-white/70 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: outfit }}
              >
                {profile.cancelEdit}
              </button>
            </div>
          </section>
        ) : (
          /* ── Profile view ── */
          <div className="auth-item-in-4 mt-6 grid gap-3 lg:grid-cols-3">

            {/* Left column */}
            <div className="space-y-3 lg:col-span-2">

              {/* Bio */}
              <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
                <SectionLabel>{profile.aboutSection}</SectionLabel>
                {member.bio ? (
                  <p
                    className="text-sm leading-[1.75] text-white/60"
                    style={{ fontFamily: outfit }}
                  >
                    {member.bio}
                  </p>
                ) : (
                  <p
                    className="text-sm text-white/20"
                    style={{ fontFamily: outfit }}
                  >
                    {profile.bioEmpty}
                  </p>
                )}
              </div>

              {/* Skills */}
              <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
                <SectionLabel>{profile.skills}</SectionLabel>
                {member.skills.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill) => (
                      <SkillPill key={skill} skill={skill} />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-white/20" style={{ fontFamily: outfit }}>
                    {profile.skillsEmpty}
                  </p>
                )}
              </div>

              {/* Interests */}
              {member.interests && (
                <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
                  <SectionLabel>{profile.interests}</SectionLabel>
                  <p
                    className="text-sm leading-[1.75] text-white/60"
                    style={{ fontFamily: outfit }}
                  >
                    {member.interests}
                  </p>
                </div>
              )}
            </div>

            {/* Right column */}
            <div className="space-y-3">
              <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
                <SectionLabel>{profile.detailsSection}</SectionLabel>
                <dl className="space-y-3.5">
                  {member.school && (
                    <div>
                      <dt
                        className="text-[10px] font-black tracking-[0.16em] text-white/25"
                        style={{ fontFamily: montserrat }}
                      >
                        {profile.school}
                      </dt>
                      <dd className="mt-0.5 text-sm text-white/55" style={{ fontFamily: outfit }}>
                        {member.school}
                      </dd>
                    </div>
                  )}
                  <div>
                    <dt
                      className="text-[10px] font-black tracking-[0.16em] text-white/25"
                      style={{ fontFamily: montserrat }}
                    >
                      {waitlist.phone}
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/55" style={{ fontFamily: outfit }}>
                      {displayValue(member.phone)}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className="text-[10px] font-black tracking-[0.16em] text-white/25"
                      style={{ fontFamily: montserrat }}
                    >
                      {waitlist.age}
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/55" style={{ fontFamily: outfit }}>
                      {member.age != null ? String(member.age) : "—"}
                    </dd>
                  </div>
                  <div>
                    <dt
                      className="text-[10px] font-black tracking-[0.16em] text-white/25"
                      style={{ fontFamily: montserrat }}
                    >
                      {waitlist.sex}
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/55" style={{ fontFamily: outfit }}>
                      {member.sex ? waitlist.sexOptions[member.sex] : "—"}
                    </dd>
                  </div>
                </dl>
              </div>

              {/* Team status */}
              <div className={`rounded-xl border p-5 ${member.openToTeams ? "border-[#aaff00]/12 bg-[#aaff00]/[0.03]" : "border-white/6 bg-white/[0.015]"}`}>
                <div className="flex items-center gap-2.5">
                  <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${member.openToTeams ? "bg-[#aaff00]" : "bg-white/15"}`} />
                  <p
                    className={`text-sm ${member.openToTeams ? "text-[#aaff00]/80" : "text-white/30"}`}
                    style={{ fontFamily: outfit }}
                  >
                    {member.openToTeams ? profile.openToTeams : profile.notOpenToTeams}
                  </p>
                </div>
                {member.openToTeams && (
                  <p className="mt-2 pl-4 text-xs text-white/30" style={{ fontFamily: outfit }}>
                    {profile.openToTeamsHint}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="auth-item-in-4 mt-10 border-t border-white/6 pt-8">
          <Link
            href={localizedPath(locale)}
            className="text-sm text-white/30 transition-colors duration-200 hover:text-white/60"
            style={{ fontFamily: outfit }}
          >
            {profile.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}

function PublicMemberProfileScreen({
  member,
}: {
  member: PublicMemberProfile;
}) {
  const dictionary = useDictionary();
  const { locale } = useLocale();
  const { profile } = dictionary;

  const githubHandle = member.github
    ? member.github
        .replace(/^https?:\/\/(www\.)?github\.com\//, "")
        .replace(/^@/, "")
    : null;
  const githubHref = githubHandle
    ? `https://github.com/${githubHandle}`
    : undefined;

  return (
    <main className="relative flex min-h-[100dvh] flex-col overflow-hidden bg-[#050505] text-white">
      <ProfileBackground />

      <ProfileHeader locale={locale} eyebrow={profile.memberEyebrow} />

      <div className="relative z-10 mx-auto w-full max-w-4xl flex-1 px-5 py-8 sm:px-8 sm:py-12">

        {/* ── Hero card ── */}
        <div className="auth-item-in-1 relative overflow-hidden rounded-2xl border border-white/8 bg-[#0a0a0a] shadow-[0_8px_40px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.04)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#aaff00]/30 to-transparent" />
          <ProfileHeroCover />

          <div className="relative z-10 px-6 pb-6 sm:px-8 sm:pb-8">
            <div className="-mt-10 mb-5 flex items-end justify-between sm:-mt-12">
              <AvatarBlock name={member.name} size="xl" />
              <div className="flex flex-wrap items-center gap-2 pb-1">
                {member.openToTeams ? (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border border-[#aaff00]/20 bg-[#aaff00]/6 px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-[#aaff00]/80"
                    style={{ fontFamily: montserrat }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
                    {profile.openToTeams}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-black tracking-[0.18em] text-white/25"
                    style={{ fontFamily: montserrat }}
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
                    {profile.notOpenToTeams}
                  </span>
                )}
              </div>
            </div>

            <h1
              className="text-2xl font-black tracking-tight sm:text-3xl"
              style={{ fontFamily: montserrat }}
            >
              {member.name}
            </h1>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              {member.school && (
                <p className="text-sm text-white/35" style={{ fontFamily: outfit }}>
                  {member.school}
                </p>
              )}
              <p className="text-[11px] text-white/20" style={{ fontFamily: outfit }}>
                {profile.memberSince} {formatMemberDate(member.createdAt, locale)}
              </p>
            </div>

            {githubHref && (
              <a
                href={githubHref}
                target="_blank"
                rel="noreferrer"
                className="group mt-4 inline-flex items-center gap-2 rounded-lg border border-white/8 bg-white/[0.03] px-3 py-1.5 text-sm text-white/50 transition-all duration-200 hover:border-[#aaff00]/25 hover:bg-[#aaff00]/5 hover:text-white/80"
                style={{ fontFamily: outfit }}
              >
                <GithubIcon className="h-3.5 w-3.5 flex-shrink-0 transition-colors group-hover:text-[#aaff00]" />
                <span>{githubHandle}</span>
                <ExternalLinkIcon className="h-3 w-3 opacity-40 transition-opacity group-hover:opacity-70" />
              </a>
            )}
          </div>
        </div>

        {/* ── Content grid ── */}
        <div className="auth-item-in-2 mt-5 grid gap-3 lg:grid-cols-3">

          {/* Left — About */}
          <div className="space-y-3 lg:col-span-2">

            <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
              <SectionLabel>{profile.aboutSection}</SectionLabel>
              {member.bio ? (
                <p className="text-sm leading-[1.75] text-white/60" style={{ fontFamily: outfit }}>
                  {member.bio}
                </p>
              ) : (
                <p className="text-sm text-white/20" style={{ fontFamily: outfit }}>
                  {profile.bioEmpty}
                </p>
              )}
            </div>

            <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
              <SectionLabel>{profile.skills}</SectionLabel>
              {member.skills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {member.skills.map((skill) => (
                    <SkillPill key={skill} skill={skill} />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-white/20" style={{ fontFamily: outfit }}>
                  {profile.skillsEmpty}
                </p>
              )}
            </div>

            {member.interests && (
              <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
                <SectionLabel>{profile.interests}</SectionLabel>
                <p className="text-sm leading-[1.75] text-white/60" style={{ fontFamily: outfit }}>
                  {member.interests}
                </p>
              </div>
            )}
          </div>

          {/* Right — Details */}
          <div className="space-y-3">
            <div className="rounded-xl border border-white/6 bg-white/[0.015] p-5">
              <SectionLabel>{profile.detailsSection}</SectionLabel>
              <dl className="space-y-3.5">
                {member.school && (
                  <div>
                    <dt className="text-[10px] font-black tracking-[0.16em] text-white/25" style={{ fontFamily: montserrat }}>
                      {profile.school}
                    </dt>
                    <dd className="mt-0.5 text-sm text-white/55" style={{ fontFamily: outfit }}>
                      {member.school}
                    </dd>
                  </div>
                )}
                {githubHref && (
                  <div>
                    <dt className="text-[10px] font-black tracking-[0.16em] text-white/25" style={{ fontFamily: montserrat }}>
                      GITHUB
                    </dt>
                    <dd className="mt-0.5">
                      <a
                        href={githubHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
                        style={{ fontFamily: outfit }}
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        {githubHandle}
                      </a>
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className={`rounded-xl border p-5 ${member.openToTeams ? "border-[#aaff00]/12 bg-[#aaff00]/[0.03]" : "border-white/6 bg-white/[0.015]"}`}>
              <div className="flex items-center gap-2.5">
                <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full ${member.openToTeams ? "bg-[#aaff00]" : "bg-white/15"}`} />
                <p
                  className={`text-sm ${member.openToTeams ? "text-[#aaff00]/80" : "text-white/30"}`}
                  style={{ fontFamily: outfit }}
                >
                  {member.openToTeams ? profile.openToTeams : profile.notOpenToTeams}
                </p>
              </div>
              {member.openToTeams && (
                <p className="mt-2 pl-4 text-xs text-white/30" style={{ fontFamily: outfit }}>
                  {profile.openToTeamsHint}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="auth-item-in-4 mt-10 border-t border-white/6 pt-8">
          <Link
            href={localizedPath(locale)}
            className="text-sm text-white/30 transition-colors duration-200 hover:text-white/60"
            style={{ fontFamily: outfit }}
          >
            {profile.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
