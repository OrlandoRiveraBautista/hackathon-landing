import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getDictionary } from "@/lib/dictionaries";
import { defaultLocale, isLocale } from "@/lib/i18n";
import { searchMembers } from "@/lib/members";
import { toPublicMemberProfile } from "@/lib/members/shared";

function resolveLocale(request: Request) {
  const header = request.headers.get("x-locale");
  if (header && isLocale(header)) {
    return header;
  }

  return defaultLocale;
}

function parsePositiveInt(value: string | null, fallback: number, max?: number) {
  if (value === null) {
    return fallback;
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  const normalized = Math.floor(parsed);
  return max ? Math.min(normalized, max) : normalized;
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

  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const page = parsePositiveInt(searchParams.get("page"), 1);
  const limit = parsePositiveInt(searchParams.get("limit"), 24, 50);
  const openToTeams = searchParams.get("openToTeams") === "true";

  const result = await searchMembers({
    query,
    page,
    limit,
    openToTeams,
  });

  return NextResponse.json({
    members: result.members.map(toPublicMemberProfile),
    total: result.total,
    page: result.page,
    limit: result.limit,
    totalPages: result.totalPages,
  });
}
