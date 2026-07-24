import { NextResponse } from "next/server";
import {
  getOnsiteSelectionSnapshot,
  isOnsiteBoostOpen,
} from "@/lib/onsite-selection";

export async function GET() {
  try {
    const snapshot = await getOnsiteSelectionSnapshot();

    return NextResponse.json({
      announced: snapshot.config.announced,
      boostOpen: isOnsiteBoostOpen(snapshot.config),
      capacity: snapshot.config.capacity,
      selectedAt: snapshot.config.selectedAt?.toISOString() ?? null,
      lotteryRunAt: snapshot.config.lotteryRunAt?.toISOString() ?? null,
      interestedCount: snapshot.interestedCount,
      waitlistCount: snapshot.waitlistCount,
      selectedCount: snapshot.selected.length,
      remoteCount: snapshot.remote.length,
      selected: snapshot.config.announced
        ? snapshot.selected.map((participant) => ({
            name: participant.name,
          }))
        : [],
      remote: snapshot.config.announced
        ? snapshot.remote.map((participant) => ({
            name: participant.name,
          }))
        : [],
    });
  } catch (error) {
    console.error("On-site selection read failed:", error);
    return NextResponse.json(
      { error: "Failed to load on-site selection." },
      { status: 500 },
    );
  }
}
