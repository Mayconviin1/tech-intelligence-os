"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { TechScore } from "@/components/dashboard/tech-score";
import { TopSignals } from "@/components/dashboard/top-signals";
import { ForYou } from "@/components/dashboard/for-you";
import { CareerOpportunities } from "@/components/dashboard/career-opportunities";
import { UpcomingEvents } from "@/components/dashboard/upcoming-events";
import { AiRecommendations } from "@/components/dashboard/ai-recommendations";
import { Greeting } from "@/components/dashboard/greeting";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { CommandPalette } from "@/components/ui/command-palette";
import { KeyboardShortcuts } from "@/components/ui/keyboard-shortcuts";
import { Skeleton } from "@/components/ui/skeleton";
import type { NewsSignal, JobMatch } from "@/types";

const DEMO = {
  techScore: {
    overall: 92,
    change: 4.2,
    categories: [],
  },
  trends: [
    { id: "1", name: "AI Agents", score: 85, growth: 18, period: "monthly" },
    { id: "2", name: "Edge Computing", score: 72, growth: 12, period: "monthly" },
    { id: "3", name: "WebAssembly", score: 65, growth: 8, period: "monthly" },
  ],
  forYou: [
    { id: "1", type: "NEWS" as const, title: "AI Agents are reshaping development workflows", reason: "Based on your interest in AI and software engineering", score: 90 },
    { id: "2", type: "JOB" as const, title: "3 new AI Engineer positions match your profile", reason: "Remote positions at companies you follow", score: 85 },
    { id: "3", type: "TREND" as const, title: "Edge Computing is growing rapidly", reason: "Trending in your monitored technologies", score: 75 },
  ],
  upcomingEvents: [
    { id: "1", name: "React Summit 2026", date: "2026-09-15", online: true, url: "#", relevance: 8 },
    { id: "2", name: "AI Engineer World Fair", date: "2026-09-22", location: "San Francisco", online: false, url: "#", relevance: 9 },
    { id: "3", name: "Cloudflare DevDay", date: "2026-10-01", online: true, url: "#", relevance: 7 },
  ],
  recommendations: [
    { type: "LEARN" as const, title: "Study MCP protocol", reason: "Growing rapidly in AI infrastructure, relevant to your AI interest" },
    { type: "READ" as const, title: "Follow Anthropic's agent framework", reason: "Major release expected, aligns with your AI engineering goals" },
    { type: "BUILD" as const, title: "Contribute to an open source AI project", reason: "Would strengthen your portfolio for AI Engineer roles" },
  ],
};

function TrendSkeleton() {
  return (
    <div className="space-y-2.5">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
        </div>
      ))}
    </div>
  );
}

function ErrorBanner({ message }: { message: string }) {
  return (
    <p className="text-xs text-red-400/70 mb-4">{message}</p>
  );
}

export default function Home() {
  const [signals, setSignals] = useState<NewsSignal[]>([]);
  const [jobs, setJobs] = useState<JobMatch[]>([]);
  const [loadingSignals, setLoadingSignals] = useState(true);
  const [loadingJobs, setLoadingJobs] = useState(true);
  const [signalsError, setSignalsError] = useState<string | null>(null);
  const [jobsError, setJobsError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/news?top=true&limit=10")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load signals");
        return res.json();
      })
      .then((json) => setSignals(json.data ?? json))
      .catch((err) => setSignalsError(err.message))
      .finally(() => setLoadingSignals(false));
  }, []);

  useEffect(() => {
    fetch("/api/jobs?mode=matches&limit=5")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load jobs");
        return res.json();
      })
      .then((json) => setJobs(json.data ?? json))
      .catch((err) => setJobsError(err.message))
      .finally(() => setLoadingJobs(false));
  }, []);

  return (
    <Layout>
      <CommandPalette />
      <KeyboardShortcuts />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Greeting />

        <div className="grid grid-cols-2 gap-12 mb-16">
          <TechScore data={DEMO.techScore} />
          <div>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-3.5 h-3.5 text-text-muted" strokeWidth={1.5} />
              <span className="text-xs font-medium uppercase tracking-widest text-text-muted">
                Trend Radar
              </span>
            </div>
            <TrendSkeleton />
            <div className="space-y-2.5 hidden">
              {DEMO.trends.map((trend) => (
                <a
                  key={trend.id}
                  href={`/trends/${trend.id}`}
                  className="flex items-center justify-between group cursor-pointer"
                >
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">
                    {trend.name}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm text-text-muted">+{trend.growth}%</span>
                    <ArrowUpRight className="w-3 h-3 text-text-muted" strokeWidth={1.5} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-border-subtle mb-12" />

        <div className="mb-16">
          {signalsError && <ErrorBanner message={signalsError} />}
          {loadingSignals ? (
            <SectionSkeleton />
          ) : (
            <TopSignals signals={signals} />
          )}
        </div>

        <div className="border-t border-border-subtle mb-12" />

        <div className="mb-16">
          <ForYou items={DEMO.forYou} />
        </div>

        <div className="border-t border-border-subtle mb-12" />

        <div className="mb-16">
          {jobsError && <ErrorBanner message={jobsError} />}
          {loadingJobs ? (
            <SectionSkeleton />
          ) : (
            <CareerOpportunities jobs={jobs} />
          )}
        </div>

        <div className="border-t border-border-subtle mb-12" />

        <div className="mb-16">
          <UpcomingEvents events={DEMO.upcomingEvents} />
        </div>

        <div className="border-t border-border-subtle mb-12" />

        <div className="mb-16">
          <AiRecommendations recommendations={DEMO.recommendations} />
        </div>
      </div>
    </Layout>
  );
}
