"use client";

import { CalendarBlock } from "@/hooks/useCalendar";
import { getDepartmentColor } from "@/lib/utils/colors";
import { formatTime } from "@/lib/utils/formatTime";
import { AlertTriangle } from "lucide-react";

interface CourseBlockProps {
  block: CalendarBlock;
  onClick: (sectionId: string) => void;
}

export function CourseBlock({ block, onClick }: CourseBlockProps) {
  const color = getDepartmentColor(block.section.course.department);

  return (
    <button
      onClick={() => onClick(block.section.id)}
      className="absolute left-1 right-1 rounded-lg px-2 py-1 text-left cursor-pointer transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md animate-scale-in overflow-hidden"
      style={{
        top: `${block.top}px`,
        height: `${block.height}px`,
        backgroundColor: color.bg,
        color: color.text,
        borderLeft: block.hasConflict ? "3px solid #DC2626" : undefined,
      }}
      aria-label={`${block.section.course.code} - ${block.section.course.title}`}
    >
      {block.hasConflict && (
        <AlertTriangle className="w-3 h-3 text-red-600 absolute top-1 right-1" />
      )}
      <div className="font-bold text-xs leading-tight truncate">
        {block.section.course.code}
      </div>
      {block.height > 40 && (
        <div className="text-[10px] leading-tight opacity-80 truncate">
          {formatTime(block.section.startTime)} – {formatTime(block.section.endTime)}
        </div>
      )}
      {block.height > 55 && block.section.location && (
        <div className="text-[9px] leading-tight opacity-60 truncate">
          {block.section.location}
        </div>
      )}
    </button>
  );
}
