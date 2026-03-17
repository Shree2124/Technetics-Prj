import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Application from "@/models/Application";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "citizen") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const totalApplications = await Application.countDocuments({
      userId: user._id,
    });
    const pendingApplications = await Application.countDocuments({
      userId: user._id,
      status: "pending",
    });
    const approvedApplications = await Application.countDocuments({
      userId: user._id,
      status: "approved",
    });
    const rejectedApplications = await Application.countDocuments({
      userId: user._id,
      status: "rejected",
    });

    return NextResponse.json({
      stats: {
        total: totalApplications,
        pending: pendingApplications,
        approved: approvedApplications,
        rejected: rejectedApplications,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching citizen stats", error },
      { status: 500 },
    );
  }
}
