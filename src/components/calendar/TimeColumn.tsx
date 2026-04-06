"use client";

interface TimeColumnProps {
  hours: number[];
  hourHeight: number;
}

export function TimeColumn({ hours, hourHeight }: TimeColumnProps) {
  return (
    <div className="w-16 shrink-0">
      {hours.map((hour) => (
        <div
          key={hour}
          className="text-xs text-tertiary text-right pr-3 relative"
          style={{ height: `${hourHeight}px` }}
        >
          <span className="absolute -top-2 right-3">
            {hour === 0
              ? "12 AM"
              : hour < 12
              ? `${hour} AM`
              : hour === 12
              ? "12 PM"
              : `${hour - 12} PM`}
          </span>
        </div>
      ))}
    </div>
  );
}
