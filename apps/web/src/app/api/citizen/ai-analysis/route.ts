import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios from "axios";

const secret = process.env.JWT_SECRET;
const AI_BACKEND_URL = process.env.AI_BACKEND_URL || "http://localhost:8001";

export async function POST(req: NextRequest) {
  const token = await getToken({ req, secret });

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const citizenData = await req.json();

    const aiApi = axios.create({
      baseURL: AI_BACKEND_URL,
    });

    const [vulnRes, fraudRes, recRes] = await Promise.all([
      aiApi.post("/ai/vulnerability-score", citizenData),
      aiApi.post("/ai/fraud-detection", citizenData),
      aiApi.post("/ai/scheme-recommendations", citizenData),
    ]);

    const results = {
      vulnerability: vulnRes.data,
      fraud: fraudRes.data,
      recommendations: recRes.data.recommendations,
    };

    return NextResponse.json(results);
  } catch (error: any) {
    console.error("AI Analysis Proxy Error:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching AI analysis." },
      { status: 500 },
    );
  }
}
