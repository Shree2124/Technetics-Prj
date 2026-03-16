import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import CitizenProfile from "@/models/CitizenProfile";
import VerifierProfile from "@/models/VerifierProfile";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get all users without profiles
    const usersWithoutProfiles = await User.find({
      $or: [
        { profile: { $exists: false } },
        { profile: null }
      ]
    });

    let updatedCount = 0;
    const errors = [];

    for (const user of usersWithoutProfiles) {
      try {
        if (user.role === "citizen") {
          // Check if citizen profile already exists
          const existingProfile = await CitizenProfile.findOne({ userId: user._id });
          if (!existingProfile) {
            const profile = await CitizenProfile.create({
              userId: user._id,
              income: 50000,
              employment_status: "unemployed",
              family_size: 4,
              education_level: "primary",
              health_condition: false,
              housing_type: "temporary",
              disaster_risk: "medium",
              address: "Default Address",
              district: "Default District",
              verificationStatus: "pending"
            });
            
            user.profile = profile._id;
            await user.save();
            updatedCount++;
          }
        } else if (user.role === "verifier") {
          // Check if verifier profile already exists
          const existingProfile = await VerifierProfile.findOne({ userId: user._id });
          if (!existingProfile) {
            const profile = await VerifierProfile.create({
              userId: user._id,
              department: "Social Welfare",
              region: "Central",
              designation: "Officer",
              isActive: true,
              verifiedCitizens: []
            });
            
            user.profile = profile._id;
            await user.save();
            updatedCount++;
          }
        }
      } catch (error: any) {
        errors.push({
          userId: user._id,
          email: user.email,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedCount} users with profiles`,
      totalUsersProcessed: usersWithoutProfiles.length,
      updatedCount,
      errors: errors.length > 0 ? errors : null
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
