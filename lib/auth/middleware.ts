import type { NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { canAccessAdmin } from "@/lib/auth/roles";
import { isLocale } from "@/lib/i18n";

const ADMIN_LOGIN = "/admin/login";

export function isProtectedAdminPath(pathname: string) {
  return (
    pathname.startsWith("/admin") &&
    pathname !== ADMIN_LOGIN &&
    !pathname.startsWith(`${ADMIN_LOGIN}/`)
  );
}

export function isProtectedMemberPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (!locale || !isLocale(locale)) {
    return false;
  }

  return (
    pathname.startsWith(`/${locale}/home`) ||
    pathname.startsWith(`/${locale}/profile`) ||
    pathname.startsWith(`/${locale}/members`) ||
    pathname.startsWith(`/${locale}/team`) ||
    pathname.startsWith(`/${locale}/notifications`)
  );
}

export function getMemberLoginPath(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);
  const locale = segments[0];

  if (locale && isLocale(locale)) {
    return `/${locale}/login`;
  }

  return "/es/login";
}

async function getSessionUser(request: NextRequest) {
  const cached = (await getCookieCache(request, {
    secret: process.env.BETTER_AUTH_SECRET,
  })) as { user?: { email?: string | null; role?: string | null } } | null;

  return cached?.user ?? null;
}

export async function getAdminAuth(request: NextRequest) {
  const user = await getSessionUser(request);

  return {
    signedIn: Boolean(user?.email),
    allowed: canAccessAdmin(user?.role),
  };
}

export async function getMemberAuth(request: NextRequest) {
  const user = await getSessionUser(request);

  return {
    signedIn: Boolean(user?.email),
  };
}
