import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { getDb } from "./firebase";

export type WaitlistResult = {
  alreadyRegistered: boolean;
};

export type WaitlistErrorMessages = {
  invalidName: string;
  invalidEmail: string;
  firestoreSetup: string;
  unavailable: string;
  generic: string;
};

function emailToDocId(email: string) {
  return email.toLowerCase().replace(/[^a-z0-9]/g, "_");
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
  name: string,
  email: string,
  messages: WaitlistErrorMessages,
): Promise<WaitlistResult> {
  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (trimmedName.length < 2) {
    throw new Error(messages.invalidName);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
    throw new Error(messages.invalidEmail);
  }

  const db = getDb();
  const docRef = doc(db, "waitlist", emailToDocId(normalizedEmail));

  try {
    const existing = await getDoc(docRef);
    if (existing.exists()) {
      return { alreadyRegistered: true };
    }

    await setDoc(docRef, {
      name: trimmedName,
      email: normalizedEmail,
      createdAt: serverTimestamp(),
    });

    return { alreadyRegistered: false };
  } catch (error) {
    console.error("Firestore waitlist write failed:", error);
    throw new Error(firestoreErrorMessage(error, messages));
  }
}
