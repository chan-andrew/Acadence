import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSchedule, saveSchedule } from "@/lib/db/schedules";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term") || "Fall 2026";

    const schedule = await getSchedule(session.user.id, term);
    return NextResponse.json(schedule || { sections: [], sectionDetails: [] });
  } catch (error) {
    console.error("Schedule GET error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { sectionIds, term, name } = body as {
      sectionIds: string[];
      term?: string;
      name?: string;
    };

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json(
        { error: "sectionIds must be an array" },
        { status: 400 }
      );
    }

    const schedule = await saveSchedule(
      session.user.id,
      term || "Fall 2026",
      sectionIds,
      name
    );

    return NextResponse.json(schedule);
  } catch (error) {
    console.error("Schedule POST error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
