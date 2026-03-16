import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import ApplicationDocument from "@/models/ApplicationDocument";
import Scheme from "@/models/Scheme";
import CitizenProfile from "@/models/CitizenProfile";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const application = await Application.findOne({
      _id: params.id,
      citizenId: user.profile
    })
      .populate('schemeId', 'schemeName category description benefitAmount eligibility active')
      .populate('documents')
      .populate('assignedVerifier', 'name email');

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      application
    });

  } catch (error: any) {
    console.error("Error fetching application:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching application" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const application = await Application.findOne({
      _id: params.id,
      citizenId: user.profile
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    // Only allow updating draft applications
    if (application.status !== "draft") {
      return NextResponse.json({ 
        message: "Cannot update submitted application" 
      }, { status: 400 });
    }

    const { draftData } = await req.json();

    application.draftData = draftData;
    await application.save();

    return NextResponse.json({
      success: true,
      message: "Draft updated successfully",
      application
    });

  } catch (error: any) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { message: error.message || "Error updating application" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const application = await Application.findOne({
      _id: params.id,
      citizenId: user.profile
    });

    if (!application) {
      return NextResponse.json({ message: "Application not found" }, { status: 404 });
    }

    // Only allow deleting draft applications
    if (application.status !== "draft") {
      return NextResponse.json({ 
        message: "Cannot delete submitted application" 
      }, { status: 400 });
    }

    // Delete associated documents
    if (application.documents && application.documents.length > 0) {
      await ApplicationDocument.deleteMany({
        _id: { $in: application.documents }
      });
    }

    // Delete application
    await Application.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Application deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { message: error.message || "Error deleting application" },
      { status: 500 }
    );
  }
}
