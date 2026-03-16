import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import VerifierProfile from "@/models/VerifierProfile";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Verifier access required" },
        { status: 403 },
      );
    }

    const { citizenProfileId, status } = await req.json();

    if (!citizenProfileId || !["verified", "rejected"].includes(status)) {
      return NextResponse.json(
        {
          success: false,
          message: "Provide citizenProfileId and status (verified/rejected)",
        },
        { status: 400 },
      );
    }

    const citizenProfile = await CitizenProfile.findById(citizenProfileId);
    if (!citizenProfile) {
      return NextResponse.json(
        { success: false, message: "Citizen profile not found" },
        { status: 404 },
      );
    }

    citizenProfile.verificationStatus = status;
    await citizenProfile.save();

    if (status === "verified") {
      await VerifierProfile.findOneAndUpdate(
        { userId: currentUser._id },
        { $addToSet: { verifiedCitizens: citizenProfile.userId } },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Citizen profile ${status} successfully`,
      profile: citizenProfile,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
