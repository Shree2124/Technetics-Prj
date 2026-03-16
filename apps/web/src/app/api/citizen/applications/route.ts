import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Application from "@/models/Application";
import ApplicationDocument from "@/models/ApplicationDocument";

export async function GET(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build query
    const query: any = { citizenId: user.profile };
    if (status && status !== 'all') {
      query.status = status;
    }

    // Get applications with pagination
    const applications = await Application.find(query)
      .populate('schemeId', 'schemeName category benefitAmount eligibility')
      .populate('documents')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    // Get total count
    const total = await Application.countDocuments(query);

    // Get draft count
    const draftCount = await Application.countDocuments({
      citizenId: user.profile,
      status: "draft"
    });

    return NextResponse.json({
      success: true,
      applications,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      draftCount
    });

  } catch (error: any) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { message: error.message || "Error fetching applications" },
      { status: 500 }
    );
  }
}
