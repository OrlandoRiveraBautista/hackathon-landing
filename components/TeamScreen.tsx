"use client";

import { useState, useCallback } from "react";
import { useDictionary, useLocale } from "@/components/LocaleProvider";
import { memberHomePath } from "@/lib/i18n";
import {
  GlassCard,
  MemberAppShell,
  MemberAvatar,
  PlatformButton,
  PlatformInput,
  PlatformPageFooter,
  SectionLabel,
  SkillPill,
  ToggleSwitch,
  GithubIcon,
  LogOutIcon,
  PlatformBadge,
} from "@/components/platform";
import { SkillsTagInput } from "@/components/profile/SkillsTagInput";
import { ProjectSubmitConfirmDialog } from "@/components/team/ProjectSubmitConfirmDialog";
import { montserrat, outfit } from "@/lib/theme";
import type { TeamWithMembersAndProject } from "@/lib/teams/types";
import type { MemberProfile } from "@/lib/members/types";

type TeamScreenProps = {
  member: MemberProfile;
  initialTeam: TeamWithMembersAndProject | null;
};

type ProjectFormState = {
  githubUrl: string;
  title: string;
  description: string;
  techStack: string[];
  demoUrl: string;
};

function defaultProjectForm(
  team: TeamWithMembersAndProject | null,
): ProjectFormState {
  const p = team?.project;
  return {
    githubUrl: p?.githubUrl ?? "",
    title: p?.title ?? "",
    description: p?.description ?? "",
    techStack: p?.techStack ?? [],
    demoUrl: p?.demoUrl ?? "",
  };
}

