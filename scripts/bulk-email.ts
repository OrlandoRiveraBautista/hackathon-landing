import "dotenv/config";
import {
  getBulkEmailTemplate,
  isBulkEmailTemplateId,
  type BulkEmailTemplateId,
} from "../lib/emails/bulk-templates";
import { defaultLocale, isLocale, type Locale } from "../lib/i18n";
import {
  getWaitlistSignupByEmail,
  getWaitlistSignups,
  type WaitlistSignup,
} from "../lib/waitlist-admin";

const SEND_DELAY_MS = 150;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printUsage() {
  console.log(`Usage: pnpm email:bulk --template=<id> [options]

Templates:
  waitlist          Waitlist confirmation (marks status as contacted)
  platform-access   Member portal is open (marks platformNotifiedAt)

Recipient modes:
  No --email flags  Send to all waitlist users matching the template filter
  --email=<addr>    Send to specific address(es); looks up name in Firestore
                    Repeat or comma-separate: --email=a@b.com --email=c@d.com

Options:
  --dry-run           List recipients without sending or updating Firestore
  --locale=<en|es>    Email language (default: ${defaultLocale})
  --limit=<n>         Max number of emails to send (bulk mode only)
  --all               Include users already sent this template (bulk mode only)
  --skip-mark         Send without updating Firestore tracking fields

Examples:
  pnpm email:bulk --template=platform-access --dry-run
  pnpm email:bulk --template=platform-access --locale=es
  pnpm email:bulk --template=platform-access --limit=5
  pnpm email:bulk --template=platform-access --email=you@example.com
  pnpm email:bulk --template=waitlist --email=you@example.com --skip-mark

Required env vars:
  RESEND_API_KEY
  RESEND_FROM
  NEXT_PUBLIC_FIREBASE_* (all Firebase config vars)
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const includeAll = args.includes("--all");
  const skipMark = args.includes("--skip-mark");
  const templateArg =
    args.find((arg) => arg.startsWith("--template="))?.split("=")[1]?.trim() ??
    "";
  const localeArg =
    args.find((arg) => arg.startsWith("--locale="))?.split("=")[1]?.trim() ??
    defaultLocale;
  const limitArg = args
    .find((arg) => arg.startsWith("--limit="))
    ?.split("=")[1]
    ?.trim();
  const limit = limitArg ? Number.parseInt(limitArg, 10) : undefined;
  const emails = args
    .filter((arg) => arg.startsWith("--email="))
    .flatMap((arg) =>
      arg
        .slice("--email=".length)
        .split(",")
        .map((email) => email.trim().toLowerCase())
        .filter(Boolean),
    );

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  if (!isBulkEmailTemplateId(templateArg)) {
    console.error(
      `Missing or invalid --template. Expected one of: ${Object.keys(
        { waitlist: 1, "platform-access": 1 },
      ).join(", ")}`,
    );
    printUsage();
    process.exit(1);
  }

  return {
    dryRun,
    includeAll,
    skipMark,
    template: templateArg,
    locale: isLocale(localeArg) ? localeArg : defaultLocale,
    limit: Number.isInteger(limit) && limit! > 0 ? limit : undefined,
    emails,
  };
}

async function resolveRecipients({
  template,
  emails,
  includeAll,
  limit,
}: {
  template: BulkEmailTemplateId;
  emails: string[];
  includeAll: boolean;
  limit?: number;
}) {
  const config = getBulkEmailTemplate(template);

  if (emails.length > 0) {
    const signups: WaitlistSignup[] = [];
    const missing: string[] = [];

    for (const email of emails) {
      const signup = await getWaitlistSignupByEmail(email);
      if (!signup) {
        missing.push(email);
        continue;
      }
      signups.push(signup);
    }

    return { signups, missing, mode: "explicit" as const, config };
  }

  const allSignups = await getWaitlistSignups();
  const pending = allSignups.filter((signup) =>
    config.shouldSend(signup, { all: includeAll }),
  );
  const signups = limit ? pending.slice(0, limit) : pending;

  return {
    signups,
    missing: [] as string[],
    mode: "bulk" as const,
    total: allSignups.length,
    pendingCount: pending.length,
    config,
  };
}

function formatSignupLine(signup: WaitlistSignup) {
  const details = [
    signup.name,
    signup.email,
    signup.status,
    signup.school !== "—" ? signup.school : null,
    signup.platformNotifiedAt
      ? `platform notified ${signup.platformNotifiedAt.toISOString()}`
      : null,
    signup.contactedAt
      ? `contacted ${signup.contactedAt.toISOString()}`
      : null,
  ]
    .filter(Boolean)
    .join(" · ");

  return `  - ${details}`;
}

async function sendToSignup({
  signup,
  locale,
  template,
  skipMark,
}: {
  signup: WaitlistSignup;
  locale: Locale;
  template: BulkEmailTemplateId;
  skipMark: boolean;
}) {
  const config = getBulkEmailTemplate(template);

  process.stdout.write(`Sending to ${signup.email} (${signup.name})... `);

  const { data, error } = await config.send({
    to: signup.email,
    name: signup.name,
    locale,
  });

  if (error) {
    console.log("failed");
    console.error(error);
    return { sent: false };
  }

  if (skipMark) {
    console.log(`sent (${data?.id}), tracking skipped`);
    return { sent: true };
  }

  try {
    await config.markSent(signup.id);
    console.log(`sent (${data?.id})`);
    return { sent: true };
  } catch (updateError) {
    console.log("sent, but Firestore update failed");
    console.error(updateError);
    return { sent: false };
  }
}

async function main() {
  const { dryRun, includeAll, skipMark, template, locale, limit, emails } =
    parseArgs();
  const resolved = await resolveRecipients({
    template,
    emails,
    includeAll,
    limit,
  });
  const { signups, missing, config } = resolved;

  console.log(`Template: ${config.label} (${template})`);

  if (resolved.mode === "bulk") {
    console.log(`Found ${resolved.total} waitlist signup(s).`);
    console.log(
      includeAll
        ? `Sending to all ${resolved.pendingCount} signup(s).`
        : `${resolved.pendingCount} ${config.pendingDescription}.`,
    );
  } else if (emails.length > 0) {
    console.log(`Looking up ${emails.length} email(s) in Firestore.`);
    for (const email of missing) {
      console.error(`  ! No waitlist signup found for ${email}`);
    }
    console.log(`Resolved ${signups.length} signup(s).`);
  }

  if (signups.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  if (dryRun) {
    console.log(
      `Dry run — would send ${signups.length} email(s) (${locale}):`,
    );
    for (const signup of signups) {
      console.log(formatSignupLine(signup));
    }
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const signup of signups) {
    const result = await sendToSignup({
      signup,
      locale,
      template,
      skipMark,
    });

    if (result.sent) {
      sent += 1;
    } else {
      failed += 1;
    }

    await sleep(SEND_DELAY_MS);
  }

  console.log(`Done. Sent: ${sent}, failed: ${failed}.`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
