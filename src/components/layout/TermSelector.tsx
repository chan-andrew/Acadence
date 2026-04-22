"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import clsx from "clsx";
import { useTerm } from "@/hooks/useTerm";

export function TermSelector() {
  const { term, setTerm, terms } = useTerm();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1 text-xs text-tertiary border border-border rounded-md pl-2 pr-1.5 py-0.5 hover:text-secondary hover:border-secondary/40 transition-colors"
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {term}
        <ChevronDown className="w-3 h-3" />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full mt-1 w-40 bg-surface border border-border rounded-lg shadow-lg overflow-hidden z-40 animate-scale-in"
        >
          {terms.map((t) => {
            const active = t === term;
            return (
              <li key={t} role="option" aria-selected={active}>
                <button
                  onClick={() => {
                    setTerm(t);
                    setOpen(false);
                  }}
                  className={clsx(
                    "w-full flex items-center justify-between gap-2 px-3 py-1.5 text-xs text-left hover:bg-background transition-colors",
                    active ? "text-primary" : "text-secondary"
                  )}
                >
                  {t}
                  {active && <Check className="w-3 h-3" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
