"use client";

import { SectionWithProfessor } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ProfessorRating } from "./ProfessorRating";
import { formatTimeRange, formatDays } from "@/lib/utils/formatTime";
import { MapPin, Clock, Check } from "lucide-react";

interface CourseCardProps {
  section: SectionWithProfessor;
  isAdded: boolean;
  onAdd: (section: SectionWithProfessor) => void;
}

export function CourseCard({ section, isAdded, onAdd }: CourseCardProps) {
  const seatVariant =
    section.openSeats > 5
      ? "success"
      : section.openSeats > 0
      ? "warning"
      : "danger";

  return (
    <div className="border border-border rounded-xl p-3 space-y-2 hover:border-border-hover transition-colors duration-150">
      <div className="flex items-start justify-between gap-2">
        <div>
          <span className="font-mono font-bold text-sm text-primary">
            {section.course.code}
          </span>
          <span className="text-sm text-primary ml-2">
            {section.course.title}
          </span>
        </div>
        <Badge className="shrink-0">
          {section.course.credits} cr
        </Badge>
      </div>

      {section.professor && (
        <ProfessorRating
          rating={section.professor.rmpRating}
          name={section.professor.name}
          compact
        />
      )}

      <div className="flex items-center gap-3 text-xs text-secondary">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {formatDays(section.days)} {formatTimeRange(section.startTime, section.endTime)}
        </span>
        {section.location && (
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {section.location}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between pt-1">
        <Badge variant={seatVariant}>
          {section.openSeats} / {section.totalSeats} seats
        </Badge>

        {isAdded ? (
          <span className="flex items-center gap-1 text-xs text-tertiary">
            <Check className="w-3.5 h-3.5" />
            Added
          </span>
        ) : (
          <Button size="sm" onClick={() => onAdd(section)}>
            Add to schedule
          </Button>
        )}
      </div>
    </div>
  );
}
