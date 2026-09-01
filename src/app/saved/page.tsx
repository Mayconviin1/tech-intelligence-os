"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Bookmark, Trash2, ExternalLink } from "lucide-react";

interface SavedItem {
  id: string;
  title: string;
  url: string;
  category?: string;
  tags?: string[];
  savedAt?: string;
}

function SavedSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="py-4 border-b border-border-subtle">
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-3 w-1/4" />
        </div>
      ))}
    </div>
  );
}

export default function SavedPage() {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleRemove = async (id: string) => {
    await fetch(`/api/saved?id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Saved
        </h1>
        <p className="text-sm text-text-secondary mb-8">
          Items you&apos;ve bookmarked for later.
        </p>

        {loading ? (
          <SavedSkeleton />
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Bookmark
              className="w-10 h-10 text-text-muted mb-6"
              strokeWidth={1}
            />
            <h2 className="text-xl font-light text-text-primary mb-2">
              Nothing saved yet.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm">
              Save articles from the feed and your personal knowledge base will
              start building itself.
            </p>
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
                    <div className="flex items-center gap-3 mt-1.5">
                      {item.category && (
                        <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                          {item.category}
                        </span>
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
                    onClick={() => handleRemove(item.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-text-muted hover:text-red-400/70 transition-all duration-200"
                    aria-label="Remove"
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