export function TeamScreen({ member, initialTeam }: TeamScreenProps) {
  const { team: t } = useDictionary();
  const { locale } = useLocale();

  const [team, setTeam] = useState(initialTeam);
  const [error, setError] = useState("");

  // Create team form
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [teamIsOpen, setTeamIsOpen] = useState(true);
  const [creating, setCreating] = useState(false);
  const [suggestingName, setSuggestingName] = useState(false);

  // Project form
  const [projectForm, setProjectForm] = useState<ProjectFormState>(
    defaultProjectForm(initialTeam),
  );
  const [savingProject, setSavingProject] = useState(false);
  const [projectBanner, setProjectBanner] = useState("");
  const [editingProject, setEditingProject] = useState(!initialTeam?.project);
  const [leavingTeam, setLeavingTeam] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const isCaptain = team ? team.captainUserId === member.userId : false;

  async function suggestName() {
    setSuggestingName(true);
    try {
      const res = await fetch("/api/teams/suggest");
      if (res.ok) {
        const data = await res.json() as { name: string };
        setTeamName(data.name);
      }
    } finally {
      setSuggestingName(false);
    }
  }

  async function handleCreateTeam() {
    setError("");
    if (!teamName.trim()) return;

    setCreating(true);
    try {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: teamName.trim(),
          description: teamDescription.trim() || null,
          isOpen: teamIsOpen,
        }),
      });

      const data = await res.json() as { team?: TeamWithMembersAndProject; error?: string };
      if (!res.ok) {
        setError(data.error ?? t.errors.generic);
        return;
      }

      setTeam(data.team ?? null);
      setProjectForm(defaultProjectForm(data.team ?? null));
      setEditingProject(true);
    } catch {
      setError(t.errors.generic);
    } finally {
      setCreating(false);
    }
  }

  async function handleLeaveTeam() {
    if (!team) return;
    setLeavingTeam(true);
    setError("");
    try {
      const res = await fetch(`/api/teams/${team.id}`, { method: "DELETE" });
      const data = await res.json() as { dissolved?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? t.errors.generic);
        return;
      }
      setTeam(null);
      setTeamName("");
      setTeamDescription("");
      setProjectForm(defaultProjectForm(null));
      setEditingProject(false);
    } catch {
      setError(t.errors.generic);
    } finally {
      setLeavingTeam(false);
    }
  }

  async function handleSaveProject(submit: boolean) {
    if (!team) return false;
    setSavingProject(true);
    setError("");
    setProjectBanner("");
    try {
      const res = await fetch(`/api/teams/${team.id}/project`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...projectForm, submit }),
      });

      const data = await res.json() as { project?: TeamWithMembersAndProject["project"]; error?: string };
      if (!res.ok) {
        setError(data.error ?? t.errors.generic);
        return false;
      }

      setTeam((prev) => prev ? { ...prev, project: data.project ?? null } : prev);
      setProjectBanner(submit ? t.projectSubmittedBanner : t.projectSavedBanner);
      setEditingProject(false);
      if (submit) {
        setShowSubmitConfirm(false);
      }
      return true;
    } catch {
      setError(t.errors.generic);
      return false;
    } finally {
      setSavingProject(false);
    }
  }

  async function confirmSubmitProject() {
    await handleSaveProject(true);
  }

  const updateProject = useCallback(
    (key: keyof ProjectFormState, value: string | string[]) => {
      setProjectForm((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  return (
    <MemberAppShell locale={locale} eyebrow={t.eyebrow} maxWidth="4xl">
      {!team ? (
        /* ── No team state ── */
        <div className="space-y-8">
          <div className="auth-item-in-1">
            <p
              className="text-xs font-black tracking-[0.22em] text-white/25"
              style={{ fontFamily: montserrat }}
            >
              {t.noTeamTitle}
            </p>
            <p className="mt-1 text-sm text-white/45" style={{ fontFamily: outfit }}>
              {t.noTeamSubtitle}
            </p>
          </div>

          <GlassCard className="auth-item-in-2">
            <SectionLabel>{t.createTeamLabel}</SectionLabel>

            <div className="space-y-4">
              {/* Team name row with suggest button */}
              <div className="flex items-end gap-3">
                <div className="flex-1">
                  <PlatformInput
                    label={t.teamNameLabel}
                    value={teamName}
                    onChange={setTeamName}
                    placeholder={t.teamNamePlaceholder}
                  />
                </div>
                <PlatformButton
                  onClick={suggestName}
                  disabled={suggestingName}
                  variant="ghost"
                >
                  {t.suggestName}
                </PlatformButton>
              </div>

              <PlatformInput
                label={t.teamDescriptionLabel}
                value={teamDescription}
                onChange={setTeamDescription}
                placeholder={t.teamDescriptionPlaceholder}
                multiline
              />

              <ToggleSwitch
                checked={teamIsOpen}
                onChange={setTeamIsOpen}
                label={t.openToJoin}
                description={t.openToJoinHint}
              />
            </div>

            {error && (
              <p className="mt-4 text-sm text-red-400" style={{ fontFamily: outfit }}>
                {error}
              </p>
            )}

            <div className="mt-6">
              <PlatformButton
                onClick={handleCreateTeam}
                disabled={creating || !teamName.trim()}
                variant="primary"
              >
                {creating ? t.creatingButton : t.createButton}
              </PlatformButton>
            </div>
          </GlassCard>
        </div>
      ) : (
        /* ── Has team ── */
        <div className="space-y-8">
          {/* Team header */}
          <div className="auth-item-in-1 flex items-start justify-between gap-4">
            <div>
              <h1
                className="text-2xl font-black tracking-tight text-white"
                style={{ fontFamily: montserrat }}
              >
                {team.name}
              </h1>
              {team.description && (
                <p className="mt-1 text-sm text-white/45" style={{ fontFamily: outfit }}>
                  {team.description}
                </p>
              )}
            </div>
            <PlatformButton
              onClick={handleLeaveTeam}
              disabled={leavingTeam}
              variant="danger"
              icon={<LogOutIcon className="h-3.5 w-3.5" />}
            >
              {leavingTeam ? t.leavingTeam : t.leaveTeam}
            </PlatformButton>
          </div>

          {/* Members */}
          <GlassCard className="auth-item-in-2">
            <SectionLabel>{t.membersLabel}</SectionLabel>
            <div className="space-y-3">
              {team.members.map((m) => {
                const isMe = m.userId === member.userId;
                const isMemberCaptain = m.userId === team.captainUserId;
                return (
                  <div key={m.userId} className="flex items-center gap-3">
                    <MemberAvatar name={m.name} imageUrl={m.imageUrl} size="sm" />
                    <div className="flex flex-1 items-center gap-2 min-w-0">
                      <span
                        className="truncate text-sm font-semibold text-white/80"
                        style={{ fontFamily: outfit }}
                      >
                        {m.name}
                      </span>
                      {isMemberCaptain && (
                        <span
                          className="flex-shrink-0 rounded-md border border-[#aaff00]/20 bg-[#aaff00]/10 px-2 py-0.5 text-[9px] font-black tracking-[0.2em] text-[#aaff00]/70"
                          style={{ fontFamily: montserrat }}
                        >
                          {t.captainBadge}
                        </span>
                      )}
                      {isMe && (
                        <span
                          className="flex-shrink-0 rounded-md border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-black tracking-[0.2em] text-white/35"
                          style={{ fontFamily: montserrat }}
                        >
                          {t.youBadge}
                        </span>
                      )}
                    </div>
                    {m.github && (
                      <a
                        href={`https://github.com/${m.github.replace(/^@/, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-shrink-0 text-white/25 transition-colors hover:text-white/60"
                      >
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Project submission */}
          <GlassCard accent className="auth-item-in-3">
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <SectionLabel>{t.projectLabel}</SectionLabel>
                <p className="text-sm text-white/40" style={{ fontFamily: outfit }}>
                  {team.project ? t.projectSubtitle : t.noProjectSubtitle}
                </p>
              </div>
              {team.project && !editingProject && isCaptain && (
                <PlatformButton
                  onClick={() => setEditingProject(true)}
                  variant="ghost"
                >
                  {t.editProject}
                </PlatformButton>
              )}
            </div>

            {/* Submitted status badge */}
            {team.project && !editingProject && (
              <div className="mb-5 flex items-center gap-2">
                <ProjectStatusBadge status={team.project.status} t={t} />
              </div>
            )}

            {/* Project view (non-editing) */}
            {team.project && !editingProject && (
              <ProjectView project={team.project} t={t} />
            )}

            {/* Project edit form */}
            {(editingProject || !team.project) && isCaptain && (
              <div className="space-y-4">
                <PlatformInput
                  label={t.githubUrlLabel}
                  value={projectForm.githubUrl}
                  onChange={(v) => updateProject("githubUrl", v)}
                  placeholder={t.githubUrlPlaceholder}
                  hint={t.githubUrlHint}
                />

                <PlatformInput
                  label={t.projectTitleLabel}
                  value={projectForm.title}
                  onChange={(v) => updateProject("title", v)}
                  placeholder={t.projectTitlePlaceholder}
                />

                <PlatformInput
                  label={t.projectDescriptionLabel}
                  value={projectForm.description}
                  onChange={(v) => updateProject("description", v)}
                  placeholder={t.projectDescriptionPlaceholder}
                  multiline
                />

                <SkillsTagInput
                  label={t.techStackLabel}
                  skills={projectForm.techStack}
                  onChange={(v) => updateProject("techStack", v)}
                  placeholder={t.techStackPlaceholder}
                  hint={t.techStackHint}
                />

                <PlatformInput
                  label={t.demoUrlLabel}
                  value={projectForm.demoUrl}
                  onChange={(v) => updateProject("demoUrl", v)}
                  placeholder={t.demoUrlPlaceholder}
                />

                {error && (
                  <p className="text-sm text-red-400" style={{ fontFamily: outfit }}>
                    {error}
                  </p>
                )}

                {projectBanner && (
                  <p className="text-sm text-[#aaff00]" style={{ fontFamily: outfit }}>
                    {projectBanner}
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <PlatformButton
                    onClick={() => handleSaveProject(false)}
                    disabled={savingProject || !projectForm.githubUrl.trim()}
                    variant="ghost"
                  >
                    {savingProject ? t.savingProjectButton : t.saveProjectButton}
                  </PlatformButton>
                  <PlatformButton
                    onClick={() => {
                      setError("");
                      setShowSubmitConfirm(true);
                    }}
                    disabled={savingProject || !projectForm.githubUrl.trim()}
                    variant="primary"
                    icon={<GithubIcon className="h-3.5 w-3.5" />}
                  >
                    {t.submitProjectButton}
                  </PlatformButton>
                </div>
              </div>
            )}

            {!isCaptain && !team.project && (
              <p className="text-sm text-white/30" style={{ fontFamily: outfit }}>
                Waiting for the captain to submit the project.
              </p>
            )}

            {projectBanner && !editingProject && (
              <p className="mt-3 text-sm text-[#aaff00]" style={{ fontFamily: outfit }}>
                {projectBanner}
              </p>
            )}
          </GlassCard>

          {error && !editingProject && (
            <p className="text-sm text-red-400" style={{ fontFamily: outfit }}>
              {error}
            </p>
          )}
        </div>
      )}

      <PlatformPageFooter locale={locale} backLabel={t.backToHome} backHref={memberHomePath(locale)} />

      <ProjectSubmitConfirmDialog
        open={showSubmitConfirm}
        githubUrl={projectForm.githubUrl.trim()}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={confirmSubmitProject}
        confirming={savingProject}
        error={showSubmitConfirm ? error : undefined}
        labels={{
          title: t.submitConfirmTitle,
          subtitle: t.submitConfirmSubtitle,
          warnings: t.submitConfirmWarnings,
          githubLabel: t.submitConfirmGithubLabel,
          cancel: t.submitConfirmCancel,
          confirm: t.submitConfirmConfirm,
          confirming: t.submitConfirmConfirming,
        }}
      />
    </MemberAppShell>
  );
}

type ProjectStatusBadgeProps = {
  status: "draft" | "submitted" | "locked";
  t: ReturnType<typeof useDictionary>["team"];
};

function ProjectStatusBadge({ status, t }: ProjectStatusBadgeProps) {
  const label =
    status === "submitted"
      ? t.submittedBadge
      : status === "locked"
        ? t.lockedBadge
        : t.draftBadge;

  const colors =
    status === "submitted"
      ? "border-[#aaff00]/25 bg-[#aaff00]/10 text-[#aaff00]/75"
      : status === "locked"
        ? "border-red-500/25 bg-red-500/10 text-red-400/75"
        : "border-white/10 bg-white/[0.04] text-white/35";

  return (
    <span
      className={`inline-block rounded-lg border px-3 py-1 text-[9px] font-black tracking-[0.2em] ${colors}`}
      style={{ fontFamily: montserrat }}
    >
      {label}
    </span>
  );
}

type ProjectViewProps = {
  project: NonNullable<TeamWithMembersAndProject["project"]>;
  t: ReturnType<typeof useDictionary>["team"];
};

function ProjectView({ project, t }: ProjectViewProps) {
  return (
    <div className="space-y-4">
      {project.title && (
        <div>
          <p
            className="mb-1 text-[9px] font-black tracking-[0.26em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {t.projectTitleLabel}
          </p>
          <p className="text-base font-semibold text-white/80" style={{ fontFamily: outfit }}>
            {project.title}
          </p>
        </div>
      )}

      {project.description && (
        <div>
          <p
            className="mb-1 text-[9px] font-black tracking-[0.26em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {t.projectDescriptionLabel}
          </p>
          <p className="text-sm text-white/55" style={{ fontFamily: outfit }}>
            {project.description}
          </p>
        </div>
      )}

      <div>
        <p
          className="mb-1 text-[9px] font-black tracking-[0.26em] text-white/25"
          style={{ fontFamily: montserrat }}
        >
          {t.githubUrlLabel}
        </p>
        <a
          href={project.githubUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[#aaff00]/70 transition-colors hover:text-[#aaff00]"
          style={{ fontFamily: outfit }}
        >
          <GithubIcon className="h-4 w-4 flex-shrink-0" />
          <span className="break-all">{project.githubUrl}</span>
        </a>
      </div>

      {project.demoUrl && (
        <div>
          <p
            className="mb-1 text-[9px] font-black tracking-[0.26em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {t.demoUrlLabel}
          </p>
          <a
            href={project.demoUrl}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-white/60 underline transition-colors hover:text-white/80"
            style={{ fontFamily: outfit }}
          >
            {project.demoUrl}
          </a>
        </div>
      )}

      {project.techStack.length > 0 && (
        <div>
          <p
            className="mb-2 text-[9px] font-black tracking-[0.26em] text-white/25"
            style={{ fontFamily: montserrat }}
          >
            {t.techStackLabel}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.map((tech) => (
              <SkillPill key={tech} skill={tech} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
