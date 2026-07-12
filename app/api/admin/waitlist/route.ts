import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { canAccessAdmin } from "@/lib/auth/roles";
import { getWaitlistSignups } from "@/lib/waitlist-admin";

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
    const signups = await getWaitlistSignups();
    return NextResponse.json({
      signups: signups.map((signup) => ({
        ...signup,
        onSiteInterestedAt: signup.onSiteInterestedAt?.toISOString() ?? null,
        onSiteSelectedAt: signup.onSiteSelectedAt?.toISOString() ?? null,
        contactedAt: signup.contactedAt?.toISOString() ?? null,
        platformNotifiedAt: signup.platformNotifiedAt?.toISOString() ?? null,
        createdAt: signup.createdAt?.toISOString() ?? null,
      })),
    });
  } catch (error) {
    console.error("Admin waitlist read failed:", error);
    return NextResponse.json(
      { error: "Failed to load waitlist signups." },
      { status: 500 },
    );
  }
}
