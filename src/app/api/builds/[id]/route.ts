// GET    /api/builds/:id   → fetch a single build (by _id or shareId)
// PUT    /api/builds/:id   → update a build (owner only)
// DELETE /api/builds/:id   → delete a build (owner only)

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/mongoose";
import { Build } from "@/models/Build";
import { validateUpdateBuild } from "@/lib/validate-build";
// Register referenced models so populate() works
import "@/models/GameRule";
import "@/models/Item";
import "@/models/Spell";

/**
 * Helper to apply populate chain.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function populateBuild(query: mongoose.Query<any, any>) {
  return query
    .populate("classRef", "name category description modifiers")
    .populate("subclassId", "name category description modifiers")
    .populate("raceRef", "name category description modifiers")
    .populate("backgroundRef", "name category description modifiers")
    .populate("equipment.head")
    .populate("equipment.chest")
    .populate("equipment.mainHand")
    .populate("equipment.offHand")
    .populate("equipment.ring1")
    .populate("equipment.ring2")
    .populate("equipment.amulet")
    .populate("spells")
    .populate("feats", "name category description modifiers")
    .lean();
}

/**
 * Resolve the `id` param: try ObjectId first, fall back to shareId lookup.
 */
async function findBuildByIdOrShareId(id: string) {
  if (mongoose.Types.ObjectId.isValid(id)) {
    const build = await populateBuild(Build.findById(id));
    if (build) return build;
  }
  // Fall back: treat id as shareId
  return populateBuild(Build.findOne({ shareId: id }));
}

/* ── GET /api/builds/:id ───────────────────────────────────────────── */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const build = await findBuildByIdOrShareId(id);
    if (!build) {
      return Response.json({ error: "Build not found." }, { status: 404 });
    }

    return Response.json({ data: build });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}

/* ── PUT /api/builds/:id ───────────────────────────────────────────── */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Validate payload
    const validation = validateUpdateBuild(body);
    if (!validation.valid) {
      return Response.json(
        { error: "Validation failed.", details: validation.errors },
        { status: 400 }
      );
    }

    // Find the existing build
    const existing = await Build.findById(id);
    if (!existing) {
      return Response.json({ error: "Build not found." }, { status: 404 });
    }

    // Ownership check
    if (existing.userId.toString() !== body.userId) {
      return Response.json(
        { error: "Forbidden: you do not own this build." },
        { status: 403 }
      );
    }

    // Strip immutable fields from the update payload
    const updateData = { ...body };
    delete updateData.userId;
    delete updateData.shareId;
    delete updateData._id;

    const updated = await Build.findByIdAndUpdate(
      id,
      { $set: updateData },
      { returnDocument: "after", runValidators: true }
    )
      .populate("classRef", "name category")
      .populate("subclassId", "name category")
      .populate("raceRef", "name category")
      .populate("backgroundRef", "name category")
      .lean();

    return Response.json({ data: updated });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}

/* ── DELETE /api/builds/:id ────────────────────────────────────────── */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!body.userId) {
      return Response.json(
        { error: "userId is required for deletion." },
        { status: 400 }
      );
    }

    const existing = await Build.findById(id);
    if (!existing) {
      return Response.json({ error: "Build not found." }, { status: 404 });
    }

    // Ownership check
    if (existing.userId.toString() !== body.userId) {
      return Response.json(
        { error: "Forbidden: you do not own this build." },
        { status: 403 }
      );
    }

    await Build.findByIdAndDelete(id);

    return Response.json({ message: "Build deleted successfully." });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 500 });
  }
}
