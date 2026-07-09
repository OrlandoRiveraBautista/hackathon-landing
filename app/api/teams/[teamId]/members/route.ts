import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { addMemberToTeam } from "@/lib/teams";

type Params = { params: Promise<{ teamId: string }> };

export async function POST(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const targetUserId = typeof body.userId === "string" ? body.userId.trim() : "";
  if (!targetUserId) {
    return NextResponse.json({ error: "userId is required." }, { status: 400 });
  }

  try {
    const team = await addMemberToTeam(teamId, session.user.id, targetUserId);
    return NextResponse.json({ team });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "not_captain") {
      return NextResponse.json({ error: "Only the captain can add members." }, { status: 403 });
    }
    if (msg === "already_in_team") {
      return NextResponse.json({ error: "This member is already in a team." }, { status: 409 });
    }
    if (msg === "team_full") {
      return NextResponse.json({ error: "Team is full." }, { status: 409 });
    }
    if (msg === "member_not_found") {
      return NextResponse.json({ error: "Member not found." }, { status: 404 });
    }
    if (msg === "team_not_found") {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
