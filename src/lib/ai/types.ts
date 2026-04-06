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
