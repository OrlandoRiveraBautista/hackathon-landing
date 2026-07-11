import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTeamByUserId, createTeam, suggestTeamName } from "@/lib/teams";

export async function GET() {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const team = await getTeamByUserId(session.user.id);
  return NextResponse.json({ team });
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 80) {
    return NextResponse.json(
      { error: "Team name is required and must be under 80 characters." },
      { status: 400 },
    );
  }

  const description =
    typeof body.description === "string" ? body.description.trim() || null : null;
  const isOpen = body.isOpen === false ? false : true;

  try {
    const team = await createTeam(session.user.id, { name, description, isOpen });
    return NextResponse.json({ team }, { status: 201 });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "already_in_team") {
      return NextResponse.json(
        { error: "You are already in a team." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

export async function GET_suggest() {
  return NextResponse.json({ name: suggestTeamName() });
}
