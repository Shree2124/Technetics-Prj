import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import CitizenProfile from "@/models/CitizenProfile";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const verification = searchParams.get("verification"); // "pending" | "verified" | "rejected"

    // Get all citizens with their profiles
    const citizens = await User.find({ role: "citizen" }).select("-password").sort({ createdAt: -1 }).lean();

    // Get all citizen profiles
    const profiles = await CitizenProfile.find().lean();

    // Merge citizen user data with their profile
    let merged = citizens.map((citizen: any) => {
      const profile = profiles.find((p: any) => p.userId?.toString() === citizen._id?.toString());
      return {
        ...citizen,
        profile: profile || null,
      };
    });

    // Filter by verification status
    if (verification && verification !== "all") {
      merged = merged.filter((c: any) => {
        const status = c.profile?.verificationStatus || "pending";
        return status === verification;
      });
    }

    // Search filter
    if (search) {
      const q = search.toLowerCase();
      merged = merged.filter(
        (c: any) =>
          c.name?.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.profile?.phone?.toLowerCase().includes(q) ||
          c.profile?.address?.district?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, citizens: merged });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
