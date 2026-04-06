"use client";

import { SectionWithProfessor } from "@/types";
import { CourseCard } from "./CourseCard";

interface CourseListProps {
  sections: SectionWithProfessor[];
  addedIds: Set<string>;
  onAdd: (section: SectionWithProfessor) => void;
}

export function CourseList({ sections, addedIds, onAdd }: CourseListProps) {
  if (sections.length === 0) return null;

  return (
    <div className="space-y-2 mt-2">
      {sections.map((section) => (
        <CourseCard
          key={section.id}
          section={section}
          isAdded={addedIds.has(section.id)}
          onAdd={onAdd}
        />
      ))}
    </div>
  );
}
