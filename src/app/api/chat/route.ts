import { NextRequest, NextResponse } from "next/server";
import { parseQuery } from "@/lib/ai/parseQuery";
import { queryCourses } from "@/lib/db/courses";
import { prisma } from "@/lib/prisma";
import { rankSections } from "@/lib/utils/rankSections";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, currentSchedule, term } = body as {
      message: string;
      currentSchedule?: string[];
      term?: string;
    };

    if (!message || typeof message !== "string" || message.length > 2000) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const parsed = await parseQuery(message, { currentSchedule });

    if (currentSchedule && currentSchedule.length > 0) {
      const scheduled = await prisma.section.findMany({
        where: { id: { in: currentSchedule } },
        select: { courseId: true },
      });
      const merged = new Set<string>([
        ...(parsed.filters.excludeCourseIds ?? []),
        ...scheduled.map((s) => s.courseId),
      ]);
      parsed.filters.excludeCourseIds = Array.from(merged);
    }

    let courses: Awaited<ReturnType<typeof queryCourses>> = [];
    let recommendedId: string | null = null;

    if (parsed.intent === "search" || parsed.intent === "add") {
      const matched = await queryCourses(parsed.filters, { term });
      if (parsed.intent === "add") {
        const ranked = rankSections(matched).slice(0, 5);
        courses = ranked;
        recommendedId = ranked[0]?.id ?? null;
      } else {
        courses = matched;
      }
    }

    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

    return NextResponse.json({
      response: parsed.conversational_response,
      intent: parsed.intent,
      courses,
      filters: parsed.filters,
      recommendedId,
      aiEnabled: hasApiKey,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
