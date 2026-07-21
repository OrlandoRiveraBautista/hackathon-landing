export const ONSITE_CAPACITY = 30;
export const ONSITE_INTEREST_WEIGHT = 3;
export const ONSITE_BOOST_DAILY_TAP_LIMIT = 100;
export const ONSITE_BOOST_LOTTERY_TAP_CAP = 1000;

export const ONSITE_STATUSES = ["pending", "selected", "remote"] as const;
export type OnsiteStatus = (typeof ONSITE_STATUSES)[number];

export type OnsiteParticipant = {
  id: string;
  name: string;
  school: string;
  github: string;
  onSiteInterested: boolean;
  onSiteBoostTapCount: number;
  onSiteStatus: OnsiteStatus;
};

export function normalizeOnsiteStatus(value: unknown): OnsiteStatus {
  return typeof value === "string" &&
    ONSITE_STATUSES.includes(value as OnsiteStatus)
    ? (value as OnsiteStatus)
    : "pending";
}

export function clampOnsiteBoostTapCount(tapCount: number): number {
  return Math.min(Math.max(0, tapCount), ONSITE_BOOST_LOTTERY_TAP_CAP);
}

export function isOnsiteBoostOpen(config: {
  announced: boolean;
  lotteryRunAt: Date | null;
}): boolean {
  return !config.announced && config.lotteryRunAt === null;
}

/** Lottery weight: 1 for everyone else; boosted users start at 3× and gain +1 per extra tap. */
export function getOnsiteLotteryWeight(participant: OnsiteParticipant): number {
  const taps =
    participant.onSiteBoostTapCount > 0
      ? clampOnsiteBoostTapCount(participant.onSiteBoostTapCount)
      : participant.onSiteInterested
        ? 1
        : 0;

  if (taps <= 0) {
    return 1;
  }

  return ONSITE_INTEREST_WEIGHT + taps - 1;
}

export function pickWeightedOnsiteParticipants<T extends OnsiteParticipant>(
  participants: T[],
  capacity: number,
  random: () => number = Math.random,
): { selected: T[]; remote: T[] } {
  const pool = [...participants];
  const selected: T[] = [];

  while (selected.length < capacity && pool.length > 0) {
    const weights = pool.map((participant) => getOnsiteLotteryWeight(participant));
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
    let threshold = random() * totalWeight;

    let index = 0;
    for (let i = 0; i < pool.length; i += 1) {
      threshold -= weights[i];
      if (threshold <= 0) {
        index = i;
        break;
      }
    }

    selected.push(pool[index]);
    pool.splice(index, 1);
  }

  const selectedIds = new Set(selected.map((participant) => participant.id));
  const remote = participants.filter((participant) => !selectedIds.has(participant.id));

  return { selected, remote };
}

export type OnsiteLotteryPickResult<T extends OnsiteParticipant> = {
  selected: T[];
  remote: T[];
  guaranteedMembers: T[];
  lotterySelected: T[];
};

/** Platform members are auto-selected; remaining spots go to a weighted lottery among waitlist-only entries. */
export function pickOnsiteLotteryParticipants<
  T extends OnsiteParticipant & { isPlatformMember: boolean },
>(
  participants: T[],
  capacity: number,
  random: () => number = Math.random,
): OnsiteLotteryPickResult<T> {
  const platformMembers = participants.filter((participant) => participant.isPlatformMember);
  const waitlistOnly = participants.filter((participant) => !participant.isPlatformMember);

  if (platformMembers.length > capacity) {
    throw new Error(
      `Too many platform members (${platformMembers.length}) for on-site capacity (${capacity}).`,
    );
  }

  const remainingCapacity = capacity - platformMembers.length;
  let lotterySelected: T[] = [];

  if (remainingCapacity > 0) {
    if (waitlistOnly.length < remainingCapacity) {
      throw new Error(
        `Not enough waitlist-only participants (${waitlistOnly.length}) to fill ${remainingCapacity} remaining spot(s).`,
      );
    }

    lotterySelected = pickWeightedOnsiteParticipants(
      waitlistOnly,
      remainingCapacity,
      random,
    ).selected;
  }

  const selected = [...platformMembers, ...lotterySelected];
  const selectedIds = new Set(selected.map((participant) => participant.id));
  const remote = participants.filter((participant) => !selectedIds.has(participant.id));

  return {
    selected,
    remote,
    guaranteedMembers: platformMembers,
    lotterySelected,
  };
}
