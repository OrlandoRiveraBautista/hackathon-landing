import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { sendWaitlistConfirmation } from "../lib/emails/send-waitlist-confirmation";
import { isLocale } from "../lib/i18n";

function loadEnvFile() {
  const envPath = resolve(process.cwd(), ".env");
  try {
    const contents = readFileSync(envPath, "utf8");
    for (const line of contents.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;

      const separator = trimmed.indexOf("=");
      if (separator === -1) continue;

      const key = trimmed.slice(0, separator).trim();
      let value = trimmed.slice(separator + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      if (!(key in process.env)) {
        process.env[key] = value;
      }
    }
  } catch {
    console.warn("No .env file found. Make sure RESEND_API_KEY and RESEND_FROM are set.");
  }
}

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

loadEnvFile();

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
