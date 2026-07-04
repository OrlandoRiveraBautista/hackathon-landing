"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { authClient } from "@/lib/auth/client";
import { SITE_LOGO } from "@/lib/brand";
import { localizedPath } from "@/lib/i18n";
import {
  displayValue,
  formatMemberDate,
  parseMemberFromJson,
  skillsFromInput,
  skillsToInput,
  type MemberProfileJson,
} from "@/lib/members/shared";
import type { MemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";
import type { WaitlistStatus } from "@/lib/waitlist-status";

type MemberProfileScreenProps = {
  member: MemberProfile;
  waitlistStatus: WaitlistStatus;
  userImage?: string | null;
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

function ProfileField({
  label,
  value,
  href,
  className = "",
}: {
  label: string;
  value: string;
  href?: string;
  className?: string;
}) {
  const content =
    href && value !== "—" ? (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="text-sm text-[#aaff00] transition-colors hover:text-white"
        style={{ fontFamily: outfit }}
      >
        {value}
      </a>
    ) : (
      <p className="text-sm text-white/80" style={{ fontFamily: outfit }}>
        {value}
      </p>
    );

  return (
    <div
      className={`rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5 ${className}`}
    >
      <p
        className="text-[10px] font-black tracking-[0.22em] text-white/35"
        style={{ fontFamily: montserrat }}
      >
        {label}
      </p>
      <div className="mt-1.5">{content}</div>
    </div>
  );
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
  const className =
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
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={`${className} resize-y min-h-[96px]`}
          style={{ fontFamily: outfit }}
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={className}
          style={{ fontFamily: outfit }}
        />
      )}
    </label>
  );
}

