"use client";

import { useEffect, useState } from "react";
import { Layout } from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { ThumbsUp, ThumbsDown, Bookmark } from "lucide-react";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  timeAgo: string;
  summary: string;
  url?: string;
  source?: string;
}

interface FeedbackState {
  [newsId: string]: "RELEVANT" | "NOT_RELEVANT" | "SAVED" | null;
}

function mapApiNewsToItem(raw: any): NewsItem {
  return {
    id: raw.id,
    category: raw.category ?? "NEWS",
    title: raw.title ?? raw.headline ?? "Untitled",
    date: raw.publishedAt
      ? new Date(raw.publishedAt)
          .toLocaleDateString("en-US", { month: "short", day: "numeric" })
          .toUpperCase()
      : raw.date ?? "",
    timeAgo: raw.timeAgo ?? raw.timestamp ?? "",
    summary: raw.summary ?? raw.description ?? "",
  };
}

function NewsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="py-6 border-b border-border-subtle">
          <div className="flex items-center gap-3 mb-2">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3 mt-1" />
        </div>
      ))}
    </div>
  );
}

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState>({});

  useEffect(() => {
    fetch("/api/news")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load news");
        return res.json();
      })
      .then((json) => {
        const items = Array.isArray(json) ? json : json.data ?? [];
        setNews(items.map(mapApiNewsToItem));
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const handleFeedback = async (
    newsId: string,
    type: "RELEVANT" | "NOT_RELEVANT"
  ) => {
    setFeedback((prev) => ({ ...prev, [newsId]: type }));
    await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, targetId: newsId, targetType: "NEWS" }),
    });
  };

  const handleBookmark = async (item: NewsItem) => {
    setFeedback((prev) => ({ ...prev, [item.id]: "SAVED" }));
    await fetch("/api/saved", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url: item.url ?? item.id,
        title: item.title,
        category: item.category,
      }),
    });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          News Intelligence
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Aggregated and analyzed from multiple sources.
        </p>

        {error && (
          <p className="text-xs text-red-400/70 mb-6">{error}</p>
        )}

        {loading ? (
          <NewsSkeleton />
        ) : news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <h2 className="text-xl font-light text-text-primary mb-2">
              No news available.
            </h2>
            <p className="text-sm text-text-secondary text-center max-w-sm">
              Connect your news sources and the intelligence feed will populate
              with curated analysis.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {news.map((item, index) => {
              const fb = feedback[item.id];
              return (
                <article
                  key={item.id}
                  className={cn(
                    "group py-6 transition-colors duration-200",
                    index < news.length - 1 && "border-b border-border-subtle"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                      {item.category}
                    </span>
                    <span className="text-[10px] text-text-muted">·</span>
                    <time className="text-[10px] text-text-muted">
                      {item.date}
                    </time>
                    {item.timeAgo && (
                      <>
                        <span className="text-[10px] text-text-muted">·</span>
                        <span className="text-[10px] text-text-muted">
                          {item.timeAgo}
                        </span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed line-clamp-2 mb-3">
                    {item.summary}
                  </p>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleFeedback(item.id, "RELEVANT")}
                      className={cn(
                        "p-1.5 rounded-sm transition-all duration-200",
                        fb === "RELEVANT"
                          ? "text-emerald-400"
                          : "text-text-muted hover:text-text-secondary"
                      )}
                      aria-label="Relevant"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleFeedback(item.id, "NOT_RELEVANT")}
                      className={cn(
                        "p-1.5 rounded-sm transition-all duration-200",
                        fb === "NOT_RELEVANT"
                          ? "text-red-400/70"
                          : "text-text-muted hover:text-text-secondary"
                      )}
                      aria-label="Not relevant"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleBookmark(item)}
                      className={cn(
                        "p-1.5 rounded-sm transition-all duration-200",
                        fb === "SAVED"
                          ? "text-amber-400"
                          : "text-text-muted hover:text-text-secondary"
                      )}
                      aria-label="Save"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}
