import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Verifier access required" },
        { status: 403 }
      );
    }

    const unverified = await CitizenProfile.find({
      verificationStatus: "pending",
    }).populate("user", "name email");

    return NextResponse.json({ success: true, citizens: unverified });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
