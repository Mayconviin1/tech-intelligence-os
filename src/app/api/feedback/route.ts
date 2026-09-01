import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth-helpers";

const VALID_TYPES = [
  "RELEVANT",
  "NOT_RELEVANT",
  "SAVE",
  "IMPORTANT",
  "DONT_SHOW",
];

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();

    if (!body.type || !body.targetId || !body.targetType) {
      return NextResponse.json(
        { error: "Missing required fields: type, targetId, targetType" },
        { status: 400 }
      );
    }

    if (!VALID_TYPES.includes(body.type)) {
      return NextResponse.json(
        { error: `Invalid feedback type. Must be one of: ${VALID_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    const feedback = await db.userFeedback.create({
      data: {
        userId,
        type: body.type,
        targetId: body.targetId,
        targetType: body.targetType,
      },
    });

    return NextResponse.json({ data: feedback }, { status: 201 });
  } catch (error) {
    console.error("[FeedbackAPI] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500 }
    );
  }
}
