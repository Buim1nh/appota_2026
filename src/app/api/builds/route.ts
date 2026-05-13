// GET  /api/builds       → list all builds (optional ?userId= filter)
// POST /api/builds       → create a new build

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import { Build } from "@/models/Build";
// Import referenced models so Mongoose registers their schemas for populate()
import "@/models/GameRule";
import "@/models/Item";
import "@/models/Spell";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isPublic = searchParams.get("public");
    const tag = searchParams.get("tag");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;
    if (isPublic === "true") filter.isPublic = true;
    if (tag) filter.tags = tag;

    const [data, total] = await Promise.all([
      Build.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("classRef", "name category")
        .populate("raceRef", "name category")
        .lean(),
      Build.countDocuments(filter),
    ]);

    return Response.json({ data, total, page, limit });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();
    const build = await Build.create(body);
    return Response.json({ data: build }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
