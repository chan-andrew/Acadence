import { prisma } from "@/lib/prisma";

export async function getProfessorById(id: string) {
  return prisma.professor.findUnique({
    where: { id },
    include: {
      sections: {
        include: { course: true },
      },
    },
  });
}

export async function searchProfessors(query: string) {
  return prisma.professor.findMany({
    where: {
      name: { contains: query, mode: "insensitive" },
    },
    include: {
      sections: {
        include: { course: true },
        take: 5,
      },
    },
    take: 10,
  });
}
