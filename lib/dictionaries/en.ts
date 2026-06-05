import type { Dictionary } from "./types";

const dictionary: Dictionary = {
  meta: {
    title: "Build Pa'l Norte — Tech Hackathon for Young Builders",
    description:
      "A 24-hour tech hackathon in Matamoros for young people. Code, create, and compete — join the waitlist for Build Pa'l Norte.",
  },
  nav: {
    about: "ABOUT",
    whyJoin: "WHY JOIN",
    howItWorks: "HOW IT WORKS",
    faq: "FAQ",
  },
  hero: {
    tagline: "a 24h tech hackathon for young people",
    location: "Matamoros, Tamaulipas",
    waitlistLabel: "on the waitlist",
    registerNow: "REGISTER NOW",
  },
  about: {
    label: "THE MISSION",
    title: "Code. Create. Compete.",
    subtitle:
      "A 24-hour hackathon in Matamoros where young builders turn wild ideas into working prototypes.",
    whatIsIt: "WHAT IS IT?",
    whatIsItBody:
      "Build Pa'l Norte is a high-energy tech hackathon built for students and young creators in Matamoros. Over 24 hours, teams design, code, and ship projects that solve real problems — with mentors, workshops, and a community that's rooting for you.",
    whoIsItFor: "WHO IS IT FOR?",
    whoIsItForBody:
      "Whether it's your first line of code or your tenth hackathon, you belong here. Developers, designers, makers, and dreamers — if you're curious and ready to build, grab a spot on the waitlist.",
    stats: [
      { value: "24H", label: "TO BUILD" },
      { value: "0", label: "ON WAITLIST", source: "waitlist" },
      { value: "MATAMOROS", label: "TAMAULIPAS", compact: true },
    ],
  },
  highlights: {
    label: "WHY JOIN",
    title: "More Than a Weekend",
    subtitle:
      "Everything you need to go from idea to demo — and have a blast doing it.",
    items: [
      {
        id: "ship",
        title: "Ship Something Real",
        description:
          "Go from blank canvas to live demo. Apps, hardware, games, tools — if you can imagine it, you can build it.",
      },
      {
        id: "crew",
        title: "Find Your Crew",
        description:
          "Come solo or bring friends. We'll help you match with teammates who complement your skills and energy.",
      },
      {
        id: "learn",
        title: "Learn From Pros",
        description:
          "Industry mentors drop in with workshops on design, APIs, pitching, and more. Ask questions, get unstuck, level up.",
      },
      {
        id: "win",
        title: "Win & Get Seen",
        description:
          "Top projects take home prizes, swag, and bragging rights. Judges are looking for creativity, execution, and impact.",
      },
    ],
  },
  howItWorks: {
    label: "THE FLOW",
    title: "How It Works",
    subtitle: "Four steps from curious to competitor. Simple as that.",
    steps: [
      {
        step: "01",
        title: "Join the Waitlist",
        description:
          "Sign up with your name and email. We'll notify you the moment registration opens and share event details.",
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
          "Pitch your project to judges and the crowd. Winners announced, prizes handed out, new friends made.",
      },
    ],
  },
  faq: {
    label: "FAQ",
    title: "Got Questions?",
    subtitle:
      "We've got answers. Still stuck? Hit us up at hello@buildpalnorte.com",
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
        answer:
          "Build Pa'l Norte takes place in Matamoros, Tamaulipas — a 24-hour hackathon. Exact dates will be announced soon. Join the waitlist to be the first to know.",
      },
    ],
  },
  cta: {
    label: "DON'T SLEEP ON THIS",
    title: "Ready to build pa'l norte?",
    subtitle:
      "Spots will go fast. Drop your name on the waitlist and we'll hit you up when doors open.",
    button: "JOIN THE WAITLIST",
  },
  footer: {
    terms: "TERMS OF SERVICE",
    privacy: "PRIVACY POLICY",
    contact: "CONTACT",
    copyright: "Built by young people, for young people.",
  },
  waitlist: {
    title: "JOIN THE WAITLIST",
    subtitle: "Be the first to know when registration opens.",
    name: "NAME",
    email: "EMAIL",
    namePlaceholder: "Your name",
    join: "JOIN WAITLIST",
    joining: "JOINING...",
    close: "CLOSE",
    successTitle: "You're on the list!",
    successDefault: "We'll reach out when registration opens.",
    successAlready: "You're already signed up — we'll be in touch.",
    errors: {
      invalidName: "Please enter your name.",
      invalidEmail: "Please enter a valid email address.",
      firestoreSetup:
        "Firestore is not set up yet. Create a Firestore database in Firebase Console first.",
      unavailable:
        "Could not reach Firestore. Check your internet connection and try again.",
      generic: "Something went wrong. Please try again.",
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
              text: "Submitting your name and email to the waitlist does not guarantee a spot at the event. Registration details, including dates, venue, and capacity, will be communicated separately. You agree to provide accurate information and keep your contact details up to date.",
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
