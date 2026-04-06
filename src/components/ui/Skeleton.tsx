"use client";

import clsx from "clsx";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-lg bg-gray-200 dark:bg-gray-700",
        className
      )}
    />
  );
}

export function CourseCardSkeleton() {
  return (
    <div className="border border-border rounded-xl p-3 space-y-2">
      <div className="flex items-center gap-2">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
      </div>
      <Skeleton className="h-3 w-40" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-5 w-16 rounded-md" />
      </div>
      <Skeleton className="h-8 w-28 rounded-lg" />
    </div>
  );
}
