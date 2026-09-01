"use client";

import { Layout } from "@/components/layout/layout";
import { Briefcase, Loader2, ExternalLink, Bookmark, BookmarkCheck } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  url?: string;
  matchScore?: number;
  summary?: string;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedJobIds, setSavedJobIds] = useState<Set<string>>(new Set());
  const [savingIds, setSavingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await fetch("/api/jobs?mode=matches");
        if (!res.ok) throw new Error(`Failed to load jobs (${res.status})`);
        const data = await res.json();
        setJobs(Array.isArray(data) ? data : data.jobs ?? []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    const fetchSaved = async () => {
      try {
        const res = await fetch("/api/applications");
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setSavedJobIds(new Set(data.map((a: { jobId: string }) => a.jobId)));
          }
        }
      } catch {}
    };

    fetchJobs();
    fetchSaved();
  }, []);

  const toggleSave = useCallback(async (jobId: string) => {
    if (savedJobIds.has(jobId)) return;

    setSavingIds((prev) => new Set(prev).add(jobId));
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId, status: "SAVED" }),
      });
      if (res.ok) {
        setSavedJobIds((prev) => new Set(prev).add(jobId));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSavingIds((prev) => {
        const next = new Set(prev);
        next.delete(jobId);
        return next;
      });
    }
  }, [savedJobIds]);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 50) return "text-yellow-500";
    return "text-text-muted";
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Jobs
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Find matching opportunities worldwide.
          {" · "}
          <Link href="/jobs/applications" className="text-text-primary hover:underline">
            View applications
          </Link>
        </p>

        {loading && (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-text-muted animate-spin mb-4" />
            <p className="text-sm text-text-muted">Loading job matches...</p>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-24">
            <Briefcase className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
            <h2 className="text-xl font-light text-text-primary mb-2">
              Could not load jobs.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm">
              {error}
            </p>
          </div>
        )}

        {!loading && !error && jobs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24">
            <Briefcase className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
            <h2 className="text-xl font-light text-text-primary mb-2">
              No job matches yet.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
              Create your career profile to get personalized job matches and recommendations.
            </p>
            <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
              Set up profile
            </button>
          </div>
        )}

        {!loading && !error && jobs.length > 0 && (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-bg-surface border border-border-subtle rounded-2xl p-5 hover:border-border-active transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-sm font-medium text-text-primary truncate">
                        {job.title}
                      </h3>
                      {job.matchScore != null && (
                        <span className={`text-xs font-medium ${getScoreColor(job.matchScore)}`}>
                          {job.matchScore}%
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-text-secondary">
                      {job.company}
                      {job.location && ` · ${job.location}`}
                    </p>
                    {job.summary && (
                      <p className="text-xs text-text-muted mt-2 line-clamp-2">
                        {job.summary}
                      </p>
                    )}
                  </div>
                  {job.url && (
                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 w-8 h-8 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" strokeWidth={1.5} />
                    </a>
                  )}
                  <button
                    onClick={() => toggleSave(job.id)}
                    disabled={savingIds.has(job.id)}
                    className="shrink-0 w-8 h-8 flex items-center justify-center transition-colors disabled:opacity-50"
                    title={savedJobIds.has(job.id) ? "Already saved" : "Save job"}
                  >
                    {savedJobIds.has(job.id) ? (
                      <BookmarkCheck className="w-4 h-4 text-text-primary" strokeWidth={1.5} />
                    ) : (
                      <Bookmark className="w-4 h-4 text-text-muted hover:text-text-primary" strokeWidth={1.5} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
