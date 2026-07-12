import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  type DocumentData,
} from "firebase/firestore";
import { getDb } from "./firebase";
import { waitlistDocIdForEmail } from "./waitlist";
import { normalizeWaitlistStatus, type WaitlistStatus } from "./waitlist-status";
import type { SexOption } from "./waitlist";

export type WaitlistSignup = {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number | null;
  sex: SexOption | null;
  school: string;
  github: string;
  interests: string;
  status: WaitlistStatus;
  contactedAt: Date | null;
  platformNotifiedAt: Date | null;
  createdAt: Date | null;
};

function mapWaitlistDoc(id: string, data: DocumentData): WaitlistSignup {
  return {
    id,
    name: data.name as string,
    email: data.email as string,
    phone: (data.phone as string | undefined) ?? "—",
    age: typeof data.age === "number" ? data.age : null,
    sex: (data.sex as SexOption | undefined) ?? null,
    school: (data.school as string | undefined) ?? "—",
    github: (data.github as string | undefined) ?? "—",
    interests: (data.interests as string | undefined) ?? "—",
    status: normalizeWaitlistStatus(data.status),
    contactedAt: data.contactedAt?.toDate?.() ?? null,
    platformNotifiedAt: data.platformNotifiedAt?.toDate?.() ?? null,
    createdAt: data.createdAt?.toDate?.() ?? null,
  };
}

export async function getWaitlistSignups(): Promise<WaitlistSignup[]> {
  const snapshot = await getDocs(
    query(collection(getDb(), "waitlist"), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((doc) => mapWaitlistDoc(doc.id, doc.data()));
}

export async function getWaitlistSignupByEmail(
  email: string,
): Promise<WaitlistSignup | null> {
  const normalizedEmail = email.trim().toLowerCase();
  const snapshot = await getDoc(
    doc(getDb(), "waitlist", waitlistDocIdForEmail(normalizedEmail)),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapWaitlistDoc(snapshot.id, snapshot.data());
}
