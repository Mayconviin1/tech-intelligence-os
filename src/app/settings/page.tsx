"use client";

import { Layout } from "@/components/layout/layout";
import { useTheme } from "@/hooks/use-theme";
import { Sun, Moon } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Settings
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Configure your experience.
        </p>

        {/* Appearance */}
        <section className="mb-12">
          <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
            Appearance
          </h2>
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Theme</p>
              <p className="text-xs text-text-muted mt-0.5">
                Select your preferred color scheme
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 h-9 px-4 text-sm text-text-secondary border border-border-default rounded-pill hover:bg-bg-surface transition-colors duration-200"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" strokeWidth={1.5} />
                  Light
                </>
              )}
            </button>
          </div>
        </section>

        {/* Notifications */}
        <section className="mb-12">
          <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-4 border-b border-border-subtle">
              <div>
                <p className="text-sm text-text-primary">Push notifications</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Receive alerts for important updates
                </p>
              </div>
              <div className="w-10 h-6 bg-bg-surface-hover rounded-pill relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-text-muted rounded-full transition-colors" />
              </div>
            </div>
            <div className="flex items-center justify-between py-4 border-b border-border-subtle">
              <div>
                <p className="text-sm text-text-primary">Email digest</p>
                <p className="text-xs text-text-muted mt-0.5">
                  Daily summary of your tracked topics
                </p>
              </div>
              <div className="w-10 h-6 bg-text-primary rounded-pill relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-bg-primary rounded-full transition-colors" />
              </div>
            </div>
          </div>
        </section>

        {/* About */}
        <section>
          <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
            About
          </h2>
          <div className="py-4 border-b border-border-subtle">
            <p className="text-sm text-text-secondary">
              Tech Intelligence OS v0.1.0
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
