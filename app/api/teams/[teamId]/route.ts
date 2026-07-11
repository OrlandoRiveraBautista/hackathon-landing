import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTeamWithMembersAndProject, updateTeam, leaveTeam } from "@/lib/teams";

type Params = { params: Promise<{ teamId: string }> };

export async function GET(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;
  const team = await getTeamWithMembersAndProject(teamId);
  if (!team) {
    return NextResponse.json({ error: "Team not found." }, { status: 404 });
  }

  const isMember = team.members.some((m) => m.userId === session.user.id);
  if (!isMember) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  return NextResponse.json({ team });
}

export async function PATCH(request: Request, { params }: Params) {
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

  const input: Record<string, unknown> = {};

  if (body.name !== undefined) {
    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 80) {
      return NextResponse.json(
        { error: "Team name must be between 1 and 80 characters." },
        { status: 400 },
      );
    }
    input.name = name;
  }

  if (body.description !== undefined) {
    input.description = typeof body.description === "string"
      ? body.description.trim() || null
      : null;
  }

  if (body.isOpen !== undefined) {
    input.isOpen = Boolean(body.isOpen);
  }

  const updated = await updateTeam(teamId, session.user.id, input);
  if (!updated) {
    return NextResponse.json(
      { error: "Team not found or you are not the captain." },
      { status: 403 },
    );
  }

  return NextResponse.json({ team: updated });
}

export async function DELETE(_request: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;

  try {
    const result = await leaveTeam(teamId, session.user.id);
    return NextResponse.json(result);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "team_not_found") {
      return NextResponse.json({ error: "Team not found." }, { status: 404 });
    }
    if (msg === "captain_must_transfer") {
      return NextResponse.json(
        { error: "Transfer captain role before leaving." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
