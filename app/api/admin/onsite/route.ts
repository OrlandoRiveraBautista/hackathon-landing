import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { canAccessAdmin } from "@/lib/auth/roles";
import {
  announceOnsiteSelection,
  getOnsiteAdminSnapshot,
  ONSITE_CAPACITY,
  resetOnsiteSelection,
  runOnsiteLottery,
} from "@/lib/onsite-selection";

async function requireAdmin() {
  const session = await getSession();
  if (!session?.user || !canAccessAdmin(session.user.role)) {
    return null;
  }

  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const snapshot = await getOnsiteAdminSnapshot();
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("On-site admin read failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load on-site admin snapshot.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let body: Record<string, unknown> = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const action = String(body.action ?? "");
  const capacity =
    typeof body.capacity === "number" && body.capacity > 0
      ? Math.floor(body.capacity)
      : ONSITE_CAPACITY;

  try {
    if (action === "lottery") {
      const result = await runOnsiteLottery(capacity);
      return NextResponse.json({ ok: true, ...result });
    }

    if (action === "announce") {
      await announceOnsiteSelection();
      return NextResponse.json({ ok: true });
    }

    if (action === "reset") {
      await resetOnsiteSelection();
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (error) {
    console.error("On-site admin action failed:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "On-site admin action failed.",
      },
      { status: 500 },
    );
  }
}
