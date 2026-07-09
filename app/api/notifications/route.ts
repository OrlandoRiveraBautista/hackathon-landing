import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getPendingInviteCount, getPendingInvitesForUser } from "@/lib/teams/invites";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const invites = await getPendingInvitesForUser(session.user.id);
  return NextResponse.json({ invites });
}

export async function HEAD() {
  const session = await getSession();
  if (!session?.user?.id) {
    return new NextResponse(null, { status: 401 });
  }

  const count = await getPendingInviteCount(session.user.id);
  return new NextResponse(null, {
    status: 200,
    headers: { "x-pending-count": String(count) },
  });
}
