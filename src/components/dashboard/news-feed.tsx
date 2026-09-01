import { cn } from "@/lib/utils";

interface NewsItem {
  id: string;
  category: string;
  title: string;
  date: string;
  timeAgo: string;
  summary: string;
}

const mockNews: NewsItem[] = [
  {
    id: "1",
    category: "AI",
    title: "OpenAI introduces a new generation of AI agents",
    date: "31 AUG",
    timeAgo: "2 hours ago",
    summary:
      "The new agent framework demonstrates significant improvements in reasoning and tool use capabilities across complex multi-step tasks.",
  },
  {
    id: "2",
    category: "DEV",
    title: "React 20 announced with revolutionary compiler",
    date: "30 AUG",
    timeAgo: "5 hours ago",
    summary:
      "The new compiler eliminates the need for most performance optimizations, automatically managing re-renders and memoization.",
  },
  {
    id: "3",
    category: "INFRA",
    title: "Cloudflare edge computing reaches 300 locations",
    date: "29 AUG",
    timeAgo: "1 day ago",
    summary:
      "The expanded network enables sub-50ms latency for 95% of global internet users.",
  },
  {
    id: "4",
    category: "SECURITY",
    title: "Critical vulnerability discovered in popular npm packages",
    date: "28 AUG",
    timeAgo: "2 days ago",
    summary:
      "Security researchers have identified a supply chain attack affecting over 2,000 dependent packages.",
  },
];

export function NewsFeed() {
  return (
    <div className="flex flex-col">
      {mockNews.map((item, index) => (
        <article
          key={item.id}
          className={cn(
            "group py-6 transition-colors duration-200",
            index < mockNews.length - 1 && "border-b border-border-subtle"
          )}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
              {item.category}
            </span>
            <span className="text-[10px] text-text-muted">·</span>
            <time className="text-[10px] text-text-muted">{item.date}</time>
            <span className="text-[10px] text-text-muted">·</span>
            <span className="text-[10px] text-text-muted">{item.timeAgo}</span>
          </div>
          <h3 className="text-base font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-2">
            {item.title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed line-clamp-2">
            {item.summary}
          </p>
        </article>
      ))}
    </div>
  );
}
