export const TERMS = ["Fall 2026", "Spring 2027"] as const;

export type Term = (typeof TERMS)[number];

// Registrar-sourced academic calendar windows.
// `end` is the last day undergrad classes meet (RRULE UNTIL).
// `breaks` are inclusive date ranges where classes do NOT meet (EXDATE source).
export const TERM_DATES: Record<
  Term,
  {
    start: string;
    end: string;
    breaks: { start: string; end: string; label?: string }[];
  }
> = {
  "Fall 2026": {
    start: "2026-08-24",
    end: "2026-12-04",
    breaks: [
      { start: "2026-09-07", end: "2026-09-07", label: "Labor Day" },
      { start: "2026-10-09", end: "2026-10-11", label: "Fall break" },
      { start: "2026-11-22", end: "2026-11-29", label: "Thanksgiving recess" },
    ],
  },
  "Spring 2027": {
    start: "2027-01-11",
    end: "2027-04-23",
    breaks: [
      { start: "2027-01-18", end: "2027-01-18", label: "MLK Day" },
      { start: "2027-03-07", end: "2027-03-14", label: "Spring recess" },
    ],
  },
};

export function isTerm(value: string): value is Term {
  return (TERMS as readonly string[]).includes(value);
}

export function termSlug(term: Term): string {
  return term.toLowerCase().replace(/\s+/g, "-");
}
