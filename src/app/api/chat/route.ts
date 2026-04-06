import { NextRequest, NextResponse } from "next/server";
import { parseQuery } from "@/lib/ai/parseQuery";
import { queryCourses } from "@/lib/db/courses";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, currentSchedule } = body as {
      message: string;
      currentSchedule?: string[];
    };

    if (!message || typeof message !== "string" || message.length > 2000) {
      return NextResponse.json(
        { error: "Invalid message" },
        { status: 400 }
      );
    }

    const parsed = await parseQuery(message, { currentSchedule });

    let courses: Awaited<ReturnType<typeof queryCourses>> = [];

    if (parsed.intent === "search") {
      courses = await queryCourses(parsed.filters);
    }

    const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

    return NextResponse.json({
      response: parsed.conversational_response,
      intent: parsed.intent,
      courses,
      filters: parsed.filters,
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
