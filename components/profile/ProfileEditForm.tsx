import {
  CheckIcon,
  GlassCard,
  PlatformButton,
  PlatformInput,
  PlatformSelect,
  SectionLabel,
  ToggleSwitch,
} from "@/components/platform";
import { outfit } from "@/lib/theme";
import { SkillsTagInput } from "./SkillsTagInput";

export type ProfileFormState = {
  school: string;
  github: string;
  interests: string;
  bio: string;
  skills: string[];
  shirtSize: string;
  openToTeams: boolean;
  showEmail: boolean;
  showPhone: boolean;
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
  shirtSize: string;
  shirtSizePlaceholder: string;
  shirtSizeHint: string;
  openToTeams: string;
  openToTeamsHint: string;
  showEmail: string;
  showEmailHint: string;
  showPhone: string;
  showPhoneHint: string;
  showPhoneDisabledHint?: string;
  contactVisibilitySection: string;
  editSection: string;
  saveProfile: string;
  savingProfile: string;
  cancelEdit: string;
};

type ProfileEditFormProps = {
  form: ProfileFormState;
  onChange: <K extends keyof ProfileFormState>(key: K, value: ProfileFormState[K]) => void;
  labels: ProfileEditFormLabels;
  shirtSizeOptions: Array<{ value: string; label: string }>;
  hasPhone: boolean;
  onSave: () => void;
  onCancel: () => void;
  saving: boolean;
  disabled?: boolean;
};

export function ProfileEditForm({
  form,
  onChange,
  labels,
  shirtSizeOptions,
  hasPhone,
  onSave,
  onCancel,
  saving,
  disabled = false,
}: ProfileEditFormProps) {
  return (
    <section className="auth-item-in-4 mt-6">
      <GlassCard>
        <SectionLabel>{labels.editSection}</SectionLabel>
        <div className="space-y-3">
          <PlatformSelect
            label={labels.shirtSize}
            value={form.shirtSize}
            onChange={(value) => onChange("shirtSize", value)}
            placeholder={labels.shirtSizePlaceholder}
            options={shirtSizeOptions}
            hint={labels.shirtSizeHint}
            required
          />
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
          <SkillsTagInput
            label={labels.skills}
            skills={form.skills}
            onChange={(skills) => onChange("skills", skills)}
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

          <div className="space-y-3 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
            <SectionLabel>{labels.contactVisibilitySection}</SectionLabel>
            <ToggleSwitch
              checked={form.showEmail}
              onChange={(checked) => onChange("showEmail", checked)}
              label={labels.showEmail}
              description={labels.showEmailHint}
              disabled={disabled || saving}
            />
            <ToggleSwitch
              checked={form.showPhone}
              onChange={(checked) => onChange("showPhone", checked)}
              label={labels.showPhone}
              description={
                hasPhone ? labels.showPhoneHint : labels.showPhoneDisabledHint
              }
              disabled={disabled || saving || !hasPhone}
            />
          </div>

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
