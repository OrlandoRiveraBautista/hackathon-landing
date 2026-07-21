import "dotenv/config";
import {
  buildOnsiteLotteryPool,
  ensureWaitlistDocsForCandidates,
  type OnsiteLotteryCandidate,
} from "../lib/onsite-lottery-pool.server";
import {
  ONSITE_CAPACITY,
  getOnsiteLotteryWeight,
  pickOnsiteLotteryParticipants,
} from "../lib/onsite/shared";
import { persistOnsiteLotteryResult } from "../lib/onsite-selection";

function createSeededRandom(seed: number) {
  let state = seed >>> 0;

  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0x1_0000_0000;
  };
}

function printUsage() {
  console.log(`Usage: pnpm onsite:lottery [options]

Runs on-site spot selection for the IRL hackathon.
All platform members are guaranteed a spot; remaining seats are filled by a weighted
lottery among waitlist-only signups (boost taps increase weight).
Staff names are excluded automatically.

Options:
  --capacity=<n>   Number of on-site spots (default: ${ONSITE_CAPACITY})
  --seed=<n>       Fixed random seed for a reproducible dry run
  --apply          Write selected/remote status to Firestore (default: preview only)
  --waitlist-only  Skip Postgres (not recommended; excludes platform-only members)

Examples:
  pnpm onsite:lottery
  pnpm onsite:lottery --seed=42
  pnpm onsite:lottery --capacity=30 --apply

Required env vars:
  NEXT_PUBLIC_FIREBASE_* (all Firebase config vars)
  DATABASE_URL (Neon Postgres — platform members)
`);
}

function parseArgs() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  const apply = args.includes("--apply");
  const waitlistOnly = args.includes("--waitlist-only");
  const capacityArg = args
    .find((arg) => arg.startsWith("--capacity="))
    ?.split("=")[1]
    ?.trim();
  const seedArg = args
    .find((arg) => arg.startsWith("--seed="))
    ?.split("=")[1]
    ?.trim();

  const capacity = capacityArg ? Number.parseInt(capacityArg, 10) : ONSITE_CAPACITY;
  const seed = seedArg ? Number.parseInt(seedArg, 10) : undefined;

  if (!Number.isFinite(capacity) || capacity < 1) {
    console.error("Invalid --capacity value. Use a positive integer.");
    process.exit(1);
  }

  if (seedArg && !Number.isFinite(seed)) {
    console.error("Invalid --seed value. Use an integer.");
    process.exit(1);
  }

  return { apply, capacity, seed, waitlistOnly };
}

function pad(value: string, width: number) {
  return value.length >= width ? value.slice(0, width - 1) + "…" : value.padEnd(width);
}

