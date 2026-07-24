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
import {
  ONSITE_BOOST_DAILY_TAP_LIMIT,
  ONSITE_CAPACITY,
  normalizeOnsiteStatus,
  pickOnsiteLotteryParticipants,
  type OnsiteParticipant,
  type OnsiteStatus,
} from "./onsite/shared";

export {
  clampOnsiteBoostTapCount,
  getOnsiteLotteryWeight,
  isOnsiteBoostOpen,
  normalizeOnsiteStatus,
  ONSITE_BOOST_DAILY_TAP_LIMIT,
  ONSITE_BOOST_LOTTERY_TAP_CAP,
  ONSITE_CAPACITY,
  ONSITE_INTEREST_WEIGHT,
  ONSITE_STATUSES,
  pickOnsiteLotteryParticipants,
  type OnsiteParticipant,
  type OnsiteStatus,
} from "./onsite/shared";

export class OnsiteBoostDailyLimitError extends Error {
  readonly resetsAt: Date;

  constructor(resetsAt: Date) {
    super("On-site boost daily tap limit reached.");
    this.name = "OnsiteBoostDailyLimitError";
    this.resetsAt = resetsAt;
  }
}

const ONSITE_BOOST_TIMEZONE = "America/Matamoros";

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

export type OnsiteSelectionConfig = {
  announced: boolean;
  capacity: number;
  selectedAt: Date | null;
  lotteryRunAt: Date | null;
  lotteryPreview: OnsiteLotteryPreview | null;
};

export type OnsiteLotteryPreviewParticipant = {
  id: string;
  name: string;
  email: string;
  school: string;
  github: string;
  isPlatformMember: boolean;
  onSiteBoostTapCount: number;
  onSiteInterested: boolean;
  hasWaitlistDoc: boolean;
};

export type OnsiteLotteryPreview = {
  selected: OnsiteLotteryPreviewParticipant[];
  remote: OnsiteLotteryPreviewParticipant[];
  guaranteedMemberCount: number;
  lotteryWinnerCount: number;
  platformMemberInPool: number;
  platformMemberTotal: number;
  waitlistOnlyInPool: number;
  duplicateMembersExcluded: string[];
  shadowWaitlistDropped: Array<{ email: string; memberEmail: string }>;
};

export type OnsiteAdminSnapshot = {
  announced: boolean;
  capacity: number;
  selectedAt: string | null;
  lotteryRunAt: string | null;
  interestedCount: number;
  waitlistCount: number;
  preview: OnsiteLotteryPreview | null;
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

export type OnsiteSelectionSnapshot = {
  config: OnsiteSelectionConfig;
  selected: OnsiteParticipant[];
  remote: OnsiteParticipant[];
  interestedCount: number;
  waitlistCount: number;
};

function defaultConfig(): OnsiteSelectionConfig {
  return {
    announced: false,
    capacity: ONSITE_CAPACITY,
    selectedAt: null,
    lotteryRunAt: null,
    lotteryPreview: null,
  };
}

function mapPreviewParticipant(
  value: unknown,
): OnsiteLotteryPreviewParticipant | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  if (typeof data.id !== "string" || typeof data.name !== "string") {
    return null;
  }

  return {
    id: data.id,
    name: data.name,
    email: typeof data.email === "string" ? data.email : "",
    school: typeof data.school === "string" ? data.school : "",
    github: typeof data.github === "string" ? data.github : "",
    isPlatformMember: data.isPlatformMember === true,
    onSiteBoostTapCount:
      typeof data.onSiteBoostTapCount === "number" ? data.onSiteBoostTapCount : 0,
    onSiteInterested: data.onSiteInterested === true,
    hasWaitlistDoc: data.hasWaitlistDoc === true,
  };
}

