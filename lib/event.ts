import type { Locale } from "@/lib/i18n";

type EventCopy = {
  dateRange: string;
  dateRangeWithYear: string;
  scheduleLine: string;
  heroDates: string;
  venueShort: string;
  statDateSublabel: string;
  faqWhenWhere: string;
  waitlistEmailBody: string;
  waitlistSuccessDetail: string;
};

const copy: Record<Locale, EventCopy> = {
  en: {
    dateRange: "July 25–26",
    dateRangeWithYear: "July 25–26, 2026",
    scheduleLine: "July 25–26, 2026 · 10 AM – 10 AM (24 hours)",
    heroDates: "July 25–26 · 10 AM – 10 AM",
    venueShort: "Plaza 11-11",
    statDateSublabel: "25–26 JUL 2026",
    faqWhenWhere:
      "Build Pa'l Norte takes place at Plaza 11-11 in Matamoros, Tamaulipas on July 25–26, 2026. It's a 24-hour hackathon running from 10:00 AM Saturday to 10:00 AM Sunday.",
    waitlistEmailBody:
      "You're on the waitlist for Build Pa'l Norte — July 25–26, 2026 at Plaza 11-11 in Matamoros. The hackathon runs 24 hours straight, from 10:00 AM Saturday to 10:00 AM Sunday. We'll email you when registration opens with next steps.",
    waitlistSuccessDetail:
      "We'll reach out with registration details soon. See you July 25–26 — 10 AM to 10 AM.",
  },
  es: {
    dateRange: "25–26 de julio",
    dateRangeWithYear: "25–26 de julio de 2026",
    scheduleLine: "25–26 de julio de 2026 · 10 AM – 10 AM (24 horas)",
    heroDates: "25–26 jul · 10 AM – 10 AM",
    venueShort: "Plaza 11-11",
    statDateSublabel: "25–26 JUL 2026",
    faqWhenWhere:
      "Build Pa'l Norte se lleva a cabo en Plaza 11-11, Matamoros, Tamaulipas el 25–26 de julio de 2026. Es un hackathon de 24 horas, de 10:00 AM del sábado a 10:00 AM del domingo.",
    waitlistEmailBody:
      "Ya estás en la lista de espera de Build Pa'l Norte — 25–26 de julio de 2026 en Plaza 11-11, Matamoros. El hackathon dura 24 horas seguidas, de 10:00 AM del sábado a 10:00 AM del domingo. Te escribiremos en cuanto abra el registro con los siguientes pasos.",
    waitlistSuccessDetail:
      "Te contactaremos pronto con los detalles del registro. Nos vemos el 25–26 de julio — 10 AM a 10 AM.",
  },
};

export function getEventCopy(locale: Locale) {
  return copy[locale];
}

/** July 25, 2026 10:00 AM — Matamoros (UTC-6) */
export function getEventStartDate() {
  return new Date("2026-07-25T10:00:00-06:00");
}
