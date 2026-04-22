"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { TermSelector } from "./TermSelector";
import { UserMenu } from "./UserMenu";

interface HeaderProps {
  totalCredits?: number;
  conflictCount?: number;
}

export function Header({ totalCredits = 0, conflictCount = 0 }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Acadence
        </h1>
        <TermSelector />
      </div>

      <div className="flex items-center gap-4">
        {totalCredits > 0 && (
          <span className="text-xs text-secondary">
            {totalCredits} credits
          </span>
        )}
        {conflictCount > 0 && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium">
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
