import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { getDb } from "./firebase";
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
  createdAt: Date | null;
};

export async function getWaitlistSignups(): Promise<WaitlistSignup[]> {
  const snapshot = await getDocs(
    query(collection(getDb(), "waitlist"), orderBy("createdAt", "desc")),
  );

  return snapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
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
      createdAt: data.createdAt?.toDate?.() ?? null,
    };
  });
}
