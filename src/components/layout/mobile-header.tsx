"use client";

import { Search, Menu } from "lucide-react";

interface MobileHeaderProps {
  onMenuClick: () => void;
}

export function MobileHeader({ onMenuClick }: MobileHeaderProps) {
  const handleSearchClick = () => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "k", metaKey: true, bubbles: true })
    );
  };

  return (
    <header className="md:hidden h-14 flex items-center justify-between px-4 border-b border-border-subtle bg-bg-primary sticky top-0 z-40 pt-[env(safe-area-inset-top)]">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-colors duration-200"
        >
          <Menu className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-text-primary flex items-center justify-center">
            <span className="text-bg-primary text-xs font-bold">TI</span>
          </div>
          <span className="text-sm font-medium text-text-primary">Tech Intelligence</span>
        </div>
      </div>
      <button
        onClick={handleSearchClick}
        className="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-colors duration-200"
      >
        <Search className="w-5 h-5" strokeWidth={1.5} />
      </button>
    </header>
  );
}
