import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import dbConnect from "@/lib/db";
import { cloudinary } from "@/lib/cloudinary";
import ApplicationDocument from "@/models/ApplicationDocument";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from 'uuid';

// Helper function to validate file type
function validateFileType(file: File, allowedTypes: string[]) {
  const fileExtension = file.name.split('.').pop()?.toLowerCase();
  return allowedTypes.includes(`.${fileExtension}`) || allowedTypes.includes(file.type);
}

// Helper function to validate file size (max 5MB)
function validateFileSize(file: File, maxSize: number = 5 * 1024 * 1024) {
  return file.size <= maxSize;
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const data = await req.formData();
    const file = data.get('file') as File;
    const documentType = data.get('documentType') as string;
    const applicationId = data.get('applicationId') as string;

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    // Validate document type
    const allowedTypes = [
      "aadhaar", "income_certificate", "ration_card", 
      "property_document", "medical_certificate"
    ];
    
    if (!allowedTypes.includes(documentType)) {
      return NextResponse.json({ 
        message: "Invalid document type" 
      }, { status: 400 });
    }

    // Validate file type (PDF, JPG, PNG)
    const allowedFileTypes = [
      "application/pdf",
      "image/jpeg",
      "image/jpg",
      "image/png"
    ];
    
    if (!validateFileType(file, allowedFileTypes)) {
      return NextResponse.json({ 
        message: "Invalid file type. Only PDF, JPG, and PNG files are allowed" 
      }, { status: 400 });
    }

    // Validate file size
    if (!validateFileSize(file)) {
      return NextResponse.json({ 
        message: "File size exceeds 5MB limit" 
      }, { status: 400 });
    }

    // Create temp directory if it doesn't exist
    const tempDir = path.join(process.cwd(), 'temp');
    await fs.mkdir(tempDir, { recursive: true });

    // Generate unique filename
    const uniqueFilename = `${uuidv4()}-${file.name}`;
    const tempFilePath = path.join(tempDir, uniqueFilename);

    // Save file temporarily
    const fileBuffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(tempFilePath, fileBuffer);

    try {
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
          tempFilePath,
          {
            folder: 'technetics-hackathon/documents',
            resource_type: 'auto',
            public_id: `${documentType}-${Date.now()}`,
            format: file.name.split('.').pop()
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
      });

      // Create document record
      const document = await ApplicationDocument.create({
        applicationId: applicationId || null,
        citizenId: user.profile,
        documentType: documentType,
        fileUrl: (result as any).secure_url,
        extractedText: (result as any).context?.custom?.extracted_text || null,
        aiFraudFlag: false,
        uploadedAt: new Date()
      });

      return NextResponse.json({
        success: true,
        message: "File uploaded successfully",
        document: {
          id: document._id,
          documentType: document.documentType,
          fileUrl: document.fileUrl,
          uploadedAt: document.uploadedAt
        }
      });

    } finally {
      // Clean up temporary file
      await fs.unlink(tempFilePath).catch(console.error);
    }

  } catch (error: any) {
    console.error("Error uploading file:", error);
    
    // Clean up temp file if it exists
    const tempDir = path.join(process.cwd(), 'temp');
    const uniqueFilename = `${uuidv4()}-${(req.formData?.then?.(d => d.get('file') as File) || { name: 'temp' }).name}`;
    const tempFilePath = path.join(tempDir, uniqueFilename);
    await fs.unlink(tempFilePath).catch(console.error);

    return NextResponse.json(
      { message: error.message || "Error uploading file" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();

    if (!user || user.role !== "citizen") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(req.url);
    const documentId = searchParams.get('documentId');

    if (!documentId) {
      return NextResponse.json({ message: "Document ID is required" }, { status: 400 });
    }

    // Find document
    const document = await ApplicationDocument.findOne({
      _id: documentId,
      citizenId: user.profile
    });

    if (!document) {
      return NextResponse.json({ message: "Document not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    if (document.fileUrl) {
      const publicId = document.fileUrl.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`technetics-hackathon/documents/${publicId}`);
      }
    }

    // Delete from database
    await ApplicationDocument.findByIdAndDelete(documentId);

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully"
    });

  } catch (error: any) {
    console.error("Error deleting document:", error);
    return NextResponse.json(
      { message: error.message || "Error deleting document" },
      { status: 500 }
    );
  }
}
