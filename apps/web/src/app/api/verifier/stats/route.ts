import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import VerifierProfile from "@/models/VerifierProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    // 1. Get total pending for this verifier
    const pendingCount = await CitizenProfile.countDocuments({
      verificationStatus: "pending",
      verifierId: currentUser._id,
    });

    // 2. Get today's processed verifications (by this verifier)
    // We would need to track verification history for "today's processed" accurately,
    // but for now we fallback to the total verified Citizens by this verifier
    const verifierProfile = await VerifierProfile.findOne({
      userId: currentUser._id,
    });
    const verifiedCount = verifierProfile
      ? verifierProfile.verifiedCitizens.length
      : 0;

    // 3. Flagged issues for this verifier
    const flaggedCount = await CitizenProfile.countDocuments({
      verificationStatus: "pending",
      verifierId: currentUser._id,
      vulnerabilityScore: { $gte: 80 },
    });

    return NextResponse.json({
      success: true,
      stats: {
        pendingCount,
        verifiedCount,
        flaggedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
