import OpenAI from "openai";

// ─── Types ──────────────────────────────────────────────

export type AIRole = "system" | "user" | "assistant";

export interface ChatMessage {
  role: AIRole;
  content: string;
}

export interface ChatOptions {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export interface ClassifyOptions {
  text: string;
  categories: string[];
  context?: string;
}

export interface SummarizeOptions {
  text: string;
  maxLength?: number;
  style?: "brief" | "detailed" | "bullet-points";
}

export interface CostEntry {
  model: string;
  inputTokens: number;
  outputTokens: number;
  timestamp: Date;
}

// ─── Model Routing ──────────────────────────────────────

const MODEL_TIERS = {
  classification: process.env.AI_MODEL_CLASSIFICATION || "gpt-4o-mini",
  summary: process.env.AI_MODEL_SUMMARY || "gpt-4o-mini",
  reasoning: process.env.AI_MODEL_REASONING || "gpt-4o",
} as const;

// ─── Local Fallback Intelligence ────────────────────────

const TECH_KNOWLEDGE: Record<string, string[]> = {
  programming: [
    "TypeScript continues to grow as the dominant language for large-scale web apps",
    "Rust is gaining traction for performance-critical backend services and WebAssembly",
    "Go remains the standard for cloud-native microservices",
    "Python leads in AI/ML but faces competition from Mojo for performance",
    "Zig is emerging as a C alternative for systems programming",
  ],
  ai: [
    "Large Language Models are shifting from general to domain-specific fine-tuning",
    "RAG (Retrieval Augmented Generation) is the standard for enterprise AI",
    "Edge AI and on-device inference are growing trends with Apple and Google",
    "AI agents and tool-use are becoming production-ready",
    "Multimodal models (text + vision + audio) are the new baseline",
  ],
  cloud: [
    "Kubernetes is mature but complexity drives adoption of simpler platforms",
    "Serverless-first architectures are gaining adoption for cost optimization",
    "Multi-cloud strategies are standard for enterprise",
    "Platform engineering is replacing traditional DevOps",
    "FinOps and cloud cost optimization are critical skills",
  ],
  career: [
    "Full-stack engineers with AI skills command premium salaries",
    "Platform engineering roles are among the fastest growing",
    "AI/ML engineering requires both ML theory and production engineering",
    "Security engineering demand outpaces supply",
    "Developer experience (DX) engineering is a growing specialty",
  ],
  frontend: [
    "React Server Components and Next.js App Router are the React standard",
    "Server-first frameworks are displacing client-side rendering",
    "Type-safe APIs with tRPC or Hono RPC reduce runtime errors",
    "Micro-frontends are adopted for large team organizations",
    "Web Components are gaining as a framework-agnostic standard",
  ],
  backend: [
    "Event-driven architectures with message queues are standard",
    "gRPC is replacing REST for internal service communication",
    "Edge computing is pushing logic closer to users",
    "Database-per-service is the microservices pattern",
    "GraphQL federation is mature for large APIs",
  ],
};

function classifyIntent(text: string): string {
  const lower = text.toLowerCase();
  const scores: Record<string, number> = {
    programming: 0,
    ai: 0,
    cloud: 0,
    career: 0,
    frontend: 0,
    backend: 0,
  };

  const programmingTerms = ["language", "code", "programming", "typescript", "javascript", "rust", "python", "go", "java"];
  const aiTerms = ["ai", "machine learning", "ml", "llm", "gpt", "model", "neural", "deep learning", "nlp"];
  const cloudTerms = ["cloud", "aws", "azure", "gcp", "kubernetes", "docker", "serverless", "infrastructure"];
  const careerTerms = ["career", "job", "salary", "hiring", "interview", "role", "position", "resume", "portfolio"];
  const frontendTerms = ["frontend", "react", "nextjs", "css", "ui", "ux", "design", "component", "browser"];
  const backendTerms = ["backend", "api", "database", "server", "microservice", "rest", "graphql", "auth"];

  for (const term of programmingTerms) { if (lower.includes(term)) scores.programming += 1; }
  for (const term of aiTerms) { if (lower.includes(term)) scores.ai += 1; }
  for (const term of cloudTerms) { if (lower.includes(term)) scores.cloud += 1; }
  for (const term of careerTerms) { if (lower.includes(term)) scores.career += 1; }
  for (const term of frontendTerms) { if (lower.includes(term)) scores.frontend += 1; }
  for (const term of backendTerms) { if (lower.includes(term)) scores.backend += 1; }

  let maxCategory = "programming";
  let maxScore = 0;
  for (const [category, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      maxCategory = category;
    }
  }
  return maxCategory;
}

function generateLocalResponse(text: string): string {
  const category = classifyIntent(text);
  const facts = TECH_KNOWLEDGE[category] || TECH_KNOWLEDGE.programming;
  const selectedFacts = facts.slice(0, 3);

  return (
    `Based on my analysis of your question about "${category}", here's what I can share:\n\n` +
    selectedFacts.map((f) => `• ${f}`).join("\n") +
    "\n\nFor deeper analysis, configure an OPENAI_API_KEY in your .env file."
  );
}

function generateLocalClassification(text: string, categories: string[]): string {
  const lower = text.toLowerCase();
  let bestMatch = categories[0] || "general";
  let bestScore = 0;

  for (const cat of categories) {
    const words = cat.toLowerCase().split(/[\s_-]+/);
    let score = 0;
    for (const word of words) {
      if (lower.includes(word)) score += 2;
    }
    if (lower.includes(cat.toLowerCase())) score += 5;
    if (score > bestScore) {
      bestScore = score;
      bestMatch = cat;
    }
  }

  return bestMatch;
}

function generateLocalSummary(text: string, style: "brief" | "detailed" | "bullet-points"): string {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0);

