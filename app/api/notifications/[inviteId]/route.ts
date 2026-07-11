import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { respondToTeamInvite } from "@/lib/teams/invites";

type Params = { params: Promise<{ inviteId: string }> };

export async function POST(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { inviteId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const action = body.action;
  if (action !== "accept" && action !== "decline") {
    return NextResponse.json({ error: "action must be accept or decline." }, { status: 400 });
  }

  try {
    const result = await respondToTeamInvite(inviteId, session.user.id, action === "accept");
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "invite_not_found") {
      return NextResponse.json({ error: "Invite not found." }, { status: 404 });
    }
    if (msg === "not_invitee") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }
    if (msg === "invite_not_pending") {
      return NextResponse.json({ error: "Invite is no longer pending." }, { status: 409 });
    }
    if (msg === "already_in_team") {
      return NextResponse.json({ error: "You are already in a team." }, { status: 409 });
    }
    if (msg === "team_full") {
      return NextResponse.json({ error: "Team is full." }, { status: 409 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
