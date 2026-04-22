"use client";

import { useCallback, useEffect, useState } from "react";

type Theme = "light" | "dark";
const THEME_EVENT = "acadence:theme-change";

function readInitial(): Theme {
  if (typeof window === "undefined") return "light";
  const saved = localStorage.getItem("theme");
  if (saved === "dark" || saved === "light") return saved;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");

  useEffect(() => {
    const initial = readInitial();
    setThemeState(initial);
    document.documentElement.classList.toggle("dark", initial === "dark");
  }, []);

  useEffect(() => {
    function onStorage(e: StorageEvent) {
      if (e.key === "theme" && (e.newValue === "light" || e.newValue === "dark")) {
        setThemeState(e.newValue);
        document.documentElement.classList.toggle("dark", e.newValue === "dark");
      }
    }
    function onCustom(e: Event) {
      const next = (e as CustomEvent<Theme>).detail;
      setThemeState(next);
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(THEME_EVENT, onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener(THEME_EVENT, onCustom);
    };
  }, []);

  const setTheme = useCallback((next: Theme) => {
    localStorage.setItem("theme", next);
    window.dispatchEvent(new CustomEvent<Theme>(THEME_EVENT, { detail: next }));
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setTheme]);

  return { theme, setTheme, toggleTheme };
}
