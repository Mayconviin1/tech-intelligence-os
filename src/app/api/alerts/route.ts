import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const userId = getCurrentUserId();

    const alerts = await db.alertRule.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: alerts });
  } catch (error) {
    console.error("[AlertsAPI] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch alert rules" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();

    if (!body.type || !body.query) {
      return NextResponse.json(
        { error: "Missing required fields: type, query" },
        { status: 400 }
      );
    }

    const alert = await db.alertRule.create({
      data: {
        userId,
        type: body.type,
        query: body.query,
        frequency: body.frequency,
      },
    });

    return NextResponse.json({ data: alert }, { status: 201 });
  } catch (error) {
    console.error("[AlertsAPI] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to create alert rule" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing required parameter: id" },
        { status: 400 }
      );
    }

    const existing = await db.alertRule.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Alert rule not found" },
        { status: 404 }
      );
    }

    await db.alertRule.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[AlertsAPI] DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete alert rule" },
      { status: 500 }
    );
  }
}
