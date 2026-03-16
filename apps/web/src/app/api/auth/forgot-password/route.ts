import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { generateResetToken } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Please provide an email" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "No user found with that email" },
        { status: 404 }
      );
    }

    const { resetToken, hashedToken, expiry } = generateResetToken();

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = expiry;
    await user.save();

    // In production, send email with reset link
    // For now, return the token directly (dev only)
    const resetUrl = `${process.env.NEXT_PUBLIC_API_URL}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      success: true,
      message: "Password reset token generated",
      resetUrl, // Remove in production — send via email instead
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 }
    );
  }
}
