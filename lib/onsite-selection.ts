import {
  collection,
  deleteField,
  doc,
  getDoc,
  getDocs,
  increment,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "./firebase";

export const ONSITE_CAPACITY = 30;
export const ONSITE_INTEREST_WEIGHT = 3;
export const ONSITE_BOOST_DAILY_TAP_LIMIT = 100;
export const ONSITE_BOOST_LOTTERY_TAP_CAP = 1000;
export const ONSITE_BOOST_TIMEZONE = "America/Matamoros";

export class OnsiteBoostDailyLimitError extends Error {
  readonly resetsAt: Date;

  constructor(resetsAt: Date) {
    super("On-site boost daily tap limit reached.");
    this.name = "OnsiteBoostDailyLimitError";
    this.resetsAt = resetsAt;
  }
}

export function clampOnsiteBoostTapCount(tapCount: number): number {
  return Math.min(Math.max(0, tapCount), ONSITE_BOOST_LOTTERY_TAP_CAP);
}

type BoostDayParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
};

function getBoostDayParts(date: Date): BoostDayParts {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: ONSITE_BOOST_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(date);

  const read = (type: string) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
  };
}

export function getBoostDayKey(now = new Date()): string {
  const parts = getBoostDayParts(now);
  const month = String(parts.month).padStart(2, "0");
  const day = String(parts.day).padStart(2, "0");
  return `${parts.year}-${month}-${day}`;
}

export function getBoostDayIndex(now = new Date()): number {
  const parts = getBoostDayParts(now);
  return parts.year * 10000 + parts.month * 100 + parts.day;
}

export function getBoostCooldownUntil(now = new Date()): Date {
  const todayKey = getBoostDayKey(now);

  for (let hours = 1; hours <= 30; hours += 1) {
    const candidate = new Date(now.getTime() + hours * 3600 * 1000);
    if (getBoostDayKey(candidate) === todayKey) {
      continue;
    }

    for (let minutes = 0; minutes < 60; minutes += 1) {
      const precise = new Date(candidate.getTime() - minutes * 60 * 1000);
      const parts = getBoostDayParts(precise);
      if (
        getBoostDayKey(precise) !== todayKey &&
        parts.hour === 0 &&
        parts.minute === 0
      ) {
        return precise;
      }
    }

    return candidate;
  }

  return new Date(now.getTime() + 24 * 3600 * 1000);
}

export type OnsiteBoostDailyStatus = {
  dayKey: string;
  dailyTapCount: number;
  dailyTapLimit: number;
  dailyLimitReached: boolean;
  cooldownUntil: Date | null;
  totalTapCount: number;
};

type BoostDailySource = {
  onSiteBoostTapCount?: unknown;
  onSiteBoostDailyKey?: unknown;
  onSiteBoostDailyCount?: unknown;
  onSiteBoostCooldownUntil?: { toDate?: () => Date } | Date | null;
};

function readBoostCooldownUntil(
  value: BoostDailySource["onSiteBoostCooldownUntil"],
): Date | null {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  return value.toDate?.() ?? null;
}

export function getBoostDailyStatus(
  data: BoostDailySource,
  now = new Date(),
): OnsiteBoostDailyStatus {
  const todayKey = getBoostDayKey(now);
  const totalTapCount =
    typeof data.onSiteBoostTapCount === "number" ? data.onSiteBoostTapCount : 0;
  const storedKey =
    typeof data.onSiteBoostDailyKey === "string" ? data.onSiteBoostDailyKey : null;
  const storedCount =
    typeof data.onSiteBoostDailyCount === "number" ? data.onSiteBoostDailyCount : 0;
  const storedCooldown = readBoostCooldownUntil(data.onSiteBoostCooldownUntil);

  const dailyTapCount = storedKey === todayKey ? storedCount : 0;
  const dailyLimitReached = dailyTapCount >= ONSITE_BOOST_DAILY_TAP_LIMIT;
  const cooldownUntil =
    dailyLimitReached || (storedCooldown && storedCooldown > now)
      ? storedCooldown && storedCooldown > now
        ? storedCooldown
        : getBoostCooldownUntil(now)
      : null;

  return {
    dayKey: todayKey,
    dailyTapCount,
    dailyTapLimit: ONSITE_BOOST_DAILY_TAP_LIMIT,
    dailyLimitReached,
    cooldownUntil,
    totalTapCount,
  };
}

export const ONSITE_STATUSES = ["pending", "selected", "remote"] as const;
export type OnsiteStatus = (typeof ONSITE_STATUSES)[number];

