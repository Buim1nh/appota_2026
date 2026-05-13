// GET  /api/spells   → list / search spells
// POST /api/spells   → create a new spell

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import { Spell } from "@/models/Spell";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const level = searchParams.get("level");
    const school = searchParams.get("school");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (q) filter.$text = { $search: q };
    if (level !== null && level !== undefined) filter.level = Number(level);
    if (school) filter.school = school;

    const [data, total] = await Promise.all([
      Spell.find(filter).sort({ level: 1, name: 1 }).skip(skip).limit(limit).lean(),
      Spell.countDocuments(filter),
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
    const spell = await Spell.create(body);
    return Response.json({ data: spell }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
