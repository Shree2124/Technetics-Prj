import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import CitizenProfile from "@/models/CitizenProfile";
import User from "@/models/User";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const vulnerableCitizens = await CitizenProfile.find({})
      .sort({ vulnerabilityScore: -1 })
      .limit(10)
      .populate({ path: "userId", model: User, select: "name" });

    return NextResponse.json({ success: true, citizens: vulnerableCitizens });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
