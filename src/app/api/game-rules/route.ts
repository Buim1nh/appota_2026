import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongoose";
import { GameRule } from "@/models";

const allowedCategories = new Set([
  "class",
  "subclass",
  "race",
  "subrace",
  "background",
  "feat",
]);

/**
 * GET /api/game-rules
 * Fetch GameRules with optional filtering by category and parentRef.
 * Query params: ?category=class&parentRef=<id>
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const parentRef = searchParams.get("parentRef");

    const filter: Record<string, unknown> = {};

    if (category) {
      if (!allowedCategories.has(category)) {
        return NextResponse.json(
          { error: "Invalid category filter" },
          { status: 400 }
        );
      }

      filter.category = category;
    }

    if (parentRef) {
      filter.parentRef = parentRef;
    }

    const rules = await GameRule.find(filter).sort({ name: 1 }).lean();

    return NextResponse.json({ data: rules }, { status: 200 });
  } catch (error) {
    console.error("Error fetching game rules:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
