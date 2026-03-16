import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { upload } from "@/lib/cloudinary";
import Application from "@/models/Application";
import ApplicationDocument from "@/models/ApplicationDocument";
import fs from "fs/promises";

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();

  if (!user || user.role !== "citizen") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  try {
    const data = await req.formData();
    const file = data.get("file") as File;
    const schemeId = data.get("schemeId") as string;
    const documentType = data.get("documentType") as string;

    if (!file) {
      return NextResponse.json(
        { message: "No file uploaded." },
        { status: 400 },
      );
    }

    // Temporarily save the file to the server
    const tempDir = "./temp";
    await fs.mkdir(tempDir, { recursive: true });
    const tempFilePath = `${tempDir}/${file.name}`;
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    // Wrap the upload logic in a middleware-like function
    const runMiddleware = (req: any, res: any, fn: any) => {
      return new Promise((resolve, reject) => {
        fn(req, res, (result: any) => {
          if (result instanceof Error) {
            return reject(result);
          }
          return resolve(result);
        });
      });
    };

    let uploadedFile: any;
    try {
      // Create a mock request object for multer
      const mockReq = {
        file: {
          path: tempFilePath,
          originalname: file.name,
        },
        body: req.body,
      };

      await runMiddleware(
        mockReq,
        new (require("http").ServerResponse)(mockReq),
        upload.single("file"),
      );
      uploadedFile = mockReq.file;

      const application = await Application.create({
        citizenId: user.profile,
        schemeId: schemeId,
      });

      const applicationDocument = await ApplicationDocument.create({
        applicationId: application._id,
        citizenId: user.profile,
        documentType: documentType,
        fileUrl: uploadedFile.path, // This is the cloudinary url
      });

      return NextResponse.json(
        { application, applicationDocument },
        { status: 201 },
      );
    } finally {
      // Clean up the temporary file
      await fs.unlink(tempFilePath);
    }
  } catch (error) {
    return NextResponse.json(
      { message: "Error uploading file", error },
      { status: 500 },
    );
  }
}
