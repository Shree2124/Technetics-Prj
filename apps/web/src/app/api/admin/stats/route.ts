import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import User from "@/models/User";
import Scheme from "@/models/Scheme";
import Application from "@/models/Application";

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

    const [
      totalCitizens,
      activeSchemes,
      totalApplications,
      pendingCount,
      underReviewCount,
      verifiedCount,
      approvedCount,
      rejectedCount,
      flaggedCount,
    ] = await Promise.all([
      User.countDocuments({ role: "citizen" }),
      Scheme.countDocuments({ active: true }),
      Application.countDocuments(),
      Application.countDocuments({ status: "submitted" }),
      Application.countDocuments({ status: "under_review" }),
      Application.countDocuments({ status: "verified" }),
      Application.countDocuments({ status: "approved" }),
      Application.countDocuments({ status: "rejected" }),
      Application.countDocuments({ status: "fraud_flagged" }),
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        totalCitizens,
        activeSchemes,
        totalApplications,
        pendingCount,
        underReviewCount,
        verifiedCount,
        approvedCount,
        rejectedCount,
        flaggedCount,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
