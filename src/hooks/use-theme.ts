"use client";

import { useCallback, useSyncExternalStore } from "react";

type Theme = "dark" | "light";

function getSnapshot(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = localStorage.getItem("theme") as Theme | null;
  if (stored) return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSnapshot(): Theme {
  return "dark";
}

function subscribe(callback: () => void) {
  const handler = (e: StorageEvent) => {
    if (e.key === "theme") callback();
  };
  window.addEventListener("storage", handler);
  return () => window.removeEventListener("storage", handler);
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  // Apply theme to document on mount (runs once on client)
  if (typeof window !== "undefined") {
    document.documentElement.setAttribute("data-theme", theme);
  }

  const setTheme = useCallback((newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
  }, []);

  const toggleTheme = useCallback(() => {
    const current = localStorage.getItem("theme") as Theme | null || "dark";
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("theme", next);
    document.documentElement.setAttribute("data-theme", next);
    window.dispatchEvent(new StorageEvent("storage", { key: "theme" }));
  }, []);

  return { theme, setTheme, toggleTheme, mounted: true };
}
