import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const departments = await prisma.course.findMany({
      select: { department: true },
      distinct: ["department"],
      orderBy: { department: "asc" },
    });

    // Build dept code mapping from the course codes
    const courses = await prisma.course.findMany({
      select: { code: true, department: true },
      distinct: ["department"],
      orderBy: { department: "asc" },
    });

    const deptMap = departments.map((d) => {
      const course = courses.find((c) => c.department === d.department);
      const code = course ? course.code.split(" ")[0] : d.department.substring(0, 4).toUpperCase();
      return { name: d.department, code };
    });

    return NextResponse.json(deptMap);
  } catch (error) {
    console.error("Departments API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
