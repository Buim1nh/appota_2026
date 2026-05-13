import { NextRequest, NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongoose";
import { Build } from "@/models";
import type { IBuild } from "@/types/database";

/**
 * GET /api/builds
 * Fetch public builds with search, filtering, and pagination.
 * Query params: ?name=<search>&classRef=<id>&raceRef=<id>&level=<num>&page=1&limit=10
 */
export async function GET(request: NextRequest) {
  try {
    await connectMongoDB();

    const searchParams = request.nextUrl.searchParams;
    const name = searchParams.get("name") || "";
    const classRef = searchParams.get("classRef");
    const raceRef = searchParams.get("raceRef");
    const level = searchParams.get("level");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);

    const filter: Record<string, unknown> = { isPublic: true };

    if (name.trim()) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (classRef) {
      filter.classRef = classRef;
    }

    if (raceRef) {
      filter.raceRef = raceRef;
    }

    if (level) {
      filter.level = parseInt(level, 10);
    }

    const skip = (page - 1) * limit;
    const total = await Build.countDocuments(filter);
    const builds = await Build.find(filter)
      .populate("classRef", "name category")
      .populate("raceRef", "name category")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(
      {
        data: builds,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching builds:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/builds
 * Create a new build document.
 */
// Trong file api/builds/route.ts - Hàm POST

// Trong file api/builds/route.ts

export async function POST(request: NextRequest) {
  try {
    await connectMongoDB();
    
    // Ép kiểu body ngay từ đầu để tránh lỗi implicit any
    const body = await request.json();

    if (!body.name || !body.classRef || !body.raceRef || !body.level) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const sanitizedEquipment = body.equipment 
      ? Object.fromEntries(
          Object.entries(body.equipment).map(([key, value]) => [
            key, 
            value && value !== "" ? value : undefined
          ])
        )
      : {};

    const shareId = `build-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Sử dụng destructuring để loại bỏ các trường không mong muốn
    const { _id, createdAt, updatedAt, ...restOfBody } = body;

    const buildToSave = {
      ...restOfBody,
      equipment: sanitizedEquipment,
      shareId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newBuild = new Build(buildToSave);
    await newBuild.save();

    return NextResponse.json(newBuild, { status: 201 });

  } catch (error: unknown) { // Chuyển thành unknown
    // Kiểm tra xem error có thuộc class Error không
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    
    console.error("Mongoose Error:", errorMessage);
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}