function mapLotteryPreview(value: unknown): OnsiteLotteryPreview | null {
  if (!value || typeof value !== "object") {
    return null;
  }

  const data = value as Record<string, unknown>;
  const selected = Array.isArray(data.selected)
    ? data.selected
        .map(mapPreviewParticipant)
        .filter((participant): participant is OnsiteLotteryPreviewParticipant =>
          participant !== null,
        )
    : [];
  const remote = Array.isArray(data.remote)
    ? data.remote
        .map(mapPreviewParticipant)
        .filter((participant): participant is OnsiteLotteryPreviewParticipant =>
          participant !== null,
        )
    : [];

  if (selected.length === 0) {
    return null;
  }

  return {
    selected,
    remote,
    guaranteedMemberCount:
      typeof data.guaranteedMemberCount === "number" ? data.guaranteedMemberCount : 0,
    lotteryWinnerCount:
      typeof data.lotteryWinnerCount === "number" ? data.lotteryWinnerCount : 0,
    platformMemberInPool:
      typeof data.platformMemberInPool === "number" ? data.platformMemberInPool : 0,
    platformMemberTotal:
      typeof data.platformMemberTotal === "number" ? data.platformMemberTotal : 0,
    waitlistOnlyInPool:
      typeof data.waitlistOnlyInPool === "number" ? data.waitlistOnlyInPool : 0,
    duplicateMembersExcluded: Array.isArray(data.duplicateMembersExcluded)
      ? data.duplicateMembersExcluded.filter(
          (email): email is string => typeof email === "string",
        )
      : [],
    shadowWaitlistDropped: Array.isArray(data.shadowWaitlistDropped)
      ? data.shadowWaitlistDropped
          .map((entry) => {
            if (!entry || typeof entry !== "object") {
              return null;
            }

            const record = entry as Record<string, unknown>;
            if (
              typeof record.email !== "string" ||
              typeof record.memberEmail !== "string"
            ) {
              return null;
            }

            return {
              email: record.email,
              memberEmail: record.memberEmail,
            };
          })
          .filter((entry): entry is { email: string; memberEmail: string } => entry !== null)
      : [],
  };
}

function mapConfig(data: DocumentData): OnsiteSelectionConfig {
  return {
    announced: data.announced === true,
    capacity:
      typeof data.capacity === "number" && data.capacity > 0
        ? data.capacity
        : ONSITE_CAPACITY,
    selectedAt: data.selectedAt?.toDate?.() ?? null,
    lotteryRunAt: data.lotteryRunAt?.toDate?.() ?? null,
    lotteryPreview: mapLotteryPreview(data.lotteryPreview),
  };
}

export async function getOnsiteSelectionConfig(): Promise<OnsiteSelectionConfig> {
  const snapshot = await getDoc(doc(getDb(), ...CONFIG_PATH));

  if (!snapshot.exists()) {
    return defaultConfig();
  }

  const data = snapshot.data();
  return mapConfig(data);
}

export async function getOnsiteAdminSnapshot(): Promise<OnsiteAdminSnapshot> {
  const [config, snapshot] = await Promise.all([
    getOnsiteSelectionConfig(),
    getOnsiteSelectionSnapshot(),
  ]);

  return {
    announced: config.announced,
    capacity: config.capacity,
    selectedAt: config.selectedAt?.toISOString() ?? null,
    lotteryRunAt: config.lotteryRunAt?.toISOString() ?? null,
    interestedCount: snapshot.interestedCount,
    waitlistCount: snapshot.waitlistCount,
    preview: config.lotteryPreview,
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

  const waitlistSelected = participants
    .filter((participant) => participant.onSiteStatus === "selected")
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const waitlistRemote = participants
    .filter((participant) => participant.onSiteStatus === "remote")
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const selected =
    config.announced && config.lotteryPreview
      ? config.lotteryPreview.selected
          .map((preview) => participantFromPreview(preview))
          .sort((a, b) => a.name.localeCompare(b.name, "es"))
      : waitlistSelected;

  const remote =
    config.announced && config.lotteryPreview
      ? config.lotteryPreview.remote
          .map((preview) => participantFromPreview(preview))
          .sort((a, b) => a.name.localeCompare(b.name, "es"))
      : waitlistRemote;

  return {
    config,
    selected,
    remote,
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

export async function persistOnsiteLotteryResult(
  selected: OnsiteParticipant[],
  remote: OnsiteParticipant[],
  capacity = ONSITE_CAPACITY,
) {
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
        capacity,
      },
      { merge: true },
    ),
  ]);
}

