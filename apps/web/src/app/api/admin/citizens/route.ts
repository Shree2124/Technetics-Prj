import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import CitizenProfile from "@/models/CitizenProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const citizens = await User.find({ role: "citizen" }).select("-password");
    const profiles = await CitizenProfile.find().populate("user", "-password");

    return NextResponse.json({ success: true, citizens, profiles });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
