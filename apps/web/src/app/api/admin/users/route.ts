import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
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
    const role = searchParams.get("role"); // "verifier" | "citizen"
    const search = searchParams.get("search");

    const filter: any = {};
    if (role) filter.role = role;

    let users = await User.find(filter).select("-password").sort({ createdAt: -1 }).lean();

    // Search by name or email
    if (search) {
      const q = search.toLowerCase();
      users = users.filter(
        (u: any) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q)
      );
    }

    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { userId, action } = body; // action: "verify" | "unverify" | "delete" | "change_role"

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: "userId and action are required" },
        { status: 400 }
      );
    }

    if (action === "delete") {
      await User.findByIdAndDelete(userId);
      return NextResponse.json({ success: true, message: "User deleted" });
    }

    if (action === "verify") {
      const user = await User.findByIdAndUpdate(userId, { isVerified: true }, { new: true }).select("-password");
      return NextResponse.json({ success: true, user });
    }

    if (action === "unverify") {
      const user = await User.findByIdAndUpdate(userId, { isVerified: false }, { new: true }).select("-password");
      return NextResponse.json({ success: true, user });
    }

    if (action === "edit" && (body.name || body.email)) {
      const updateData: any = {};
      if (body.name) updateData.name = body.name;
      if (body.email) updateData.email = body.email;
      const user = await User.findByIdAndUpdate(userId, updateData, { new: true }).select("-password");
      return NextResponse.json({ success: true, user });
    }

    if (action === "change_role" && body.newRole) {
      const user = await User.findByIdAndUpdate(userId, { role: body.newRole }, { new: true }).select("-password");
      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
