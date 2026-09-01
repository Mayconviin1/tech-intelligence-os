"use client";

import { useState } from "react";
import { Search, Bell, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

export function TopNav() {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleSearchClick = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-border-subtle">
      <div className="flex-1" />

      <button
        onClick={handleSearchClick}
        className={cn(
          "flex items-center gap-2 h-9 px-3 w-80",
          "bg-bg-surface border border-border-subtle rounded-pill",
          "text-text-muted text-sm",
          "hover:bg-bg-surface-hover hover:border-border-default",
          "transition-all duration-200"
        )}
      >
        <Search className="w-3.5 h-3.5" strokeWidth={1.5} />
        <span>Search</span>
        <div className="ml-auto flex items-center gap-0.5">
          <kbd className="text-[10px] text-text-muted bg-bg-surface px-1.5 py-0.5 rounded">
            ⌘
          </kbd>
          <kbd className="text-[10px] text-text-muted bg-bg-surface px-1.5 py-0.5 rounded">
            K
          </kbd>
        </div>
      </button>

      <div className="flex-1 flex items-center justify-end gap-1">
        <button
          onClick={toggleTheme}
          className="w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-all duration-200"
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <Moon className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications((prev) => !prev)}
            className="relative w-8 h-8 flex items-center justify-center rounded-full text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-all duration-200"
          >
            <Bell className="w-4 h-4" strokeWidth={1.5} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-text-primary rounded-full" />
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 top-full mt-2 w-72 bg-bg-surface border border-border-subtle rounded-lg shadow-lg z-50 py-2">
                <div className="px-4 py-2 border-b border-border-subtle">
                  <p className="text-xs font-medium uppercase tracking-widest text-text-muted">
                    Notifications
                  </p>
                </div>
                <div className="px-4 py-6 text-center">
                  <p className="text-sm text-text-muted">No new notifications</p>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="ml-2 w-8 h-8 rounded-full bg-bg-surface-hover flex items-center justify-center text-xs font-medium text-text-primary">
          M
        </div>
      </div>
    </header>
  );
}
