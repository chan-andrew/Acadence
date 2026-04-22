import { prisma } from "@/lib/prisma";
import { ParsedFilters } from "@/lib/ai/types";
import type { SectionWhereInput } from "@/generated/prisma/models/Section";

export async function queryCourses(
  filters: ParsedFilters,
  options: { term?: string } = {}
) {
  // Build where clause dynamically to avoid type issues with Prisma 7
  const conditions: Record<string, unknown>[] = [];
  const courseConditions: Record<string, unknown>[] = [];

  conditions.push({ term: options.term ?? "Fall 2026" });

  if (filters.days && filters.days.length > 0) {
    conditions.push({ days: { hasSome: filters.days } });
  }

  if (filters.startTime) {
    conditions.push({ startTime: filters.startTime });
  }

  if (filters.endTime) {
    conditions.push({ endTime: filters.endTime });
  }

  if (filters.startTimeAfter) {
    conditions.push({ startTime: { gte: filters.startTimeAfter } });
  }

  if (filters.startTimeBefore) {
    conditions.push({ startTime: { lte: filters.startTimeBefore } });
  }

  if (filters.endTimeBefore) {
    conditions.push({ endTime: { lte: filters.endTimeBefore } });
  }

  if (filters.minSeatsOpen) {
    conditions.push({ openSeats: { gte: filters.minSeatsOpen } });
  }

  if (filters.minProfRating) {
    conditions.push({ professor: { rmpRating: { gte: filters.minProfRating } } });
  }

  if (filters.maxDifficulty) {
    conditions.push({ professor: { rmpDifficulty: { lte: filters.maxDifficulty } } });
  }

  if (filters.department) {
    courseConditions.push({ department: { contains: filters.department, mode: "insensitive" } });
  }

  if (filters.fulfills && filters.fulfills.length > 0) {
    courseConditions.push({ fulfills: { hasSome: filters.fulfills } });
  }

  if (filters.credits) {
    courseConditions.push({ credits: filters.credits });
  }

  if (filters.searchText) {
    courseConditions.push({
      OR: [
        { title: { contains: filters.searchText, mode: "insensitive" } },
        { code: { contains: filters.searchText, mode: "insensitive" } },
        { description: { contains: filters.searchText, mode: "insensitive" } },
      ],
    });
  }

  if (filters.excludeCourseIds && filters.excludeCourseIds.length > 0) {
    courseConditions.push({ id: { notIn: filters.excludeCourseIds } });
  }

  if (courseConditions.length > 0) {
    conditions.push({ course: { AND: courseConditions } });
  }

  const where = conditions.length === 1 ? conditions[0] : { AND: conditions };

  const sections = await prisma.section.findMany({
    where: where as SectionWhereInput,
    include: {
      professor: true,
      course: true,
    },
    take: 20,
    orderBy: [
      { course: { code: "asc" } },
      { startTime: "asc" },
    ],
  });

  return sections;
}

export async function getCourseById(id: string) {
  return prisma.course.findUnique({
    where: { id },
    include: {
      sections: {
        include: { professor: true },
      },
    },
  });
}
