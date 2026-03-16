import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import User from "@/models/User";
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

    // Upsert: create a blank profile if one doesn't exist yet
    let profile = await CitizenProfile.findOne({ userId: currentUser._id });
    if (!profile) {
      profile = await CitizenProfile.create({ userId: currentUser._id });
      // Link profile to user document
      await User.findByIdAndUpdate(currentUser._id, { profile: profile._id });
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

    // Prevent citizens from changing sensitive fields
    delete updates.verificationStatus;
    delete updates.vulnerabilityScore;
    delete updates.user;
    delete updates.userId;
    delete updates._id;

    const profile = await CitizenProfile.findOneAndUpdate(
      { userId: currentUser._id },
      { $set: updates },
      { new: true, runValidators: true, upsert: true },
    );

    // Ensure user.profile reference is linked
    if (profile && !currentUser.profile) {
      await User.findByIdAndUpdate(currentUser._id, { profile: profile._id });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
