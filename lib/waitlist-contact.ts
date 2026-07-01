import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDb } from "./firebase";

export async function markWaitlistContacted(docId: string) {
  await updateDoc(doc(getDb(), "waitlist", docId), {
    status: "contacted",
    contactedAt: serverTimestamp(),
  });
}
