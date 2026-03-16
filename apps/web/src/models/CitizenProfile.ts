import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICitizenProfile extends Document {
  userId: mongoose.Types.ObjectId;
  income: number;
  employment_status:
    | "employed"
    | "unemployed"
    | "informal"
    | "self_employed"
    | "retired";
  family_size: number;
  education_level:
    | "primary"
    | "secondary"
    | "graduate"
    | "postgraduate"
    | "none";
  health_condition: boolean;
  housing_type: "temporary" | "permanent" | "rented" | "homeless";
  disaster_risk: "low" | "medium" | "high";
  address: string;
  district: string;
  phoneNumber?: string;
  documents?: string[];
  vulnerabilityScore?: number;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CitizenProfileSchema = new Schema<ICitizenProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    income: { type: Number, default: 0 },
    employment_status: {
      type: String,
      enum: ["employed", "unemployed", "informal", "self_employed", "retired"],
      default: "unemployed",
    },
    family_size: { type: Number, default: 1, min: 1 },
    education_level: {
      type: String,
      enum: ["primary", "secondary", "graduate", "postgraduate", "none"],
      default: "primary",
    },
    health_condition: { type: Boolean, default: false },
    housing_type: {
      type: String,
      enum: ["temporary", "permanent", "rented", "homeless"],
      default: "temporary",
    },
    disaster_risk: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    address: { type: String, default: "" },
    district: { type: String, default: "" },
    phoneNumber: { type: String, default: "" },
    documents: [{ type: String }],
    vulnerabilityScore: { type: Number, default: 0, min: 0, max: 100 },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Delete stale cached model to avoid schema mismatch during dev hot reloads
if (mongoose.models.CitizenProfile) {
  delete mongoose.models.CitizenProfile;
}

const CitizenProfile: Model<ICitizenProfile> =
  mongoose.model<ICitizenProfile>("CitizenProfile", CitizenProfileSchema);

export default CitizenProfile;
