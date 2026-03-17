import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dbConnect from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import CitizenProfile from "@/models/CitizenProfile";
import Scheme from "@/models/Scheme";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function GET(req: NextRequest) {
  if (!process.env.GEMINI_API_KEY) {
    return NextResponse.json(
      { error: "Gemini API key is not configured." },
      { status: 500 },
    );
  }

  try {
    await dbConnect();
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [citizen, schemes] = await Promise.all([
      CitizenProfile.findOne({ userId: user.id }).lean(),
      Scheme.find({ active: true }).lean(),
    ]);

    if (!citizen) {
      return NextResponse.json(
        { error: "Citizen profile not found" },
        { status: 404 },
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

    const prompt = `
      Based on the following citizen's profile, recommend the most relevant scheme categories from the provided list. Return only a comma-separated list of the category names.

      **Citizen Profile:**
      - Age: ${citizen.age || "N/A"}
      - Income: ${citizen.income || "N/A"}
      - Employment Status: ${citizen.employmentStatus || "N/A"}
      - Family Size: ${citizen.familySize || "N/A"}
      - Education Level: ${citizen.educationLevel || "N/A"}
      - Disability: ${citizen.disability ? "Yes" : "No"}
      - Housing: Lives in a ${citizen.ruralFlag ? "rural" : "urban"} area.
      - Vulnerability Score: ${citizen.vulnerabilityScore || "N/A"}/100

      **Available Scheme Categories:**
      ${[...new Set(schemes.map((s: any) => s.category))].join(", ")}

      **Recommended Categories (comma-separated):**
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    const recommendedCategories = text.split(",").map((c: string) => c.trim());

    const recommendedSchemes = schemes.filter((scheme: any) =>
      recommendedCategories.includes(scheme.category),
    );

    return NextResponse.json({
      success: true,
      recommendations: recommendedSchemes,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: "Failed to generate recommendations", details: error.message },
      { status: 500 },
    );
  }
}
