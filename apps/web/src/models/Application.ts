import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  citizenId: mongoose.Types.ObjectId;
  schemeId: mongoose.Types.ObjectId;
  status: 
    | "submitted"
    | "under_review"
    | "verified"
    | "rejected"
    | "approved"
    | "fraud_flagged";
  assignedVerifier?: mongoose.Types.ObjectId;
  fraudScore?: number;
  vulnerabilityScore?: number;
  appliedAt: Date;
  verifiedAt?: Date;
  adminApprovedAt?: Date;
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
        "submitted",
        "under_review",
        "verified",
        "rejected",
        "approved",
        "fraud_flagged",
      ],
      default: "submitted",
    },
    assignedVerifier: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    fraudScore: { type: Number, default: 0 },
    vulnerabilityScore: { type: Number, default: 0 },
    appliedAt: { type: Date, default: Date.now },
    verifiedAt: { type: Date },
    adminApprovedAt: { type: Date },
  },
  { timestamps: true },
);

const Application: Model<IApplication> =
  mongoose.models.Application ||
  mongoose.model<IApplication>("Application", ApplicationSchema);

export default Application;
