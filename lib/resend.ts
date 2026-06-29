import { Resend } from "resend";

let client: Resend | null = null;

export function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to your .env file and restart the server.",
    );
  }

  if (!client) {
    client = new Resend(apiKey);
  }

  return client;
}

export function getResendFromAddress() {
  const from = process.env.RESEND_FROM;
  if (!from) {
    throw new Error(
      "RESEND_FROM is not set. Use a verified domain, e.g. Build Pa'l Norte <noreply@yourdomain.com>",
    );
  }

  return from;
}
