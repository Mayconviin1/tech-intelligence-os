"use client";

import { Layout } from "@/components/layout/layout";
import { Calendar } from "lucide-react";

export default function EventsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Events
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Conferences, hackathons, and developer events.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <Calendar className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No events tracked.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Follow events to get reminders for conferences, meetups, and hackathons.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Discover events
          </button>
        </div>
      </div>
    </Layout>
  );
}
