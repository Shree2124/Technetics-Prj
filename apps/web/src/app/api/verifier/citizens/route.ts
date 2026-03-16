import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import CitizenProfile from "@/models/CitizenProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "verifier") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "pending";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // Base query
    const query: any = {};
    
    // Status filter
    if (status !== "all") {
      query.verificationStatus = status;
    }

    // Search filter (Aadhaar or FullName)
    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { aadhaarNumber: { $regex: search, $options: "i" } },
        { "address.district": { $regex: search, $options: "i" } }
      ];
    }

    const total = await CitizenProfile.countDocuments(query);
    const citizens = await CitizenProfile.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit)
      .populate("userId", "email"); // Bring in email if needed

    return NextResponse.json({
      success: true,
      data: citizens,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
