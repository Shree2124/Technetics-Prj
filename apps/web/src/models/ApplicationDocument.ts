import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplicationDocument extends Document {
  applicationId: mongoose.Types.ObjectId;
  citizenId: mongoose.Types.ObjectId;
  documentType: 
    | "aadhaar"
    | "income_certificate"
    | "ration_card"
    | "property_document"
    | "medical_certificate";
  fileUrl: string;
  extractedText?: string;
  aiFraudFlag?: boolean;
  uploadedAt: Date;
}

const ApplicationDocumentSchema = new Schema<IApplicationDocument>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "CitizenProfile",
      required: true,
    },
    documentType: {
      type: String,
      enum: [
        "aadhaar",
        "income_certificate",
        "ration_card",
        "property_document",
        "medical_certificate",
      ],
      required: true,
    },
    fileUrl: { type: String, required: true },
    extractedText: { type: String },
    aiFraudFlag: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'uploadedAt', updatedAt: false } },
);

const ApplicationDocument: Model<IApplicationDocument> =
  mongoose.models.ApplicationDocument ||
  mongoose.model<IApplicationDocument>(
    "ApplicationDocument",
    ApplicationDocumentSchema,
  );

export default ApplicationDocument;
