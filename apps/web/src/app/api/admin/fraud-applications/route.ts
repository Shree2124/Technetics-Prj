import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Application from "@/models/Application";
import User from "@/models/User";
import Scheme from "@/models/Scheme";

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

    const fraudApplications = await Application.find({ status: "fraud_flagged" })
      .sort({ fraudScore: -1 })
      .limit(10)
      .populate({ path: "userId", model: User, select: "name email" })
      .populate({ path: "schemeId", model: Scheme, select: "name" });

    return NextResponse.json({ success: true, applications: fraudApplications });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
