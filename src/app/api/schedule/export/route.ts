import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchedule } from "@/lib/db/schedules";
import { buildICS } from "@/lib/utils/ics";
import { isTerm, termSlug } from "@/lib/utils/terms";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const termParam = new URL(request.url).searchParams.get("term") || "Fall 2026";
    if (!isTerm(termParam)) {
      return NextResponse.json({ error: "Unknown term" }, { status: 400 });
    }

    const schedule = await getSchedule(session.user.id, termParam);
    const sections = schedule?.sectionDetails ?? [];

    const ics = buildICS(sections, termParam);

    return new NextResponse(ics, {
      status: 200,
      headers: {
        "Content-Type": "text/calendar; charset=utf-8",
        "Content-Disposition": `attachment; filename="acadence-${termSlug(termParam)}.ics"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Schedule export error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
