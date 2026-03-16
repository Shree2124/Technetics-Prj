import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Application from "@/models/Application";
import CitizenProfile from "@/models/CitizenProfile";
import Scheme from "@/models/Scheme";
import User from "@/models/User";

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

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);

    // Build query filter
    const filter: any = { status: { $ne: "draft" } };
    if (status && status !== "all") {
      filter.status = status;
    }

    // Get applications with populated refs
    let applications = await Application.find(filter)
      .populate({ path: "userId", model: User, select: "name email" })
      .populate({ path: "schemeId", model: Scheme, select: "name" })
      .sort({ appliedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // If search is provided, filter in memory after population
    if (search) {
      const q = search.toLowerCase();
      applications = applications.filter((app: any) => {
        const userName = app.userId?.name?.toLowerCase() || "";
        const userEmail = app.userId?.email?.toLowerCase() || "";
        const schemeName = app.schemeId?.name?.toLowerCase() || "";
        return (
          userName.includes(q) ||
          userEmail.includes(q) ||
          schemeName.includes(q)
        );
      });
    }

    const totalCount = await Application.countDocuments(filter);

    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
