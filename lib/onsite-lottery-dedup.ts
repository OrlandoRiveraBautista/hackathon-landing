import { normalizeParticipantName } from "./onsite-staff-exclusions";

/** Waitlist emails for people already represented as platform members under another address. */
export const ONSITE_LOTTERY_SHADOW_WAITLIST_EMAILS = [
  "lavindev@proton.me", // Jose Angel Elizondo — member as lavincool.angel@gmail.com
] as const;

/** Platform member emails that are duplicate accounts — excluded from the lottery pool. */
export const ONSITE_LOTTERY_SHADOW_MEMBER_EMAILS = [
  "david.matz.ld@gmail.com", // David — duplicate of davidpmartinezs@gmail.com
] as const;

const shadowWaitlistEmails = new Set(
  ONSITE_LOTTERY_SHADOW_WAITLIST_EMAILS.map((email) =>
    email.trim().toLowerCase(),
  ),
);

const shadowMemberEmails = new Set(
  ONSITE_LOTTERY_SHADOW_MEMBER_EMAILS.map((email) => email.trim().toLowerCase()),
);

export function isShadowWaitlistEmail(email: string): boolean {
  return shadowWaitlistEmails.has(email.trim().toLowerCase());
}

export function isShadowMemberEmail(email: string): boolean {
  return shadowMemberEmails.has(email.trim().toLowerCase());
}

export function findPlatformMemberByName<
  T extends { name: string; isPlatformMember: boolean },
>(candidates: Iterable<T>, name: string): T | undefined {
  const normalized = normalizeParticipantName(name);

  for (const candidate of candidates) {
    if (
      candidate.isPlatformMember &&
      normalizeParticipantName(candidate.name) === normalized
    ) {
      return candidate;
    }
  }

  return undefined;
}

export function shouldDropShadowWaitlistEntry(
  signup: { email: string; name: string },
  memberCandidates: Iterable<{ name: string; isPlatformMember: boolean }>,
): boolean {
  if (isShadowWaitlistEmail(signup.email)) {
    return true;
  }

  return findPlatformMemberByName(memberCandidates, signup.name) !== undefined;
}
