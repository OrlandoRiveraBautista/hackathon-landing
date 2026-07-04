import type { Dictionary } from "./types";
import { getEventCopy } from "@/lib/event";

const event = getEventCopy("en");

const dictionary: Dictionary = {
  meta: {
    title: "Build Pa'l Norte — Tech Hackathon for Young Builders",
    description:
      "A 24-hour tech hackathon in Matamoros, July 25–26, 2026. Code, create, and compete — join the waitlist for Build Pa'l Norte.",
  },
  brand: {
    organizedBy: "Organized by",
    organizerNote:
      "Peseros puts Matamoros peseras on the map with live tracking — for riders, drivers, and route owners. They're organizing Build Pa'l Norte to invest in the city's next generation of builders.",
  },
  nav: {
    about: "ABOUT",
    whyJoin: "PERKS",
    howItWorks: "PROCESS",
    faq: "FAQ",
  },
  hero: {
    tagline: "a 24h tech hackathon for young people",
    dates: event.heroDates,
    location: "Matamoros, Tamaulipas",
    waitlistLabel: "on the waitlist",
    registerNow: "REGISTER NOW",
  },
  about: {
    label: "THE MISSION",
    title: "Code. Create. Compete.",
    accentWord: "Compete.",
    subtitle:
      "A 24-hour hackathon in Matamoros where young builders turn wild ideas into working prototypes.",
    whatIsIt: "WHAT IS IT?",
    whatIsItBody:
      "Build Pa'l Norte is a high-energy tech hackathon built for students and young creators in Matamoros. Over 24 hours, teams design, code, and ship projects that solve real problems — with mentors, workshops, and a community that's rooting for you.",
    whoIsItFor: "WHO IS IT FOR?",
    whoIsItForBody:
      "Whether it's your first line of code or your tenth hackathon, you belong here. Developers, designers, makers, and dreamers — if you're curious and ready to build, grab a spot on the waitlist.",
    stats: [
      { value: "24H", label: "TO BUILD", sublabel: event.statDateSublabel },
      { value: "0", label: "ON WAITLIST", source: "waitlist" },
      { value: "MATAMOROS", label: event.venueShort, compact: true },
    ],
  },
  highlights: {
    label: "WHY JOIN",
    title: "More Than a Weekend",
    accentWord: "Weekend",
    subtitle:
      "Everything you need to go from idea to demo — and have a blast doing it.",
    featuredCta: "START BUILDING",
    learnMoreCta: "LEARN MORE",
    items: [
      {
        id: "ship",
        tag: "BUILD IT",
        title: "Ship Something Real",
        description:
          "Go from blank canvas to live demo. Apps, hardware, games, tools — if you can imagine it, you can build it.",
      },
      {
        id: "crew",
        tag: "FIND YOUR TRIBE",
        title: "Find Your Crew",
        description:
          "Come solo or bring friends. We'll help you match with teammates who complement your skills and energy.",
      },
      {
        id: "learn",
        tag: "LEVEL UP",
        title: "Learn From Pros",
        description:
          "Industry mentors drop in with workshops on design, APIs, pitching, and more. Ask questions, get unstuck, level up.",
      },
      {
        id: "win",
        tag: "GET SEEN",
        title: "Demo & Get Seen",
        description:
          "Present your project to judges and an audience. Get recognized for creativity, execution, and impact — and take home bragging rights.",
      },
    ],
  },
  howItWorks: {
    label: "THE FLOW",
    title: "How It Works",
    accentWord: "Works",
    subtitle: "Four steps from curious to competitor. Simple as that.",
    steps: [
      {
        step: "01",
        title: "Join the Waitlist",
        description:
          "Sign up with your name, email, and phone number. We'll notify you when registration opens — the event is July 25–26, 10 AM to 10 AM.",
      },
      {
        step: "02",
        title: "Form Your Team",
        description:
          "Register solo or with up to 4 teammates. We'll run team-matching for anyone flying solo who wants a crew.",
      },
      {
        step: "03",
        title: "Build Like Crazy",
        description:
          "24 hours of hacking, workshops, food, and caffeine. Mentors roam the floor to help you push through blockers.",
      },
      {
        step: "04",
        title: "Demo & Celebrate",
        description:
          "Pitch your project to judges and the crowd. Top projects get recognized, applause earned, new friends made.",
      },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Got Questions?",
    accentWord: "Questions?",
    subtitle: "We've got answers. Still stuck?",
    items: [
      {
        question: "Is there an age limit?",
        answer:
          "No. Build Pa'l Norte is open to everyone — all ages welcome. Whether you're a student, a professional, or just curious about tech, you can join.",
      },
      {
        question: "Do I need experience to join?",
        answer:
          "Not at all. First-timers are welcome. What matters is curiosity and willingness to learn. We'll have mentors on hand to help you get unstuck.",
      },
      {
        question: "Is it free?",
        answer:
          "Yes — participation is free. Food, swag, and good vibes included. Just bring your laptop, charger, and ideas.",
      },
      {
        question: "Can I participate alone?",
        answer:
          "Absolutely. Solo hackers are welcome, and we'll help match you with a team during registration if you'd rather collaborate.",
      },
      {
        question: "What should I build?",
        answer:
          "Anything! Web apps, mobile apps, hardware hacks, games, AI tools, social impact projects — as long as you build it during the event, it counts.",
      },
      {
        question: "When and where is the event?",
        answer: event.faqWhenWhere,
      },
    ],
  },
  cta: {
    label: "DON'T SLEEP ON THIS",
    title: "Ready to build pa'l norte?",
    subtitle:
      "July 25–26 in Matamoros. Drop your name on the waitlist and we'll hit you up when registration opens.",
    button: "JOIN THE WAITLIST",
    urgencyBadge: "SPOTS FILLING FAST",
    socialProof: "Builders already signed up — join them",
    footnote: "Free to join · No credit card required · Just your ideas",
  },
  perks: {
    label: "WHAT YOU GET",
    title: "Everything Included",
    accentWord: "Included",
    subtitle: "Zero cost. Maximum value. Show up and we take care of the rest.",
    featuredNote: "INCLUDED FOR ALL PARTICIPANTS",
    bottomCallout: "FREE TO JOIN · ALL INCLUDED · NO STRINGS ATTACHED",
    items: [
      {
        id: "food",
        title: "Food & Drinks",
        body: "Fuel for 24 hours. Meals, snacks, and coffee — all included. Just bring your appetite.",
      },
      {
        id: "wifi",
        title: "High-Speed WiFi",
        body: "We've got the infrastructure. You focus on building, not on connection issues.",
      },
      {
        id: "mentors",
        title: "Expert Mentors",
        body: "Industry builders roam the floor ready to unblock you on design, code, or pitch.",
      },
      {
        id: "workshops",
        title: "Live Workshops",
        body: "Hands-on sessions on real tools and skills — from APIs to product thinking.",
      },
      {
        id: "teams",
        title: "Team Matching",
        body: "Flying solo? We'll connect you with teammates who complement your skills.",
      },
      {
        id: "demo",
        title: "Demo Day",
        body: "Present your project to an audience. Get feedback, recognition, and applause.",
      },
      {
        id: "community",
        title: "Community",
        body: "Leave with real friendships, collaborators, and a network that lasts beyond the event.",
      },
      {
        id: "swag",
        title: "Swag",
        body: "Exclusive Build Pa'l Norte merch for every participant. Wear your build with pride.",
      },
    ],
  },
  ticker: {
    items: [
      "24 HOURS TO BUILD",
      "JUL 25–26, 2026",
      "10 AM – 10 AM",
      "FREE TO JOIN",
      "EXPERT MENTORS",
      "MATAMOROS 2026",
      "FOOD INCLUDED",
      "FORM YOUR TEAM",
      "DEMO DAY",
      "ALL SKILL LEVELS",
      "LIVE WORKSHOPS",
      "BUILD SOMETHING REAL",
      "SWAG FOR ALL",
      "COMMUNITY FIRST",
    ],
  },
  footer: {
    terms: "TERMS OF SERVICE",
    privacy: "PRIVACY POLICY",
    contact: "CONTACT",
    sponsor: "BECOME A SPONSOR",
    copyright: "Built by young people, for young people.",
    eventHeading: "EVENT",
    legalHeading: "LEGAL",
    rightsReserved: "All rights reserved.",
    locationTag: "MATAMOROS · TAMAULIPAS · 2026",
  },
  waitlist: {
    title: "PARTICIPANT REGISTRATION",
    subtitle: "Sign up to participate in Build Pa'l Norte.",
    name: "NAME",
    email: "EMAIL",
    phone: "PHONE",
    age: "AGE",
    sex: "SEX",
    school: "SCHOOL",
    github: "GITHUB",
    interests: "INTERESTS",
    optional: "optional",
    namePlaceholder: "Your name",
    phonePlaceholder: "+52 868 123 4567",
    agePlaceholder: "18",
    schoolPlaceholder: "Your school or university",
    githubPlaceholder: "username or profile URL",
    interestsPlaceholder: "Web dev, AI, design, hardware…",
    sexOptions: {
      male: "Male",
      female: "Female",
      other: "Other",
      preferNotToSay: "Prefer not to say",
    },
    sexPlaceholder: "Select",
    join: "REGISTER",
    joining: "REGISTERING...",
    close: "CLOSE",
    successTitle: "You're registered!",
    successDefault: event.waitlistSuccessDetail,
    successAlreadyTitle: "You're already on the list!",
    successAlready:
      "Good news — we already have you signed up for July 25–26. We'll email you when registration opens with venue details and next steps.",
    errors: {
      invalidName: "Please enter your name.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidAge: "You must be 18 or older to register.",
      invalidSex: "Please select your sex.",
      invalidGithub: "Please enter a valid GitHub username or URL.",
      firestoreSetup:
        "Firestore is not set up yet. Create a Firestore database in Firebase Console first.",
      unavailable:
        "Could not reach Firestore. Check your internet connection and try again.",
      generic: "Something went wrong. Please try again.",
    },
  },
  sponsor: {
    title: "SPONSOR REGISTRATION",
    subtitle: "Partner with us to empower young builders in Matamoros.",
    name: "NAME",
    email: "EMAIL",
    phone: "PHONE",
    company: "COMPANY",
    sponsorship: "WHAT DO YOU WANT TO SPONSOR?",
    problem: "WHAT PROBLEM DO YOU WANT SOLVED?",
    workshop: "WANT TO DO A WORKSHOP?",
    namePlaceholder: "Your name",
    phonePlaceholder: "+52 868 123 4567",
    companyPlaceholder: "Company or organization",
    sponsorshipPlaceholder: "Cash amount, prizes, swag, food, cloud credits…",
    problemPlaceholder:
      "What challenge or theme would you like hackers to tackle?",
    workshopOptions: {
      yes: "Yes",
      no: "No",
    },
    workshopPlaceholder: "Select",
    submit: "SUBMIT",
    submitting: "SUBMITTING...",
    close: "CLOSE",
    successTitle: "Thanks for your interest!",
    successDefault: "We'll reach out to discuss sponsorship details.",
    successAlreadyTitle: "We already have your info!",
    successAlready: "Looks like you've already reached out — we'll be in touch soon.",
    errors: {
      invalidName: "Please enter your name.",
      invalidEmail: "Please enter a valid email address.",
      invalidPhone: "Please enter a valid phone number.",
      invalidCompany: "Please enter your company name.",
      invalidSponsorship: "Please describe what you'd like to sponsor.",
      invalidProblem: "Please describe the problem you'd like solved.",
      invalidWorkshop: "Please select whether you'd like to do a workshop.",
      firestoreSetup:
        "Firestore is not set up yet. Create a Firestore database in Firebase Console first.",
      unavailable:
        "Could not reach Firestore. Check your internet connection and try again.",
      generic: "Something went wrong. Please try again.",
    },
  },
  sponsorsSection: {
    label: "SPONSORS",
    title: "Backed by the Best",
    accentWord: "Best",
    subtitle:
      "Build Pa'l Norte runs on the support of local businesses and people who believe in young builders. Cash, food, workshops, prizes — every contribution counts.",
    cta: "BECOME A SPONSOR",
    learnMore: "LEARN MORE",
    note: "Custom packages available",
    perks: [
      { text: "Cash, food, or in-kind contributions welcome" },
      { text: "Host a 60–90 min workshop or keynote" },
      { text: "Direct access to motivated young talent" },
      { text: "Real impact on Matamoros's tech community" },
    ],
  },
  sponsorsPage: {
    metaTitle: "Sponsor Build Pa'l Norte — Empower Young Builders",
    metaDescription:
      "Partner with Build Pa'l Norte to support the next generation of tech builders in Matamoros. Money, food, workshops, prizes — every contribution counts.",
    label: "PARTNER WITH US",
    title: "Sponsor the Future",
    accentWord: "Future",
    subtitle:
      "Help us run a free, high-quality hackathon. Cash, food, prizes, cloud credits, workshops — every contribution matters.",
    whyLabel: "WHY SPONSOR",
    whyTitle: "Why It Matters",
    whySubtitle:
      "Your support makes the event free for everyone and puts real resources in the hands of young builders.",
    whyItems: [
      {
        title: "Brand Visibility",
        body: "Your logo on every piece of swag, our website, stage banners, and all event communications reaching hundreds of young builders.",
      },
      {
        title: "Talent Pipeline",
        body: "Meet motivated young developers, designers, and makers before they enter the job market. Recruiting at the source.",
      },
      {
        title: "Host a Workshop",
        body: "Run a live session, showcase your product, or set a challenge for participants. Direct access and real engagement.",
      },
      {
        title: "Community Impact",
        body: "Matamoros is building its tech scene from the ground up. Your sponsorship helps make a free, high-quality event possible.",
      },
    ],
    contributionsLabel: "HOW YOU CAN HELP",
    contributionsTitle: "What We Need",
    contributionsSubtitle:
      "We're not just looking for cash. If you can cover any of these, you're a sponsor — reach out and let's figure out the details.",
    coveredLabel: "Covered by",
    contributions: [
      {
        id: "venue",
        category: "Venue",
        examples: "Event space rental",
        who: "Universities, co-working spaces",
      },
      {
        id: "food",
        category: "Food",
        examples: "Full lunch for all participants",
        who: "Restaurants, catering",
      },
      {
        id: "dinner",
        category: "Dinner",
        examples: "Pizzas (30+), tacos, catering",
        who: "Pizzerias, local restaurants",
      },
      {
        id: "night-snacks",
        category: "Night snacks",
        examples: "Chips, candy, energy drinks",
        who: "Convenience stores, brands",
      },
      {
        id: "breakfast",
        category: "Breakfast",
        examples: "Coffee, pastries, fruit",
        who: "Cafes, bakeries",
      },
      {
        id: "beverages",
        category: "Beverages",
        examples: "Water, soft drinks",
        who: "Distributors, convenience stores",
      },
      {
        id: "prizes",
        category: "Prizes",
        examples: "Cash, gadgets, credits",
        who: "Industrial companies, tech firms",
      },
      {
        id: "branding",
        category: "Branding",
        examples: "Banners, stickers, print",
        who: "Print shops, agencies",
      },
      {
        id: "tech-av",
        category: "Tech & AV",
        examples: "Extension cords, internet, speakers",
        who: "IT companies, venues",
      },
      {
        id: "marketing",
        category: "Marketing",
        examples: "Ads, social media",
        who: "Agencies, organizers",
      },
      {
        id: "media",
        category: "Media",
        examples: "Photo and video coverage",
        who: "Students, agencies",
      },
      {
        id: "workshop",
        category: "Workshop",
        examples: "Run a 60–90 min session",
        who: "Companies, professionals",
      },
    ],
    workshopsLabel: "HOST A WORKSHOP",
    workshopsTitle: "Bring a Workshop",
    workshopsSubtitle:
      "We don't have a workshop lineup yet — and that's where you come in. Sponsor a 60–90 minute session that helps participants build something real, not sit through a lecture.",
    workshopsCallout:
      "Workshops are open. If your company has expertise to share, we'd love to put you in front of the builders.",
    workshopIdeasLabel: "EXAMPLE TOPICS WE'D LOVE TO SEE",
    workshopExampleTag: "IDEA",
    idealForLabel: "For:",
    speakersLabel: "Who could host:",
    workshopsHostCta:
      "Want to host a workshop? Tell us your idea — we'll make it happen.",
    workshops: [
      {
        id: "ai-agents",
        title: "Building with AI Agents",
        theme: "How to build AI agents that execute real tasks",
        topics: [
          "What is an agent",
          "MCPs",
          "RAG",
          "Automation",
          "Business use cases",
        ],
        idealFor: "All tracks",
        speakers: "AI consultants, SaaS founders, CS professors",
      },
      {
        id: "mvp",
        title: "From Idea to MVP in 24 Hours",
        theme: "How to validate an idea and turn it into a working prototype",
        topics: [
          "Define the problem",
          "Realistic scope",
          "Prioritization",
          "How to win a hackathon",
        ],
        idealFor: "New teams",
        speakers: "Entrepreneurs, startup founders, incubators",
      },
      {
        id: "nearshoring",
        title: "Nearshoring Opportunities in Northern Mexico",
        theme: "Real problems that exist today in industry",
        topics: [
          "Nearshoring",
          "Manufacturing",
          "Supply chain",
          "Regional opportunities",
        ],
        idealFor: "Enterprise, Smart Border Cities",
        speakers: "INDEX Nacional, INDEX Matamoros, COPARMEX",
      },
      {
        id: "logistics",
        title: "Logistics & Cross-Border Commerce",
        theme: "How cross-border logistics actually works",
        topics: [
          "Carta Porte",
          "Customs",
          "Transportation",
          "International crossings",
        ],
        idealFor: "Enterprise",
        speakers: "Customs agencies, freight companies, forwarders",
      },
      {
        id: "ux",
        title: "Rapid UI/UX for Hackathons",
        theme: "Design fast without losing quality",
        topics: ["Figma", "Wireframes", "MVP UX"],
        idealFor: "Designers, developers",
        speakers: "Local agencies, senior freelancers",
      },
      {
        id: "cloud",
        title: "Cloud Deployment in Under One Hour",
        theme: "How to ship fast",
        topics: ["VPS", "Docker", "Basic CI/CD"],
        idealFor: "Everyone",
        speakers: "Hosting companies, DevOps engineers",
      },
      {
        id: "pitch",
        title: "Pitching Like a Startup",
        theme: "How to present a project",
        topics: ["Storytelling", "Live demo", "How to impress judges"],
        idealFor: "Everyone",
        speakers: "Entrepreneurs, investors, accelerators",
      },
      {
        id: "security",
        title: "Cybersecurity for Modern Applications",
        theme: "Basic security for applications",
        topics: ["OWASP", "APIs", "AI security"],
        idealFor: "AI track, Enterprise",
        speakers: "Security engineers, consultants",
      },
    ],
    keynotesLabel: "KEYNOTE IDEAS",
    keynotesSubtitle:
      "Short talks we'd love a sponsor or industry leader to deliver — not confirmed yet.",
    keynotes: [
      {
        title: "Why Nearshoring Matters",
        description:
          "An industry leader explains the regional opportunity and what builders can do about it.",
      },
      {
        title: "Building Companies from the Border",
        description:
          "A successful founder from the region shares what it took to build from Matamoros.",
      },
      {
        title: "The Future of AI in Business",
        description:
          "An AI expert unpacks where the industry is heading and what that means for young builders.",
      },
    ],
    ctaLabel: "READY TO PARTNER?",
    ctaTitle: "Let's Build Together",
    ctaSubtitle:
      "Tell us what you want to contribute — cash, food, a workshop, or something else. We'll figure out the details together.",
    ctaButton: "BECOME A SPONSOR",
    ctaNote: "No commitment until you're ready · We'll reach out within 48h",
    back: "← BACK",
  },
  login: {
    metaTitle: "Member Login — Build Pa'l Norte",
    metaDescription:
      "Sign in with Google to access your Build Pa'l Norte member portal.",
    eyebrow: "MEMBERS",
    title: "Sign in",
    subtitle: "Use your Google account to open your member dashboard.",
    signingIn: "Signing in...",
    signInWithGoogle: "Sign in with Google",
    signInFailed: "Google sign in failed. Try again.",
    signedInAs: "Signed in as",
    signOut: "Sign out",
    signingOut: "Signing out...",
    signOutFailed: "Sign out failed. Try again.",
    notRegistered:
      "This Google account isn't on the waitlist. Join the waitlist first, then sign in.",
    backToHome: "Back to home",
  },
  members: {
    metaTitle: "Member Portal — Build Pa'l Norte",
    metaDescription:
      "Your Build Pa'l Norte member dashboard for hackathon updates and team info.",
    eyebrow: "MEMBER ACCESS",
    title: "Welcome, {name}",
    subtitle:
      "You're in. Complete your profile, explore what's coming, and get ready for July 25.",
    signOut: "Sign out",
    signingOut: "Signing out...",
    signOutFailed: "Sign out failed. Try again.",
    backToHome: "← Back to event site",
    comingSoon: "SOON",
    event: {
      label: "EVENT",
      title: "Build Pa'l Norte 2026",
      countdown: {
        days: "DAYS",
        hours: "HRS",
        minutes: "MIN",
        seconds: "SEC",
      },
    },
    profileCompletion: {
      label: "YOUR PROFILE",
      title: "Help other builders find you",
      subtitle: "Add the missing details so teammates can discover you in the directory.",
      completeLabel: "Profile looks great — you're ready to be discovered.",
      editLabel: "Complete your profile",
      items: {
        github: "GitHub linked",
        bio: "Bio added",
        skills: "Skills listed",
        interests: "Interests filled in",
      },
    },
    quickActions: {
      label: "QUICK ACTIONS",
      openLabel: "Open",
      items: [
        {
          id: "profile",
          title: "Your profile",
          description: "View and edit your participant info, skills, and team status.",
        },
        {
          id: "directory",
          title: "Member directory",
          description: "Browse builders by interests, skills, and team availability.",
        },
        {
          id: "team",
          title: "My team",
          description: "Create a team, send invites, and manage your crew.",
          comingSoon: true,
        },
        {
          id: "submit",
          title: "Project submission",
          description: "Share your repo and demo link when hackathon day arrives.",
          comingSoon: true,
        },
      ],
    },
    directory: {
      metaTitle: "Member Directory — Build Pa'l Norte",
      metaDescription:
        "Browse hackathon participants by name, skills, interests, and team availability.",
      title: "Member directory",
      subtitle:
        "Find builders to collaborate with. Search by name, school, skills, or interests.",
      searchPlaceholder: "Search members…",
      searchAriaLabel: "Search member directory",
      clearSearch: "Clear search",
      noResults: "No members match your search.",
      noResultsHint: "Try a different name, skill, or interest.",
      resultsCount: "{count} builders",
      resultsCountOne: "1 builder",
      viewProfile: "View profile",
      loading: "Searching…",
      searchFailed: "Search failed. Try again.",
      viewAllResults: "View all results",
      searchHint: "Search by name, skill, school, or interest",
      showingResultsFor: "Results for “{query}”",
      sectionLabel: "BUILDERS",
      filterAll: "All",
      filterOpenTeams: "Open to teams",
      loadMore: "Load more builders",
      showingCount: "Showing {shown} of {total}",
      statSuffix: "builders",
      statSuffixOne: "builder",
    },
  },
  profile: {
    metaTitle: "Your Profile — Build Pa'l Norte",
    metaDescription:
      "View your Build Pa'l Norte participant profile, registration details, and hackathon status.",
    metaTitleMember: "{name} — Build Pa'l Norte",
    metaDescriptionMember:
      "View {name}'s hackathon participant profile on Build Pa'l Norte.",
    eyebrow: "YOUR PROFILE",
    memberEyebrow: "MEMBER PROFILE",
    subtitle:
      "This is your participant profile. Update your GitHub, interests, and skills so other builders can find you. Team assignments and event updates will show up here as we get closer to July 25.",
    memberSince: "Member since",
    signOut: "Sign out",
    signingOut: "Signing out...",
    signOutFailed: "Sign out failed. Try again.",
    backToHome: "← Back to dashboard",
    backToMemberHome: "← Back to home",
    backToDirectory: "← Back to directory",
    editProfile: "Edit profile",
    editSection: "EDIT PROFILE",
    saveProfile: "Save changes",
    savingProfile: "Saving...",
    cancelEdit: "Cancel",
    saveSuccess: "Profile updated.",
    bio: "BIO",
    bioEmpty: "No bio yet.",
    skills: "SKILLS",
    skillsEmpty: "No skills listed yet.",
    school: "SCHOOL",
    schoolEmpty: "Not specified",
    interests: "INTERESTS",
    interestsEmpty: "No interests listed yet.",
    openToTeams: "Open to teams",
    openToTeamsHint: "Show other builders that you're looking for teammates.",
    notOpenToTeams: "Not looking for a team",
    email: "EMAIL",
    phone: "PHONE",
    showEmail: "Show email publicly",
    showEmailHint: "Let other members see your email on your public profile.",
    showPhone: "Show phone publicly",
    showPhoneHint: "Let other members see your phone number on your public profile.",
    showPhoneDisabledHint: "Add a phone number to your registration to enable this.",
    contactVisibilitySection: "CONTACT VISIBILITY",
    contactPublic: "Public",
    contactPrivate: "Private",
    github: "GITHUB",
    viewOnGithub: "View on GitHub",
    bioPlaceholder: "Tell others what you're building or what you're looking for...",
    skillsPlaceholder: "React, Python, UI design, hardware...",
    skillsHint: "Separate with commas — React, Python, UI design...",
    aboutSection: "ABOUT",
    detailsSection: "DETAILS",
    errors: {
      unauthorized: "Sign in to update your profile.",
      notFound: "Profile not found.",
      notRegistered: "This account is not registered for the event.",
      invalidBody: "Invalid request.",
      invalidGithub: "Enter a valid GitHub username or profile URL.",
      fieldTooLong: "One of the fields is too long.",
      invalidSkills: "Skills must be a list of short tags.",
      generic: "Something went wrong. Try again.",
      saveFailed: "Could not save your profile. Try again.",
    },
  },
  legal: {
    back: "← BACK",
    label: "LEGAL",
    lastUpdated: "June 5, 2026",
    terms: {
      metaTitle: "Terms of Service — Build Pa'l Norte",
      metaDescription:
        "Terms of service for Build Pa'l Norte hackathon participants.",
      title: "Terms of Service",
      sections: [
        {
          title: "1. Agreement",
          blocks: [
            {
              type: "paragraph",
              text: "By joining the Build Pa'l Norte waitlist, registering for the event, or participating in any related activities, you agree to these Terms of Service. If you do not agree, please do not use our services or attend the event.",
            },
          ],
        },
        {
          title: "2. Eligibility",
          blocks: [
            {
              type: "paragraph",
              text: "Build Pa'l Norte is open to participants of all ages. Participants under 18 must have permission from a parent or legal guardian. Organizers reserve the right to deny or revoke participation for violations of these terms or the code of conduct.",
            },
          ],
        },
        {
          title: "3. Registration & Waitlist",
          blocks: [
            {
              type: "paragraph",
              text: "Submitting your name, email, and phone number to the waitlist does not guarantee a spot at the event. Registration details, including dates, venue, and capacity, will be communicated separately. You agree to provide accurate information and keep your contact details up to date.",
            },
          ],
        },
        {
          title: "4. Code of Conduct",
          blocks: [
            {
              type: "paragraph",
              text: "All participants, mentors, volunteers, and organizers are expected to treat each other with respect. Harassment, discrimination, hate speech, intimidation, or disruptive behavior of any kind will not be tolerated and may result in immediate removal from the event without refund of any kind.",
            },
            {
              type: "paragraph",
              text: "We are committed to fostering an inclusive environment where everyone — regardless of background, experience level, gender, or identity — feels welcome to learn and build.",
            },
          ],
        },
        {
          title: "5. Intellectual Property",
          blocks: [
            {
              type: "paragraph",
              text: "You retain ownership of any code, designs, and projects you create during the hackathon. By participating in demo sessions or submitting projects for judging, you grant Build Pa'l Norte a non-exclusive, royalty-free license to display, photograph, record, and share your project for promotional and educational purposes.",
            },
          ],
        },
        {
          title: "6. Liability & Assumption of Risk",
          blocks: [
            {
              type: "paragraph",
              text: "Participation is at your own risk. Build Pa'l Norte and its organizers, sponsors, and partners are not liable for any injury, loss, theft, or damage to personal property that may occur during the event. You are responsible for your own equipment, including laptops and peripherals.",
            },
          ],
        },
        {
          title: "7. Photography & Media",
          blocks: [
            {
              type: "paragraph",
              text: "The event may be photographed and recorded. By attending, you consent to the use of your likeness in photos, videos, and promotional materials related to Build Pa'l Norte. If you prefer not to be photographed, please notify an organizer on site.",
            },
          ],
        },
        {
          title: "8. Changes & Cancellation",
          blocks: [
            {
              type: "paragraph",
              text: "We reserve the right to modify event details, schedules, venues, or these terms at any time. In the event of cancellation or significant changes, we will make reasonable efforts to notify registered participants via the email provided at signup.",
            },
          ],
        },
        {
          title: "9. Contact",
          blocks: [
            {
              type: "paragraph",
              text: "Questions about these terms? Reach us at {email}.",
            },
          ],
        },
      ],
    },
    privacy: {
      metaTitle: "Privacy Policy — Build Pa'l Norte",
      metaDescription:
        "Privacy policy for Build Pa'l Norte waitlist and event.",
      title: "Privacy Policy",
      sections: [
        {
          title: "1. Overview",
          blocks: [
            {
              type: "paragraph",
              text: 'Build Pa\'l Norte ("we," "us," or "our") respects your privacy. This policy explains what information we collect when you join our waitlist or participate in the event, and how we use it.',
            },
          ],
        },
        {
          title: "2. Information We Collect",
          blocks: [
            {
              type: "paragraph",
              text: "When you sign up for the waitlist, we collect:",
            },
            {
              type: "list",
              items: [
                "Your name",
                "Your email address",
                "Your phone number",
                "The date and time of your signup",
              ],
            },
            {
              type: "paragraph",
              text: "We may also collect additional information during registration, such as team details, dietary preferences, or emergency contact information, which will be disclosed at the time of collection.",
            },
          ],
        },
        {
          title: "3. How We Use Your Information",
          blocks: [
            {
              type: "paragraph",
              text: "We use the information we collect to:",
            },
            {
              type: "list",
              items: [
                "Notify you when registration opens",
                "Send event updates, schedules, and important announcements",
                "Manage your participation and team assignments",
                "Improve future editions of the hackathon",
              ],
            },
            {
              type: "paragraph",
              text: "We will not sell your personal information to third parties.",
            },
          ],
        },
        {
          title: "4. Data Storage",
          blocks: [
            {
              type: "paragraph",
              text: "Waitlist data is stored securely using Firebase/Firestore. We take reasonable measures to protect your information, but no method of electronic storage is 100% secure.",
            },
          ],
        },
        {
          title: "5. Data Retention",
          blocks: [
            {
              type: "paragraph",
              text: "We retain your information for as long as needed to operate the event and communicate with participants. If you wish to have your data removed from the waitlist, contact us and we will delete it within a reasonable timeframe.",
            },
          ],
        },
        {
          title: "6. Your Rights",
          blocks: [
            {
              type: "paragraph",
              text: "You may request access to, correction of, or deletion of your personal data at any time by emailing {email}. We will respond to legitimate requests within 30 days.",
            },
          ],
        },
        {
          title: "7. Cookies & Analytics",
          blocks: [
            {
              type: "paragraph",
              text: "This landing page may use basic analytics to understand traffic and improve the site experience. Any analytics tools used will be configured to minimize personal data collection.",
            },
          ],
        },
        {
          title: "8. Changes to This Policy",
          blocks: [
            {
              type: "paragraph",
              text: 'We may update this privacy policy from time to time. The "Last updated" date at the top of this page will reflect any changes. Continued use of our services after changes constitutes acceptance of the updated policy.',
            },
          ],
        },
        {
          title: "9. Contact",
          blocks: [
            {
              type: "paragraph",
              text: "Privacy questions? Email us at {email}.",
            },
          ],
        },
      ],
    },
  },
};

export default dictionary;
