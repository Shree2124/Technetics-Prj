import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import Scheme from "@/models/Scheme";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const body = await req.json();
    const newScheme = new Scheme(body);
    const savedScheme = await newScheme.save();
    return NextResponse.json(savedScheme, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { message: "Error creating scheme", error },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !["admin", "verifier", "citizen"].includes(user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const schemes = await Scheme.find({}).sort({ createdAt: -1 });
    return NextResponse.json(schemes);
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching schemes", error },
      { status: 500 },
    );
  }
}
