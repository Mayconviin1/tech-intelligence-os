import { XMLParser } from "fast-xml-parser";
import type { NewsSignal, DeduplicatedEvent } from "@/types";

// ─── RSS Feed Configuration ─────────────────────────────

interface FeedConfig {
  name: string;
  url: string;
  quality: number;
}

const RSS_FEEDS: FeedConfig[] = [
  { name: "TechCrunch", url: "https://techcrunch.com/feed/", quality: 0.9 },
  { name: "The Verge", url: "https://www.theverge.com/rss/index.xml", quality: 0.85 },
  { name: "Hacker News", url: "https://hnrss.org/frontpage", quality: 0.95 },
  { name: "Ars Technica", url: "https://feeds.arstechnica.com/arstechnica/index", quality: 0.85 },
  { name: "Techmeme", url: "https://techmeme.com/feed.xml", quality: 0.9 },
  { name: "Wired", url: "https://www.wired.com/feed/rss", quality: 0.8 },
  { name: "NYT Technology", url: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml", quality: 0.75 },
];

// ─── Types ──────────────────────────────────────────────

interface RawFeedItem {
  title?: string;
  link?: string;
  pubDate?: string;
  description?: string;
  "content:encoded"?: string;
  category?: string | string[];
  guid?: { "#text"?: string; "@_isPermaLink"?: string } | string;
  enclosure?: { "@_url"?: string; "@_type"?: string };
  "media:content"?: { "@_url"?: string; "@_medium"?: string };
  "media:thumbnail"?: { "@_url"?: string };
}

interface ParsedFeedItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  categories: string[];
  imageUrl?: string;
  guid?: string;
}

export interface NewsFetchResult {
  items: NewsSignal[];
  errors: Array<{ feed: string; error: string }>;
}

// ─── Parser Setup ───────────────────────────────────────

const xmlParser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@_",
  textNodeName: "#text",
  isArray: (name) => {
    if (name === "category" || name === "item" || name === "entry") return true;
    return false;
  },
});

// ─── Core Functions ─────────────────────────────────────

function extractImageUrl(item: RawFeedItem): string | undefined {
  if (item.enclosure?.["@_type"]?.startsWith("image/") && item.enclosure["@_url"]) {
    return item.enclosure["@_url"];
  }
  if (item["media:content"]?.["@_medium"] === "image" && item["media:content"]["@_url"]) {
    return item["media:content"]["@_url"];
  }
  if (item["media:thumbnail"]?.["@_url"]) {
    return item["media:thumbnail"]["@_url"];
  }
  const content = item["content:encoded"] || item.description || "";
  const match = content.match(/<img[^>]+src="([^"]+)"/);
  return match?.[1];
}

function extractCategories(item: RawFeedItem): string[] {
  const raw = item.category;
  if (!raw) return [];
  if (Array.isArray(raw)) {
    return raw
      .map((c) => (typeof c === "string" ? c : c["#text"] || ""))
      .filter(Boolean);
  }
  if (typeof raw === "string") return [raw];
  if (typeof raw === "object" && raw["#text"]) return [raw["#text"]];
  return [];
}

