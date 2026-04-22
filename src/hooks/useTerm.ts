"use client";

import { useCallback, useEffect, useState } from "react";

export const TERMS = [
  "Fall 2026",
  "Spring 2027",
  "Fall 2027",
  "Spring 2028",
] as const;

export type Term = (typeof TERMS)[number];
const DEFAULT_TERM: Term = "Fall 2026";
const STORAGE_KEY = "acadence:term";
const TERM_EVENT = "acadence:term-change";

function readInitial(): Term {
  if (typeof window === "undefined") return DEFAULT_TERM;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && (TERMS as readonly string[]).includes(saved)) return saved as Term;
  return DEFAULT_TERM;
}

export function useTerm() {
  const [term, setTermState] = useState<Term>(DEFAULT_TERM);

  useEffect(() => {
    setTermState(readInitial());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue && (TERMS as readonly string[]).includes(e.newValue)) {
        setTermState(e.newValue as Term);
      }
    }
    function onCustom(e: Event) {
      const next = (e as CustomEvent<Term>).detail;
      setTermState(next);
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(TERM_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(TERM_EVENT, onCustom);
    };
  }, []);

  const setTerm = useCallback((next: Term) => {
    localStorage.setItem(STORAGE_KEY, next);
    window.dispatchEvent(new CustomEvent<Term>(TERM_EVENT, { detail: next }));
  }, []);

  return { term, setTerm, terms: TERMS };
}
