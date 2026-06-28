export function canAccessAdmin(role: string | null | undefined) {
  return role === "owner" || role === "admin";
}
