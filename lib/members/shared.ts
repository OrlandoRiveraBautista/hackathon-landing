import type { MemberProfile, PublicMemberProfile } from "@/lib/members/types";

export function toPublicMemberProfile(member: MemberProfile): PublicMemberProfile {
  return {
    userId: member.userId,
    name: member.name,
    school: member.school,
    github: member.github,
    interests: member.interests,
    bio: member.bio,
    skills: member.skills,
    openToTeams: member.openToTeams,
    createdAt: member.createdAt,
    updatedAt: member.updatedAt,
  };
}

export type MemberProfileJson = Omit<
  MemberProfile,
  "createdAt" | "updatedAt"
> & {
  createdAt: string | Date;
  updatedAt: string | Date;
};

export function parseMemberFromJson(raw: MemberProfileJson): MemberProfile {
  return {
    ...raw,
    createdAt: new Date(raw.createdAt),
    updatedAt: new Date(raw.updatedAt),
  };
}

export function formatMemberDate(
  date: Date | string | null | undefined,
  locale: string,
) {
  if (!date) return "—";

  const value = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(value.getTime())) return "—";

  return new Intl.DateTimeFormat(locale, {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(value);
}

export function displayValue(value: string | null | undefined) {
  return value?.trim() ? value : "—";
}

export function skillsToInput(skills: string[]) {
  return skills.join(", ");
}

export function skillsFromInput(input: string) {
  return input
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean)
    .slice(0, 20);
}
