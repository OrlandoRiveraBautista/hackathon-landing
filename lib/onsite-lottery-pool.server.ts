import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import { loadAllMembersForLottery } from "./members";
import {
  findPlatformMemberByName,
  isShadowMemberEmail,
  shouldDropShadowWaitlistEntry,
} from "./onsite-lottery-dedup";
import type { OnsiteParticipant } from "./onsite/shared";
import { isOnsiteLotteryStaff } from "./onsite-staff-exclusions";
import type { SexOption } from "./waitlist";
import { waitlistDocIdForEmail } from "./waitlist";
import { getWaitlistSignups, type WaitlistSignup } from "./waitlist-admin";

export type OnsiteLotteryCandidate = OnsiteParticipant & {
  email: string;
  hasWaitlistDoc: boolean;
  isPlatformMember: boolean;
  phone: string | null;
  age: number | null;
  sex: SexOption | null;
};

export type OnsiteLotteryPool = {
  eligible: OnsiteLotteryCandidate[];
  platformMemberEligible: OnsiteLotteryCandidate[];
  staff: Array<{ name: string; email: string }>;
  shadowWaitlistDropped: Array<{ name: string; email: string; memberEmail: string }>;
  duplicateMembersExcluded: Array<{ name: string; email: string }>;
  stats: {
    waitlistEntries: number;
    waitlistOnlyEntries: number;
    platformMemberTotal: number;
    platformMemberInPool: number;
    platformMemberStaffExcluded: number;
    memberOnlyEntries: number;
    eligibleTotal: number;
  };
};

export type BuildOnsiteLotteryPoolOptions = {
  waitlistOnly?: boolean;
};

function dedupeWaitlistByEmail(signups: WaitlistSignup[]): WaitlistSignup[] {
  const byEmail = new Map<string, WaitlistSignup>();

  for (const signup of signups) {
    const email = signup.email.trim().toLowerCase();
    const existing = byEmail.get(email);

    if (!existing || signup.onSiteBoostTapCount > existing.onSiteBoostTapCount) {
      byEmail.set(email, signup);
    }
  }

  return [...byEmail.values()];
}

function waitlistToCandidate(
  signup: WaitlistSignup,
  isPlatformMember: boolean,
): OnsiteLotteryCandidate {
  return {
    id: signup.id,
    name: signup.name,
    school: signup.school === "—" ? "" : signup.school,
    github: signup.github === "—" ? "" : signup.github,
    onSiteInterested: signup.onSiteInterested,
    onSiteBoostTapCount: signup.onSiteBoostTapCount,
    onSiteStatus: signup.onSiteStatus,
    email: signup.email.trim().toLowerCase(),
    hasWaitlistDoc: true,
    isPlatformMember,
    phone: signup.phone === "—" ? null : signup.phone,
    age: signup.age,
    sex: signup.sex,
  };
}

function memberToCandidate(member: {
  email: string;
  name: string;
  school: string | null;
  github: string | null;
  phone: string | null;
  age: number | null;
  sex: SexOption | null;
}): OnsiteLotteryCandidate {
  const email = member.email.trim().toLowerCase();

  return {
    id: waitlistDocIdForEmail(email),
    name: member.name,
    school: member.school ?? "",
    github: member.github ?? "",
    onSiteInterested: false,
    onSiteBoostTapCount: 0,
    onSiteStatus: "pending",
    email,
    hasWaitlistDoc: false,
    isPlatformMember: true,
    phone: member.phone,
    age: member.age,
    sex: member.sex,
  };
}

function mergeWaitlistIntoMemberCandidate(
  member: OnsiteLotteryCandidate,
  signup: WaitlistSignup,
): OnsiteLotteryCandidate {
  return {
    ...member,
    onSiteBoostTapCount: Math.max(
      member.onSiteBoostTapCount,
      signup.onSiteBoostTapCount,
    ),
    onSiteInterested: member.onSiteInterested || signup.onSiteInterested,
    school:
      member.school ||
      (signup.school === "—" ? "" : signup.school),
    github:
      member.github ||
      (signup.github === "—" ? "" : signup.github),
    phone:
      member.phone ??
      (signup.phone === "—" ? null : signup.phone),
    age: member.age ?? signup.age,
    sex: member.sex ?? signup.sex,
  };
}

