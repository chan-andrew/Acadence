"use client";

interface SuggestionChipsProps {
  onSelect: (query: string) => void;
  visible: boolean;
}

const SUGGESTIONS = [
  "Find morning classes",
  "Show humanities electives",
  "Classes with top-rated professors",
  "No Friday classes",
  "Easy CS electives",
  "TTh afternoon classes",
];

export function SuggestionChips({ onSelect, visible }: SuggestionChipsProps) {
  if (!visible) return null;

  return (
    <div className="flex flex-wrap gap-2 px-4 py-2">
      {SUGGESTIONS.map((suggestion) => (
        <button
          key={suggestion}
          onClick={() => onSelect(suggestion)}
          className="text-xs px-3 py-1.5 rounded-full border border-border bg-surface text-secondary hover:text-primary hover:border-border-hover transition-colors duration-150"
        >
          {suggestion}
        </button>
      ))}
    </div>
  );
}
