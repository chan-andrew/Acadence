import { SectionWithProfessor, TimeConflict } from "@/types";

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function checkTimeConflict(
  existing: SectionWithProfessor,
  incoming: SectionWithProfessor
): TimeConflict | null {
  const overlappingDays = existing.days.filter((d) =>
    incoming.days.includes(d)
  );
  if (overlappingDays.length === 0) return null;

  const existStart = timeToMinutes(existing.startTime);
  const existEnd = timeToMinutes(existing.endTime);
  const newStart = timeToMinutes(incoming.startTime);
  const newEnd = timeToMinutes(incoming.endTime);

  if (newStart < existEnd && newEnd > existStart) {
    return { existingSection: existing, newSection: incoming, overlappingDays };
  }
  return null;
}

export function findConflicts(
  schedule: SectionWithProfessor[],
  incoming: SectionWithProfessor
): TimeConflict[] {
  return schedule
    .map((s) => checkTimeConflict(s, incoming))
    .filter((c): c is TimeConflict => c !== null);
}