function average(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function sortSelectedForDisplay(selected: OnsiteLotteryCandidate[]) {
  return [...selected].sort((a, b) => {
    if (a.isPlatformMember !== b.isPlatformMember) {
      return a.isPlatformMember ? -1 : 1;
    }

    return a.name.localeCompare(b.name, "es");
  });
}

function printSelectedTable(selected: OnsiteLotteryCandidate[]) {
  const rows = sortSelectedForDisplay(selected);

  console.log(`IRL HACKATHON — SELECTED (${rows.length})`);
  console.log(
    `${pad("#", 4)} ${pad("Name", 22)} ${pad("Email", 30)} ${pad("From Members", 14)} ${pad("Boosts", 8)} ${pad("Weight", 8)} Interested`,
  );
  console.log("-".repeat(102));

  for (const [index, participant] of rows.entries()) {
    console.log(
      `${pad(String(index + 1), 4)} ${pad(participant.name, 22)} ${pad(participant.email, 30)} ${pad(participant.isPlatformMember ? "yes" : "no", 14)} ${pad(String(participant.onSiteBoostTapCount), 8)} ${pad(String(getOnsiteLotteryWeight(participant)), 8)} ${participant.onSiteInterested ? "yes" : "no"}`,
    );
  }

  console.log("");
}

async function main() {
  const { apply, capacity, seed, waitlistOnly } = parseArgs();
  const pool = await buildOnsiteLotteryPool({ waitlistOnly });
  const participants = pool.eligible;
  const random = seed === undefined ? Math.random : createSeededRandom(seed);

  const waitlistOnlyInPool = pool.stats.eligibleTotal - pool.stats.platformMemberInPool;
  const waitlistSpots = capacity - pool.stats.platformMemberInPool;

  const { selected, remote, guaranteedMembers, lotterySelected } =
    pickOnsiteLotteryParticipants(participants, capacity, random);

  const mode = apply ? "APPLY" : "DRY RUN";
  const seedLabel = seed === undefined ? "random" : `seed ${seed}`;

  console.log("");
  console.log("Build Pa'l Norte — on-site lottery");
  console.log(`Mode: ${mode} (${seedLabel})`);
  console.log(`Capacity: ${capacity}`);
  console.log(
    `Selection: ${guaranteedMembers.length} platform members guaranteed + ${lotterySelected.length} waitlist lottery spot(s)`,
  );
  const nonStaffMembers =
    pool.stats.platformMemberTotal - pool.stats.platformMemberStaffExcluded;
  const waitlistOnlyEligible = pool.stats.eligibleTotal - pool.stats.platformMemberInPool;
  console.log(
    `Pool: ${pool.stats.eligibleTotal} eligible (${pool.stats.platformMemberInPool} platform members + ${waitlistOnlyEligible} waitlist-only; ${nonStaffMembers}/${pool.stats.platformMemberTotal} non-staff members included)`,
  );
  if (pool.staff.length > 0) {
    console.log(
      `Staff excluded (${pool.staff.length}, ${pool.stats.platformMemberStaffExcluded} platform members): ${pool.staff.map((entry) => entry.name).join(", ")}`,
    );
  }
  if (pool.shadowWaitlistDropped.length > 0) {
    console.log(
      `Duplicate waitlist entries dropped (${pool.shadowWaitlistDropped.length}): ${pool.shadowWaitlistDropped
        .map((entry) => `${entry.email} → member ${entry.memberEmail}`)
        .join(", ")}`,
    );
  }
  if (pool.duplicateMembersExcluded.length > 0) {
    console.log(
      `Duplicate member accounts excluded (${pool.duplicateMembersExcluded.length}): ${pool.duplicateMembersExcluded
        .map((entry) => entry.email)
        .join(", ")}`,
    );
  }
  if (waitlistOnly) {
    console.warn(
      "WARNING: --waitlist-only skips Postgres. Platform-only members are not in this pool.",
    );
  }
  console.log(`Run at: ${new Date().toISOString()}`);
  console.log("");

  printSelectedTable(selected);

  const selectedBoosts = selected.map((participant) => participant.onSiteBoostTapCount);
  const poolBoosts = participants.map((participant) => participant.onSiteBoostTapCount);

  console.log("Summary");
  console.log(`  Remote (not selected): ${remote.length}`);
  console.log(
    `  Platform members guaranteed: ${guaranteedMembers.length}/${pool.stats.platformMemberInPool}`,
  );
  console.log(
    `  Waitlist-only lottery winners: ${lotterySelected.length}/${waitlistSpots || 0} spot(s)`,
  );
  console.log(`  Selected with boost taps: ${selected.filter((p) => p.onSiteBoostTapCount > 0).length}/${selected.length}`);
  console.log(`  Selected marked interested: ${selected.filter((p) => p.onSiteInterested).length}/${selected.length}`);
  console.log(`  Avg boost taps (selected): ${average(selectedBoosts).toFixed(1)}`);
  console.log(`  Avg boost taps (pool): ${average(poolBoosts).toFixed(1)}`);
  console.log("");

  if (apply) {
    await ensureWaitlistDocsForCandidates([...selected, ...remote]);
    await persistOnsiteLotteryResult(selected, remote, capacity);
    console.log("Firestore updated: onSiteStatus set to selected/remote.");
    console.log(
      "Platform-only members without a waitlist doc received a minimal waitlist record when needed.",
    );
    console.log("Config updated: lotteryRunAt recorded, announced=false.");
  } else {
    console.log("Dry run only — no Firestore changes.");
    console.log("Re-run with --apply to persist this exact result (use the same --seed if set).");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("On-site lottery failed:", error);
    process.exit(1);
  });
