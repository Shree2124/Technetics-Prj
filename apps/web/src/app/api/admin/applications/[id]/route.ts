import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import Application from "@/models/Application";
import CitizenProfile from "@/models/CitizenProfile";
import Scheme from "@/models/Scheme";
import User from "@/models/User";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;

    const application = await Application.findById(id)
      .populate({
        path: "citizenId",
        populate: { path: "userId", model: "User", select: "name email" },
      })
      .populate("schemeId")
      .populate("assignedVerifier", "name email")
      .lean();

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const body = await req.json();
    const { action } = body; // "approve" | "reject" | "flag_fraud"

    const updateData: any = {};

    switch (action) {
      case "approve":
        updateData.status = "approved";
        updateData.adminApprovedAt = new Date();
        break;
      case "reject":
        updateData.status = "rejected";
        break;
      case "flag_fraud":
        updateData.status = "fraud_flagged";
        break;
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }

    const application = await Application.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    )
      .populate({
        path: "citizenId",
        populate: { path: "userId", model: "User", select: "name email" },
      })
      .populate("schemeId", "schemeName category benefitAmount");

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
