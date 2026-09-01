import { NextResponse } from "next/server";
import { getNews, getTopSignals } from "@/lib/providers/news";

export const dynamic = "force-dynamic";
export const revalidate = 300;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const topOnly = searchParams.get("top") === "true";
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit") || "50", 10), 1), 100);

  try {
    if (topOnly) {
      const signals = await getTopSignals(Math.min(limit, 10));
      return NextResponse.json({ data: signals });
    }

    const result = await getNews();
    return NextResponse.json({
      data: result.items.slice(0, limit),
      meta: {
        total: result.items.length,
        returned: Math.min(limit, result.items.length),
        errors: result.errors,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Failed to fetch news",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
