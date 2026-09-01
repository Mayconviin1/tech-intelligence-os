import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUserId } from "@/lib/auth-helpers";

const VALID_STATUSES = ["SAVED", "APPLIED", "INTERVIEW", "TECHNICAL_TEST", "OFFER", "REJECTED", "WITHDRAWN"] as const;

export async function GET() {
  try {
    const userId = getCurrentUserId();

    const applications = await db.jobApplication.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("[ApplicationsAPI] GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();
    const { jobId, status, notes, salary, contact, nextAction, title, company, location, url } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const existing = await db.jobApplication.findFirst({
      where: { userId, jobId },
    });

    if (existing) {
      return NextResponse.json({ error: "Application already exists for this job" }, { status: 409 });
    }

    // Ensure JobListing exists
    await db.jobListing.upsert({
      where: { id: jobId },
      update: {},
      create: {
        id: jobId,
        title: title || "Unknown Position",
        company: company || "Unknown Company",
        location: location || null,
        url: url || "#",
        publishedAt: new Date(),
      },
    });

    const application = await db.jobApplication.create({
      data: {
        jobId,
        userId,
        status: status || "SAVED",
        notes: notes || null,
        salary: salary || null,
        contact: contact || null,
        nextAction: nextAction || null,
        appliedAt: status === "APPLIED" ? new Date() : null,
      },
      include: { job: true },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error) {
    console.error("[ApplicationsAPI] POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const body = await request.json();
    const { id, status, notes, salary, contact, nextAction } = body;

    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    if (status && !VALID_STATUSES.includes(status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }

    const existing = await db.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};
    if (status !== undefined) {
      updateData.status = status;
      if (status === "APPLIED" && !existing.appliedAt) {
        updateData.appliedAt = new Date();
      }
    }
    if (notes !== undefined) updateData.notes = notes;
    if (salary !== undefined) updateData.salary = salary;
    if (contact !== undefined) updateData.contact = contact;
    if (nextAction !== undefined) updateData.nextAction = nextAction;

    const application = await db.jobApplication.update({
      where: { id },
      data: updateData,
      include: { job: true },
    });

    return NextResponse.json(application);
  } catch (error) {
    console.error("[ApplicationsAPI] PATCH Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "id query param is required" }, { status: 400 });
    }

    const existing = await db.jobApplication.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    await db.jobApplication.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ApplicationsAPI] DELETE Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
