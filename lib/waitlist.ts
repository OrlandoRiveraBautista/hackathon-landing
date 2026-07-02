import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";

export type SexOption = "male" | "female" | "other" | "preferNotToSay";

export const SEX_OPTIONS: SexOption[] = [
  "male",
  "female",
  "other",
  "preferNotToSay",
];

export type ParticipantInput = {
  name: string;
  email: string;
  phone: string;
  age: string;
  sex: string;
  school?: string;
  github?: string;
  interests?: string;
};

export type WaitlistResult = {
  alreadyRegistered: boolean;
};

export type WaitlistErrorMessages = {
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

function normalizePhone(phone: string) {
  return phone.replace(/\D/g, "");
}

function isValidPhone(phone: string) {
  const digits = normalizePhone(phone);
  return digits.length >= 10 && digits.length <= 15;
}

function emailToDocId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
}

export function waitlistDocIdForEmail(email: string) {
  return emailToDocId(email);
}

function isValidAge(age: string) {
  const parsed = Number.parseInt(age, 10);
  return Number.isInteger(parsed) && parsed >= 18 && parsed <= 120;
}

function isValidSex(sex: string): sex is SexOption {
  return SEX_OPTIONS.includes(sex as SexOption);
}

function normalizeGithub(github: string) {
  const trimmed = github.trim();
  if (!trimmed) return "";

  const urlMatch = trimmed.match(
    /(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?)/i,
  );
  if (urlMatch) return urlMatch[1];

  if (/^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,37}[a-zA-Z0-9])?$/.test(trimmed)) {
    return trimmed;
  }

  return null;
}

function firestoreErrorCode(error: unknown) {
  return error && typeof error === "object" && "code" in error
    ? String(error.code)
    : "";
}

function firestoreErrorMessage(
  error: unknown,
  messages: WaitlistErrorMessages,
) {
  const code = firestoreErrorCode(error);

  if (code === "not-found" || code === "failed-precondition") {
    return messages.firestoreSetup;
  }

  if (code === "unavailable") {
    return messages.unavailable;
  }

  return messages.generic;
}

export async function getWaitlistCount(): Promise<number> {
  const db = getDb();
  const snapshot = await getCountFromServer(collection(db, "waitlist"));
  return snapshot.data().count;
}

export async function joinWaitlist(
  input: ParticipantInput,
  messages: WaitlistErrorMessages,
): Promise<WaitlistResult> {
  const trimmedName = input.name.trim();
  const normalizedEmail = input.email.trim().toLowerCase();
  const normalizedPhone = normalizePhone(input.phone);
  const trimmedSchool = input.school?.trim() ?? "";
  const trimmedInterests = input.interests?.trim() ?? "";
  const trimmedGithub = input.github?.trim() ?? "";

  if (trimmedName.length < 2) {
    throw new Error(messages.invalidName);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error(messages.invalidEmail);
  }

  if (!isValidPhone(input.phone)) {
    throw new Error(messages.invalidPhone);
  }

  if (!isValidAge(input.age)) {
    throw new Error(messages.invalidAge);
  }

  if (!isValidSex(input.sex)) {
    throw new Error(messages.invalidSex);
  }

  let github: string | undefined;
  if (trimmedGithub) {
    const normalized = normalizeGithub(trimmedGithub);
    if (!normalized) {
      throw new Error(messages.invalidGithub);
    }
    github = normalized;
  }

  const db = getDb();
  const docRef = doc(db, "waitlist", emailToDocId(normalizedEmail));
  const age = Number.parseInt(input.age, 10);

  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      return { alreadyRegistered: true };
    }

    const payload: Record<string, unknown> = {
      name: trimmedName,
      email: normalizedEmail,
      phone: normalizedPhone,
      age,
      sex: input.sex,
      status: "pending",
      createdAt: serverTimestamp(),
    };

    if (trimmedSchool) payload.school = trimmedSchool;
    if (github) payload.github = github;
    if (trimmedInterests) payload.interests = trimmedInterests;

    await setDoc(docRef, payload);

    return { alreadyRegistered: false };
  } catch (error) {
    console.error("Firestore waitlist write failed:", error);
    throw new Error(firestoreErrorMessage(error, messages));
  }
}
