"use client";

import { Layout } from "@/components/layout/layout";
import { Building2 } from "lucide-react";

export default function CompaniesPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Companies
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Follow and track companies that matter to you.
        </p>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-24">
          <Building2 className="w-10 h-10 text-text-muted mb-6" strokeWidth={1} />
          <h2 className="text-xl font-light text-text-primary mb-2">
            No companies followed.
          </h2>
          <p className="text-sm text-text-secondary text-center max-w-sm mb-6">
            Follow companies to get updates on hiring, funding, product launches, and tech stack changes.
          </p>
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Find companies
          </button>
        </div>
      </div>
    </Layout>
  );
}
