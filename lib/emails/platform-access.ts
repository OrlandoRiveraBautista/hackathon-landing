import { SITE_LOGO } from "@/lib/brand";
import { buildBrandEmailHtml } from "@/lib/emails/brand-email-layout";
import { getDictionary } from "@/lib/dictionaries";
import { getEventCopy } from "@/lib/event";
import type { Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

type PlatformAccessContent = {
  subject: string;
  html: string;
  text: string;
};

const emailCopy: Record<
  Locale,
  {
    subject: (name: string) => string;
    headline: (name: string) => string;
    greeting: (name: string) => string;
    badge: string;
    cta: string;
  }
> = {
  en: {
    subject: (name) => `${name}, your member portal is ready — Build Pa'l Norte`,
    headline: (name) => `You're in, ${name}!`,
    greeting: (name) => `Hi ${name},`,
    badge: "Member portal",
    cta: "Sign in now",
  },
  es: {
    subject: (name) =>
      `${name}, tu plataforma de miembro está lista — Build Pa'l Norte`,
    headline: (name) => `¡Ya puedes entrar, ${name}!`,
    greeting: (name) => `Hola ${name},`,
    badge: "Plataforma de miembros",
    cta: "Iniciar sesión",
  },
};

export function buildPlatformAccessEmail({
  name,
  locale,
}: {
  name: string;
  locale: Locale;
}): PlatformAccessContent {
  const dictionary = getDictionary(locale);
  const content = emailCopy[locale];
  const event = getEventCopy(locale);
  const siteUrl = getSiteUrl();
  const loginUrl = `${siteUrl}${localizedPath(locale, "/login")}`;
  const logoUrl = `${siteUrl}${SITE_LOGO}`;
  const firstName = name.trim().split(/\s+/)[0] || name.trim();
  const greeting = content.greeting(firstName);
  const headline = content.headline(firstName);
  const body = event.platformAccessEmailBody;

  const html = buildBrandEmailHtml({
    locale,
    badge: content.badge,
    headline,
    greeting,
    body,
    cta: content.cta,
    ctaUrl: loginUrl,
    tagline: dictionary.hero.tagline,
    scheduleLine: event.scheduleLine,
    locationTag: dictionary.footer.locationTag,
    footerLine: `${dictionary.footer.copyright} ${dictionary.footer.locationTag}`,
    logoUrl,
  });

  const text = `${headline}

${greeting}

${body}

${content.cta}: ${loginUrl}

${dictionary.footer.copyright}
${dictionary.footer.locationTag}`;

  return {
    subject: content.subject(firstName),
    html,
    text,
  };
}
