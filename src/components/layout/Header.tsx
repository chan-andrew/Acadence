"use client";

import { AlertTriangle, Download, Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "@/hooks/useTheme";
import { useTerm } from "@/hooks/useTerm";
import { TermSelector } from "./TermSelector";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  totalCredits?: number;
  conflictCount?: number;
  hasSchedule?: boolean;
}

export function Header({
  totalCredits = 0,
  conflictCount = 0,
  hasSchedule = false,
}: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";
  const { term } = useTerm();

  const exportHref = `/api/schedule/export?term=${encodeURIComponent(term)}`;

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold text-primary tracking-tight mr-1">
          Acadence
        </h1>
        <TermSelector />
        <a
          href={hasSchedule ? exportHref : undefined}
          download={hasSchedule ? `acadence-${term}.ics` : undefined}
          aria-disabled={!hasSchedule}
          tabIndex={hasSchedule ? 0 : -1}
          onClick={(e) => {
            if (!hasSchedule) e.preventDefault();
          }}
          title={
            hasSchedule
              ? "Export this term to your calendar app"
              : "Add classes to enable export"
          }
          className={clsx(
            "inline-flex items-center gap-1 text-xs border rounded-md pl-2 pr-2 py-0.5 transition-colors",
            hasSchedule
              ? "text-tertiary border-border hover:text-secondary hover:border-secondary/40 cursor-pointer"
              : "text-tertiary/40 border-border/60 cursor-not-allowed"
          )}
        >
          <Download className="w-3 h-3" />
          Export
        </a>
      </div>

      <div className="flex items-center gap-4">
        {totalCredits > 0 && (
          <span className="text-xs text-secondary">
            {totalCredits} credits
          </span>
        )}
        {conflictCount > 0 && (
          <span
            key={conflictCount}
            className="flex items-center gap-1 text-xs font-medium text-red-700 dark:text-red-200 bg-red-100 dark:bg-red-950/60 border border-red-300 dark:border-red-800/70 rounded-md px-2 py-0.5 animate-jiggle"
            role="alert"
          >
            <AlertTriangle className="w-3 h-3" />
            {conflictCount} conflict{conflictCount > 1 ? "s" : ""}
          </span>
        )}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-background transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
        <UserMenu />
      </div>
    </header>
  );
}
