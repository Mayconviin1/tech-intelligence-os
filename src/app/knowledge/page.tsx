"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { BookOpen, Trash2, Plus, X, ExternalLink } from "lucide-react";

interface SavedItem {
  id: string;
  title: string;
  url: string;
  category?: string;
  tags?: string[];
  importance?: string;
  savedAt?: string;
}

function VaultSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="py-4 border-b border-border-subtle">
          <Skeleton className="h-4 w-2/3 mb-2" />
          <Skeleton className="h-3 w-1/3 mb-2" />
          <div className="flex gap-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function KnowledgePage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/saved")
      .then((res) => res.json())
      .then((json) => {
        const data = Array.isArray(json) ? json : json.data ?? [];
        setItems(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/saved?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    if (!newUrl.trim()) return;
    setSaving(true);
    try {
      const res = await fetch("/api/saved", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, title: newTitle || newUrl }),
      });
      const data = await res.json();
      if (data) {
        setItems((prev) => [data, ...prev]);
      }
      setNewUrl("");
      setNewTitle("");
      setShowForm(false);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-4xl font-light tracking-tight text-text-primary">
            Knowledge Vault
          </h1>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? (
              <X className="w-3.5 h-3.5" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            {showForm ? "Cancel" : "Add URL"}
          </Button>
        </div>
        <p className="text-sm text-text-secondary mb-8">
          Your personal knowledge base.
        </p>

        {showForm && (
          <div className="mb-8 p-4 bg-bg-surface border border-border-subtle rounded-sm space-y-3">
            <Input
              placeholder="URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
            />
            <Input
              placeholder="Title (optional)"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
            />
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="sm"
                onClick={handleSave}
                disabled={saving || !newUrl.trim()}
              >
                {saving ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        )}

        {loading ? (
          <VaultSkeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <BookOpen
              className="w-10 h-10 text-text-muted mb-6"
              strokeWidth={1}
            />
            <h2 className="text-xl font-light text-text-primary mb-2">
              Nothing in your vault yet.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
              Save articles, notes, and resources to build your personal
              knowledge base.
            </p>
            <Button variant="primary" size="sm" onClick={() => setShowForm(true)}>
              <Plus className="w-3.5 h-3.5" />
              Add knowledge
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {items.map((item, index) => (
              <div
                key={item.id}
                className={cn(
                  "group py-4 transition-colors duration-200",
                  index < items.length - 1 && "border-b border-border-subtle"
                )}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-text-primary hover:text-text-secondary transition-colors duration-200 inline-flex items-center gap-1.5"
                    >
                      {item.title}
                      <ExternalLink className="w-3 h-3 text-text-muted opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                      {item.category && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                          {item.category}
                        </span>
                      )}
                      {item.importance && (
                        <>
                          <span className="text-[10px] text-text-muted">·</span>
                          <span className="text-[10px] text-text-muted">
                            {item.importance}
                          </span>
                        </>
                      )}
                      {item.tags && item.tags.length > 0 && (
                        <>
                          <span className="text-[10px] text-text-muted">·</span>
                          <span className="text-[10px] text-text-muted">
                            {item.tags.join(", ")}
                          </span>
                        </>
                      )}
                      {item.savedAt && (
                        <>
                          <span className="text-[10px] text-text-muted">·</span>
                          <time className="text-[10px] text-text-muted">
                            {new Date(item.savedAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </time>
                        </>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-red-400/70 transition-all duration-200"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
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
