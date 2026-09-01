"use client";

import { Layout } from "@/components/layout/layout";

export default function CareerPage() {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-light tracking-tight text-text-primary mb-2">
          Career Profile
        </h1>
        <p className="text-sm text-text-secondary mb-16">
          Your professional identity and goals.
        </p>

        {/* Profile fields */}
        <div className="space-y-6">
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Full name</p>
              <p className="text-xs text-text-muted mt-0.5">Your display name</p>
            </div>
            <span className="text-sm text-text-muted">Not set</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Headline</p>
              <p className="text-xs text-text-muted mt-0.5">A short professional tagline</p>
            </div>
            <span className="text-sm text-text-muted">Not set</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Skills</p>
              <p className="text-xs text-text-muted mt-0.5">Your core competencies</p>
            </div>
            <span className="text-sm text-text-muted">None added</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Experience</p>
              <p className="text-xs text-text-muted mt-0.5">Years of professional experience</p>
            </div>
            <span className="text-sm text-text-muted">Not set</span>
          </div>
          <div className="flex items-center justify-between py-4 border-b border-border-subtle">
            <div>
              <p className="text-sm text-text-primary">Goals</p>
              <p className="text-xs text-text-muted mt-0.5">What you are looking for</p>
            </div>
            <span className="text-sm text-text-muted">Not set</span>
          </div>
        </div>

        <div className="mt-12">
          <button className="h-10 px-5 text-sm font-medium bg-text-primary text-bg-primary rounded-pill hover:bg-text-secondary transition-colors duration-200">
            Complete profile
          </button>
        </div>
      </div>
    </Layout>
  );
}
