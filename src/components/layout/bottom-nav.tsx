"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Newspaper,
  Briefcase,
  Bot,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/" },
  { icon: Newspaper, label: "News", href: "/news" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: Bot, label: "Copilot", href: "/copilot" },
  { icon: MoreHorizontal, label: "More", href: "/settings" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-bg-primary border-t border-border-subtle pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors duration-200",
                isActive ? "text-text-primary" : "text-text-muted"
              )}
            >
              <Icon className="w-5 h-5" strokeWidth={1.5} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </nav>
  );
}
