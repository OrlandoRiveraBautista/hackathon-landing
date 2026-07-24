/** Community links for remote participants and member onboarding. */

export const CLUB_LOGIN_PATH = "/login";

export const DEFAULT_DISCORD_URL = "https://discord.gg/8vfprRE5M";

export function getDiscordUrl() {
  return process.env.NEXT_PUBLIC_DISCORD_URL?.trim() || DEFAULT_DISCORD_URL;
}

export function getWhatsAppUrl() {
  return process.env.NEXT_PUBLIC_WHATSAPP_URL?.trim() || "";
}

export function hasCommunityLinks() {
  return Boolean(getDiscordUrl() || getWhatsAppUrl());
}
