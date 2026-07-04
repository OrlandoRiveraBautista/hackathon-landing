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
    email: member.showEmail ? member.email : null,
    phone: member.showPhone ? member.phone : null,
    imageUrl: member.imageUrl,
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
    showEmail: raw.showEmail ?? false,
    showPhone: raw.showPhone ?? false,
    imageUrl: raw.imageUrl ?? null,
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

export function getProfileCompletion(member: {
  github: string | null;
  bio: string | null;
  skills: string[];
  interests: string | null;
}) {
  const items = {
    github: Boolean(member.github?.trim()),
    bio: Boolean(member.bio?.trim()),
    skills: member.skills.length > 0,
    interests: Boolean(member.interests?.trim()),
  };

  const total = Object.keys(items).length;
  const done = Object.values(items).filter(Boolean).length;

  return {
    items,
    done,
    total,
    percent: Math.round((done / total) * 100),
    isComplete: done === total,
  };
}

export function parseGithubUrl(github: string | null | undefined) {
  if (!github?.trim()) {
    return { handle: null, href: undefined };
  }

  const handle = github
    .trim()
    .replace(/^https?:\/\/(www\.)?github\.com\//, "")
    .replace(/^@/, "");

  if (!handle) {
    return { handle: null, href: undefined };
  }

  return {
    handle,
    href: `https://github.com/${handle}`,
  };
}
