"use client";

import { Star } from "lucide-react";

interface ProfessorRatingProps {
  rating: number | null;
  name?: string;
  compact?: boolean;
}

export function ProfessorRating({ rating, name, compact }: ProfessorRatingProps) {
  if (rating === null) {
    return (
      <span className="text-xs text-tertiary">
        {name && `${name} · `}No rating
      </span>
    );
  }

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className="flex items-center gap-1">
      {name && <span className={compact ? "text-xs" : "text-sm"}>{name}</span>}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`${compact ? "w-3 h-3" : "w-3.5 h-3.5"} ${
              i < fullStars
                ? "fill-amber-400 text-amber-400"
                : i === fullStars && hasHalf
                ? "fill-amber-400/50 text-amber-400"
                : "text-gray-300 dark:text-gray-600"
            }`}
          />
        ))}
      </div>
      <span className="text-xs text-secondary font-medium">
        {rating.toFixed(1)}
      </span>
    </div>
  );
}
