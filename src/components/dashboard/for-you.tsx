import { ArrowRight } from "lucide-react";
import type { ForYouItem } from "@/types";

interface ForYouProps {
  items: ForYouItem[];
}

export function ForYou({ items }: ForYouProps) {
  if (items.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          For You
        </h2>
        <p className="text-sm text-text-secondary">
          Personalize your profile to get tailored recommendations.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-2">
        For You
      </h2>
      <p className="text-xs text-text-muted mb-6">
        {items.length} thing{items.length !== 1 ? "s" : ""} that deserve your attention today
      </p>
      <div className="space-y-4">
        {items.map((item, index) => (
          <a
            key={item.id}
            href={item.url || "#"}
            className="group flex items-start gap-3 py-3 transition-colors duration-200"
          >
            <span className="text-text-muted text-sm mt-0.5 flex-shrink-0">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-text-muted leading-relaxed">
                {item.reason}
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
