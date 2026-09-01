"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, TrendingUp, Bookmark, Settings, FileText, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const commands = [
  { icon: Search, label: "Search", category: "Search" },
  { icon: FileText, label: "Navigate", category: "Navigate" },
  { icon: Plus, label: "Create", category: "Create" },
  { icon: Bookmark, label: "Save", category: "Save" },
  { icon: TrendingUp, label: "Research", category: "Research" },
  { icon: Settings, label: "Settings", category: "Settings" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "fixed top-[20%] left-1/2 -translate-x-1/2 z-50",
              "w-full max-w-lg",
              "bg-glass-bg backdrop-blur-2xl",
              "border border-glass-border rounded-xl",
              "shadow-lg overflow-hidden"
            )}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 px-4 h-12 border-b border-border-subtle">
              <Search className="w-4 h-4 text-text-muted" strokeWidth={1.5} />
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search commands..."
                className="flex-1 bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none"
              />
              <kbd className="text-[10px] text-text-muted bg-bg-surface px-1.5 py-0.5 rounded">
                ESC
              </kbd>
            </div>

            {/* Commands list */}
            <div className="max-h-64 overflow-y-auto py-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-text-muted">
                  No commands found
                </div>
              ) : (
                filtered.map((cmd) => (
                  <button
                    key={cmd.label}
                    onClick={() => setOpen(false)}
                    className="w-full flex items-center gap-3 px-4 h-10 text-sm text-text-secondary hover:bg-bg-surface-hover hover:text-text-primary transition-colors"
                  >
                    <cmd.icon className="w-4 h-4" strokeWidth={1.5} />
                    <span>{cmd.label}</span>
                    <span className="ml-auto text-[10px] text-text-muted uppercase tracking-wider">
                      {cmd.category}
                    </span>
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