  if (style === "brief") {
    return sentences.slice(0, 2).join(". ").trim() + ".";
  }
  if (style === "bullet-points") {
    return sentences.slice(0, 5).map((s) => `• ${s.trim()}`).join("\n");
  }
  return sentences.slice(0, 4).join(". ").trim() + ".";
}

// ─── Cost Tracker ───────────────────────────────────────

class CostTracker {
  private entries: CostEntry[] = [];

  track(model: string, inputTokens: number, outputTokens: number): void {
    this.entries.push({
      model,
      inputTokens,
      outputTokens,
      timestamp: new Date(),
    });
  }

  getTotal(): { inputTokens: number; outputTokens: number; estimatedCostUSD: number } {
    let inputTokens = 0;
    let outputTokens = 0;

    for (const entry of this.entries) {
      inputTokens += entry.inputTokens;
      outputTokens += entry.outputTokens;
    }

    return {
      inputTokens,
      outputTokens,
      estimatedCostUSD: this.estimateCost(inputTokens, outputTokens),
    };
  }

  private estimateCost(input: number, output: number): number {
    const inputCostPer1K = 0.00015;
    const outputCostPer1K = 0.0006;
    return (input / 1000) * inputCostPer1K + (output / 1000) * outputCostPer1K;
  }

  clear(): void {
    this.entries = [];
  }
}

// ─── AI Provider ────────────────────────────────────────

class AIProviderImpl {
  private client: OpenAI | null = null;
  public costs: CostTracker;

  constructor() {
    this.costs = new CostTracker();
    const apiKey = process.env.OPENAI_API_KEY;
    if (apiKey) {
      this.client = new OpenAI({ apiKey });
    }
  }

  get isAvailable(): boolean {
    return this.client !== null;
  }

  private estimateTokens(text: string): number {
    return Math.ceil(text.length / 4);
  }

  async chat(options: ChatOptions): Promise<string> {
    if (!this.client) {
      const lastUser = options.messages.filter((m) => m.role === "user").pop();
      const userText = lastUser?.content || "";
      return generateLocalResponse(userText);
    }

    const model = options.model || MODEL_TIERS.reasoning;
    const response = await this.client.chat.completions.create({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
    });

    const content = response.choices[0]?.message?.content || "";
    if (response.usage) {
      this.costs.track(model, response.usage.prompt_tokens, response.usage.completion_tokens);
    }
    return content;
  }

  async chatStream(options: ChatOptions): Promise<ReadableStream<string>> {
    if (!this.client) {
      const lastUser = options.messages.filter((m) => m.role === "user").pop();
      const userText = lastUser?.content || "";
      const response = generateLocalResponse(userText);
      return new ReadableStream({
        start(controller) {
          const words = response.split(" ");
          for (let i = 0; i < words.length; i++) {
            controller.enqueue((i > 0 ? " " : "") + words[i]);
          }
          controller.close();
        },
      });
    }

    const model = options.model || MODEL_TIERS.reasoning;
    const stream = await this.client.chat.completions.create({
      model,
      messages: options.messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 1024,
      stream: true,
    });

    const modelRef = model;
    const costTracker = this.costs;
    return new ReadableStream({
      async start(controller) {
        let inputTokens = 0;
        let outputTokens = 0;
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(delta);
          if (chunk.usage) {
            inputTokens = chunk.usage.prompt_tokens;
            outputTokens = chunk.usage.completion_tokens;
          }
        }
        costTracker.track(modelRef, inputTokens, outputTokens);
        controller.close();
      },
    });
  }

  async summarize(options: SummarizeOptions): Promise<string> {
    const model = MODEL_TIERS.summary;

    if (!this.client) {
      return generateLocalSummary(options.text, options.style || "brief");
    }

    const styleInstructions: Record<string, string> = {
      brief: "Provide a concise 2-3 sentence summary.",
      detailed: "Provide a detailed paragraph summary covering all key points.",
      "bullet-points": "Provide a bullet-point list of the 5 most important points.",
    };

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `You are a summarization assistant. ${styleInstructions[options.style || "brief"]} Focus on facts and key insights. Do not add opinions.`,
      },
      { role: "user", content: options.text },
    ];

    return this.chat({ messages, model, maxTokens: 512, temperature: 0.3 });
  }

  async classify(options: ClassifyOptions): Promise<string> {
    const model = MODEL_TIERS.classification;

    if (!this.client) {
      return generateLocalClassification(options.text, options.categories);
    }

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: `Classify the following text into exactly one of these categories: ${options.categories.join(", ")}.${options.context ? ` Context: ${options.context}` : ""} Respond with ONLY the category name, nothing else.`,
      },
      { role: "user", content: options.text },
    ];

    const result = await this.chat({ messages, model, maxTokens: 20, temperature: 0 });
    return result.trim().replace(/["']/g, "");
  }
}

// ─── Singleton ──────────────────────────────────────────

export const AIProvider = new AIProviderImpl();