export function normalizeOnsiteStatus(value: unknown): OnsiteStatus {
  return typeof value === "string" &&
    ONSITE_STATUSES.includes(value as OnsiteStatus)
    ? (value as OnsiteStatus)
    : "pending";
}

export type OnsiteSelectionConfig = {
  announced: boolean;
  capacity: number;
  selectedAt: Date | null;
  lotteryRunAt: Date | null;
};

export type OnsiteParticipant = {
  id: string;
  name: string;
  school: string;
  github: string;
  onSiteInterested: boolean;
  onSiteBoostTapCount: number;
  onSiteStatus: OnsiteStatus;
};

export type OnsiteSelectionSnapshot = {
  config: OnsiteSelectionConfig;
  selected: OnsiteParticipant[];
  interestedCount: number;
  waitlistCount: number;
};

const CONFIG_PATH = ["config", "onsite-selection"] as const;

function mapParticipant(id: string, data: DocumentData): OnsiteParticipant {
  return {
    id,
    name: data.name as string,
    school: (data.school as string | undefined) ?? "",
    github: (data.github as string | undefined) ?? "",
    onSiteInterested: data.onSiteInterested === true,
    onSiteBoostTapCount:
      typeof data.onSiteBoostTapCount === "number" ? data.onSiteBoostTapCount : 0,
    onSiteStatus: normalizeOnsiteStatus(data.onSiteStatus),
  };
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

function defaultConfig(): OnsiteSelectionConfig {
  return {
    announced: false,
    capacity: ONSITE_CAPACITY,
    selectedAt: null,
    lotteryRunAt: null,
  };
}

export async function getOnsiteSelectionConfig(): Promise<OnsiteSelectionConfig> {
  const snapshot = await getDoc(doc(getDb(), ...CONFIG_PATH));

  if (!snapshot.exists()) {
    return defaultConfig();
  }

  const data = snapshot.data();
  return {
    announced: data.announced === true,
    capacity:
      typeof data.capacity === "number" && data.capacity > 0
        ? data.capacity
        : ONSITE_CAPACITY,
    selectedAt: data.selectedAt?.toDate?.() ?? null,
    lotteryRunAt: data.lotteryRunAt?.toDate?.() ?? null,
  };
}

export async function getOnsiteSelectionSnapshot(): Promise<OnsiteSelectionSnapshot> {
  const [config, waitlistSnapshot] = await Promise.all([
    getOnsiteSelectionConfig(),
    getDocs(query(collection(getDb(), "waitlist"))),
  ]);

  const participants = waitlistSnapshot.docs.map((entry) =>
    mapParticipant(entry.id, entry.data()),
  );

  const selected = participants
    .filter((participant) => participant.onSiteStatus === "selected")
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  return {
    config,
    selected,
    interestedCount: participants.filter((participant) => participant.onSiteInterested)
      .length,
    waitlistCount: participants.length,
  };
}

export async function getOnsiteStatusForDocId(docId: string): Promise<{
  onSiteInterested: boolean;
  onSiteInterestedAt: Date | null;
  onSiteStatus: OnsiteStatus;
  onSiteBoostTapCount: number;
  boostDaily: OnsiteBoostDailyStatus;
}> {
  const snapshot = await getDoc(doc(getDb(), "waitlist", docId));
  if (!snapshot.exists()) {
    return {
      onSiteInterested: false,
      onSiteInterestedAt: null,
      onSiteStatus: "pending",
      onSiteBoostTapCount: 0,
      boostDaily: getBoostDailyStatus({}),
    };
  }

  const data = snapshot.data();
  return {
    onSiteInterested: data.onSiteInterested === true,
    onSiteInterestedAt: data.onSiteInterestedAt?.toDate?.() ?? null,
    onSiteStatus: normalizeOnsiteStatus(data.onSiteStatus),
    onSiteBoostTapCount:
      typeof data.onSiteBoostTapCount === "number" ? data.onSiteBoostTapCount : 0,
    boostDaily: getBoostDailyStatus(data),
  };
}

export async function recordOnsiteBoostTap(docId: string) {
  const ref = doc(getDb(), "waitlist", docId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) {
    throw new Error("Waitlist signup not found.");
  }

  const data = snapshot.data();
  const wasAlreadyInterested = data.onSiteInterested === true;
  const dailyStatus = getBoostDailyStatus(data);

  if (dailyStatus.dailyLimitReached) {
    throw new OnsiteBoostDailyLimitError(
      dailyStatus.cooldownUntil ?? getBoostCooldownUntil(),
    );
  }

  const nextDailyCount = dailyStatus.dailyTapCount + 1;
  const payload: Record<string, unknown> = {
    onSiteBoostTapCount: increment(1),
    onSiteBoostDailyKey: dailyStatus.dayKey,
    onSiteBoostDailyCount: nextDailyCount,
    onSiteBoostDayIndex: getBoostDayIndex(),
  };

  if (nextDailyCount >= ONSITE_BOOST_DAILY_TAP_LIMIT) {
    payload.onSiteBoostCooldownUntil = getBoostCooldownUntil();
  } else if ("onSiteBoostCooldownUntil" in data) {
    payload.onSiteBoostCooldownUntil = deleteField();
  }

  if (!wasAlreadyInterested) {
    payload.onSiteInterested = true;
    payload.onSiteInterestedAt = serverTimestamp();
  }

  await updateDoc(ref, payload);

  return {
    tapCount: dailyStatus.totalTapCount + 1,
    dailyTapCount: nextDailyCount,
    dailyTapLimit: ONSITE_BOOST_DAILY_TAP_LIMIT,
    dailyLimitReached: nextDailyCount >= ONSITE_BOOST_DAILY_TAP_LIMIT,
    cooldownUntil:
      nextDailyCount >= ONSITE_BOOST_DAILY_TAP_LIMIT
        ? (payload.onSiteBoostCooldownUntil as Date)
        : null,
    wasAlreadyInterested,
  };
}

export async function markOnsiteInterested(docId: string) {
  await updateDoc(doc(getDb(), "waitlist", docId), {
    onSiteInterested: true,
    onSiteInterestedAt: serverTimestamp(),
  });
}

export function pickWeightedOnsiteParticipants(
  participants: OnsiteParticipant[],
  capacity: number,
  random: () => number = Math.random,
): { selected: OnsiteParticipant[]; remote: OnsiteParticipant[] } {
  const pool = [...participants];
  const selected: OnsiteParticipant[] = [];

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

export async function runOnsiteLottery(capacity = ONSITE_CAPACITY) {
  const snapshot = await getDocs(query(collection(getDb(), "waitlist")));
  const participants = snapshot.docs.map((entry) =>
    mapParticipant(entry.id, entry.data()),
  );

  const { selected, remote } = pickWeightedOnsiteParticipants(
    participants,
    capacity,
  );

  await Promise.all([
    ...selected.map((participant) =>
      updateDoc(doc(getDb(), "waitlist", participant.id), {
        onSiteStatus: "selected",
        onSiteSelectedAt: serverTimestamp(),
      }),
    ),
    ...remote.map((participant) =>
      updateDoc(doc(getDb(), "waitlist", participant.id), {
        onSiteStatus: "remote",
        onSiteSelectedAt: serverTimestamp(),
      }),
    ),
    setDoc(
      doc(getDb(), ...CONFIG_PATH),
      {
        announced: false,
        capacity,
        lotteryRunAt: serverTimestamp(),
      },
      { merge: true },
    ),
  ]);

  return {
    selectedCount: selected.length,
    remoteCount: remote.length,
    interestedSelected: selected.filter((participant) => participant.onSiteInterested)
      .length,
  };
}

export async function announceOnsiteSelection() {
  await setDoc(
    doc(getDb(), ...CONFIG_PATH),
    {
      announced: true,
      selectedAt: serverTimestamp(),
    },
    { merge: true },
  );
}

export async function resetOnsiteSelection() {
  const snapshot = await getDocs(query(collection(getDb(), "waitlist")));

  await Promise.all([
    ...snapshot.docs.map((entry) =>
      updateDoc(entry.ref, {
        onSiteStatus: "pending",
        onSiteSelectedAt: deleteField(),
        onSiteBoostTapCount: deleteField(),
        onSiteBoostDailyKey: deleteField(),
        onSiteBoostDailyCount: deleteField(),
        onSiteBoostDayIndex: deleteField(),
        onSiteBoostCooldownUntil: deleteField(),
        onSiteInterested: deleteField(),
        onSiteInterestedAt: deleteField(),
      }),
    ),
    setDoc(
      doc(getDb(), ...CONFIG_PATH),
      {
        announced: false,
        capacity: ONSITE_CAPACITY,
        selectedAt: null,
        lotteryRunAt: null,
      },
      { merge: true },
    ),
  ]);
}
