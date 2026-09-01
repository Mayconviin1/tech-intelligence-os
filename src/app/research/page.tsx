"use client";

import { Layout } from "@/components/layout/layout";
import { Search } from "lucide-react";

export default function ResearchPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Deep Research
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          In-depth analysis from multiple sources.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <Search className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No research started.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Start a deep dive into any topic and get comprehensive analysis from multiple sources.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Start research
          </button>
        </div>
      </div>
    </Layout>
  );
}
