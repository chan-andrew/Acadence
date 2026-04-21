const DEPARTMENT_COLORS: Record<string, { bg: string; text: string }> = {
  "Computer Science":   { bg: "#DBEAFE", text: "#1E3A8A" }, // blue
  "Mathematics":        { bg: "#E0E7FF", text: "#312E81" }, // indigo
  "Philosophy":         { bg: "#EDE9FE", text: "#4C1D95" }, // violet
  "Music":              { bg: "#E9D5FF", text: "#581C87" }, // purple
  "Art":                { bg: "#FAE8FF", text: "#701A75" }, // fuchsia
  "English":            { bg: "#FCE7F3", text: "#831843" }, // pink
  "Psychology":         { bg: "#FFE4E6", text: "#881337" }, // rose
  "Political Science":  { bg: "#FEE2E2", text: "#7F1D1D" }, // red
  "Economics":          { bg: "#FFEDD5", text: "#7C2D12" }, // orange
  "History":            { bg: "#FEF3C7", text: "#78350F" }, // amber
  "Business":           { bg: "#FEF9C3", text: "#713F12" }, // yellow
  "Chemistry":          { bg: "#ECFCCB", text: "#365314" }, // lime
  "Biology":            { bg: "#D1FAE5", text: "#064E3B" }, // emerald
  "Sociology":          { bg: "#CCFBF1", text: "#134E4A" }, // teal
  "Physics":            { bg: "#CFFAFE", text: "#164E63" }, // cyan
};

const FALLBACK_COLOR = { bg: "#E5E7EB", text: "#1F2937" }; // gray

export function getDepartmentColor(department: string) {
  return DEPARTMENT_COLORS[department] ?? FALLBACK_COLOR;
}

export { DEPARTMENT_COLORS };
