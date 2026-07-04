import {
  CheckIcon,
  GlassCard,
  PencilIcon,
  PlatformButton,
  PlatformInput,
  SectionLabel,
  ToggleSwitch,
} from "@/components/platform";
import { outfit } from "@/lib/theme";

export type ProfileFormState = {
  school: string;
  github: string;
  interests: string;
  bio: string;
  skills: string;
  openToTeams: boolean;
};

type ProfileEditFormLabels = {
  school: string;
  schoolPlaceholder: string;
  github: string;
  githubPlaceholder: string;
  interests: string;
  interestsPlaceholder: string;
  bio: string;
  bioPlaceholder: string;
  skills: string;
  skillsPlaceholder: string;
  skillsHint?: string;
  openToTeams: string;
  openToTeamsHint: string;
  saveProfile: string;
  savingProfile: string;
  cancelEdit: string;
  editSection?: string;
};

type ProfileEditFormProps = {
  form: ProfileFormState;
  onChange: <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => void;
  labels: ProfileEditFormLabels;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  disabled?: boolean;
};

export function ProfileEditForm({
  form,
  onChange,
  labels,
  onSave,
  onCancel,
  saving,
  disabled = false,
}: ProfileEditFormProps) {
  return (
    <section className="auth-item-in-4 mt-6">
      <GlassCard>
        <SectionLabel icon={<PencilIcon className="h-3.5 w-3.5" />}>
          {labels.editSection ?? "EDIT PROFILE"}
        </SectionLabel>
        <div className="space-y-3">
          <PlatformInput
            label={labels.school}
            value={form.school}
            onChange={(value) => onChange("school", value)}
            placeholder={labels.schoolPlaceholder}
          />
          <PlatformInput
            label={labels.github}
            value={form.github}
            onChange={(value) => onChange("github", value)}
            placeholder={labels.githubPlaceholder}
          />
          <PlatformInput
            label={labels.interests}
            value={form.interests}
            onChange={(value) => onChange("interests", value)}
            placeholder={labels.interestsPlaceholder}
          />
          <PlatformInput
            label={labels.bio}
            value={form.bio}
            onChange={(value) => onChange("bio", value)}
            placeholder={labels.bioPlaceholder}
            multiline
          />
          <PlatformInput
            label={labels.skills}
            value={form.skills}
            onChange={(value) => onChange("skills", value)}
            placeholder={labels.skillsPlaceholder}
            hint={labels.skillsHint}
          />

          <ToggleSwitch
            checked={form.openToTeams}
            onChange={(checked) => onChange("openToTeams", checked)}
            label={labels.openToTeams}
            description={labels.openToTeamsHint}
            disabled={disabled || saving}
          />

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <PlatformButton
              onClick={onSave}
              disabled={disabled || saving}
              variant="primary"
              icon={saving ? undefined : <CheckIcon className="h-3.5 w-3.5" />}
            >
              {saving ? labels.savingProfile : labels.saveProfile}
            </PlatformButton>
            <button
              type="button"
              onClick={onCancel}
              disabled={disabled || saving}
              className="cursor-pointer text-sm text-white/30 transition-colors hover:text-white/65 disabled:cursor-not-allowed disabled:opacity-50"
              style={{ fontFamily: outfit }}
            >
              {labels.cancelEdit}
            </button>
          </div>
        </div>
      </GlassCard>
    </section>
  );
}
