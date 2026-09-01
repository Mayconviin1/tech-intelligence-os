"use client";

import { Layout } from "@/components/layout/layout";
import { FileText, Loader2, ChevronDown, Calendar, StickyNote } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface JobApplication {
  id: string;
  jobId: string;
  status: string;
  notes: string | null;
  salary: string | null;
  contact: string | null;
  nextAction: string | null;
  appliedAt: string | null;
  createdAt: string;
  job?: {
    id: string;
    title: string;
    company: string;
    location: string | null;
    url: string;
  } | null;
}

const STATUS_ORDER = ["INTERVIEW", "OFFER", "APPLIED", "TECHNICAL_TEST", "SAVED", "REJECTED", "WITHDRAWN"] as const;

const STATUS_LABELS: Record<string, string> = {
  SAVED: "Saved",
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  TECHNICAL_TEST: "Technical Test",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

const STATUS_COLORS: Record<string, string> = {
  SAVED: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  APPLIED: "bg-purple-500/15 text-purple-400 border-purple-500/30",
  INTERVIEW: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  TECHNICAL_TEST: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  OFFER: "bg-green-500/15 text-green-400 border-green-500/30",
  REJECTED: "bg-red-500/15 text-red-400 border-red-500/30",
  WITHDRAWN: "bg-gray-500/15 text-gray-400 border-gray-500/30",
};

const ALL_STATUSES = ["SAVED", "APPLIED", "INTERVIEW", "TECHNICAL_TEST", "OFFER", "REJECTED", "WITHDRAWN"] as const;

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const res = await fetch("/api/applications");
      if (!res.ok) throw new Error("Failed to load applications");
      const data = await res.json();
      setApplications(Array.isArray(data) ? data : []);
    } catch {
      setApplications([]);
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(id: string, newStatus: string) {
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
    } catch (err) {
      console.error(err);
    }
  }

  async function saveNotes(id: string) {
    setSavingNotes(true);
    try {
      const res = await fetch("/api/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, notes: editNotes }),
      });
      if (!res.ok) throw new Error("Failed to save notes");
      const updated = await res.json();
      setApplications((prev) => prev.map((a) => (a.id === id ? updated : a)));
      setEditingId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setSavingNotes(false);
    }
  }

  async function deleteApplication(id: string) {
    try {
      const res = await fetch(`/api/applications?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setApplications((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  const grouped = STATUS_ORDER.reduce(
    (acc, status) => {
      const items = applications.filter((a) => a.status === status);
      if (items.length > 0) acc.push({ status, items });
      return acc;
    },
    [] as { status: string; items: JobApplication[] }[]
  );

  const totalApps = applications.length;
  const interviewCount = applications.filter((a) => a.status === "INTERVIEW" || a.status === "TECHNICAL_TEST").length;
  const offerCount = applications.filter((a) => a.status === "OFFER").length;
  const appliedCount = applications.filter((a) => a.status !== "SAVED" && a.status !== "REJECTED" && a.status !== "WITHDRAWN").length;
  const responseRate = appliedCount > 0 ? Math.round(((interviewCount + offerCount) / appliedCount) * 100) : 0;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Applications
        </h1>
        <p className="text-sm text-text-secondary mb-10">
          Track your job applications and their status.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-8 h-8 text-text-muted animate-spin mb-4" />
            <p className="text-sm text-text-muted">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <FileText className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
            <h2 className="text-xl font-light text-text-primary mb-2">
              No applications saved.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
              Save job listings to track your applications and monitor their status.
            </p>
            <Link
              href="/jobs"
              className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200 inline-flex items-center"
            >
              Browse jobs
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">Total</p>
                <p className="text-2xl font-light text-text-primary">{totalApps}</p>
              </div>
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">Interviews</p>
                <p className="text-2xl font-light text-yellow-400">{interviewCount}</p>
              </div>
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">Offers</p>
                <p className="text-2xl font-light text-green-400">{offerCount}</p>
              </div>
              <div className="bg-bg-surface border border-border-subtle rounded-xl p-4">
                <p className="text-xs text-text-muted mb-1">Response Rate</p>
                <p className="text-2xl font-light text-text-primary">{responseRate}%</p>
              </div>
            </div>

            <div className="space-y-8">
              {grouped.map(({ status, items }) => (
                <div key={status}>
                  <div className="flex items-center gap-3 mb-3">
                    <h2 className="text-sm font-medium text-text-secondary">{STATUS_LABELS[status]}</h2>
                    <span className="text-xs text-text-muted bg-bg-surface px-2 py-0.5 rounded-full border border-border-subtle">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2">
                    {items.map((app) => (
                      <div
                        key={app.id}
                        className="bg-bg-surface border border-border-subtle rounded-xl p-4 hover:border-border-active transition-colors duration-200"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <a
                                href={app.job?.url || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm font-medium text-text-primary hover:underline truncate"
                              >
                                {app.job?.title || `Job #${app.jobId}`}
                              </a>
                              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}>
                                {STATUS_LABELS[app.status]}
                              </span>
                            </div>
                            <p className="text-xs text-text-secondary">
                              {app.job?.company || "Unknown company"}
                              {app.job?.location && ` · ${app.job.location}`}
                            </p>
                            <div className="flex items-center gap-3 mt-2 text-[10px] text-text-muted">
                              {app.appliedAt && (
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  Applied {new Date(app.appliedAt).toLocaleDateString()}
                                </span>
                              )}
                              <span>Added {new Date(app.createdAt).toLocaleDateString()}</span>
                            </div>
                            {(app.notes || editingId === app.id) && (
                              <div className="mt-3">
                                {editingId === app.id ? (
                                  <div className="flex gap-2">
                                    <textarea
                                      value={editNotes}
                                      onChange={(e) => setEditNotes(e.target.value)}
                                      className="flex-1 bg-bg-base border border-border-subtle rounded-lg px-3 py-2 text-xs text-text-primary placeholder-text-muted resize-none focus:outline-none focus:border-border-active"
                                      rows={2}
                                      placeholder="Add notes..."
                                    />
                                    <div className="flex flex-col gap-1">
                                      <button
                                        onClick={() => saveNotes(app.id)}
                                        disabled={savingNotes}
                                        className="h-7 px-3 text-[10px] font-medium bg-text-primary text-bg-primary rounded-lg hover:bg-text-secondary transition-colors disabled:opacity-50"
                                      >
                                        {savingNotes ? "..." : "Save"}
                                      </button>
                                      <button
                                        onClick={() => setEditingId(null)}
                                        className="h-7 px-3 text-[10px] font-medium text-text-muted border border-border-subtle rounded-lg hover:text-text-primary transition-colors"
                                      >
                                        Cancel
                                      </button>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex items-start gap-2">
                                    <StickyNote className="w-3 h-3 text-text-muted mt-0.5 shrink-0" />
                                    <p className="text-xs text-text-secondary">{app.notes}</p>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center gap-1 shrink-0">
                            {editingId !== app.id && (
                              <button
                                onClick={() => {
                                  setEditingId(app.id);
                                  setEditNotes(app.notes || "");
                                }}
                                className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                                title="Edit notes"
                              >
                                <StickyNote className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </button>
                            )}
                            <div className="relative group">
                              <button className="w-7 h-7 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                                <ChevronDown className="w-3.5 h-3.5" strokeWidth={1.5} />
                              </button>
                              <div className="absolute right-0 top-full mt-1 w-44 bg-bg-surface border border-border-subtle rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150 z-10 py-1">
                                {ALL_STATUSES.map((s) => (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(app.id, s)}
                                    className={`w-full text-left px-3 py-1.5 text-xs hover:bg-bg-base transition-colors ${
                                      app.status === s ? "text-text-primary font-medium" : "text-text-secondary"
                                    }`}
                                  >
                                    {STATUS_LABELS[s]}
                                  </button>
                                ))}
                                <div className="border-t border-border-subtle mt-1 pt-1">
                                  <button
                                    onClick={() => deleteApplication(app.id)}
                                    className="w-full text-left px-3 py-1.5 text-xs text-red-400 hover:bg-bg-base transition-colors"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
