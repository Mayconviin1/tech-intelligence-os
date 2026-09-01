import { AIProvider, type ChatMessage } from "./provider";

// ─── System Prompt ──────────────────────────────────────

const COPILOT_SYSTEM_PROMPT = `You are the Tech Intelligence OS Copilot — an expert advisor on technology trends, software engineering careers, and the tech industry. You are knowledgeable, concise, and actionable.

## Your Expertise
- **Technology Trends**: You track emerging technologies, adoption curves, and market signals across AI/ML, cloud, DevOps, cybersecurity, frontend, backend, and mobile.
- **Career Strategy**: You advise on career paths, skill development, salary negotiation, job search, interview preparation, and portfolio building.
- **Job Market**: You understand hiring patterns, company cultures, remote work trends, and compensation benchmarks across global tech markets.
- **Learning Paths**: You recommend personalized learning resources, certifications, and project ideas based on skill gaps.
- **Industry Analysis**: You evaluate companies, startups, open-source projects, and emerging ecosystems.

## Response Style
- Be direct and actionable. No fluff.
- Use bullet points for multiple items.
- Include specific technologies, tools, and companies when relevant.
- When discussing trends, mention concrete signals (funding, adoption, job postings).
- If you don't know something specific, say so clearly rather than guessing.
- Adapt depth to the question: quick questions get quick answers, complex questions get thorough analysis.

## Knowledge Boundaries
- Your training data has a cutoff. Acknowledge when something may be outdated.
- You don't have real-time data unless provided in context.
- For company-specific info, provide general patterns unless you have specific knowledge.
- You are not a substitute for professional career coaching or legal/financial advice.`;

// ─── Types ──────────────────────────────────────────────

export interface CopilotRequest {
  message: string;
  context?: {
    userInterests?: string[];
    recentActivity?: string[];
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  };
}

export interface CopilotResponse {
  reply: string;
  model: string;
  tokens?: { input: number; output: number };
  sources?: Array<{ title: string; url: string }>;
}

export interface RecommendationRequest {
  profile: {
    interests: string[];
    skills: string[];
    experienceLevel: string;
    goals?: string[];
  };
  count?: number;
}

export interface DeepResearchRequest {
  topic: string;
  context?: string;
  steps?: number;
}

// ─── Copilot Service ────────────────────────────────────

class CopilotService {
  async processMessage(request: CopilotRequest): Promise<CopilotResponse> {
    const messages: ChatMessage[] = [
      { role: "system", content: COPILOT_SYSTEM_PROMPT },
    ];

    if (request.context?.conversationHistory) {
      for (const msg of request.context.conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    let contextNote = "";
    if (request.context?.userInterests?.length) {
      contextNote += `User interests: ${request.context.userInterests.join(", ")}. `;
    }
    if (request.context?.recentActivity?.length) {
      contextNote += `Recent activity: ${request.context.recentActivity.join("; ")}. `;
    }

    const userContent = contextNote
      ? `${contextNote}\n\nUser message: ${request.message}`
      : request.message;

    messages.push({ role: "user", content: userContent });

    const reply = await AIProvider.chat({
      messages,
      temperature: 0.7,
      maxTokens: 1500,
    });

    return {
      reply,
      model: "local-fallback",
    };
  }

  async processMessageStream(request: CopilotRequest): Promise<ReadableStream<string>> {
    const messages: ChatMessage[] = [
      { role: "system", content: COPILOT_SYSTEM_PROMPT },
    ];

    if (request.context?.conversationHistory) {
      for (const msg of request.context.conversationHistory) {
        messages.push({ role: msg.role, content: msg.content });
      }
    }

    messages.push({ role: "user", content: request.message });

    return AIProvider.chatStream({
      messages,
      temperature: 0.7,
      maxTokens: 1500,
    });
  }

  async generateRecommendations(request: RecommendationRequest): Promise<string> {
    const { profile, count = 5 } = request;

    const messages: ChatMessage[] = [
      {
        role: "system",
        content: COPILOT_SYSTEM_PROMPT + "\n\nYou generate personalized tech recommendations. Return a JSON array with objects containing: type (READ|LEARN|APPLY|ATTEND|FOLLOW|BUILD), title, reason, and optional url.",
      },
      {
        role: "user",
        content: `Generate ${count} personalized recommendations for a tech professional with the following profile:

Skills: ${profile.skills.join(", ") || "Not specified"}
Interests: ${profile.interests.join(", ") || "Not specified"}
Experience Level: ${profile.experienceLevel}
Goals: ${profile.goals?.join(", ") || "Not specified"}

Provide actionable recommendations across different types (learning, reading, projects, events). Be specific with technology names, course titles, and company names.`,
      },
    ];

    return AIProvider.chat({
      messages,
      temperature: 0.8,
      maxTokens: 2000,
    });
  }

  async deepResearch(request: DeepResearchRequest): Promise<string> {
    const { topic, context, steps = 3 } = request;

    const findings: string[] = [];

    for (let step = 0; step < steps; step++) {
      const stepPrompt =
        step === 0
          ? `Research the following topic: "${topic}". ${context ? `Additional context: ${context}` : ""} Provide a comprehensive overview covering: current state, key players, recent developments, and future outlook.`
          : step === 1
            ? `Based on the initial research on "${topic}", dive deeper into the most important aspects. Focus on: practical implications, specific technologies/companies involved, market signals, and actionable insights.`
            : `Final analysis of "${topic}". Synthesize the findings into a clear summary with: key takeaways, recommended actions, risks to watch, and related opportunities.`;

      const messages: ChatMessage[] = [
        {
          role: "system",
          content: COPILOT_SYSTEM_PROMPT + "\n\nYou are conducting deep research. Be thorough and cite specific examples, companies, and technologies.",
        },
        {
          role: "user",
          content: stepPrompt + (findings.length > 0 ? `\n\nPrevious findings:\n${findings.join("\n")}` : ""),
        },
      ];

      const result = await AIProvider.chat({
        messages,
        temperature: 0.6,
        maxTokens: 1500,
      });

      findings.push(`### Step ${step + 1}\n${result}`);
    }

    return findings.join("\n\n---\n\n");
  }
}

// ─── Singleton ──────────────────────────────────────────

export const Copilot = new CopilotService();
