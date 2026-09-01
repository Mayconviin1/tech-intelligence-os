"use client";

import { Layout } from "@/components/layout/layout";
import { TrendingUp } from "lucide-react";

export default function TrendsPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Trend Radar
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Track emerging technologies and market signals.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <TrendingUp className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No trends tracked yet.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Start following topics and the radar will populate with real-time signals and analysis.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Explore topics
          </button>
        </div>
      </div>
    </Layout>
  );
}
