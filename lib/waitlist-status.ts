export const WAITLIST_STATUSES = ["pending", "contacted"] as const;

export type WaitlistStatus = (typeof WAITLIST_STATUSES)[number];

export function isWaitlistStatus(value: unknown): value is WaitlistStatus {
  return (
    typeof value === "string" &&
    WAITLIST_STATUSES.includes(value as WaitlistStatus)
  );
}

export function normalizeWaitlistStatus(value: unknown): WaitlistStatus {
  return isWaitlistStatus(value) ? value : "pending";
}
