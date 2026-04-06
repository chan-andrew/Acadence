const COURSE_COLORS = [
  { bg: "#DBEAFE", text: "#1E40AF" },
  { bg: "#FCE7F3", text: "#9D174D" },
  { bg: "#D1FAE5", text: "#065F46" },
  { bg: "#FEF3C7", text: "#92400E" },
  { bg: "#EDE9FE", text: "#5B21B6" },
  { bg: "#FFE4E6", text: "#9F1239" },
  { bg: "#CCFBF1", text: "#115E59" },
  { bg: "#FEE2E2", text: "#991B1B" },
] as const;

export function getCourseColor(courseId: string) {
  let hash = 0;
  for (let i = 0; i < courseId.length; i++) {
    hash = (hash << 5) - hash + courseId.charCodeAt(i);
    hash |= 0;
  }
  return COURSE_COLORS[Math.abs(hash) % COURSE_COLORS.length];
}

export { COURSE_COLORS };
