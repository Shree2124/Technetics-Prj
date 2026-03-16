import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import VerifierProfile from "@/models/VerifierProfile";
import { getCurrentUser } from "@/lib/auth";

// GET a specific citizen's detailed profile
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const resolvedParams = await params;
    
    const citizen = await CitizenProfile.findById(resolvedParams.id).populate("userId", "email name");
    if (!citizen) {
      return NextResponse.json({ success: false, message: "Citizen not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, citizen });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}

// PUT to approve or reject
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 });
    }

    const { status, remarks } = await req.json();

    if (!["verified", "rejected"].includes(status)) {
      return NextResponse.json({ success: false, message: "Invalid status" }, { status: 400 });
    }

    const resolvedParams = await params;

    // Update the citizen profile status
    const citizen = await CitizenProfile.findByIdAndUpdate(
      resolvedParams.id,
      { $set: { verificationStatus: status } }, // We can store remarks if we add it to the schema later
      { new: true }
    );

    if (!citizen) {
      return NextResponse.json({ success: false, message: "Citizen not found" }, { status: 404 });
    }

    // Add exactly this citizen to this verifier's record
    if (status === "verified") {
      await VerifierProfile.findOneAndUpdate(
        { userId: currentUser._id },
        { $addToSet: { verifiedCitizens: citizen._id } }
      );
    }

    return NextResponse.json({ success: true, citizen });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message || "Server error" }, { status: 500 });
  }
}
