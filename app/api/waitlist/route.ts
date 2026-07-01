import { NextResponse } from "next/server";
import { sendWaitlistConfirmation } from "@/lib/emails/send-waitlist-confirmation";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { markWaitlistContacted } from "@/lib/waitlist-contact";
import { joinWaitlist, waitlistDocIdForEmail, type ParticipantInput } from "@/lib/waitlist";

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const localeParam = String(body.locale ?? "");
  const locale = isLocale(localeParam) ? localeParam : defaultLocale;
  const dictionary = getDictionary(locale);

  const input: ParticipantInput = {
    name: String(body.name ?? ""),
    email: String(body.email ?? ""),
    phone: String(body.phone ?? ""),
    age: String(body.age ?? ""),
    sex: String(body.sex ?? ""),
    school: body.school ? String(body.school) : undefined,
    github: body.github ? String(body.github) : undefined,
    interests: body.interests ? String(body.interests) : undefined,
  };

  try {
    const result = await joinWaitlist(input, dictionary.waitlist.errors);

    if (!result.alreadyRegistered) {
      const { error } = await sendWaitlistConfirmation({
        to: input.email,
        name: input.name,
        locale,
      });

      if (error) {
        console.error("Waitlist confirmation email failed:", error);
      } else {
        try {
          await markWaitlistContacted(
            waitlistDocIdForEmail(input.email.trim().toLowerCase()),
          );
        } catch (updateError) {
          console.error("Waitlist contacted status update failed:", updateError);
        }
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : dictionary.waitlist.errors.generic;

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
