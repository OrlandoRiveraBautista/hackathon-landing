"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GithubIcon,
  MemberAvatar,
  PlatformBadge,
  SkillPill,
} from "@/components/platform";
import { memberProfilePath, type Locale } from "@/lib/i18n";
import { parseGithubUrl } from "@/lib/members/shared";
import type { PublicMemberProfile } from "@/lib/members/types";
import { montserrat, outfit } from "@/lib/theme";

type AddContext = {
  teamId: string;
  alreadyMember: boolean;
  teamFull: boolean;
  onAdd: (userId: string) => Promise<void>;
};

type MemberDirectoryCardProps = {
  member: PublicMemberProfile;
  locale: Locale;
  labels: {
    openToTeams: string;
    notOpenToTeams: string;
    viewProfile: string;
    addToTeam: string;
    addingToTeam: string;
    added: string;
    alreadyInTeam: string;
    teamFull: string;
    addFailed: string;
  };
  addContext: AddContext | null;
};

export function MemberDirectoryCard({
  member,
  locale,
  labels,
  addContext,
}: MemberDirectoryCardProps) {
  const { handle: githubHandle } = parseGithubUrl(member.github);
  const skills = member.skills.slice(0, 3);
  const extraSkills = member.skills.length - skills.length;
  const summary = member.bio?.trim() || member.interests?.trim();

  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState("");
  const [wasAdded, setWasAdded] = useState(false);

  async function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!addContext || adding) return;
    setAdding(true);
    setAddError("");
    try {
      await addContext.onAdd(member.userId);
      setWasAdded(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.toLowerCase().includes("full")) {
        setAddError(labels.teamFull);
      } else if (msg.toLowerCase().includes("team")) {
        setAddError(labels.alreadyInTeam);
      } else {
        setAddError(labels.addFailed);
      }
    } finally {
      setAdding(false);
    }
  }

  const isAdded = wasAdded || addContext?.alreadyMember;
  const canAdd = addContext && !isAdded && !addContext.teamFull;

  return (
    <Link
      href={memberProfilePath(locale, member.userId)}
      className="platform-card-lift group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.018] p-5 hover:border-[#aaff00]/22 hover:bg-[#aaff00]/[0.025] hover:shadow-[0_12px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(170,255,0,0.08)_inset]"
      style={{
        backdropFilter: "blur(10px) saturate(160%)",
        WebkitBackdropFilter: "blur(10px) saturate(160%)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.03) inset, 0 4px 24px rgba(0,0,0,0.35)",
      }}
    >
      <span className="pointer-events-none absolute inset-0 z-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent transition-transform duration-500 ease-out group-hover:translate-x-full" />
      <span
        className="pointer-events-none absolute inset-x-0 top-0 h-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, rgba(170,255,0,0.45) 50%, transparent 100%)",
        }}
      />

      <div className="relative z-10 flex h-full flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="relative shrink-0">
          {member.openToTeams && (
            <div
              className="absolute -inset-1 rounded-2xl opacity-0 blur-md transition-opacity duration-300 group-hover:opacity-60"
              style={{
                background:
                  "radial-gradient(circle, rgba(170,255,0,0.35) 0%, transparent 70%)",
              }}
            />
          )}
          <MemberAvatar name={member.name} imageUrl={member.imageUrl} size="md" />
        </div>

        <PlatformBadge
          active={member.openToTeams}
          label={member.openToTeams ? labels.openToTeams : labels.notOpenToTeams}
          pulse={member.openToTeams}
        />
      </div>

      <div className="mt-4 min-w-0">
        <h2
          className="truncate text-lg font-black tracking-tight text-white/92 transition-colors group-hover:text-white"
          style={{ fontFamily: montserrat }}
        >
          {member.name}
        </h2>

        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
          {member.school && (
            <span
              className="truncate text-[12px] text-white/38"
              style={{ fontFamily: outfit }}
            >
              {member.school}
            </span>
          )}
          {githubHandle && (
            <span
              className="inline-flex items-center gap-1 text-[11px] text-white/28 transition-colors group-hover:text-white/45"
              style={{ fontFamily: outfit }}
            >
              <GithubIcon className="h-3 w-3" />@{githubHandle}
            </span>
          )}
        </div>
      </div>

      {summary && (
        <p
          className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/42"
          style={{ fontFamily: outfit }}
        >
          {summary}
        </p>
      )}

      {skills.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <SkillPill key={skill} skill={skill} />
          ))}
          {extraSkills > 0 && (
            <span
              className="inline-flex items-center rounded-lg border border-white/[0.07] bg-white/[0.03] px-2.5 py-1.5 text-[10px] font-semibold text-white/30"
              style={{ fontFamily: outfit }}
            >
              +{extraSkills}
            </span>
          )}
        </div>
      )}

      <div
        className="mt-auto flex items-center justify-between gap-3 border-t border-white/[0.05] pt-4"
      >
        <span
          className="text-[11px] font-semibold text-[#aaff00]/45 transition-colors duration-200 group-hover:text-[#aaff00]/85"
          style={{ fontFamily: outfit }}
        >
          {labels.viewProfile}
        </span>

        <div className="flex items-center gap-2">
          {/* Add to team button */}
          {addContext && (
            <button
              type="button"
              onClick={handleAdd}
              disabled={adding || !!isAdded || addContext.teamFull}
              className={`relative inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[10px] font-black tracking-[0.14em] transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60 ${
                isAdded
                  ? "border-[#aaff00]/20 bg-[#aaff00]/8 text-[#aaff00]/60"
                  : addContext.teamFull
                    ? "border-white/[0.07] bg-white/[0.02] text-white/25"
                    : "border-white/[0.1] bg-white/[0.04] text-white/55 hover:border-[#aaff00]/30 hover:bg-[#aaff00]/10 hover:text-[#aaff00]/80"
              }`}
              style={{ fontFamily: montserrat }}
            >
              {adding
                ? labels.addingToTeam
                : isAdded
                  ? labels.added
                  : addContext.teamFull
                    ? labels.teamFull
                    : labels.addToTeam}
            </button>
          )}

          <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.03] text-white/30 transition-all duration-200 group-hover:border-[#aaff00]/25 group-hover:bg-[#aaff00]/10 group-hover:text-[#aaff00]">
            <svg viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </div>

      {addError && (
        <p className="mt-2 text-[11px] text-red-400" style={{ fontFamily: outfit }}>
          {addError}
        </p>
      )}
      </div>
    </Link>
  );
}
