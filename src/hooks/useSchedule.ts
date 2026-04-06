"use client";

import { useState, useCallback } from "react";
import { SectionWithProfessor, TimeConflict } from "@/types";
import { findConflicts } from "@/lib/utils/timeConflict";

export function useSchedule() {
  const [sections, setSections] = useState<SectionWithProfessor[]>([]);
  const [conflicts, setConflicts] = useState<TimeConflict[]>([]);

  const addSection = useCallback(
    (section: SectionWithProfessor): { added: boolean; conflicts: TimeConflict[] } => {
      const existing = sections.find((s) => s.id === section.id);
      if (existing) return { added: false, conflicts: [] };

      const newConflicts = findConflicts(sections, section);
      // Add even with conflicts, but track them
      setSections((prev) => [...prev, section]);
      if (newConflicts.length > 0) {
        setConflicts((prev) => [...prev, ...newConflicts]);
      }
      return { added: true, conflicts: newConflicts };
    },
    [sections]
  );

  const removeSection = useCallback((sectionId: string) => {
    setSections((prev) => prev.filter((s) => s.id !== sectionId));
    setConflicts((prev) =>
      prev.filter(
        (c) =>
          c.existingSection.id !== sectionId &&
          c.newSection.id !== sectionId
      )
    );
  }, []);

  const totalCredits = sections.reduce(
    (sum, s) => sum + (s.course?.credits || 0),
    0
  );

  const sectionIds = sections.map((s) => s.id);

  return {
    sections,
    conflicts,
    addSection,
    removeSection,
    totalCredits,
    sectionIds,
  };
}
