import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const userId = getCurrentUserId();

    const items = await db.savedItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: items });
  } catch (error) {
    console.error("[SavedAPI] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();

    const item = await db.savedItem.create({
      data: {
        userId,
        url: body.url,
        title: body.title,
        description: body.description,
        category: body.category,
        tags: body.tags,
        technology: body.technology,
        summary: body.summary,
        importance: body.importance,
        itemType: body.itemType,
        content: body.content,
      },
    });

    return NextResponse.json({ data: item }, { status: 201 });
  } catch (error) {
    console.error("[SavedAPI] POST Error:", error);
    return NextResponse.json(
      { error: "Failed to save item" },
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

    const existing = await db.savedItem.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Saved item not found" },
        { status: 404 }
      );
    }

    await db.savedItem.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[SavedAPI] DELETE Error:", error);
    return NextResponse.json(
      { error: "Failed to delete saved item" },
      { status: 500 }
    );
  }
}
