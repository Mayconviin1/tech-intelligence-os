// ─── Core Types ──────────────────────────────────────────

export type Theme = "dark" | "light";

export type ImportanceLevel = "CRITICAL" | "IMPORTANT" | "INTERESTING";

export type SkillLevel = "MASTERED" | "LEARNING" | "WANT_TO_LEARN" | "MONITORING";

export type SourceType = "PRIMARY" | "OFFICIAL_BLOG" | "OFFICIAL_DOCS" | "JOURNALISM" | "OTHER";

export type JobCategory =
  | "SOFTWARE_ENGINEER"
  | "FRONTEND"
  | "BACKEND"
  | "FULL_STACK"
  | "MOBILE"
  | "AI_ENGINEER"
  | "ML_ENGINEER"
  | "DATA_ENGINEER"
  | "DEVOPS"
  | "CLOUD"
  | "CYBERSECURITY"
  | "SRE"
  | "PRODUCT"
  | "UX_UI"
  | "TECH_LEAD";

export type Seniority = "INTERN" | "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "STAFF" | "PRINCIPAL";

export type ApplicationStatus =
  | "SAVED"
  | "APPLIED"
  | "INTERVIEW"
  | "TECHNICAL_TEST"
  | "OFFER"
  | "REJECTED"
  | "WITHDRAWN";

export type Eligibility = "GOOD" | "ATTENTION" | "LOW" | "UNKNOWN";

export type RecommendationType = "READ" | "LEARN" | "APPLY" | "ATTEND" | "FOLLOW" | "BUILD";

export type FeedbackType = "RELEVANT" | "NOT_RELEVANT" | "SAVE" | "IMPORTANT" | "DONT_SHOW";

export type AIModelRole = "CLASSIFICATION" | "SUMMARY" | "REASONING" | "DEEP_RESEARCH" | "EMBEDDINGS";

// ─── News & Signals ──────────────────────────────────────

export interface NewsSignal {
  id: string;
  title: string;
  category: string;
  timestamp: string;
  source: string;
  sourceUrl: string;
  summary: string;
  aiSummary?: string;
  importance: number;
  personalRelevance: number;
  confirmed: boolean;
  imageUrl?: string;
  tags?: string[];
  event?: {
    id: string;
    title: string;
    sourceCount: number;
  };
  technology?: {
    id: string;
    name: string;
  };
}

export interface DeduplicatedEvent {
  id: string;
  title: string;
  description?: string;
  category: string;
  importance: number;
  sourceCount: number;
  sources: Array<{
    name: string;
    url: string;
    quality: number;
  }>;
  latestUpdate: string;
}

// ─── Trend Radar ─────────────────────────────────────────

export interface TrendData {
  id: string;
  name: string;
  category?: string;
  score: number;
  growth: number;
  period: string;
  technology?: {
    id: string;
    name: string;
    category?: string;
  };
}

// ─── Jobs ────────────────────────────────────────────────

export interface JobMatch {
  id: string;
  title: string;
  company: string;
  location?: string;
  remote: boolean;
  salary?: string;
  matchScore?: number;
  eligibility?: Eligibility;
  seniority?: string;
  technologies?: string[];
  publishedAt: string;
  url: string;
  category?: string;
}

export interface ApplicationTracker {
  id: string;
  job: JobMatch;
  status: ApplicationStatus;
  notes?: string;
  salary?: string;
  contact?: string;
  nextAction?: string;
  appliedAt?: string;
  createdAt: string;
}

// ─── Events ──────────────────────────────────────────────

export interface TechEvent {
  id: string;
  name: string;
  date: string;
  time?: string;
  timezone?: string;
  location?: string;
  online: boolean;
  price?: string;
  organizer?: string;
  url: string;
  category?: string;
  relevance: number;
}

// ─── Companies ───────────────────────────────────────────

export interface CompanyData {
  id: string;
  name: string;
  domain?: string;
  logoUrl?: string;
  description?: string;
  category?: string;
  followed?: boolean;
}

// ─── Knowledge Vault ─────────────────────────────────────

export interface SavedItemData {
  id: string;
  url?: string;
  title?: string;
  description?: string;
  category?: string;
  tags?: string[];
  technology?: string;
  summary?: string;
  importance: number;
  itemType: string;
  content?: string;
  createdAt: string;
}

// ─── AI Copilot ──────────────────────────────────────────

export interface AIMessage {
  id: string;
  role: "USER" | "ASSISTANT" | "SYSTEM";
  content: string;
  sources?: Array<{
    title: string;
    url: string;
    type: string;
  }>;
  model?: string;
  createdAt: string;
}

export interface AIConversation {
  id: string;
  title?: string;
  messages: AIMessage[];
  createdAt: string;
}

// ─── Tech Score ──────────────────────────────────────────

export interface TechScoreData {
  overall: number;
  change: number;
  categories: Array<{
    name: string;
    score: number;
    evidence: string[];
    gaps: string[];
    recommendations: string[];
  }>;
}

// ─── For You ─────────────────────────────────────────────

export interface ForYouItem {
  id: string;
  type: "NEWS" | "JOB" | "EVENT" | "TREND" | "RECOMMENDATION";
  title: string;
  reason: string;
  url?: string;
  score: number;
}

// ─── Dashboard ───────────────────────────────────────────

export interface DashboardData {
  greeting: string;
  techScore: TechScoreData;
  trends: TrendData[];
  topSignals: NewsSignal[];
  forYou: ForYouItem[];
  jobMatches: JobMatch[];
  upcomingEvents: TechEvent[];
  recommendations: Array<{
    type: RecommendationType;
    title: string;
    reason: string;
    url?: string;
  }>;
}

// ─── Navigation ──────────────────────────────────────────

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  badge?: number;
}

// ─── API Responses ───────────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  };
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// ─── Search ──────────────────────────────────────────────

export interface SearchResult {
  type: "NEWS" | "TREND" | "COMPANY" | "STARTUP" | "JOB" | "EVENT" | "KNOWLEDGE" | "TECHNOLOGY";
  id: string;
  title: string;
  subtitle?: string;
  url?: string;
  score: number;
}
