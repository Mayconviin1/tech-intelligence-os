import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth-helpers";

export async function GET() {
  try {
    const userId = getCurrentUserId();

    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: notifications });
  } catch (error) {
    console.error("[NotificationsAPI] GET Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();

    if (body.markAll) {
      await db.notification.updateMany({
        where: { userId, read: false },
        data: { read: true },
      });

      return NextResponse.json({ success: true });
    }

    if (!body.id) {
      return NextResponse.json(
        { error: "Missing required field: id or markAll" },
        { status: 400 }
      );
    }

    const existing = await db.notification.findFirst({
      where: { id: body.id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Notification not found" },
        { status: 404 }
      );
    }

    const updated = await db.notification.update({
      where: { id: body.id },
      data: { read: true },
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error("[NotificationsAPI] PATCH Error:", error);
    return NextResponse.json(
      { error: "Failed to update notification" },
      { status: 500 }
    );
  }
}
