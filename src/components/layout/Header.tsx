"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

interface HeaderProps {
  totalCredits: number;
  conflictCount: number;
}

export function Header({ totalCredits, conflictCount }: HeaderProps) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || (!saved && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      setDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-primary tracking-tight">
          Acadence
        </h1>
        <span className="text-xs text-tertiary border border-border rounded-md px-2 py-0.5">
          Fall 2026
        </span>
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
          className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
}
