import type { Locale } from "@/lib/i18n";
import type { ContributionId } from "@/lib/contribution-fulfillment";

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
  brand: {
    organizedBy: string;
    organizerNote: string;
  };
  nav: {
    about: string;
    whyJoin: string;
    howItWorks: string;
    faq: string;
  };
  hero: {
    tagline: string;
    dates: string;
    location: string;
    waitlistLabel: string;
    registerNow: string;
  };
  about: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    whatIsIt: string;
    whatIsItBody: string;
    whoIsItFor: string;
    whoIsItForBody: string;
    stats: Array<{
      value: string;
      label: string;
      sublabel?: string;
      source?: "waitlist";
      compact?: boolean;
    }>;
  };
  highlights: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    featuredCta: string;
    learnMoreCta: string;
    items: Array<{
      id: "ship" | "crew" | "learn" | "win";
      tag: string;
      title: string;
      description: string;
    }>;
  };
  howItWorks: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    steps: Array<{ step: string; title: string; description: string }>;
  };
  faq: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    items: Array<{ question: string; answer: string }>;
  };
  cta: {
    label: string;
    title: string;
    subtitle: string;
    button: string;
    urgencyBadge: string;
    socialProof: string;
    footnote: string;
  };
  perks: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    featuredNote: string;
    bottomCallout: string;
    items: Array<{
      id: "food" | "wifi" | "mentors" | "workshops" | "teams" | "demo" | "community" | "swag";
      title: string;
      body: string;
    }>;
  };
  ticker: {
    items: string[];
  };
  footer: {
    terms: string;
    privacy: string;
    contact: string;
    sponsor: string;
    copyright: string;
    eventHeading: string;
    legalHeading: string;
    rightsReserved: string;
    locationTag: string;
  };
  waitlist: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phone: string;
    age: string;
    sex: string;
    school: string;
    github: string;
    interests: string;
    optional: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    agePlaceholder: string;
    schoolPlaceholder: string;
    githubPlaceholder: string;
    interestsPlaceholder: string;
    sexOptions: {
      male: string;
      female: string;
      other: string;
      preferNotToSay: string;
    };
    sexPlaceholder: string;
    join: string;
    joining: string;
    close: string;
    successTitle: string;
    successDefault: string;
    successAlreadyTitle: string;
    successAlready: string;
    errors: {
      invalidName: string;
      invalidEmail: string;
      invalidPhone: string;
      invalidAge: string;
      invalidSex: string;
      invalidGithub: string;
      firestoreSetup: string;
      unavailable: string;
      generic: string;
    };
  };
  sponsor: {
    title: string;
    subtitle: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    sponsorship: string;
    problem: string;
    workshop: string;
    namePlaceholder: string;
    phonePlaceholder: string;
    companyPlaceholder: string;
    sponsorshipPlaceholder: string;
    problemPlaceholder: string;
    workshopOptions: {
      yes: string;
      no: string;
    };
    workshopPlaceholder: string;
    submit: string;
    submitting: string;
    close: string;
    successTitle: string;
    successDefault: string;
    successAlreadyTitle: string;
    successAlready: string;
    errors: {
      invalidName: string;
      invalidEmail: string;
      invalidPhone: string;
      invalidCompany: string;
      invalidSponsorship: string;
      invalidProblem: string;
      invalidWorkshop: string;
      firestoreSetup: string;
      unavailable: string;
      generic: string;
    };
  };
  sponsorsSection: {
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    cta: string;
    learnMore: string;
    note: string;
    perks: Array<{ text: string }>;
  };
  sponsorsPage: {
    metaTitle: string;
    metaDescription: string;
    label: string;
    title: string;
    accentWord: string;
    subtitle: string;
    whyLabel: string;
    whyTitle: string;
    whySubtitle: string;
    whyItems: Array<{ title: string; body: string }>;
    contributionsLabel: string;
    contributionsTitle: string;
    contributionsSubtitle: string;
    contributions: Array<{
      id: ContributionId;
      category: string;
      examples: string;
      who: string;
    }>;
    coveredLabel: string;
    workshopsLabel: string;
    workshopsTitle: string;
    workshopsSubtitle: string;
    workshopsCallout: string;
    workshopIdeasLabel: string;
    workshopExampleTag: string;
    idealForLabel: string;
    speakersLabel: string;
    workshopsHostCta: string;
    workshops: Array<{
      id: string;
      title: string;
      theme: string;
      topics: string[];
      idealFor: string;
      speakers: string;
    }>;
    keynotesLabel: string;
    keynotesSubtitle: string;
    keynotes: Array<{ title: string; description: string }>;
    ctaLabel: string;
    ctaTitle: string;
    ctaSubtitle: string;
    ctaButton: string;
    ctaNote: string;
    back: string;
  };
  login: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    signingIn: string;
    signInWithGoogle: string;
    signInFailed: string;
    signedInAs: string;
    signOut: string;
    signingOut: string;
    signOutFailed: string;
    notRegistered: string;
    backToHome: string;
  };
  members: {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    title: string;
    subtitle: string;
    signOut: string;
    signingOut: string;
    signOutFailed: string;
    backToHome: string;
  };
  profile: {
    metaTitle: string;
    metaDescription: string;
    metaTitleMember: string;
    metaDescriptionMember: string;
    eyebrow: string;
    memberEyebrow: string;
    subtitle: string;
    memberSince: string;
    signOut: string;
    signingOut: string;
    signOutFailed: string;
    backToHome: string;
    backToDirectory: string;
    editProfile: string;
    editSection: string;
    saveProfile: string;
    savingProfile: string;
    cancelEdit: string;
    saveSuccess: string;
    bio: string;
    bioEmpty: string;
    skills: string;
    skillsEmpty: string;
    school: string;
    schoolEmpty: string;
    interests: string;
    interestsEmpty: string;
    openToTeams: string;
    openToTeamsHint: string;
    notOpenToTeams: string;
    email: string;
    phone: string;
    showEmail: string;
    showEmailHint: string;
    showPhone: string;
    showPhoneHint: string;
    showPhoneDisabledHint: string;
    contactVisibilitySection: string;
    contactPublic: string;
    contactPrivate: string;
    github: string;
    viewOnGithub: string;
    bioPlaceholder: string;
    skillsPlaceholder: string;
    skillsHint: string;
    aboutSection: string;
    detailsSection: string;
    errors: {
      unauthorized: string;
      notFound: string;
      notRegistered: string;
      invalidBody: string;
      invalidGithub: string;
      fieldTooLong: string;
      invalidSkills: string;
      generic: string;
      saveFailed: string;
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
