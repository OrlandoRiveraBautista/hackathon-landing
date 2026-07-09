import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getTeamWithMembersAndProject, upsertProject } from "@/lib/teams";

type Params = { params: Promise<{ teamId: string }> };

export async function PUT(request: Request, { params }: Params) {
  const session = await getSession();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { teamId } = await params;

  const team = await getTeamWithMembersAndProject(teamId);
  if (!team) {
    return NextResponse.json({ error: "Team not found." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const githubUrl = typeof body.githubUrl === "string" ? body.githubUrl.trim() : "";
  if (!githubUrl) {
    return NextResponse.json(
      { error: "GitHub repository URL is required." },
      { status: 400 },
    );
  }

  const githubPattern =
    /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+\/?$/;
  if (!githubPattern.test(githubUrl)) {
    return NextResponse.json(
      { error: "Enter a valid GitHub repository URL (e.g. https://github.com/user/repo)." },
      { status: 400 },
    );
  }

  try {
    const project = await upsertProject(teamId, session.user.id, {
      title: typeof body.title === "string" ? body.title : undefined,
      description: typeof body.description === "string" ? body.description : undefined,
      techStack: Array.isArray(body.techStack)
        ? body.techStack.map(String).filter(Boolean).slice(0, 20)
        : undefined,
      githubUrl,
      demoUrl: typeof body.demoUrl === "string" ? body.demoUrl : undefined,
      submit: body.submit === true,
    });

    return NextResponse.json({ project });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "";
    if (msg === "not_captain") {
      return NextResponse.json(
        { error: "Only the team captain can submit a project." },
        { status: 403 },
      );
    }
    if (msg === "submission_locked") {
      return NextResponse.json(
        { error: "Submission is locked and can no longer be edited." },
        { status: 409 },
      );
    }
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
