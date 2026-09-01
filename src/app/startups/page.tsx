"use client";

import { Layout } from "@/components/layout/layout";
import { Rocket } from "lucide-react";

export default function StartupsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Startups
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Track emerging startups, funding, and founders.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <Rocket className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No startups tracked.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Follow promising startups to monitor funding rounds, launches, and founder activity.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Discover startups
          </button>
        </div>
      </div>
    </Layout>
  );
}
