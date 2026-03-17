import { NextResponse, NextRequest } from "next/server";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import CitizenProfile from "@/models/CitizenProfile";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
    }

    const { searchParams } = new URL(req.url);
    const citizenId = searchParams.get("citizenId");

    if (!citizenId) {
      return NextResponse.json(
        { success: false, message: "Citizen ID is required" },
        { status: 400 },
      );
    }

    const citizen = await CitizenProfile.findById(citizenId);

    if (!citizen) {
      return NextResponse.json(
        { success: false, message: "Citizen not found" },
        { status: 404 },
      );
    }

    // Call the AI service
    const aiServiceUrl = process.env.AI_SERVICE_URL || "http://127.0.0.1:8000";
    const response = await axios.post(
      `${aiServiceUrl}/ai/scheme-recommendations`,
      {
        income: citizen.income,
        employment_status: citizen.employmentStatus,
        family_size: citizen.familySize,
        education_level: citizen.educationLevel,
        health_condition: citizen.healthCondition ? 1 : 0,
        housing_type: citizen.housingType,
        disaster_risk: citizen.disasterRisk,
      },
    );

    return NextResponse.json({
      success: true,
      recommendations: response.data.recommendations,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Server error" },
      { status: 500 },
    );
  }
}
