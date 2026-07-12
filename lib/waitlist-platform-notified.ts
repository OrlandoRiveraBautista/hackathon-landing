import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { getDb } from "./firebase";

export async function markWaitlistPlatformNotified(docId: string) {
  await updateDoc(doc(getDb(), "waitlist", docId), {
    platformNotifiedAt: serverTimestamp(),
  });
}
