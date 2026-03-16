import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Scheme from "@/models/Scheme";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); // Fix incorrect import path

    const { schemeId, draftData } = await req.json();

    if (!schemeId) {
      return NextResponse.json(
        { message: "Scheme ID is required" },
        { status: 400 },
      );
    }

    // Verify scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) {
      return NextResponse.json(
        { message: "Scheme not found" },
        { status: 404 },
      );
    }

    // Check if draft already exists for this user and scheme
    let application = await Application.findOne({
      citizenId: user.profile,
      schemeId: schemeId,
      status: "draft",
    });

    if (application) {
      // Update existing draft
      application.draftData = draftData;
      await application.save();
    } else {
      // Create new draft
      application = await Application.create({
        citizenId: user.profile,
        schemeId: schemeId,
        status: "draft",
        draftData: draftData,
        appliedAt: new Date(),
      });
    }

    return NextResponse.json({
      success: true,
      message: "Draft saved successfully",
      application,
    });
  } catch (error: any) {
    console.error("Error saving draft:", error);
    return NextResponse.json(
      { message: error.message || "Error saving draft" },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect(); // Fix incorrect import path

    const { searchParams } = new URL(req.url);
    const schemeId = searchParams.get("schemeId");

    if (!schemeId) {
      return NextResponse.json(
        { message: "Scheme ID is required" },
        { status: 400 },
      );
    }

    // Find draft for this user and scheme
    const draft = await Application.findOne({
      citizenId: user.profile,
      schemeId: schemeId,
      status: "draft",
    }).populate("schemeId", "schemeName category description benefitAmount");

    if (!draft) {
      return NextResponse.json({ message: "No draft found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      draft,
    });
  } catch (error: any) {
    console.error("Error fetching draft:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching draft" },
      { status: 500 },
    );
  }
}
