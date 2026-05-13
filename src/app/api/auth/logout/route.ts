import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/mongoose";
import { Session } from "@/models/Session";

export async function POST() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (sessionToken) {
      await Session.deleteOne({ sessionToken });
      cookieStore.delete("session_token");
    }

    return NextResponse.json({ message: "Logged out successfully" }, { status: 200 });
  } catch (error: any) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
