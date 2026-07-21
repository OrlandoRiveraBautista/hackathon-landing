/** Staff already reserved for on-site — excluded from the public lottery pool. */
export const ONSITE_LOTTERY_STAFF_NAMES = [
  "Eduardo Lorenzo",
  "Eduardo Lorenzo Diaz",
  "Jeremiah Garza",
  "Orlando I Rivera-Bautista",
  "Felix Martinez",
  "Benjamin Ascencio",
] as const;

export const ONSITE_LOTTERY_STAFF_EMAILS = [
  "lorenzodiazeduardo14@gmail.com",
  "jeremiahgar5983@gmail.com",
  "orlandovaluta568@gmail.com",
  "felixmrtzflrs04@gmail.com",
] as const;

const staffNamesNormalized = new Set(
  ONSITE_LOTTERY_STAFF_NAMES.map(normalizeParticipantName),
);

const staffEmailsNormalized = new Set(
  ONSITE_LOTTERY_STAFF_EMAILS.map((email) => email.trim().toLowerCase()),
);

export function normalizeParticipantName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function isOnsiteLotteryStaff(name: string, email?: string | null): boolean {
  if (email && staffEmailsNormalized.has(email.trim().toLowerCase())) {
    return true;
  }

  return staffNamesNormalized.has(normalizeParticipantName(name));
}

export function partitionOnsiteLotteryPool<T extends { name: string; email?: string | null }>(
  entries: T[],
): { eligible: T[]; staff: T[] } {
  const eligible: T[] = [];
  const staff: T[] = [];

  for (const entry of entries) {
    if (isOnsiteLotteryStaff(entry.name, entry.email)) {
      staff.push(entry);
    } else {
      eligible.push(entry);
    }
  }

  return { eligible, staff };
}
