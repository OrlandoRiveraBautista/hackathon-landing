import { buildPlatformAccessEmail } from "@/lib/emails/platform-access";
import type { Locale } from "@/lib/i18n";
import { getResend, getResendFromAddress } from "@/lib/resend";

type SendPlatformAccessInput = {
  to: string;
  name: string;
  locale: Locale;
};

export async function sendPlatformAccess({
  to,
  name,
  locale,
}: SendPlatformAccessInput) {
  const resend = getResend();
  const { subject, html, text } = buildPlatformAccessEmail({
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
      { name: "category", value: "platform-access" },
      { name: "locale", value: locale },
    ],
  });

  return { data, error };
}
