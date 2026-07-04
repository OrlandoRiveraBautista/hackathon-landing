export const locales = ["en", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

export function isLocale(value: string): value is Locale {
  return locales.includes(value as Locale);
}

export function localizedPath(locale: Locale, path = ""): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `/${locale}` : `/${locale}${normalized}`;
}

export function memberHomePath(locale: Locale): string {
  return localizedPath(locale, "/home");
}

export function memberProfilePath(locale: Locale, userId: string): string {
  return localizedPath(locale, `/profile/${userId}`);
}

export function membersDirectoryPath(
  locale: Locale,
  search: {
    q?: string;
    openToTeams?: boolean;
  } = {},
): string {
  const base = localizedPath(locale, "/members");
  const params = new URLSearchParams();

  if (search.q?.trim()) {
    params.set("q", search.q.trim());
  }
  if (search.openToTeams) {
    params.set("openToTeams", "true");
  }

  const queryString = params.toString();
  return queryString ? `${base}?${queryString}` : base;
}

export function parseMembersDirectorySearch(searchParams: {
  q?: string;
  openToTeams?: string;
}) {
  return {
    q: searchParams.q ?? "",
    openToTeams: searchParams.openToTeams === "true",
  };
}
