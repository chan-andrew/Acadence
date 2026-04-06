import { prisma } from "@/lib/prisma";

export async function getSchedule(userId: string, term: string) {
  const schedule = await prisma.schedule.findFirst({
    where: { userId, term },
  });

  if (!schedule) return null;

  const sections = await prisma.section.findMany({
    where: { id: { in: schedule.sections } },
    include: { professor: true, course: true },
  });

  return { ...schedule, sectionDetails: sections };
}

export async function saveSchedule(
  userId: string,
  term: string,
  sectionIds: string[],
  name?: string
) {
  const existing = await prisma.schedule.findFirst({
    where: { userId, term },
  });

  if (existing) {
    return prisma.schedule.update({
      where: { id: existing.id },
      data: { sections: sectionIds, name: name || existing.name },
    });
  }

  return prisma.schedule.create({
    data: {
      userId,
      term,
      sections: sectionIds,
      name: name || "My Schedule",
    },
  });
}
