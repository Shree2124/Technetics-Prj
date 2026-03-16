import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import User from "@/models/User";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "citizen") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Citizen access required" },
        { status: 403 },
      );
    }

    // Upsert: create a blank profile if one doesn't exist yet
    let profile = await CitizenProfile.findOne({ userId: currentUser._id });
    if (!profile) {
      profile = await CitizenProfile.create({ userId: currentUser._id });
      // Link profile to user document
      await User.findByIdAndUpdate(currentUser._id, { profile: profile._id });
    }

    // Map profile back to frontend shape
    const mappedProfile = {
      ...profile.toObject(),
      phoneNumber: profile.phone,
      family_size: profile.familySize,
      employment_status: profile.employmentStatus,
      education_level: profile.educationLevel,
      health_condition: profile.healthCondition,
      district: profile.address?.district,
      address: profile.address?.village, // or full address
      state: profile.address?.state,
      pincode: profile.address?.pincode,
    };

    return NextResponse.json({ success: true, profile: mappedProfile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "citizen") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Citizen access required" },
        { status: 403 },
      );
    }

    const updates = await req.json();

    // Map frontend specific shape to Mongoose schema shape
    const mappedUpdates: any = {
      phone: updates.phoneNumber,
      age: updates.age,
      gender: updates.gender,
      income: updates.income,
      employmentStatus: updates.employment_status,
      familySize: updates.family_size,
      educationLevel: updates.education_level,
      healthCondition: updates.health_condition,
      disability: updates.disability,
      propertyOwned: updates.propertyOwned,
      bankAccount: updates.bankAccount,
      ruralFlag: updates.ruralFlag,
    };

    // Nest address fields correctly
    if (updates.address || updates.district || updates.state || updates.pincode || updates.village) {
      mappedUpdates.address = {
        state: updates.state,
        district: updates.district,
        village: updates.village,
        pincode: updates.pincode,
        // The frontend currently passes the full address string in `address`
        // We'll store it in village or as a new field if needed. 
        // For now, let's store it in `village` if we don't have a separate fullAddress field.
        ...(updates.address && { village: updates.address })
      };
    }

    // Clean up undefined values from mappedUpdates
    Object.keys(mappedUpdates).forEach(key => {
      if (mappedUpdates[key] === undefined) {
        delete mappedUpdates[key];
      }
    });

    const profile = await CitizenProfile.findOneAndUpdate(
      { userId: currentUser._id },
      { $set: mappedUpdates },
      { new: true, runValidators: true, upsert: true },
    );

    // Ensure user.profile reference is linked
    if (profile && !currentUser.profile) {
      await User.findByIdAndUpdate(currentUser._id, { profile: profile._id });
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
