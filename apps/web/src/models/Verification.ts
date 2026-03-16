import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerification extends Document {
  applicationId: mongoose.Types.ObjectId;
  verifierId: mongoose.Types.ObjectId;
  documentChecks: {
    documentId: mongoose.Types.ObjectId;
    status: "valid" | "invalid" | "suspicious";
    comment?: string;
  }[];
  overallStatus: "verified" | "rejected";
  notes?: string;
  verifiedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    verifierId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    documentChecks: [
      {
        documentId: { type: Schema.Types.ObjectId, required: true },
        status: {
          type: String,
          enum: ["valid", "invalid", "suspicious"],
          required: true,
        },
        comment: { type: String },
      },
    ],
    overallStatus: {
      type: String,
      enum: ["verified", "rejected"],
      required: true,
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: 'verifiedAt', updatedAt: false } },
);

const Verification: Model<IVerification> =
  mongoose.models.Verification ||
  mongoose.model<IVerification>("Verification", VerificationSchema);

export default Verification;
