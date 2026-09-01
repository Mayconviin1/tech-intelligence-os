import { ExternalLink } from "lucide-react";
import type { NewsSignal } from "@/types";

interface TopSignalsProps {
  signals: NewsSignal[];
}

function ImportanceBadge({ score }: { score: number }) {
  return (
    <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
      IMPORTANCE {score}
    </span>
  );
}

export function TopSignals({ signals }: TopSignalsProps) {
  if (signals.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          Top Signals
        </h2>
        <p className="text-sm text-text-secondary">
          No signals yet. Start following topics to see important updates here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
        Top Signals
      </h2>
      <div className="space-y-0">
        {signals.map((signal, index) => (
          <article
            key={signal.id}
            className={`group py-5 transition-colors duration-200 ${
              index < signals.length - 1 ? "border-b border-border-subtle" : ""
            }`}
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="text-[10px] font-medium uppercase tracking-widest text-text-muted">
                {signal.category}
              </span>
              <span className="text-[10px] text-text-muted">·</span>
              <time className="text-[10px] text-text-muted">{signal.timestamp}</time>
              {signal.source && (
                <>
                  <span className="text-[10px] text-text-muted">·</span>
                  <a
                    href={signal.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-text-muted hover:text-text-secondary transition-colors inline-flex items-center gap-1"
                  >
                    {signal.source}
                    <ExternalLink className="w-2.5 h-2.5" strokeWidth={1.5} />
                  </a>
                </>
              )}
            </div>
            <h3 className="text-base font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-2">
              {signal.title}
            </h3>
            <p className="text-sm text-text-secondary leading-relaxed mb-2 line-clamp-2">
              {signal.summary}
            </p>
            <div className="flex items-center gap-4">
              <ImportanceBadge score={signal.importance} />
              {!signal.confirmed && (
                <span className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                  UNCONFIRMED
                </span>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
