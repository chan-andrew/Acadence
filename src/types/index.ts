export interface ParsedFilters {
  days: string[] | null;
  startTimeAfter: string | null;
  startTimeBefore: string | null;
  endTimeBefore: string | null;
  department: string | null;
  fulfills: string[] | null;
  minProfRating: number | null;
  maxDifficulty: number | null;
  minSeatsOpen: number | null;
  credits: number | null;
  excludeCourseIds: string[] | null;
  searchText: string | null;
}

export interface ParsedQuery {
  filters: ParsedFilters;
  conversational_response: string;
  intent: "search" | "remove" | "info" | "general";
}

export interface CourseWithDetails {
  id: string;
  code: string;
  title: string;
  description: string | null;
  credits: number;
  department: string;
  fulfills: string[];
  prerequisites: string[];
  sections: SectionWithProfessor[];
}

export interface SectionWithProfessor {
  id: string;
  sectionNumber: string;
  days: string[];
  startTime: string;
  endTime: string;
  location: string | null;
  totalSeats: number;
  openSeats: number;
  waitlist: number;
  term: string;
  type: string;
  professor: {
    id: string;
    name: string;
    rmpRating: number | null;
    rmpDifficulty: number | null;
    wouldTakeAgain: number | null;
    topTags: string[];
  } | null;
  course: {
    id: string;
    code: string;
    title: string;
    credits: number;
    department: string;
    fulfills: string[];
  };
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  courses?: SectionWithProfessor[];
  timestamp: Date;
}

export interface ScheduleState {
  sections: SectionWithProfessor[];
}

export interface TimeConflict {
  existingSection: SectionWithProfessor;
  newSection: SectionWithProfessor;
  overlappingDays: string[];
}
