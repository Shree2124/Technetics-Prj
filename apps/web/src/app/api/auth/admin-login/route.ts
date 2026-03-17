import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import { generateToken, setAuthCookie } from "@/lib/auth";
import User from "@/models/User";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password, remember } = await req.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Check against hardcoded admin credentials
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 },
      );
    }

    // Create or find admin user
    let user = await User.findOne({ email: adminEmail });
    if (!user) {
      // Create admin user if not exists
      user = new User({
        name: "Admin",
        email: adminEmail,
        password: adminPassword,
        role: "admin",
      });
      await user.save();
    }

    // Generate token and set cookie
    const token = generateToken(user._id.toString(), user.role);
    await setAuthCookie(token, remember);

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
