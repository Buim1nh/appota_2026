import { NextResponse } from "next/server";
import { getBuildByIdentifier } from "@/lib/build-details";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  const { id } = await params;
  const build = await getBuildByIdentifier(id);

  if (!build) {
    return NextResponse.json({ error: "Build not found" }, { status: 404 });
  }

  return NextResponse.json({ data: build }, { status: 200 });
}
import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongoose";
import { Build } from "@/models";

/**
 * GET /api/builds/[id]
 * Fetch a specific build by _id or shareId, with populated references.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectMongoDB();

    const { id } = await params;

    // Try to find by _id first, then by shareId
    let build = await Build.findById(id)
      .populate("classRef")
      .populate("raceRef")
      .populate("subclassId")
      .populate("backgroundRef")
      .populate("spells")
      .populate("feats")
      .populate("equipment.head")
      .populate("equipment.chest")
      .populate("equipment.mainHand")
      .populate("equipment.offHand")
      .populate("equipment.ring1")
      .populate("equipment.ring2")
      .populate("equipment.amulet")
      .lean();

    // If not found by _id, try by shareId
    if (!build) {
      build = await Build.findOne({ shareId: id })
        .populate("classRef")
        .populate("raceRef")
        .populate("subclassId")
        .populate("backgroundRef")
        .populate("spells")
        .populate("feats")
        .populate("equipment.head")
        .populate("equipment.chest")
        .populate("equipment.mainHand")
        .populate("equipment.offHand")
        .populate("equipment.ring1")
        .populate("equipment.ring2")
        .populate("equipment.amulet")
        .lean();
    }

    if (!build) {
      return NextResponse.json(
        { error: "Build not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(build, { status: 200 });
  } catch (error) {
    console.error("Error fetching build:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
