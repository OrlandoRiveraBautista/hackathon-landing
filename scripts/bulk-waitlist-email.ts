import "dotenv/config";
import { sendWaitlistConfirmation } from "../lib/emails/send-waitlist-confirmation";
import { isLocale } from "../lib/i18n";
import { getWaitlistSignups } from "../lib/waitlist-admin";
import { markWaitlistContacted } from "../lib/waitlist-contact";

const SEND_DELAY_MS = 150;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function printUsage() {
  console.log(`Usage: pnpm email:bulk-waitlist [options]

Options:
  --dry-run           List recipients without sending or updating status
  --locale=<en|es>    Email language (default: en)
  --limit=<n>         Max number of emails to send

Examples:
  pnpm email:bulk-waitlist --dry-run
  pnpm email:bulk-waitlist --locale=es
  pnpm email:bulk-waitlist --limit=10

Required env vars:
  RESEND_API_KEY
  RESEND_FROM
  NEXT_PUBLIC_FIREBASE_* (all Firebase config vars)
`);
}

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run");
  const localeArg =
    args.find((arg) => arg.startsWith("--locale="))?.split("=")[1]?.trim() ??
    "en";
  const limitArg = args
    .find((arg) => arg.startsWith("--limit="))
    ?.split("=")[1]
    ?.trim();
  const limit = limitArg ? Number.parseInt(limitArg, 10) : undefined;

  if (args.includes("--help") || args.includes("-h")) {
    printUsage();
    process.exit(0);
  }

  return {
    dryRun,
    locale: isLocale(localeArg) ? localeArg : "en",
    limit: Number.isInteger(limit) && limit! > 0 ? limit : undefined,
  };
}

async function main() {
  const { dryRun, locale, limit } = parseArgs();
  const signups = await getWaitlistSignups();
  const pending = signups.filter((signup) => signup.status !== "contacted");
  const recipients = limit ? pending.slice(0, limit) : pending;

  console.log(`Found ${signups.length} waitlist signup(s).`);
  console.log(`${pending.length} not yet contacted.`);

  if (recipients.length === 0) {
    console.log("Nothing to do.");
    return;
  }

  if (dryRun) {
    console.log(`Dry run — would send ${recipients.length} email(s) (${locale}):`);
    for (const signup of recipients) {
      console.log(`  - ${signup.name} <${signup.email}>`);
    }
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const signup of recipients) {
    process.stdout.write(`Sending to ${signup.email}... `);

    const { data, error } = await sendWaitlistConfirmation({
      to: signup.email,
      name: signup.name,
      locale,
    });

    if (error) {
      failed += 1;
      console.log("failed");
      console.error(error);
      continue;
    }

    try {
      await markWaitlistContacted(signup.id);
      sent += 1;
      console.log(`sent (${data?.id})`);
    } catch (updateError) {
      failed += 1;
      console.log("sent, but status update failed");
      console.error(updateError);
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
