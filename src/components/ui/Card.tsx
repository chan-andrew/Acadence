"use client";

import clsx from "clsx";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
}

export function Card({ children, className, padding = true }: CardProps) {
  return (
    <div
      className={clsx(
        "bg-surface border border-border rounded-xl",
        padding && "p-4",
        className
      )}
    >
      {children}
    </div>
  );
}
