import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import CitizenProfile from "@/models/CitizenProfile";
import VerifierProfile from "@/models/VerifierProfile";
import { generateToken, setAuthCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Please provide name, email, and password" },
        { status: 400 },
      );
    }

    const validRoles = ["admin", "verifier", "citizen"];
    const userRole = validRoles.includes(role) ? role : "citizen";

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 400 },
      );
    }

    const user = await User.create({ name, email, password, role: userRole });

    // Create profile based on role
    if (userRole === "citizen") {
      const profile = await CitizenProfile.create({ user: user._id });
      user.profile = profile._id as any;
      await user.save();
    } else if (userRole === "verifier") {
      const profile = await VerifierProfile.create({ user: user._id });
      user.profile = profile._id as any;
      await user.save();
    }

    const token = generateToken(String(user._id), user.role);
    await setAuthCookie(token);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
