import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import mongoose from "mongoose";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || !["admin", "verifier"].includes(user.role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const schemesWithApplicants = await Application.aggregate([
      {
        $group: {
          _id: "$schemeId",
          applicants: { $push: "$$ROOT" },
        },
      },
      {
        $lookup: {
          from: "schemes",
          localField: "_id",
          foreignField: "_id",
          as: "schemeDetails",
        },
      },
      {
        $unwind: "$schemeDetails",
      },
      {
        $unwind: "$applicants",
      },
      {
        $lookup: {
          from: "citizenprofiles",
          localField: "applicants.citizenId",
          foreignField: "_id",
          as: "applicants.citizenDetails",
        },
      },
      {
        $unwind: "$applicants.citizenDetails",
      },
      {
        $group: {
          _id: "$_id",
          schemeDetails: { $first: "$schemeDetails" },
          applicants: { $push: "$applicants" },
        },
      },
      {
        $project: {
          _id: 0,
          scheme: "$schemeDetails",
          applicants: 1,
        },
      },
    ]);

    return NextResponse.json(schemesWithApplicants);
  } catch (error) {
    if (error instanceof mongoose.Error) {
      return NextResponse.json(
        { message: "Mongoose Error", error: error.message },
        { status: 500 },
      );
    }
    return NextResponse.json(
      { message: "Error fetching schemes with applicants", error },
      { status: 500 },
    );
  }
}
