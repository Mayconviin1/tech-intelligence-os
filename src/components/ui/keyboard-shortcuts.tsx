"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const shortcuts: Record<string, string> = {
  g: "/",
  n: "/news",
  t: "/trends",
  j: "/jobs",
  e: "/events",
  k: "/knowledge",
  c: "/copilot",
};

export function KeyboardShortcuts() {
  const router = useRouter();

  useEffect(() => {
    let lastKey = "";
    let timeout: ReturnType<typeof setTimeout>;

    const handler = (e: KeyboardEvent) => {
      // Skip if typing in input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      // Cmd/Ctrl+K is handled by Command Palette
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        return;
      }

      // Single key shortcuts (when not in input)
      if (!e.metaKey && !e.ctrlKey && !e.altKey) {
        if (lastKey === "g" && shortcuts[e.key]) {
          e.preventDefault();
          router.push(shortcuts[e.key]);
          lastKey = "";
          clearTimeout(timeout);
          return;
        }

        lastKey = e.key;
        timeout = setTimeout(() => {
          lastKey = "";
        }, 500);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [router]);

  return null;
}
