import type { JobMatch, JobCategory, Eligibility } from "@/types";

// ─── Remotive API Types ───────────────────────────────────

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  company_logo: string | null;
  category: string;
  tags: string[];
  job_type: string;
  publication_date: string;
  description: string;
  salary: string;
  candidate_required_location: string;
  required_experience: string;
}

interface RemotiveResponse {
  "job-count": number;
  "total-job-count": number;
  jobs: RemotiveJob[];
}

// ─── Constants ────────────────────────────────────────────

const REMOTIVE_API_URL = "https://remotive.com/api/remote-jobs";

const CATEGORY_MAP: Record<string, JobCategory> = {
  "Software Development": "SOFTWARE_ENGINEER",
  "Front-End": "FRONTEND",
  "Back-End": "BACKEND",
  "Mobile": "MOBILE",
  "AI": "AI_ENGINEER",
  "Machine Learning": "ML_ENGINEER",
  "Data Engineering": "DATA_ENGINEER",
  "DevOps / Sysadmin": "DEVOPS",
  "DevOps": "DEVOPS",
  "Cloud": "CLOUD",
  "Security": "CYBERSECURITY",
  "SRE": "SRE",
  "Product": "PRODUCT",
  "Design": "UX_UI",
};

const BRAZIL_KEYWORDS = [
  "brazil",
  "brasil",
  "latin america",
  "latam",
  "são paulo",
  "rio de janeiro",
  "belo horizonte",
  "curitiba",
  "brasília",
  "remote worldwide",
  "anywhere",
  "worldwide",
];

const TECH_KEYWORDS: Record<string, string[]> = {
  FRONTEND: ["react", "vue", "angular", "svelte", "next.js", "nuxt", "typescript", "javascript", "css", "tailwind"],
  BACKEND: ["node.js", "python", "java", "go", "rust", "php", "ruby", "django", "fastapi", "express", "nestjs"],
  MOBILE: ["react native", "flutter", "swift", "kotlin", "ios", "android"],
  AI_ENGINEER: ["openai", "llm", "gpt", "langchain", "transformers", "nlp", "machine learning", "deep learning"],
  DEVOPS: ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "jenkins", "github actions"],
  FULL_STACK: ["full stack", "fullstack", "full-stack"],
};

// ─── Category Detection ───────────────────────────────────

function detectCategory(job: RemotiveJob): JobCategory {
  const categoryLower = job.category.toLowerCase();
  const titleLower = job.title.toLowerCase();
  const tagsLower = job.tags.map((t) => t.toLowerCase());

  if (titleLower.includes("frontend") || titleLower.includes("front-end") || titleLower.includes("ui")) {
    return "FRONTEND";
  }
  if (titleLower.includes("backend") || titleLower.includes("back-end") || titleLower.includes("server")) {
    return "BACKEND";
  }
  if (titleLower.includes("full stack") || titleLower.includes("fullstack") || titleLower.includes("full-stack")) {
    return "FULL_STACK";
  }
  if (titleLower.includes("mobile") || titleLower.includes("ios") || titleLower.includes("android") || titleLower.includes("flutter") || titleLower.includes("react native")) {
    return "MOBILE";
  }
  if (titleLower.includes("devops") || titleLower.includes("sre") || titleLower.includes("infrastructure")) {
    return "DEVOPS";
  }
  if (titleLower.includes("data") && titleLower.includes("engineer")) {
    return "DATA_ENGINEER";
  }
  if (titleLower.includes("machine learning") || titleLower.includes("ml ") || titleLower.includes("ai ")) {
    return "ML_ENGINEER";
  }
  if (titleLower.includes("security") || titleLower.includes("cyber")) {
    return "CYBERSECURITY";
  }
  if (titleLower.includes("product manager") || titleLower.includes("product owner")) {
    return "PRODUCT";
  }
  if (titleLower.includes("design") || titleLower.includes("ux") || titleLower.includes("ui")) {
    return "UX_UI";
  }
  if (titleLower.includes("lead") || titleLower.includes("architect")) {
    return "TECH_LEAD";
  }

  for (const [key, value] of Object.entries(CATEGORY_MAP)) {
    if (categoryLower.includes(key.toLowerCase())) {
      return value;
    }
  }

  return "SOFTWARE_ENGINEER";
}

// ─── Seniority Detection ──────────────────────────────────

function detectSeniority(job: RemotiveJob): string {
  const titleLower = job.title.toLowerCase();

  if (titleLower.includes("principal") || titleLower.includes("distinguished")) {
    return "PRINCIPAL";
  }
  if (titleLower.includes("staff")) {
    return "STAFF";
  }
  if (titleLower.includes("lead") || titleLower.includes("head of")) {
    return "LEAD";
  }
  if (titleLower.includes("senior") || titleLower.includes("sr.") || titleLower.includes("sr ")) {
    return "SENIOR";
  }
  if (titleLower.includes("mid") || titleLower.includes("intermediate")) {
    return "MID";
  }
  if (titleLower.includes("junior") || titleLower.includes("jr.") || titleLower.includes("jr ")) {
    return "JUNIOR";
  }
  if (titleLower.includes("intern")) {
    return "INTERN";
  }

  return "MID";
}

