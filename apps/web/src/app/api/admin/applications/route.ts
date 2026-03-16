import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Application from "@/models/Application";
import CitizenProfile from "@/models/CitizenProfile";
import User from "@/models/User";
import Scheme from "@/models/Scheme";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 403 },
      );
    }

    const applications = await Application.find({ status: { $ne: "draft" } })
      .populate({ path: "userId", model: User, select: "name email" })
      .populate({ path: "schemeId", model: Scheme, select: "name" })
      .sort({ appliedAt: -1 });

    const applicationsWithProfiles = await Promise.all(
      applications.map(async (app) => {
        const profile = await CitizenProfile.findOne({
          userId: app.userId._id,
        });
        return {
          ...app.toObject(),
          profile: profile ? profile.toObject() : null,
        };
      }),
    );

    return NextResponse.json({
      success: true,
      applications: applicationsWithProfiles,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
