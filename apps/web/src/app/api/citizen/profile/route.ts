import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "citizen") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Citizen access required" },
        { status: 403 },
      );
    }

    const profile = await CitizenProfile.findOne({ userId: currentUser._id });
    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "citizen") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Citizen access required" },
        { status: 403 },
      );
    }

    const updates = await req.json();

    // Prevent citizens from changing verification status
    delete updates.verificationStatus;
    delete updates.user;

    const profile = await CitizenProfile.findOneAndUpdate(
      { userId: currentUser._id },
      updates,
      { new: true, runValidators: true },
    );

    if (!profile) {
      return NextResponse.json(
        { success: false, message: "Profile not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
