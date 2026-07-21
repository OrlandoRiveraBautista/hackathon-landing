import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import {
  getOnsiteSelectionConfig,
  getOnsiteStatusForDocId,
  isOnsiteBoostOpen,
  OnsiteBoostDailyLimitError,
  recordOnsiteBoostTap,
} from "@/lib/onsite-selection";
import { getWaitlistSignupByEmail } from "@/lib/waitlist-admin";

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
      { error: dictionary.onsiteSelection.errors.unauthorized },
      { status: 401 },
    );
  }

  const signup = await getWaitlistSignupByEmail(session.user.email);
  if (!signup) {
    return NextResponse.json(
      { error: dictionary.onsiteSelection.errors.notRegistered },
      { status: 403 },
    );
  }

  const [config, status] = await Promise.all([
    getOnsiteSelectionConfig(),
    getOnsiteStatusForDocId(signup.id),
  ]);

  return NextResponse.json({
    announced: config.announced,
    boostOpen: isOnsiteBoostOpen(config),
    onSiteInterested: status.onSiteInterested,
    onSiteInterestedAt: status.onSiteInterestedAt?.toISOString() ?? null,
    onSiteStatus: config.announced ? status.onSiteStatus : "pending",
    onSiteBoostTapCount: status.onSiteBoostTapCount,
    dailyTapCount: status.boostDaily.dailyTapCount,
    dailyTapLimit: status.boostDaily.dailyTapLimit,
    dailyLimitReached: status.boostDaily.dailyLimitReached,
    cooldownUntil: status.boostDaily.cooldownUntil?.toISOString() ?? null,
    name: signup.name,
  });
}

export async function POST(request: Request) {
  const session = await getSession();
  const locale = resolveLocale(request);
  const dictionary = getDictionary(locale);

  if (!session?.user?.email) {
    return NextResponse.json(
      { error: dictionary.onsiteSelection.errors.unauthorized },
      { status: 401 },
    );
  }

  const signup = await getWaitlistSignupByEmail(session.user.email);
  if (!signup) {
    return NextResponse.json(
      { error: dictionary.onsiteSelection.errors.notRegistered },
      { status: 403 },
    );
  }

  const config = await getOnsiteSelectionConfig();
  if (!isOnsiteBoostOpen(config)) {
    return NextResponse.json(
      { error: dictionary.onsiteSelection.errors.selectionClosed },
      { status: 409 },
    );
  }

  try {
    const result = await recordOnsiteBoostTap(signup.id);
    return NextResponse.json({
      onSiteInterested: true,
      tapCount: result.tapCount,
      dailyTapCount: result.dailyTapCount,
      dailyTapLimit: result.dailyTapLimit,
      dailyLimitReached: result.dailyLimitReached,
      cooldownUntil: result.cooldownUntil?.toISOString() ?? null,
      alreadyInterested: result.wasAlreadyInterested,
    });
  } catch (error) {
    if (error instanceof OnsiteBoostDailyLimitError) {
      return NextResponse.json(
        {
          error: dictionary.onsiteSelection.errors.boostLimitReached,
          cooldownUntil: error.resetsAt.toISOString(),
        },
        { status: 429 },
      );
    }

    console.error("On-site boost tap failed:", error);
    return NextResponse.json(
      { error: dictionary.onsiteSelection.errors.generic },
      { status: 500 },
    );
  }
}
