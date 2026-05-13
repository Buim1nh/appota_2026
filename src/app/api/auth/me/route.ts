import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongoose";
import { Session } from "@/models/Session";
import { User } from "@/models/User";

export async function GET() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const session = await Session.findOne({
      sessionToken,
      expires: { $gt: new Date() },
    }).populate("userId");

    if (!session || !session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const { passwordHash: _, ...userWithoutPassword } = session.userId.toObject();

    return NextResponse.json({ user: userWithoutPassword }, { status: 200 });
  } catch (error: any) {
    console.error("Me error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
