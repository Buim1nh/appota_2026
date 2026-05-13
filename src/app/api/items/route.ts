// GET  /api/items   → list / search items
// POST /api/items   → create a new item

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongoose";
import { Item } from "@/models/Item";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q"); // text search
    const type = searchParams.get("type");
    const rarity = searchParams.get("rarity");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    const filter: Record<string, unknown> = {};
    if (q) filter.$text = { $search: q };
    if (type) filter.type = type;
    if (rarity) filter.rarity = rarity;

    const [data, total] = await Promise.all([
      Item.find(filter).sort({ name: 1 }).skip(skip).limit(limit).lean(),
      Item.countDocuments(filter),
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
    const item = await Item.create(body);
    return Response.json({ data: item }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
