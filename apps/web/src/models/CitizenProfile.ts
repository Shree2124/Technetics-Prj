import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICitizenProfile extends Document {
  user: mongoose.Types.ObjectId;
  income: number;
  employmentStatus: string;
  familySize: number;
  healthConditions: string[];
  location: string;
  housingType: string;
  phoneNumber: string;
  documents: string[];
  vulnerabilityScore: number;
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const CitizenProfileSchema = new Schema<ICitizenProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    income: { type: Number, default: 0 },
    employmentStatus: {
      type: String,
      enum: ["employed", "unemployed", "self-employed", "retired", "student"],
      default: "unemployed",
    },
    familySize: { type: Number, default: 1 },
    healthConditions: [{ type: String }],
    location: { type: String, default: "" },
    housingType: {
      type: String,
      enum: ["owned", "rented", "homeless", "government", "other"],
      default: "other",
    },
    phoneNumber: { type: String, default: "" },
    documents: [{ type: String }],
    vulnerabilityScore: { type: Number, default: 0, min: 0, max: 100 },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const CitizenProfile: Model<ICitizenProfile> =
  mongoose.models.CitizenProfile ||
  mongoose.model<ICitizenProfile>("CitizenProfile", CitizenProfileSchema);

export default CitizenProfile;