// ─── Eligibility ──────────────────────────────────────────

function determineEligibility(job: RemotiveJob): Eligibility {
  const location = job.candidate_required_location.toLowerCase();
  const description = job.description.toLowerCase();
  const combined = `${location} ${description}`;

  const isBrazilMentioned = BRAZIL_KEYWORDS.some((kw) => combined.includes(kw));

  if (isBrazilMentioned) {
    return "GOOD";
  }
  if (location === "worldwide" || location === "anywhere" || location === "") {
    return "GOOD";
  }
  if (location.includes("us") || location.includes("europe")) {
    return "ATTENTION";
  }

  return "LOW";
}

// ─── Match Score ──────────────────────────────────────────

function calculateMatchScore(job: RemotiveJob, category: JobCategory): number {
  let score = 50;

  const categoryKeywords = TECH_KEYWORDS[category] || [];
  const tagsLower = job.tags.map((t) => t.toLowerCase());
  const titleLower = job.title.toLowerCase();
  const combined = `${tagsLower.join(" ")} ${titleLower}`;

  for (const keyword of categoryKeywords) {
    if (combined.includes(keyword.toLowerCase())) {
      score += 5;
    }
  }

  if (job.salary && job.salary !== "" && !job.salary.toLowerCase().includes("undisclosed")) {
    score += 10;
  }

  const location = job.candidate_required_location.toLowerCase();
  if (location === "worldwide" || location === "anywhere" || location === "") {
    score += 5;
  }

  const dayDiff = (Date.now() - new Date(job.publication_date).getTime()) / (1000 * 60 * 60 * 24);
  if (dayDiff <= 7) score += 10;
  else if (dayDiff <= 30) score += 5;

  return Math.min(score, 100);
}

// ─── Normalize to JobMatch ────────────────────────────────

function normalizeJob(remotiveJob: RemotiveJob): JobMatch {
  const category = detectCategory(remotiveJob);
  const matchScore = calculateMatchScore(remotiveJob, category);
  const eligibility = determineEligibility(remotiveJob);

  return {
    id: `remotive-${remotiveJob.id}`,
    title: remotiveJob.title,
    company: remotiveJob.company_name,
    location: remotiveJob.candidate_required_location || undefined,
    remote: true,
    salary: remotiveJob.salary || undefined,
    matchScore,
    eligibility,
    seniority: detectSeniority(remotiveJob),
    technologies: remotiveJob.tags,
    publishedAt: remotiveJob.publication_date,
    url: remotiveJob.url,
    category,
  };
}

// ─── Public Functions ─────────────────────────────────────

export interface GetJobsOptions {
  category?: JobCategory;
  limit?: number;
  offset?: number;
}

export async function getJobs(options: GetJobsOptions = {}): Promise<JobMatch[]> {
  const { category, limit = 50, offset = 0 } = options;

  try {
    const params = new URLSearchParams();
    if (category) {
      const remotiveCategory = Object.entries(CATEGORY_MAP).find(([, v]) => v === category)?.[0];
      if (remotiveCategory) {
        params.set("category", remotiveCategory);
      }
    }

    const url = params.toString()
      ? `${REMOTIVE_API_URL}?${params.toString()}`
      : REMOTIVE_API_URL;

    const response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Remotive API error: ${response.status}`);
    }

    const data: RemotiveResponse = await response.json();

    const jobs = data.jobs.slice(offset, offset + limit).map(normalizeJob);

    return jobs;
  } catch (error) {
    console.error("[JobsProvider] Failed to fetch jobs:", error);
    return [];
  }
}

export interface JobMatchFilters {
  category?: JobCategory;
  minMatchScore?: number;
  eligibility?: Eligibility;
  technologies?: string[];
}

export async function getJobMatches(filters: JobMatchFilters = {}): Promise<JobMatch[]> {
  const { category, minMatchScore = 0, eligibility, technologies } = filters;

  try {
    const jobs = await getJobs({ category, limit: 100 });

    let filtered = jobs.filter((job) => {
      if (job.matchScore !== undefined && job.matchScore < minMatchScore) return false;
      if (eligibility && job.eligibility !== eligibility) return false;
      if (technologies && technologies.length > 0) {
        const jobTechs = (job.technologies || []).map((t) => t.toLowerCase());
        const hasMatch = technologies.some((t) => jobTechs.includes(t.toLowerCase()));
        if (!hasMatch) return false;
      }
      return true;
    });

    filtered.sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

    return filtered;
  } catch (error) {
    console.error("[JobsProvider] Failed to get job matches:", error);
    return [];
  }
}
