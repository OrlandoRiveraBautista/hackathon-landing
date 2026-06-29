import { buildWaitlistConfirmationEmail } from "@/lib/emails/waitlist-confirmation";
import type { Locale } from "@/lib/i18n";
import { getResend, getResendFromAddress } from "@/lib/resend";

type SendWaitlistConfirmationInput = {
  to: string;
  name: string;
  locale: Locale;
};

export async function sendWaitlistConfirmation({
  to,
  name,
  locale,
}: SendWaitlistConfirmationInput) {
  const resend = getResend();
  const { subject, html, text } = buildWaitlistConfirmationEmail({
    name,
    locale,
  });

  const normalizedEmail = to.trim().toLowerCase();

  const { data, error } = await resend.emails.send({
    from: getResendFromAddress(),
    to: [normalizedEmail],
    subject,
    html,
    text,
    tags: [
      { name: "category", value: "waitlist" },
      { name: "locale", value: locale },
    ],
  });

  return { data, error };
}
