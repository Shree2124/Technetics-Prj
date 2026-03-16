import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Scheme from "@/models/Scheme";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect(); // Fix incorrect import path usage

  try {
    const body = await req.json();
    const scheme = await Scheme.create(body);
    return NextResponse.json(scheme, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating scheme", error },
      { status: 500 },
    );
  }
}

export async function PUT(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "admin") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect(); // Fix incorrect import path usage

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const body = await req.json();
    const updatedScheme = await Scheme.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!updatedScheme) {
      return NextResponse.json(
        { message: "Scheme not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(updatedScheme);
  } catch (error) {
    return NextResponse.json(
      { message: "Error updating scheme", error },
      { status: 500 },
    );
  }
}
