import { NextRequest, NextResponse } from "next/server";
import { getJobs, getJobMatches } from "@/lib/providers/jobs";
import type { JobCategory, Eligibility } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const mode = searchParams.get("mode") || "all";
    const category = searchParams.get("category") as JobCategory | null;
    const minMatchScore = searchParams.get("minMatchScore");
    const eligibility = searchParams.get("eligibility") as Eligibility | null;
    const technologies = searchParams.get("technologies");
    const limit = searchParams.get("limit");
    const offset = searchParams.get("offset");

    if (mode === "matches") {
      const matches = await getJobMatches({
        category: category || undefined,
        minMatchScore: minMatchScore ? parseInt(minMatchScore, 10) : undefined,
        eligibility: eligibility || undefined,
        technologies: technologies ? technologies.split(",").map((t) => t.trim()) : undefined,
      });

      return NextResponse.json({
        data: matches,
        meta: {
          total: matches.length,
          mode: "matches",
        },
      });
    }

    const jobs = await getJobs({
      category: category || undefined,
      limit: limit ? parseInt(limit, 10) : 50,
      offset: offset ? parseInt(offset, 10) : 0,
    });

    return NextResponse.json({
      data: jobs,
      meta: {
        total: jobs.length,
        mode: "all",
      },
    });
  } catch (error) {
    console.error("[JobsAPI] Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        message: error instanceof Error ? error.message : "Failed to fetch jobs",
        statusCode: 500,
      },
      { status: 500 }
    );
  }
}
