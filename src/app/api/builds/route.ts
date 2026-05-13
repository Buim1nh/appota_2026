// GET  /api/builds       → list builds (paginated, filterable, searchable)
// POST /api/builds       → create a new build (with validation + auto shareId)

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import connectDB from "@/lib/mongoose";
import { Build } from "@/models/Build";
import { GameRule } from "@/models/GameRule";
import { User } from "@/models/User";
import { validateCreateBuild } from "@/lib/validate-build";
// Import referenced models so Mongoose registers their schemas for populate()
import "@/models/Item";
import "@/models/Spell";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const isPublic = searchParams.get("public");
    const tag = searchParams.get("tag");
    const search = searchParams.get("search");
    const classRef = searchParams.get("classRef");
    const page = Math.max(1, Number(searchParams.get("page") ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get("limit") ?? 20)));
    const skip = (page - 1) * limit;

    // Build filter
    const filter: Record<string, unknown> = {};
    if (userId) filter.userId = userId;
    if (isPublic === "true") filter.isPublic = true;
    if (tag) filter.tags = tag;
    if (classRef) filter.classRef = classRef;
    if (search) filter.name = { $regex: search, $options: "i" };

    const [data, total] = await Promise.all([
      Build.find(filter)
        .sort({ updatedAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("classRef", "name category")
        .populate("subclassId", "name category")
        .populate("raceRef", "name category")
        .populate("backgroundRef", "name category")
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

    // Validate payload
    const validation = validateCreateBuild(body);
    if (!validation.valid) {
      return Response.json(
        { error: "Validation failed.", details: validation.errors },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findById(body.userId).lean();
    if (!user) {
      return Response.json(
        { error: "User not found.", details: ["The provided userId does not exist."] },
        { status: 404 }
      );
    }

    // Verify classRef exists as a "class" GameRule (optional for initial creation)
    if (body.classRef) {
      const classRule = await GameRule.findById(body.classRef).lean();
      if (!classRule) {
        return Response.json(
          { error: "Validation failed.", details: ["classRef does not reference a valid GameRule."] },
          { status: 400 }
        );
      }
    }

    // Verify raceRef exists as a "race" GameRule (optional for initial creation)
    if (body.raceRef) {
      const raceRule = await GameRule.findById(body.raceRef).lean();
      if (!raceRule) {
        return Response.json(
          { error: "Validation failed.", details: ["raceRef does not reference a valid GameRule."] },
          { status: 400 }
        );
      }
    }

    // Auto-generate shareId if not provided
    if (!body.shareId) {
      body.shareId = nanoid(12);
    }

    // Ensure userId is an ObjectId
    body.userId = new mongoose.Types.ObjectId(body.userId as string);

    const build = await Build.create(body);

    // Return with populated references
    const populated = await Build.findById(build._id)
      .populate("classRef", "name category")
      .populate("subclassId", "name category")
      .populate("raceRef", "name category")
      .populate("backgroundRef", "name category")
      .lean();

    return Response.json({ data: populated }, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
