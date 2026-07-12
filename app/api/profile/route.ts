import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import {
  getMemberByUserId,
  getOrCreateMember,
  parseMemberProfileUpdate,
  updateMemberProfile,
} from "@/lib/members";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";
import { isValidShirtSize } from "@/lib/shirt-size";
import { updateWaitlistShirtSize } from "@/lib/waitlist-shirt-size";

function resolveLocale(request: Request) {
  const header = request.headers.get("x-locale");
  if (header && isLocale(header)) {
    return header;
  }

  return defaultLocale;
}

function errorMessage(code: string, locale: ReturnType<typeof resolveLocale>) {
  const dictionary = getDictionary(locale);
  const errors = dictionary.profile.errors;

  switch (code) {
    case "invalid_github":
      return errors.invalidGithub;
    case "field_too_long":
      return errors.fieldTooLong;
    case "invalid_skills":
      return errors.invalidSkills;
    case "invalid_open_to_teams":
    case "invalid_show_email":
    case "invalid_show_phone":
      return errors.invalidBody;
    case "invalid_shirt_size":
      return errors.invalidShirtSize;
    default:
      return errors.generic;
  }
}

export async function PATCH(request: Request) {
  const session = await getSession();
  const locale = resolveLocale(request);
  const dictionary = getDictionary(locale);

  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: dictionary.profile.errors.unauthorized }, {
      status: 401,
    });
  }

  const signup = await getWaitlistSignupByEmail(session.user.email);
  if (!signup) {
    return NextResponse.json(
      { error: dictionary.profile.errors.notRegistered },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: dictionary.profile.errors.invalidBody },
      { status: 400 },
    );
  }

  let update;

  try {
    update = parseMemberProfileUpdate(body);
  } catch (error) {
    const code = error instanceof Error ? error.message : "generic";
    return NextResponse.json(
      { error: errorMessage(code, locale) },
      { status: 400 },
    );
  }

  let member = await getMemberByUserId(session.user.id);
  if (!member) {
    member = await getOrCreateMember(session.user.id, signup);
  }

  const updated = await updateMemberProfile(session.user.id, update);
  if (!updated) {
    return NextResponse.json(
      { error: dictionary.profile.errors.generic },
      { status: 500 },
    );
  }

  if (body.shirtSize !== undefined) {
    const shirtSize = String(body.shirtSize);
    if (!isValidShirtSize(shirtSize)) {
      return NextResponse.json(
        { error: dictionary.profile.errors.invalidShirtSize },
        { status: 400 },
      );
    }

    try {
      await updateWaitlistShirtSize(signup.id, shirtSize);
    } catch (error) {
      console.error("Waitlist shirt size update failed:", error);
      return NextResponse.json(
        { error: dictionary.profile.errors.generic },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ member: updated });
}