function previewParticipantFromCandidate(
  candidate: Awaited<
    ReturnType<
      typeof import("./onsite-lottery-pool.server").buildOnsiteLotteryPool
    >
  >["eligible"][number],
): OnsiteLotteryPreviewParticipant {
  return {
    id: candidate.id,
    name: candidate.name,
    email: candidate.email,
    school: candidate.school,
    github: candidate.github,
    isPlatformMember: candidate.isPlatformMember,
    onSiteBoostTapCount: candidate.onSiteBoostTapCount,
    onSiteInterested: candidate.onSiteInterested,
    hasWaitlistDoc: candidate.hasWaitlistDoc,
  };
}

function participantFromPreview(
  preview: OnsiteLotteryPreviewParticipant,
): OnsiteParticipant {
  return {
    id: preview.id,
    name: preview.name,
    school: preview.school,
    github: preview.github,
    onSiteInterested: preview.onSiteInterested,
    onSiteBoostTapCount: preview.onSiteBoostTapCount,
    onSiteStatus: "pending",
  };
}

function candidateFromPreview(
  preview: OnsiteLotteryPreviewParticipant,
): import("./onsite-lottery-pool.server").OnsiteLotteryCandidate {
  return {
    ...participantFromPreview(preview),
    email: preview.email,
    hasWaitlistDoc: preview.hasWaitlistDoc,
    isPlatformMember: preview.isPlatformMember,
    phone: null,
    age: null,
    sex: null,
  };
}

async function saveOnsiteLotteryPreview(
  preview: OnsiteLotteryPreview,
  capacity: number,
) {
  await setDoc(
    doc(getDb(), ...CONFIG_PATH),
    {
      announced: false,
      capacity,
      lotteryRunAt: serverTimestamp(),
      lotteryPreview: preview,
    },
    { merge: true },
  );
}

export async function runOnsiteLottery(capacity = ONSITE_CAPACITY) {
  const { buildOnsiteLotteryPool } = await import("./onsite-lottery-pool.server");

  const pool = await buildOnsiteLotteryPool();
  const { selected, remote, guaranteedMembers, lotterySelected } =
    pickOnsiteLotteryParticipants(pool.eligible, capacity);

  const preview: OnsiteLotteryPreview = {
    selected: selected.map(previewParticipantFromCandidate),
    remote: remote.map(previewParticipantFromCandidate),
    guaranteedMemberCount: guaranteedMembers.length,
    lotteryWinnerCount: lotterySelected.length,
    platformMemberInPool: pool.stats.platformMemberInPool,
    platformMemberTotal: pool.stats.platformMemberTotal,
    waitlistOnlyInPool:
      pool.stats.eligibleTotal - pool.stats.platformMemberInPool,
    duplicateMembersExcluded: pool.duplicateMembersExcluded.map(
      (entry) => entry.email,
    ),
    shadowWaitlistDropped: pool.shadowWaitlistDropped.map((entry) => ({
      email: entry.email,
      memberEmail: entry.memberEmail,
    })),
  };

  await saveOnsiteLotteryPreview(preview, capacity);

  return {
    selectedCount: preview.selected.length,
    remoteCount: preview.remote.length,
    interestedSelected: preview.selected.filter((participant) => participant.onSiteInterested)
      .length,
    guaranteedMemberCount: preview.guaranteedMemberCount,
    lotteryWinnerCount: preview.lotteryWinnerCount,
    platformMemberInPool: preview.platformMemberInPool,
    platformMemberTotal: preview.platformMemberTotal,
    selected: preview.selected,
    preview,
  };
}

export async function announceOnsiteSelection() {
  const config = await getOnsiteSelectionConfig();
  if (!config.lotteryPreview) {
    throw new Error("Run the lottery before announcing results.");
  }

  const { ensureWaitlistDocsForCandidates } = await import(
    "./onsite-lottery-pool.server"
  );
  const preview = config.lotteryPreview;
  const selected = preview.selected.map(participantFromPreview);
  const remote = preview.remote.map(participantFromPreview);
  const candidates = [...preview.selected, ...preview.remote].map(candidateFromPreview);

  await ensureWaitlistDocsForCandidates(candidates);
  await persistOnsiteLotteryResult(selected, remote, config.capacity);
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
        lotteryPreview: deleteField(),
      },
      { merge: true },
    ),
  ]);
}
