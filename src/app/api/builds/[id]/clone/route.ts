// POST /api/builds/:id/clone → clone a build into the requesting user's account

import { NextRequest } from "next/server";
import mongoose from "mongoose";
import { nanoid } from "nanoid";
import connectDB from "@/lib/mongoose";
import { Build } from "@/models/Build";
import { User } from "@/models/User";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    // Validate userId
    if (!body.userId || !mongoose.Types.ObjectId.isValid(body.userId)) {
      return Response.json(
        { error: "userId is required and must be a valid ObjectId." },
        { status: 400 }
      );
    }

    // Verify user exists
    const user = await User.findById(body.userId).lean();
    if (!user) {
      return Response.json({ error: "User not found." }, { status: 404 });
    }

    // Find source build
    const source = await Build.findById(id).lean();
    if (!source) {
      return Response.json(
        { error: "Source build not found." },
        { status: 404 }
      );
    }

    // Shallow clone: copy all fields, assign new identity
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id: _sourceId, __v: _version, ...sourceFields } = source;
    const cloneData = {
      ...sourceFields,
      _id: new mongoose.Types.ObjectId(),
      userId: new mongoose.Types.ObjectId(body.userId),
      name: `${source.name} (Copy)`,
      shareId: nanoid(12),
      isPublic: false,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const cloned = await Build.create(cloneData);

    return Response.json(
      { data: cloned, message: "Build cloned successfully." },
      { status: 201 }
    );
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return Response.json({ error: message }, { status: 400 });
  }
}
