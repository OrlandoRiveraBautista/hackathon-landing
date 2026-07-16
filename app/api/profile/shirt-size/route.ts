import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
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

export async function GET(request: Request) {
  const session = await getSession();
  const locale = resolveLocale(request);
  const dictionary = getDictionary(locale);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: dictionary.profile.errors.unauthorized },
      { status: 401 },
    );
  }

  const signup = await getWaitlistSignupByEmail(session.user.email);
  return NextResponse.json({ shirtSize: signup?.shirtSize ?? null });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  const locale = resolveLocale(request);
  const dictionary = getDictionary(locale);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: dictionary.profile.errors.unauthorized },
      { status: 401 },
    );
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

  const shirtSize = String(body.shirtSize ?? "");
  if (!isValidShirtSize(shirtSize)) {
    return NextResponse.json(
      { error: dictionary.profile.errors.invalidShirtSize },
      { status: 400 },
    );
  }

  try {
    await updateWaitlistShirtSize(signup.id, shirtSize);
  } catch (error) {
    console.error("Shirt size update failed:", error);
    return NextResponse.json(
      { error: dictionary.profile.errors.generic },
      { status: 500 },
    );
  }

  return NextResponse.json({ shirtSize });
}
