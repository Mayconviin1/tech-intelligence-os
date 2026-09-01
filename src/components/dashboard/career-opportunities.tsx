import { MapPin, ArrowUpRight } from "lucide-react";
import type { JobMatch } from "@/types";

interface CareerOpportunitiesProps {
  jobs: JobMatch[];
}

export function CareerOpportunities({ jobs }: CareerOpportunitiesProps) {
  if (jobs.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          Career Opportunities
        </h2>
        <p className="text-sm text-text-secondary">
          Set up your career profile to see matching opportunities.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-2">
        Career Opportunities
      </h2>
      <p className="text-xs text-text-muted mb-6">
        {jobs.length} new matching {jobs.length === 1 ? "opportunity" : "opportunities"}
      </p>
      <div className="space-y-0">
        {jobs.map((job, index) => (
          <a
            key={job.id}
            href={job.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-center justify-between py-4 transition-colors duration-200 ${
              index < jobs.length - 1 ? "border-b border-border-subtle" : ""
            }`}
          >
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-1">
                {job.title}
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{job.company}</span>
                {job.location && (
                  <>
                    <span>·</span>
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3" strokeWidth={1.5} />
                      {job.location}
                    </span>
                  </>
                )}
                {job.remote && (
                  <>
                    <span>·</span>
                    <span>Remote</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 ml-4">
              {job.matchScore && (
                <span className="text-xs font-medium text-text-secondary">
                  {job.matchScore}% Match
                </span>
              )}
              <ArrowUpRight
                className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors"
                strokeWidth={1.5}
              />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
