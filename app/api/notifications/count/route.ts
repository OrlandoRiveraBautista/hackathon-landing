import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getPendingInviteCount } from "@/lib/teams/invites";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await getPendingInviteCount(session.user.id);
  return NextResponse.json({ count });
}
