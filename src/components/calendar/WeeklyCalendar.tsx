"use client";

import { SectionWithProfessor } from "@/types";
import { useCalendar } from "@/hooks/useCalendar";
import { TimeColumn } from "./TimeColumn";
import { CourseBlock } from "./CourseBlock";
import { CalendarDays } from "lucide-react";

interface WeeklyCalendarProps {
  sections: SectionWithProfessor[];
  conflictSectionIds: Set<string>;
  onSectionClick: (sectionId: string) => void;
}

export function WeeklyCalendar({
  sections,
  conflictSectionIds,
  onSectionClick,
}: WeeklyCalendarProps) {
  const { blocks, hours, days, hourHeight } = useCalendar(sections, conflictSectionIds);

  const totalHeight = hours.length * hourHeight;

  if (sections.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-center p-8">
        <div>
          <CalendarDays className="w-12 h-12 text-tertiary mx-auto mb-3" />
          <p className="text-secondary text-sm font-medium">Your schedule is empty</p>
          <p className="text-tertiary text-xs mt-1">
            Try asking me to find some classes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto">
      {/* Day headers */}
      <div className="flex sticky top-0 bg-background z-10 border-b border-border">
        <div className="w-16 shrink-0" />
        {days.map((day) => (
          <div
            key={day}
            className="flex-1 text-center text-xs font-medium text-secondary py-2 border-l border-border"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex">
        <TimeColumn hours={hours} hourHeight={hourHeight} />

        <div className="flex flex-1">
          {days.map((day) => (
            <div
              key={day}
              className="flex-1 relative border-l border-border"
              style={{ height: `${totalHeight}px` }}
            >
              {/* Hour lines */}
              {hours.map((hour) => (
                <div
                  key={hour}
                  className="absolute left-0 right-0 border-t border-border/50"
                  style={{ top: `${(hour - 8) * hourHeight}px` }}
                />
              ))}

              {/* Course blocks */}
              {blocks
                .filter((b) => b.day === day)
                .map((block) => (
                  <CourseBlock
                    key={`${block.section.id}-${block.day}`}
                    block={block}
                    onClick={onSectionClick}
                  />
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