export function MemberProfileScreen({
  member: initialMember,
  waitlistStatus,
  userImage,
}: MemberProfileScreenProps) {
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

  const initials = member.name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");

  const sexLabel = member.sex ? waitlist.sexOptions[member.sex] : "—";

  const statusLabel =
    waitlistStatus === "contacted"
      ? profile.statusContacted
      : profile.statusPending;

  const githubDisplay = displayValue(member.github);
  const githubHref =
    member.github && githubDisplay !== "—"
      ? member.github.startsWith("http")
        ? member.github
        : `https://github.com/${member.github.replace(/^@/, "")}`
      : undefined;

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
      <div className="pointer-events-none absolute inset-0">
        <div
          className="auth-blob-1 absolute -top-40 -left-40 h-[560px] w-[560px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(170,255,0,0.55) 0%, rgba(100,200,0,0.2) 45%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="auth-blob-2 absolute top-1/3 -right-32 h-[480px] w-[480px] rounded-full opacity-15"
          style={{
            background:
              "radial-gradient(circle, rgba(0,220,130,0.6) 0%, rgba(0,180,100,0.2) 50%, transparent 70%)",
            filter: "blur(70px)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(170,255,0,0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(170,255,0,0.5) 1px, transparent 1px)
            `,
            backgroundSize: "48px 48px",
          }}
        />
      </div>

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
            <p className="text-[11px] text-white/40" style={{ fontFamily: outfit }}>
              {profile.eyebrow}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {!editing && (
            <button
              type="button"
              onClick={startEditing}
              disabled={saving || signingOut}
              className="cursor-pointer rounded-full border border-[#aaff00]/30 bg-[#aaff00]/10 px-4 py-2 text-xs font-black tracking-[0.12em] text-[#aaff00] transition-all hover:border-[#aaff00]/60 hover:bg-[#aaff00]/15 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ fontFamily: montserrat }}
            >
              {profile.editProfile}
            </button>
          )}
          <button
            type="button"
            onClick={signOut}
            disabled={signingOut || saving}
            className="cursor-pointer rounded-full border border-white/12 bg-white/[0.04] px-4 py-2 text-xs font-black tracking-[0.12em] text-white/70 transition-all hover:border-[#aaff00]/40 hover:text-[#aaff00] disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: montserrat }}
          >
            {signingOut ? profile.signingOut : profile.signOut}
          </button>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 flex-col px-5 py-8 sm:px-8 sm:py-12">
        <div className="auth-item-in-1 mb-8 inline-flex w-fit items-center gap-2 rounded-full border border-[#aaff00]/25 bg-[#aaff00]/8 px-3 py-1">
          <span className="auth-badge-dot relative h-1.5 w-1.5 rounded-full bg-[#aaff00]" />
          <span
            className="text-[10px] font-black tracking-[0.28em] text-[#aaff00]"
            style={{ fontFamily: montserrat }}
          >
            {profile.eyebrow}
          </span>
        </div>

        <div className="auth-item-in-2 flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-8">
          <div className="relative flex-shrink-0">
            {userImage ? (
              <img
                src={userImage}
                alt={member.name}
                width={96}
                height={96}
                className="h-24 w-24 rounded-2xl border border-white/10 object-cover shadow-[0_0_32px_rgba(170,255,0,0.15)]"
              />
            ) : (
              <div
                className="flex h-24 w-24 items-center justify-center rounded-2xl border border-[#aaff00]/20 bg-[#aaff00]/10 text-2xl font-black text-[#aaff00] shadow-[0_0_32px_rgba(170,255,0,0.15)]"
                style={{ fontFamily: montserrat }}
              >
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h1
              className="text-3xl font-black tracking-tight sm:text-4xl"
              style={{ fontFamily: montserrat }}
            >
              {member.name}
            </h1>
            <p className="mt-2 text-sm text-white/50" style={{ fontFamily: outfit }}>
              {member.email}
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-black tracking-[0.18em] ${
                  waitlistStatus === "contacted"
                    ? "border-[#aaff00]/30 bg-[#aaff00]/10 text-[#aaff00]"
                    : "border-white/12 bg-white/[0.04] text-white/50"
                }`}
                style={{ fontFamily: montserrat }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    waitlistStatus === "contacted" ? "bg-[#aaff00]" : "bg-white/30"
                  }`}
                />
                {statusLabel}
              </span>
              {member.openToTeams && (
                <span
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#aaff00]/20 bg-[#aaff00]/8 px-3 py-1 text-[10px] font-black tracking-[0.18em] text-[#aaff00]"
                  style={{ fontFamily: montserrat }}
                >
                  {profile.openToTeams}
                </span>
              )}
              <span className="text-xs text-white/35" style={{ fontFamily: outfit }}>
                {profile.memberSince}{" "}
                {formatMemberDate(member.createdAt, locale)}
              </span>
            </div>
          </div>
        </div>

        <p
          className="auth-item-in-3 mt-8 max-w-2xl text-sm leading-relaxed text-white/45"
          style={{ fontFamily: outfit }}
        >
          {profile.subtitle}
        </p>

        {error && (
          <div className="auth-item-in-3 mt-6 flex items-start gap-2.5 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400" />
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {success && (
          <div className="auth-item-in-3 mt-6 flex items-start gap-2.5 rounded-xl border border-[#aaff00]/20 bg-[#aaff00]/8 px-4 py-3">
            <span className="mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#aaff00]" />
            <p className="text-sm text-[#aaff00]">{success}</p>
          </div>
        )}

        {editing ? (
          <section className="auth-item-in-4 mt-10 space-y-3">
            <ProfileInput
              label={waitlist.school}
              value={form.school}
              onChange={(school) => setForm((current) => ({ ...current, school }))}
              placeholder={waitlist.schoolPlaceholder}
            />
            <ProfileInput
              label={waitlist.github}
              value={form.github}
              onChange={(github) => setForm((current) => ({ ...current, github }))}
              placeholder={waitlist.githubPlaceholder}
            />
            <ProfileInput
              label={waitlist.interests}
              value={form.interests}
              onChange={(interests) =>
                setForm((current) => ({ ...current, interests }))
              }
              placeholder={waitlist.interestsPlaceholder}
            />
            <ProfileInput
              label={profile.bio}
              value={form.bio}
              onChange={(bio) => setForm((current) => ({ ...current, bio }))}
              placeholder={profile.bioPlaceholder}
              multiline
            />
            <ProfileInput
              label={profile.skills}
              value={form.skills}
              onChange={(skills) => setForm((current) => ({ ...current, skills }))}
              placeholder={profile.skillsPlaceholder}
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3.5">
              <input
                type="checkbox"
                checked={form.openToTeams}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    openToTeams: event.target.checked,
                  }))
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
              <button
                type="button"
                onClick={saveProfile}
                disabled={saving || signingOut}
                className="cursor-pointer rounded-full border border-[#aaff00]/40 bg-[#aaff00]/10 px-6 py-2.5 text-xs font-black tracking-[0.12em] text-[#aaff00] transition-all hover:border-[#aaff00]/70 hover:bg-[#aaff00]/20 disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: montserrat }}
              >
                {saving ? profile.savingProfile : profile.saveProfile}
              </button>
              <button
                type="button"
                onClick={cancelEditing}
                disabled={saving || signingOut}
                className="cursor-pointer text-sm text-white/40 transition-colors hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                style={{ fontFamily: outfit }}
              >
                {profile.cancelEdit}
              </button>
            </div>
          </section>
        ) : (
          <section className="auth-item-in-4 mt-10 grid gap-3 sm:grid-cols-2">
            <ProfileField label={waitlist.phone} value={displayValue(member.phone)} />
            <ProfileField
              label={waitlist.age}
              value={member.age != null ? String(member.age) : "—"}
            />
            <ProfileField label={waitlist.sex} value={sexLabel} />
            <ProfileField label={waitlist.school} value={displayValue(member.school)} />
            <ProfileField
              label={waitlist.github}
              value={githubDisplay}
              href={githubHref}
            />
            <ProfileField
              label={waitlist.interests}
              value={displayValue(member.interests)}
            />
            <ProfileField
              label={profile.bio}
              value={displayValue(member.bio)}
              className="sm:col-span-2"
            />
            <ProfileField
              label={profile.skills}
              value={
                member.skills.length > 0 ? member.skills.join(", ") : "—"
              }
              className="sm:col-span-2"
            />
          </section>
        )}

        <div className="auth-item-in-4 mt-10 border-t border-white/8 pt-8">
          <Link
            href={localizedPath(locale)}
            className="text-sm text-white/40 transition-colors duration-200 hover:text-[#aaff00]"
            style={{ fontFamily: outfit }}
          >
            {profile.backToHome}
          </Link>
        </div>
      </div>
    </main>
  );
}
