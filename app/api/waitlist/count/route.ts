import { NextResponse } from "next/server";
import { getWaitlistCount } from "@/lib/waitlist";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Waitlist count fetch failed:", error);
    return NextResponse.json({ count: null }, { status: 503 });
  }
}
