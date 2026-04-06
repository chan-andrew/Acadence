import Anthropic from "@anthropic-ai/sdk";
import { ParsedQuery } from "./types";
import { QUERY_PARSER_SYSTEM_PROMPT } from "./prompts";

const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

function fallbackParse(message: string): ParsedQuery {
  const lower = message.toLowerCase();
  const filters: ParsedQuery["filters"] = {
    days: null,
    startTimeAfter: null,
    startTimeBefore: null,
    endTimeBefore: null,
    department: null,
    fulfills: null,
    minProfRating: null,
    maxDifficulty: null,
    minSeatsOpen: null,
    credits: null,
    excludeCourseIds: null,
    searchText: null,
  };

  if (/mwf/i.test(lower)) filters.days = ["Mon", "Wed", "Fri"];
  else if (/t(u)?(\s*\/?\s*)th/i.test(lower)) filters.days = ["Tue", "Thu"];

  if (/morning/i.test(lower)) filters.startTimeBefore = "12:00";
  if (/afternoon/i.test(lower)) {
    filters.startTimeAfter = "12:00";
    filters.endTimeBefore = "17:00";
  }
  if (/evening/i.test(lower)) filters.startTimeAfter = "17:00";
  if (/no 8/i.test(lower)) filters.startTimeAfter = "09:00";

  const deptMatch = lower.match(
    /\b(cs|math|english|history|philosophy|physics|chemistry|biology|economics|psychology|art|music|political science|sociology|business)\b/i
  );
  if (deptMatch) {
    const deptMap: Record<string, string> = {
      cs: "Computer Science",
      math: "Mathematics",
      english: "English",
      history: "History",
      philosophy: "Philosophy",
      physics: "Physics",
      chemistry: "Chemistry",
      biology: "Biology",
      economics: "Economics",
      psychology: "Psychology",
      art: "Art",
      music: "Music",
      "political science": "Political Science",
      sociology: "Sociology",
      business: "Business",
    };
    filters.department = deptMap[deptMatch[1].toLowerCase()] || deptMatch[1];
  }

  if (/humanities/i.test(lower))
    filters.fulfills = ["Humanities Elective"];
  if (/social science/i.test(lower))
    filters.fulfills = ["Social Science Elective"];
  if (/writing/i.test(lower))
    filters.fulfills = ["Writing Requirement"];

  if (/open|available/i.test(lower)) filters.minSeatsOpen = 1;
  if (/easy|nice professor/i.test(lower)) filters.minProfRating = 3.5;

  // Use remaining words as text search
  const cleaned = message
    .replace(
      /\b(find|me|a|an|the|show|get|with|class|classes|course|courses|in|for|that|is|are|some|any)\b/gi,
      ""
    )
    .trim();
  if (cleaned.length > 2 && !filters.department && !filters.fulfills) {
    filters.searchText = cleaned;
  }

  return {
    filters,
    conversational_response: "Here's what I found based on your search:",
    intent: "search",
  };
}

export async function parseQuery(
  message: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context?: { currentSchedule?: string[] }
): Promise<ParsedQuery> {
  if (!hasApiKey) {
    return fallbackParse(message);
  }

  try {
    const anthropic = new Anthropic();
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: QUERY_PARSER_SYSTEM_PROMPT,
      messages: [{ role: "user", content: message }],
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return fallbackParse(message);

    const parsed = JSON.parse(jsonMatch[0]) as ParsedQuery;
    return parsed;
  } catch {
    return fallbackParse(message);
  }
}
