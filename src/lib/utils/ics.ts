import { SectionWithProfessor } from "@/types";
import { Term, TERM_DATES } from "./terms";

const CRLF = "\r\n";

// Accept both DB single-letter codes (M, T, W, Th, F) and display names (Mon, Tue, ...).
const DAY_TO_BYDAY: Record<string, string> = {
  M: "MO",
  Mon: "MO",
  T: "TU",
  Tue: "TU",
  W: "WE",
  Wed: "WE",
  Th: "TH",
  Thu: "TH",
  F: "FR",
  Fri: "FR",
  Sa: "SA",
  Sat: "SA",
  Su: "SU",
  Sun: "SU",
};

// JS Date.getDay(): Sun=0, Mon=1, ... Sat=6
const BYDAY_TO_DOW: Record<string, number> = {
  SU: 0,
  MO: 1,
  TU: 2,
  WE: 3,
  TH: 4,
  FR: 5,
  SA: 6,
};

function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function pad2(n: number): string {
  return n.toString().padStart(2, "0");
}

// Floating-time format: YYYYMMDDTHHMMSS (no Z, no TZID — interpreted in viewer's local TZ).
function formatFloating(date: Date, time: string): string {
  const [hh, mm] = time.split(":").map(Number);
  const y = date.getFullYear();
  const m = pad2(date.getMonth() + 1);
  const d = pad2(date.getDate());
  return `${y}${m}${d}T${pad2(hh)}${pad2(mm)}00`;
}

function formatDateOnly(date: Date): string {
  return `${date.getFullYear()}${pad2(date.getMonth() + 1)}${pad2(date.getDate())}`;
}

// Find the first calendar date on or after `from` whose day-of-week is in `targetDows`.
function firstOccurrence(from: Date, targetDows: number[]): Date {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  for (let i = 0; i < 7; i++) {
    if (targetDows.includes(d.getDay())) return d;
    d.setDate(d.getDate() + 1);
  }
  return d; // fallback (shouldn't happen if targetDows is non-empty)
}

// Enumerate all calendar dates within an inclusive [start, end] range that match targetDows.
function matchingDatesInRange(
  startStr: string,
  endStr: string,
  targetDows: number[]
): Date[] {
  const start = new Date(`${startStr}T00:00:00`);
  const end = new Date(`${endStr}T00:00:00`);
  const out: Date[] = [];
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  while (cursor <= end) {
    if (targetDows.includes(cursor.getDay())) {
      out.push(new Date(cursor));
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

function nowStamp(): string {
  // DTSTAMP in UTC per RFC 5545 (must be Z-suffixed regardless of event TZ).
  const d = new Date();
  const y = d.getUTCFullYear();
  const m = pad2(d.getUTCMonth() + 1);
  const day = pad2(d.getUTCDate());
  const hh = pad2(d.getUTCHours());
  const mm = pad2(d.getUTCMinutes());
  const ss = pad2(d.getUTCSeconds());
  return `${y}${m}${day}T${hh}${mm}${ss}Z`;
}

function buildEvent(section: SectionWithProfessor, term: Term): string | null {
  const window = TERM_DATES[term];
  if (!window) return null;

  const bydays = section.days
    .map((d) => DAY_TO_BYDAY[d])
    .filter((b): b is string => Boolean(b));
  if (bydays.length === 0) return null;

  const targetDows = bydays.map((b) => BYDAY_TO_DOW[b]);
  const termStart = new Date(`${window.start}T00:00:00`);
  const termEnd = new Date(`${window.end}T00:00:00`);
  const firstDate = firstOccurrence(termStart, targetDows);

  const dtStart = formatFloating(firstDate, section.startTime);
  const dtEnd = formatFloating(firstDate, section.endTime);
  const until = `${formatDateOnly(termEnd)}T235959`;
  const stamp = nowStamp();

  const summary = escapeText(`${section.course.code} — ${section.course.title}`);
  const descParts = [`Section ${section.sectionNumber}`];
  if (section.professor?.name) descParts.push(`Prof. ${section.professor.name}`);
  descParts.push(term);
  const description = escapeText(descParts.join(" • "));

  const lines = [
    "BEGIN:VEVENT",
    `UID:${section.id}@acadence.app`,
    `DTSTAMP:${stamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `RRULE:FREQ=WEEKLY;BYDAY=${bydays.join(",")};UNTIL=${until}`,
  ];

  // Skip break days that fall on this section's meeting weekdays.
  for (const brk of window.breaks ?? []) {
    for (const d of matchingDatesInRange(brk.start, brk.end, targetDows)) {
      lines.push(`EXDATE:${formatFloating(d, section.startTime)}`);
    }
  }

  lines.push(`SUMMARY:${summary}`);
  lines.push(`DESCRIPTION:${description}`);
  if (section.location) {
    lines.push(`LOCATION:${escapeText(section.location)}`);
  }
  lines.push("END:VEVENT");
  return lines.join(CRLF);
}

export function buildICS(sections: SectionWithProfessor[], term: Term): string {
  const events = sections
    .map((s) => buildEvent(s, term))
    .filter((e): e is string => Boolean(e));

  const calendarName = `Acadence — ${term}`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Acadence//Schedule Export//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeText(calendarName)}`,
    ...events,
    "END:VCALENDAR",
  ];
  return lines.join(CRLF) + CRLF;
}
