"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { SectionWithProfessor, TimeConflict } from "@/types";
import { findConflicts } from "@/lib/utils/timeConflict";
import { useTerm } from "@/hooks/useTerm";

export function useSchedule() {
  const { status } = useSession();
  const { term } = useTerm();
  const [sections, setSections] = useState<SectionWithProfessor[]>([]);
  const [conflicts, setConflicts] = useState<TimeConflict[]>([]);
  const [loaded, setLoaded] = useState(false);
  const loadedTermRef = useRef<string | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate from API when session is authenticated AND when term changes
  useEffect(() => {
    if (status !== "authenticated") return;
    if (loadedTermRef.current === term) return;

    const targetTerm = term;
    let canceled = false;

    setLoaded(false);
    setSections([]);
    setConflicts([]);

    (async () => {
      try {
        const res = await fetch(
          `/api/schedule?term=${encodeURIComponent(targetTerm)}`
        );
        if (!res.ok || canceled) return;
        const data = await res.json();
        if (canceled) return;
        const details: SectionWithProfessor[] = data.sectionDetails || [];
        setSections(details);
        const pairConflicts: TimeConflict[] = [];
        for (let i = 0; i < details.length; i++) {
          pairConflicts.push(...findConflicts(details.slice(0, i), details[i]));
        }
        setConflicts(pairConflicts);
      } finally {
        if (!canceled) {
          loadedTermRef.current = targetTerm;
          setLoaded(true);
        }
      }
    })();

    return () => {
      canceled = true;
    };
  }, [status, term]);

  // Debounced auto-save — only fires for the term we just loaded
  useEffect(() => {
    if (!loaded || status !== "authenticated") return;
    if (loadedTermRef.current !== term) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch("/api/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionIds: sections.map((s) => s.id),
          term,
        }),
      }).catch(() => {});
    }, 300);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [sections, loaded, status, term]);

  const addSection = useCallback(
    (section: SectionWithProfessor): { added: boolean; conflicts: TimeConflict[] } => {
      const existing = sections.find((s) => s.id === section.id);
      if (existing) return { added: false, conflicts: [] };

      const newConflicts = findConflicts(sections, section);
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
    loaded,
  };
}
