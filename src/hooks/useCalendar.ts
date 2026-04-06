"use client";

import { useMemo } from "react";
import { SectionWithProfessor } from "@/types";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const DB_TO_DISPLAY: Record<string, string> = {
  M: "Mon",
  T: "Tue",
  W: "Wed",
  Th: "Thu",
  F: "Fri",
};
const START_HOUR = 8;
const END_HOUR = 21;
const HOUR_HEIGHT = 60;

export interface CalendarBlock {
  section: SectionWithProfessor;
  day: string;
  top: number;
  height: number;
  hasConflict: boolean;
}

function timeToOffset(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return (h - START_HOUR) * HOUR_HEIGHT + (m / 60) * HOUR_HEIGHT;
}

function timeToHeight(start: string, end: string): number {
  const startMin = parseInt(start.split(":")[0]) * 60 + parseInt(start.split(":")[1]);
  const endMin = parseInt(end.split(":")[0]) * 60 + parseInt(end.split(":")[1]);
  return ((endMin - startMin) / 60) * HOUR_HEIGHT;
}

export function useCalendar(sections: SectionWithProfessor[], conflictSectionIds: Set<string>) {
  const blocks = useMemo(() => {
    const result: CalendarBlock[] = [];
    for (const section of sections) {
      for (const rawDay of section.days) {
        const day = DB_TO_DISPLAY[rawDay] || rawDay;
        if (!(DAYS as readonly string[]).includes(day)) continue;
        result.push({
          section,
          day,
          top: timeToOffset(section.startTime),
          height: timeToHeight(section.startTime, section.endTime),
          hasConflict: conflictSectionIds.has(section.id),
        });
      }
    }
    return result;
  }, [sections, conflictSectionIds]);

  const hours = Array.from(
    { length: END_HOUR - START_HOUR },
    (_, i) => START_HOUR + i
  );

  return { blocks, hours, days: DAYS, hourHeight: HOUR_HEIGHT };
}
