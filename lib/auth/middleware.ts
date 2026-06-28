import type { NextRequest } from "next/server";
import { getCookieCache } from "better-auth/cookies";
import { canAccessAdmin } from "@/lib/auth/roles";

const ADMIN_LOGIN = "/admin/login";

export function isProtectedAdminPath(pathname: string) {
  return (
    pathname.startsWith("/admin") &&
    pathname !== ADMIN_LOGIN &&
    !pathname.startsWith(`${ADMIN_LOGIN}/`)
  );
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
