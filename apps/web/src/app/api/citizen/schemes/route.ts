import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Scheme from "@/models/Scheme";
import CitizenProfile from "@/models/CitizenProfile";
import Application from "@/models/Application";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Get citizen profile
    const citizenProfile = await CitizenProfile.findById(user.profile);
    if (!citizenProfile) {
      return NextResponse.json({ message: "Citizen profile not found" }, { status: 404 });
    }

    // Get all active schemes
    const schemes = await Scheme.find({ active: true });

    // Get user's existing applications
    const existingApplications = await Application.find({
      citizenId: user.profile,
      status: { $ne: "draft" }
    }).select('schemeId');

    const appliedSchemeIds = existingApplications.map(app => app.schemeId);

    // Filter and categorize schemes
    const availableSchemes = schemes.map(scheme => {
      const isEligible = checkEligibility(scheme.eligibility, citizenProfile);
      const hasApplied = appliedSchemeIds.includes(scheme._id);
      
      return {
        ...scheme.toObject(),
        isEligible,
        hasApplied,
        eligibilityReasons: getEligibilityReasons(scheme.eligibility, citizenProfile)
      };
    });

    // Categorize schemes
    const eligibleSchemes = availableSchemes.filter(s => s.isEligible && !s.hasApplied);
    const ineligibleSchemes = availableSchemes.filter(s => !s.isEligible);
    const appliedSchemes = availableSchemes.filter(s => s.hasApplied);

    return NextResponse.json({
      success: true,
      schemes: {
        eligible: eligibleSchemes,
        ineligible: ineligibleSchemes,
        applied: appliedSchemes
      },
      totalSchemes: schemes.length,
      eligibleCount: eligibleSchemes.length,
      appliedCount: appliedSchemes.length
    });

  } catch (error: any) {
    console.error("Error fetching schemes:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching schemes" },
      { status: 500 }
    );
  }
}

function checkEligibility(eligibility: any, profile: any): boolean {
  if (!eligibility) return true;

  if (eligibility.minAge && profile.age < eligibility.minAge) return false;
  if (eligibility.maxAge && profile.age > eligibility.maxAge) return false;
  if (eligibility.maxIncome && profile.income > eligibility.maxIncome) return false;
  if (eligibility.ruralOnly && !profile.ruralFlag) return false;
  if (eligibility.minFamilySize && profile.familySize < eligibility.minFamilySize) return false;

  return true;
}

function getEligibilityReasons(eligibility: any, profile: any): string[] {
  const reasons: string[] = [];
  
  if (!eligibility) return reasons;

  if (eligibility.minAge && profile.age < eligibility.minAge) {
    reasons.push(`Age must be at least ${eligibility.minAge} years`);
  }
  
  if (eligibility.maxAge && profile.age > eligibility.maxAge) {
    reasons.push(`Age must be at most ${eligibility.maxAge} years`);
  }
  
  if (eligibility.maxIncome && profile.income > eligibility.maxIncome) {
    reasons.push(`Income must be at most ₹${eligibility.maxIncome.toLocaleString()}`);
  }
  
  if (eligibility.ruralOnly && !profile.ruralFlag) {
    reasons.push("This scheme is only for rural citizens");
  }
  
  if (eligibility.minFamilySize && profile.familySize < eligibility.minFamilySize) {
    reasons.push(`Family size must be at least ${eligibility.minFamilySize} members`);
  }

  return reasons;
}