function parseFeedItem(raw: RawFeedItem, feedName: string): ParsedFeedItem | null {
  const title = raw.title?.trim();
  const link = raw.link?.trim();
  if (!title || !link) return null;

  return {
    title,
    link,
    pubDate: raw.pubDate || new Date().toISOString(),
    description: stripHtml(
      raw.description || raw["content:encoded"] || ""
    ).slice(0, 500),
    categories: extractCategories(raw),
    imageUrl: extractImageUrl(raw),
    guid:
      typeof raw.guid === "object"
        ? raw.guid["#text"]
        : typeof raw.guid === "string"
          ? raw.guid
          : undefined,
  };
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Fetch & Parse ──────────────────────────────────────

async function fetchFeed(feed: FeedConfig): Promise<ParsedFeedItem[]> {
  const response = await fetch(feed.url, {
    headers: { "User-Agent": "TechIntelligenceOS/1.0" },
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const xml = await response.text();
  const parsed = xmlParser.parse(xml);

  const items: RawFeedItem[] =
    parsed?.rss?.channel?.item ||
    parsed?.feed?.entry ||
    parsed?.["rdf:RDF"]?.item ||
    [];

  return items
    .map((item) => parseFeedItem(item, feed.name))
    .filter((item): item is ParsedFeedItem => item !== null);
}

async function fetchAllFeeds(): Promise<{
  items: ParsedFeedItem[];
  errors: Array<{ feed: string; error: string }>;
}> {
  const results = await Promise.allSettled(
    RSS_FEEDS.map(async (feed) => {
      const items = await fetchFeed(feed);
      return { feed, items };
    })
  );

  const items: ParsedFeedItem[] = [];
  const errors: Array<{ feed: string; error: string }> = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      items.push(...result.value.items);
    } else {
      const feedName = RSS_FEEDS[results.indexOf(result)]?.name || "Unknown";
      errors.push({ feed: feedName, error: result.reason?.message || "Unknown error" });
    }
  }

  return { items, errors };
}

// ─── Scoring ────────────────────────────────────────────

const HIGH_SIGNAL_KEYWORDS = [
  "layoff", "acquisition", "ipo", "funding", "raised", "billion", "million",
  "vulnerability", "breach", "zero-day", "exploit", "attack",
  "gpt", "llm", "ai", "machine learning", "artificial intelligence",
  "open source", "release", "launch", "announce",
  "regulation", "ban", "antitrust", "lawsuit",
  "breakthrough", "revolutionary", "first-ever",
];

const MEDIUM_SIGNAL_KEYWORDS = [
  "startup", "series a", "series b", "seed",
  "update", "patch", "version", "release",
  "hiring", "job", "career",
  "review", "benchmark", "performance",
  "trend", "growth", "adoption",
];

function scoreItem(item: ParsedFeedItem, feedConfig: FeedConfig): number {
  let score = feedConfig.quality * 50;

  const text = `${item.title} ${item.description}`.toLowerCase();

  let keywordHits = 0;
  for (const kw of HIGH_SIGNAL_KEYWORDS) {
    if (text.includes(kw)) keywordHits += 3;
  }
  for (const kw of MEDIUM_SIGNAL_KEYWORDS) {
    if (text.includes(kw)) keywordHits += 1;
  }
  score += Math.min(keywordHits * 5, 40);

  try {
    const pubDate = new Date(item.pubDate);
    const hoursAgo = (Date.now() - pubDate.getTime()) / (1000 * 60 * 60);
    if (hoursAgo < 6) score += 15;
    else if (hoursAgo < 24) score += 10;
    else if (hoursAgo < 72) score += 5;
  } catch {
    // invalid date, no bonus
  }

  return Math.min(Math.round(score), 100);
}

function determineCategory(item: ParsedFeedItem): string {
  const text = `${item.title} ${item.description} ${item.categories.join(" ")}`.toLowerCase();

  if (text.includes("ai") || text.includes("machine learning") || text.includes("llm") || text.includes("gpt")) {
    return "AI";
  }
  if (text.includes("security") || text.includes("vulnerability") || text.includes("breach")) {
    return "SECURITY";
  }
  if (text.includes("startup") || text.includes("funding") || text.includes("raised")) {
    return "STARTUPS";
  }
  if (text.includes("job") || text.includes("hiring") || text.includes("career")) {
    return "CAREER";
  }
  if (text.includes("hardware") || text.includes("chip") || text.includes("processor")) {
    return "HARDWARE";
  }
  if (item.categories.length > 0) {
    return item.categories[0]!.toUpperCase().slice(0, 30);
  }
  return "TECH";
}

// ─── Deduplication ──────────────────────────────────────

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function deduplicateItems(items: NewsSignal[]): NewsSignal[] {
  const seen = new Map<string, NewsSignal>();

  for (const item of items) {
    const normalized = normalizeTitle(item.title);
    const key = normalized.slice(0, 60);

    const existing = seen.get(key);
    if (existing) {
      existing.importance = Math.max(existing.importance, item.importance);
      existing.tags = [...new Set([...(existing.tags || []), ...(item.tags || [])])];
    } else {
      seen.set(key, { ...item });
    }
  }

  return Array.from(seen.values());
}

// ─── Public API ─────────────────────────────────────────

function toNewsSignal(item: ParsedFeedItem, feedConfig: FeedConfig): NewsSignal {
  const id = Buffer.from(item.guid || item.link)
    .toString("base64url")
    .slice(0, 24);

  return {
    id: `news_${id}`,
    title: item.title,
    category: determineCategory(item),
    timestamp: item.pubDate,
    source: feedConfig.name,
    sourceUrl: item.link,
    summary: item.description,
    importance: scoreItem(item, feedConfig),
    personalRelevance: 0,
    confirmed: false,
    imageUrl: item.imageUrl,
    tags: item.categories.slice(0, 5),
  };
}

export async function getNews(): Promise<NewsFetchResult> {
  const { items: rawItems, errors } = await fetchAllFeeds();

  const signals = rawItems.map((item) => {
    const fallback: FeedConfig = { name: "Unknown", url: item.link, quality: 0.5 };
    const feedConfig = RSS_FEEDS.find((f) =>
      item.link.includes(new URL(f.url).hostname)
    ) ?? fallback;
    return toNewsSignal(item, feedConfig);
  });

  const deduplicated = deduplicateItems(signals);

  deduplicated.sort((a, b) => b.importance - a.importance);

  return { items: deduplicated, errors };
}

export async function getTopSignals(limit = 10): Promise<NewsSignal[]> {
  const { items } = await getNews();
  return items.slice(0, limit);
}

export async function getDeduplicatedEvents(): Promise<DeduplicatedEvent[]> {
  const { items } = await getNews();
  const eventMap = new Map<string, DeduplicatedEvent>();

  for (const signal of items) {
    const normalized = normalizeTitle(signal.title).slice(0, 40);

    const existing = eventMap.get(normalized);
    if (existing) {
      existing.sourceCount += 1;
      existing.sources.push({
        name: signal.source,
        url: signal.sourceUrl,
        quality: RSS_FEEDS.find((f) => f.name === signal.source)?.quality ?? 0.5,
      });
      existing.importance = Math.max(existing.importance, signal.importance);
      if (new Date(signal.timestamp) > new Date(existing.latestUpdate)) {
        existing.latestUpdate = signal.timestamp;
      }
    } else {
      eventMap.set(normalized, {
        id: `evt_${signal.id}`,
        title: signal.title,
        description: signal.summary,
        category: signal.category,
        importance: signal.importance,
        sourceCount: 1,
        sources: [
          {
            name: signal.source,
            url: signal.sourceUrl,
            quality: RSS_FEEDS.find((f) => f.name === signal.source)?.quality ?? 0.5,
          },
        ],
        latestUpdate: signal.timestamp,
      });
    }
  }

  return Array.from(eventMap.values())
    .filter((e) => e.sourceCount > 1)
    .sort((a, b) => b.importance - a.importance);
}
