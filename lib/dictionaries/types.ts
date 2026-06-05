import type { Locale } from "@/lib/i18n";

export type LegalBlock =
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type LegalSectionContent = {
  title: string;
  blocks: LegalBlock[];
};

export type Dictionary = {
  meta: {
    title: string;
    description: string;
  };
  nav: {
    about: string;
    whyJoin: string;
    howItWorks: string;
    faq: string;
  };
  hero: {
    tagline: string;
    location: string;
    waitlistLabel: string;
    registerNow: string;
  };
  about: {
    label: string;
    title: string;
    subtitle: string;
    whatIsIt: string;
    whatIsItBody: string;
    whoIsItFor: string;
    whoIsItForBody: string;
    stats: Array<{
      value: string;
      label: string;
      source?: "waitlist";
      compact?: boolean;
    }>;
  };
  highlights: {
    label: string;
    title: string;
    subtitle: string;
    items: Array<{
      id: "ship" | "crew" | "learn" | "win";
      title: string;
      description: string;
    }>;
  };
  howItWorks: {
    label: string;
    title: string;
    subtitle: string;
    steps: Array<{ step: string; title: string; description: string }>;
  };
  faq: {
    label: string;
    title: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  cta: {
    label: string;
    title: string;
    subtitle: string;
    button: string;
  };
  footer: {
    terms: string;
    privacy: string;
    contact: string;
    copyright: string;
  };
  waitlist: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    namePlaceholder: string;
    join: string;
    joining: string;
    close: string;
    successTitle: string;
    successDefault: string;
    successAlready: string;
    errors: {
      invalidName: string;
      invalidEmail: string;
      firestoreSetup: string;
      unavailable: string;
      generic: string;
    };
  };
  legal: {
    back: string;
    label: string;
    lastUpdated: string;
    terms: {
      metaTitle: string;
      metaDescription: string;
      title: string;
      sections: LegalSectionContent[];
    };
    privacy: {
      metaTitle: string;
      metaDescription: string;
      title: string;
      sections: LegalSectionContent[];
    };
  };
};

export type DictionaryLoader = (locale: Locale) => Dictionary;
