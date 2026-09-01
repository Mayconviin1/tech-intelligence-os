import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Recommendation {
  type: string;
  title: string;
  reason: string;
  url?: string;
}

interface AiRecommendationsProps {
  recommendations: Recommendation[];
}

const typeLabels: Record<string, string> = {
  READ: "READ",
  LEARN: "LEARN",
  APPLY: "APPLY",
  ATTEND: "ATTEND",
  FOLLOW: "FOLLOW",
  BUILD: "BUILD",
};

export function AiRecommendations({ recommendations }: AiRecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          AI Recommends
        </h2>
        <p className="text-sm text-text-secondary mb-4">
          Set up your profile and interests to get AI-powered recommendations.
        </p>
        <Link
          href="/settings"
          className="inline-flex items-center justify-center h-8 px-4 text-xs font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200"
        >
          Set up profile
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
        AI Recommends
      </h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <a
            key={index}
            href={rec.url || "#"}
            className="group flex items-start gap-3 py-3 transition-colors duration-200"
          >
            <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted bg-bg-surface px-2 py-0.5 rounded flex-shrink-0 mt-0.5">
              {typeLabels[rec.type] || rec.type}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-1">
                {rec.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {rec.reason}
              </p>
            </div>
            <ArrowRight
              className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors mt-0.5 flex-shrink-0"
              strokeWidth={1.5}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
