export function isSafeRedirect(path: string): boolean {
  return (
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !path.includes("://") &&
    !path.includes("\\")
  );
}

export function resolveSafeRedirect(
  next: string | null | undefined,
  fallback: string,
): string {
  return next && isSafeRedirect(next) ? next : fallback;
}
