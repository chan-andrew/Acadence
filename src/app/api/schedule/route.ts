import { NextRequest, NextResponse } from "next/server";
import { getSchedule, saveSchedule } from "@/lib/db/schedules";

const DEFAULT_USER = "anonymous";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const term = searchParams.get("term") || "Fall 2026";
    const userId = searchParams.get("userId") || DEFAULT_USER;

    const schedule = await getSchedule(userId, term);
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
    const body = await request.json();
    const { sectionIds, term, name, userId } = body as {
      sectionIds: string[];
      term?: string;
      name?: string;
      userId?: string;
    };

    if (!Array.isArray(sectionIds)) {
      return NextResponse.json(
        { error: "sectionIds must be an array" },
        { status: 400 }
      );
    }

    const schedule = await saveSchedule(
      userId || DEFAULT_USER,
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
