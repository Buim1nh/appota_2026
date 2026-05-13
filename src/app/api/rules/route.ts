// GET  /api/rules   → list game rules (classes, races, backgrounds, feats)
// POST /api/rules   → create a new game rule

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import { GameRule } from "@/models/GameRule";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category"); // "class" | "race" | "feat" | …
    const parentRef = searchParams.get("parentRef");
    const source = searchParams.get("source");
    const edition = searchParams.get("edition");

    const filter: Record<string, unknown> = {};
    if (category) filter.category = category;
    if (parentRef) filter.parentRef = parentRef;
    if (source) filter.source = source;
    if (edition) filter.edition = edition;

    const data = await GameRule.find(filter).sort({ category: 1, name: 1 }).lean();

    return Response.json({ data, total: data.length });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const rule = await GameRule.create(body);
    return Response.json({ data: rule }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
