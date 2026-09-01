import { NextRequest, NextResponse } from "next/server";
import { Copilot, type CopilotRequest, type DeepResearchRequest, type RecommendationRequest } from "@/lib/ai/copilot";

// ─── POST /api/copilot ──────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...payload } = body;

    switch (action) {
      case "chat": {
        const chatPayload = payload as { message: string; context?: CopilotRequest["context"]; stream?: boolean };

        if (!chatPayload.message || typeof chatPayload.message !== "string") {
          return NextResponse.json(
            { error: "Missing or invalid 'message' field" },
            { status: 400 }
          );
        }

        const copilotRequest: CopilotRequest = {
          message: chatPayload.message,
          context: chatPayload.context,
        };

        if (chatPayload.stream) {
          const stream = await Copilot.processMessageStream(copilotRequest);
          return new Response(stream, {
            headers: {
              "Content-Type": "text/plain; charset=utf-8",
              "Transfer-Encoding": "chunked",
            },
          });
        }

        const response = await Copilot.processMessage(copilotRequest);
        return NextResponse.json(response);
      }

      case "recommendations": {
        const recPayload = payload as RecommendationRequest;

        if (!recPayload.profile) {
          return NextResponse.json(
            { error: "Missing 'profile' field" },
            { status: 400 }
          );
        }

        const result = await Copilot.generateRecommendations(recPayload);
        return NextResponse.json({ reply: result });
      }

      case "deep-research": {
        const researchPayload = payload as DeepResearchRequest;

        if (!researchPayload.topic || typeof researchPayload.topic !== "string") {
          return NextResponse.json(
            { error: "Missing or invalid 'topic' field" },
            { status: 400 }
          );
        }

        const result = await Copilot.deepResearch(researchPayload);
        return NextResponse.json({ reply: result });
      }

      default:
        return NextResponse.json(
          {
            error: `Unknown action: "${action}"`,
            validActions: ["chat", "recommendations", "deep-research"],
          },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("[Copilot API Error]", error);
    const message =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
