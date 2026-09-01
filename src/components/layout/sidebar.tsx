"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Radio,
  Newspaper,
  Brain,
  TrendingUp,
  Building2,
  Rocket,
  Briefcase,
  FileCheck,
  User,
  GitBranch,
  Bookmark,
  Database,
  GraduationCap,
  Calendar,
  Bot,
  Search,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavGroup } from "@/types";

const navGroups: NavGroup[] = [
  {
    label: "PAINEL",
    items: [
      { icon: "LayoutDashboard", label: "Dashboard", href: "/" },
    ],
  },
  {
    label: "INTELIGÊNCIA",
    items: [
      { icon: "Radio", label: "Tech Pulse", href: "/pulse" },
      { icon: "Newspaper", label: "Notícias", href: "/news" },
      { icon: "Brain", label: "AI Radar", href: "/ai" },
      { icon: "TrendingUp", label: "Tendências", href: "/trends" },
      { icon: "Building2", label: "Empresas", href: "/companies" },
      { icon: "Rocket", label: "Startups", href: "/startups" },
    ],
  },
  {
    label: "CARRERA",
    items: [
      { icon: "Briefcase", label: "Vagas", href: "/jobs" },
      { icon: "FileCheck", label: "Candidaturas", href: "/jobs/applications" },
      { icon: "User", label: "Perfil", href: "/career" },
      { icon: "GitBranch", label: "GitHub", href: "/github" },
    ],
  },
  {
    label: "CONHECIMENTO",
    items: [
      { icon: "Bookmark", label: "Salvos", href: "/saved" },
      { icon: "Database", label: "Knowledge Vault", href: "/knowledge" },
      { icon: "GraduationCap", label: "Learning", href: "/learning" },
    ],
  },
  {
    label: "EVENTOS",
    items: [
      { icon: "Calendar", label: "Eventos", href: "/events" },
    ],
  },
  {
    label: "AI",
    items: [
      { icon: "Bot", label: "Tech Copilot", href: "/copilot" },
      { icon: "Search", label: "Deep Research", href: "/research" },
    ],
  },
];

const iconMap: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  LayoutDashboard,
  Radio,
  Newspaper,
  Brain,
  TrendingUp,
  Building2,
  Rocket,
  Briefcase,
  FileCheck,
  User,
  GitBranch,
  Bookmark,
  Database,
  GraduationCap,
  Calendar,
  Bot,
  Search,
};

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <motion.aside
      animate={{ width: collapsed ? 64 : 240 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="h-screen sticky top-0 flex flex-col border-r border-border-subtle bg-bg-primary overflow-y-auto"
    >
      {/* Logo */}
      <div className="h-14 flex items-center px-4 border-b border-border-subtle flex-shrink-0">
        <div className="flex items-center gap-2.5 overflow-hidden">
          <div className="w-7 h-7 rounded-lg bg-text-primary flex items-center justify-center flex-shrink-0">
            <span className="text-bg-primary text-xs font-bold">TI</span>
          </div>
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm font-medium text-text-primary whitespace-nowrap overflow-hidden"
              >
                Tech Intelligence
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 py-3 px-2">
        {navGroups.map((group) => (
          <div key={group.label} className="mb-4">
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="block px-3 mb-1 text-[10px] font-medium uppercase tracking-widest text-text-muted"
                >
                  {group.label}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const Icon = iconMap[item.icon];
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 h-9 rounded-[10px] transition-all duration-200",
                      collapsed ? "justify-center px-0" : "px-3",
                      isActive
                        ? "bg-bg-surface-hover text-text-primary"
                        : "text-text-muted hover:text-text-secondary hover:bg-bg-surface"
                    )}
                  >
                    {Icon && <Icon className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />}
                    <AnimatePresence>
                      {!collapsed && (
                        <motion.span
                          initial={{ opacity: 0, width: 0 }}
                          animate={{ opacity: 1, width: "auto" }}
                          exit={{ opacity: 0, width: 0 }}
                          transition={{ duration: 0.2 }}
                          className="text-sm whitespace-nowrap overflow-hidden"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Settings + Collapse */}
      <div className="p-2 border-t border-border-subtle flex-shrink-0 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 h-9 rounded-[10px] transition-all duration-200",
            collapsed ? "justify-center px-0" : "px-3",
            pathname === "/settings"
              ? "bg-bg-surface-hover text-text-primary"
              : "text-text-muted hover:text-text-secondary hover:bg-bg-surface"
          )}
        >
          <Settings className="w-4 h-4 flex-shrink-0" strokeWidth={1.5} />
          <AnimatePresence>
            {!collapsed && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm whitespace-nowrap overflow-hidden"
              >
                Configurações
              </motion.span>
            )}
          </AnimatePresence>
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full h-9 rounded-[10px] text-text-muted hover:text-text-secondary hover:bg-bg-surface transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" strokeWidth={1.5} />
          ) : (
            <ChevronLeft className="w-4 h-4" strokeWidth={1.5} />
          )}
        </button>
      </div>
    </motion.aside>
  );
}