export async function buildOnsiteLotteryPool(
  options: BuildOnsiteLotteryPoolOptions = {},
): Promise<OnsiteLotteryPool> {
  const signups = await getWaitlistSignups();
  const { members } = await loadAllMembersForLottery({
    skip: options.waitlistOnly,
  });

  const waitlistByEmail = new Map(
    dedupeWaitlistByEmail(signups).map((signup) => {
      const email = signup.email.trim().toLowerCase();
      return [email, signup] as const;
    }),
  );

  const candidatesByEmail = new Map<string, OnsiteLotteryCandidate>();
  const duplicateMembersExcluded: Array<{ name: string; email: string }> = [];
  const duplicateMemberEmailsLogged = new Set<string>();
  let memberOnlyEntries = 0;

  function excludeDuplicateMember(name: string, email: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (!isShadowMemberEmail(normalizedEmail)) {
      return false;
    }

    if (!duplicateMemberEmailsLogged.has(normalizedEmail)) {
      duplicateMemberEmailsLogged.add(normalizedEmail);
      duplicateMembersExcluded.push({ name, email: normalizedEmail });
    }

    return true;
  }

  for (const member of members) {
    const email = member.email.trim().toLowerCase();
    if (excludeDuplicateMember(member.name, email)) {
      continue;
    }

    const signup = waitlistByEmail.get(email);

    if (signup) {
      candidatesByEmail.set(email, waitlistToCandidate(signup, true));
      continue;
    }

    candidatesByEmail.set(email, memberToCandidate(member));
    memberOnlyEntries += 1;
  }

  let waitlistOnlyEntries = 0;
  const shadowWaitlistDropped: Array<{
    name: string;
    email: string;
    memberEmail: string;
  }> = [];

  for (const [email, signup] of waitlistByEmail) {
    if (candidatesByEmail.has(email)) {
      continue;
    }

    if (excludeDuplicateMember(signup.name, email)) {
      continue;
    }

    const memberMatch = findPlatformMemberByName(candidatesByEmail.values(), signup.name);
    if (shouldDropShadowWaitlistEntry(signup, candidatesByEmail.values())) {
      if (memberMatch) {
        candidatesByEmail.set(
          memberMatch.email,
          mergeWaitlistIntoMemberCandidate(memberMatch, signup),
        );
        shadowWaitlistDropped.push({
          name: signup.name,
          email,
          memberEmail: memberMatch.email,
        });
      }
      continue;
    }

    candidatesByEmail.set(email, waitlistToCandidate(signup, false));
    waitlistOnlyEntries += 1;
  }

  const eligible: OnsiteLotteryCandidate[] = [];
  const staff: Array<{ name: string; email: string }> = [];
  let platformMemberStaffExcluded = 0;

  for (const candidate of candidatesByEmail.values()) {
    if (isOnsiteLotteryStaff(candidate.name, candidate.email)) {
      staff.push({ name: candidate.name, email: candidate.email });
      if (candidate.isPlatformMember) {
        platformMemberStaffExcluded += 1;
      }
    } else {
      eligible.push(candidate);
    }
  }

  const platformMemberEligible = eligible.filter(
    (candidate) => candidate.isPlatformMember,
  );

  if (!options.waitlistOnly) {
    const eligibleMemberEmails = new Set(
      platformMemberEligible.map((candidate) => candidate.email),
    );

    for (const member of members) {
      if (isOnsiteLotteryStaff(member.name, member.email)) {
        continue;
      }

      const email = member.email.trim().toLowerCase();
      if (isShadowMemberEmail(email)) {
        continue;
      }

      if (!eligibleMemberEmails.has(email)) {
        throw new Error(`Platform member missing from lottery pool: ${member.email}`);
      }
    }
  }

  return {
    eligible,
    platformMemberEligible,
    staff,
    shadowWaitlistDropped,
    duplicateMembersExcluded,
    stats: {
      waitlistEntries: waitlistByEmail.size,
      waitlistOnlyEntries,
      platformMemberTotal: members.length,
      platformMemberInPool: platformMemberEligible.length,
      platformMemberStaffExcluded,
      memberOnlyEntries,
      eligibleTotal: eligible.length,
    },
  };
}

function resolveWaitlistPhone(phone: string | null): string {
  const digits = phone?.replace(/\D/g, "") ?? "";
  if (digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  return "1000000000";
}

async function ensureWaitlistDocForCandidate(candidate: OnsiteLotteryCandidate) {
  const ref = doc(getDb(), "waitlist", candidate.id);
  const snapshot = await getDoc(ref);

  if (snapshot.exists()) {
    return;
  }

  const payload: Record<string, unknown> = {
    name: candidate.name,
    email: candidate.email,
    phone: resolveWaitlistPhone(candidate.phone),
    age: candidate.age ?? 18,
    sex: candidate.sex ?? "preferNotToSay",
    shirtSize: "M",
    status: "pending",
    createdAt: serverTimestamp(),
  };

  if (candidate.school) {
    payload.school = candidate.school;
  }

  if (candidate.github) {
    payload.github = candidate.github;
  }

  await setDoc(ref, payload);
}

export async function ensureWaitlistDocsForCandidates(
  candidates: OnsiteLotteryCandidate[],
) {
  const missingDocs = candidates.filter((candidate) => !candidate.hasWaitlistDoc);

  await Promise.all(missingDocs.map(ensureWaitlistDocForCandidate));
}
