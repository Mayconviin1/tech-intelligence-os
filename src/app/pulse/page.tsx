"use client";

import { Layout } from "@/components/layout/layout";
import { Activity } from "lucide-react";

export default function PulsePage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Tech Pulse
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Real-time pulse of the technology world.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <Activity className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No data sources connected.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Connect your data sources to see real-time activity across the tech landscape.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Connect sources
          </button>
        </div>
      </div>
    </Layout>
  );
}
