import { MapPin, ExternalLink } from "lucide-react";
import type { TechEvent } from "@/types";

interface UpcomingEventsProps {
  events: TechEvent[];
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  if (events.length === 0) {
    return (
      <div>
        <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-6">
          Upcoming
        </h2>
        <p className="text-sm text-text-secondary">
          No upcoming events. Follow topics to see relevant events here.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xs font-medium uppercase tracking-widest text-text-muted mb-2">
        Upcoming
      </h2>
      <p className="text-xs text-text-muted mb-6">
        {events.length} relevant {events.length === 1 ? "event" : "events"}
      </p>
      <div className="space-y-0">
        {events.map((event, index) => (
          <a
            key={event.id}
            href={event.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`group flex items-start gap-4 py-4 transition-colors duration-200 ${
              index < events.length - 1 ? "border-b border-border-subtle" : ""
            }`}
          >
            <div className="flex-shrink-0 w-10 text-center">
              <div className="text-[10px] font-medium uppercase tracking-wider text-text-muted">
                {new Date(event.date).toLocaleDateString("en-US", { month: "short" })}
              </div>
              <div className="text-lg font-light text-text-primary">
                {new Date(event.date).getDate()}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-text-primary group-hover:text-text-secondary transition-colors duration-200 mb-1">
                {event.name}
              </h3>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                {event.online ? (
                  <span>Online</span>
                ) : event.location ? (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" strokeWidth={1.5} />
                    {event.location}
                  </span>
                ) : null}
                {event.price && (
                  <>
                    <span>·</span>
                    <span>{event.price}</span>
                  </>
                )}
              </div>
            </div>
            <ExternalLink
              className="w-3.5 h-3.5 text-text-muted group-hover:text-text-secondary transition-colors mt-1 flex-shrink-0"
              strokeWidth={1.5}
            />
          </a>
        ))}
      </div>
    </div>
  );
}
