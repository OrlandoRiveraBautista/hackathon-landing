import type { NextRequest } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const ADMIN_PUBLIC_PATHS = ["/admin/login"];

export function isAdminPath(pathname: string) {
  return pathname.startsWith("/admin");
}

export function isProtectedAdminPath(pathname: string) {
  return (
    isAdminPath(pathname) &&
    !ADMIN_PUBLIC_PATHS.some(
      (path) => pathname === path || pathname.startsWith(`${path}/`),
    )
  );
}

export function hasAuthSession(request: NextRequest) {
  return Boolean(getSessionCookie(request));
}
