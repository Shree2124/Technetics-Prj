import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  citizenId: mongoose.Types.ObjectId;
  schemeId: mongoose.Types.ObjectId;
  status:
    | "draft"
    | "submitted"
    | "under_review"
    | "verified"
    | "rejected"
    | "approved"
    | "fraud_flagged";
  assignedVerifier?: mongoose.Types.ObjectId;
  fraudScore?: number;
  vulnerabilityScore?: number;
  appliedAt?: Date;
  submittedAt?: Date;
  verifiedAt?: Date;
  adminApprovedAt?: Date;
  draftData?: any; // Store draft form data
  documents?: mongoose.Types.ObjectId[]; // References to ApplicationDocument
}

const ApplicationSchema = new Schema<IApplication>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "CitizenProfile",
      required: true,
    },
    schemeId: {
      type: Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "draft",
        "submitted",
        "under_review",
        "verified",
        "rejected",
        "approved",
        "fraud_flagged",
      ],
      default: "draft",
    },
    assignedVerifier: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fraudScore: { type: Number, default: 0 },
    vulnerabilityScore: { type: Number, default: 0 },
    appliedAt: { type: Date },
    submittedAt: { type: Date },
    verifiedAt: { type: Date },
    adminApprovedAt: { type: Date },
    draftData: { type: Schema.Types.Mixed }, // Store draft form data
    documents: [{ type: Schema.Types.ObjectId, ref: "ApplicationDocument" }],
  },
  { timestamps: true },
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
