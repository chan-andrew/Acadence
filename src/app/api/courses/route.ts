import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const department = searchParams.get("department");
    const courseCode = searchParams.get("courseCode");
    const term = searchParams.get("term") || "Fall 2026";

    const where: Record<string, unknown> = {};

    if (query) {
      where.OR = [
        { title: { contains: query, mode: "insensitive" } },
        { code: { contains: query, mode: "insensitive" } },
      ];
    }

    if (department) {
      where.department = { contains: department, mode: "insensitive" };
    }

    if (courseCode) {
      where.code = courseCode;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        sections: {
          where: { term },
          include: { professor: true },
          orderBy: { startTime: "asc" },
        },
      },
      take: 200,
      orderBy: { code: "asc" },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error("Courses API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
