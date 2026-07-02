import "dotenv/config";
import { sendWaitlistConfirmation } from "../lib/emails/send-waitlist-confirmation";
import { isLocale } from "../lib/i18n";
import { getWaitlistSignupByEmail } from "../lib/waitlist-admin";

function printUsage() {
  console.log(`Usage: pnpm email:test <email> [locale]

Looks up the waitlist signup in Firestore and sends the confirmation email
using their stored name.

Examples:
  pnpm email:test you@example.com
  pnpm email:test you@example.com es

Required env vars:
  RESEND_API_KEY
  RESEND_FROM   e.g. Build Pa'l Norte <noreply@yourdomain.com>
  NEXT_PUBLIC_FIREBASE_* (all Firebase config vars)
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

  const signup = await getWaitlistSignupByEmail(to);

  if (!signup) {
    console.error(`No waitlist signup found for ${to.toLowerCase()}.`);
    process.exit(1);
  }

  console.log(`Found signup: ${signup.name} (status: ${signup.status})`);

  const { data, error } = await sendWaitlistConfirmation({
    to: signup.email,
    name: signup.name,
    locale,
  });

  if (error) {
    console.error("Failed to send waitlist confirmation email:");
    console.error(error);
    process.exit(1);
  }

  console.log(`Waitlist confirmation email sent to ${signup.email}`);
  console.log(`Message id: ${data?.id}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
