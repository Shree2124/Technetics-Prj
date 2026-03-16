import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Scheme from "@/models/Scheme";
import CitizenProfile from "@/models/CitizenProfile";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { schemeId, applicationData, documents } = await req.json();

    if (!schemeId) {
      return NextResponse.json({ message: "Scheme ID is required" }, { status: 400 });
    }

    // Verify scheme exists and is active
    const scheme = await Scheme.findById(schemeId);
    if (!scheme || !scheme.active) {
      return NextResponse.json({ message: "Scheme not available" }, { status: 404 });
    }

    // Get citizen profile
    const citizenProfile = await CitizenProfile.findById(user.profile);
    if (!citizenProfile) {
      return NextResponse.json({ message: "Citizen profile not found" }, { status: 404 });
    }

    // Check eligibility (basic validation)
    const eligibilityErrors = [];
    
    if (scheme.eligibility.minAge && citizenProfile.age < scheme.eligibility.minAge) {
      eligibilityErrors.push(`Age must be at least ${scheme.eligibility.minAge}`);
    }
    
    if (scheme.eligibility.maxAge && citizenProfile.age > scheme.eligibility.maxAge) {
      eligibilityErrors.push(`Age must be at most ${scheme.eligibility.maxAge}`);
    }
    
    if (scheme.eligibility.maxIncome && citizenProfile.income > scheme.eligibility.maxIncome) {
      eligibilityErrors.push(`Income must be at most ${scheme.eligibility.maxIncome}`);
    }
    
    if (scheme.eligibility.ruralOnly && !citizenProfile.ruralFlag) {
      eligibilityErrors.push("This scheme is only for rural citizens");
    }
    
    if (scheme.eligibility.minFamilySize && citizenProfile.familySize < scheme.eligibility.minFamilySize) {
      eligibilityErrors.push(`Family size must be at least ${scheme.eligibility.minFamilySize}`);
    }

    if (eligibilityErrors.length > 0) {
      return NextResponse.json({
        message: "Eligibility requirements not met",
        errors: eligibilityErrors
      }, { status: 400 });
    }

    // Check if application already exists (not in draft status)
    const existingApplication = await Application.findOne({
      citizenId: user.profile,
      schemeId: schemeId,
      status: { $ne: "draft" }
    });

    if (existingApplication) {
      return NextResponse.json({
        message: "You have already applied for this scheme",
        application: existingApplication
      }, { status: 400 });
    }

    // Create or update application
    let application;
    
    // Try to find existing draft
    const draft = await Application.findOne({
      citizenId: user.profile,
      schemeId: schemeId,
      status: "draft"
    });

    if (draft) {
      // Update draft to submitted
      application = await Application.findByIdAndUpdate(
        draft._id,
        {
          status: "submitted",
          submittedAt: new Date(),
          draftData: undefined, // Clear draft data
          documents: documents || []
        },
        { new: true }
      );
    } else {
      // Create new application
      application = await Application.create({
        citizenId: user.profile,
        schemeId: schemeId,
        status: "submitted",
        submittedAt: new Date(),
        appliedAt: new Date(),
        documents: documents || []
      });
    }

    // Populate the response with scheme details
    await application.populate('schemeId', 'schemeName category benefitAmount');

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully",
      application
    });

  } catch (error: any) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { message: error.message || "Error submitting application" },
      { status: 500 }
    );
  }
}
