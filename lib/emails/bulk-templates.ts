import { sendPlatformAccess } from "@/lib/emails/send-platform-access";
import { sendWaitlistConfirmation } from "@/lib/emails/send-waitlist-confirmation";
import type { Locale } from "@/lib/i18n";
import { markWaitlistContacted } from "@/lib/waitlist-contact";
import { markWaitlistPlatformNotified } from "@/lib/waitlist-platform-notified";
import type { WaitlistSignup } from "@/lib/waitlist-admin";

type SendResult = Awaited<ReturnType<typeof sendWaitlistConfirmation>>;

type BulkEmailTemplate = {
  label: string;
  send: (input: {
    to: string;
    name: string;
    locale: Locale;
  }) => Promise<SendResult>;
  shouldSend: (signup: WaitlistSignup, options: { all: boolean }) => boolean;
  markSent: (docId: string) => Promise<void>;
  pendingDescription: string;
};

export const BULK_EMAIL_TEMPLATES = {
  waitlist: {
    label: "Waitlist confirmation",
    send: sendWaitlistConfirmation,
    shouldSend: (signup, { all }) => all || signup.status !== "contacted",
    markSent: markWaitlistContacted,
    pendingDescription: "not yet contacted",
  },
  "platform-access": {
    label: "Platform access",
    send: sendPlatformAccess,
    shouldSend: (signup, { all }) => all || !signup.platformNotifiedAt,
    markSent: markWaitlistPlatformNotified,
    pendingDescription: "not yet notified about platform access",
  },
} as const satisfies Record<string, BulkEmailTemplate>;

export type BulkEmailTemplateId = keyof typeof BULK_EMAIL_TEMPLATES;

export function isBulkEmailTemplateId(
  value: string,
): value is BulkEmailTemplateId {
  return value in BULK_EMAIL_TEMPLATES;
}

export function getBulkEmailTemplate(templateId: BulkEmailTemplateId) {
  return BULK_EMAIL_TEMPLATES[templateId];
}
