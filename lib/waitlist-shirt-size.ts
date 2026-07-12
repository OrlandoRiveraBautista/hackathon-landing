import { doc, updateDoc } from "firebase/firestore";
import { getDb } from "./firebase";
import { isValidShirtSize, type ShirtSize } from "./shirt-size";

export async function updateWaitlistShirtSize(
  docId: string,
  shirtSize: ShirtSize,
): Promise<void> {
  if (!isValidShirtSize(shirtSize)) {
    throw new Error("invalid_shirt_size");
  }

  await updateDoc(doc(getDb(), "waitlist", docId), { shirtSize });
}
