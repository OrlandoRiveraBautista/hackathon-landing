import "dotenv/config";
import { sendWaitlistConfirmation } from "../lib/emails/send-waitlist-confirmation";
import { isLocale } from "../lib/i18n";

function printUsage() {
  console.log(`Usage: pnpm email:test <email> [locale]

Examples:
  pnpm email:test you@example.com
  pnpm email:test you@example.com es

Required env vars:
  RESEND_API_KEY
  RESEND_FROM   e.g. Build Pa'l Norte <noreply@yourdomain.com>
`);
}

async function main() {
  const to = process.argv[2]?.trim();
  const localeArg = process.argv[3]?.trim() ?? "en";
  const locale = isLocale(localeArg) ? localeArg : "en";

  if (!to) {
    printUsage();
    process.exit(1);
  }

  const { data, error } = await sendWaitlistConfirmation({
    to,
    name: "Test User",
    locale,
  });

  if (error) {
    console.error("Failed to send waitlist confirmation email:");
    console.error(error);
    process.exit(1);
  }

  console.log(`Waitlist confirmation email sent to ${to}`);
  console.log(`Message id: ${data?.id}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
