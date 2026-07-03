import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getAdminAuth,
  getMemberAuth,
  getMemberLoginPath,
  isProtectedAdminPath,
  isProtectedMemberPath,
} from "@/lib/auth/middleware";
import { defaultLocale, isLocale } from "@/lib/i18n";

const LOCALE_COOKIE = "NEXT_LOCALE";
const ADMIN_LOGIN = "/admin/login";

function getPreferredLocale(request: NextRequest) {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value;
  if (cookieLocale && isLocale(cookieLocale)) {
    return cookieLocale;
  }

  const acceptLanguage = request.headers.get("accept-language") ?? "";
  if (acceptLanguage.toLowerCase().includes("es")) {
    return "es";
  }

  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isProtectedAdminPath(pathname)) {
    const { signedIn, allowed } = await getAdminAuth(request);

    if (!allowed) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = ADMIN_LOGIN;
      loginUrl.searchParams.set("next", pathname);
      if (signedIn) {
        loginUrl.searchParams.set("error", "unauthorized");
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  if (isProtectedMemberPath(pathname)) {
    const { signedIn } = await getMemberAuth(request);

    if (!signedIn) {
      const loginUrl = request.nextUrl.clone();
      loginUrl.pathname = getMemberLoginPath(pathname);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const pathnameLocale = pathname.split("/")[1];
  if (isLocale(pathnameLocale)) {
    const response = NextResponse.next();
    response.cookies.set(LOCALE_COOKIE, pathnameLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365,
    });
    return response;
  }

  const locale = getPreferredLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  response.cookies.set(LOCALE_COOKIE, locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
