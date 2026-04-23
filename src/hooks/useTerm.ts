"use client";

import { useCallback, useEffect, useState } from "react";
import { TERMS, type Term, isTerm } from "@/lib/utils/terms";

export { TERMS, type Term };

const DEFAULT_TERM: Term = "Fall 2026";
const STORAGE_KEY = "acadence:term";
const TERM_EVENT = "acadence:term-change";

function readInitial(): Term {
  if (typeof window === "undefined") return DEFAULT_TERM;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && isTerm(saved)) return saved;
  return DEFAULT_TERM;
}

export function useTerm() {
  const [term, setTermState] = useState<Term>(DEFAULT_TERM);

  useEffect(() => {
    setTermState(readInitial());
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY && e.newValue && isTerm(e.newValue)) {
        setTermState(e.newValue);
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
