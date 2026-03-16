import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICitizenProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName?: string;
  aadhaarNumber?: string;
  phone?: string;
  age?: number;
  gender?: string;
  address?: {
    state?: string;
    district?: string;
    village?: string;
    pincode?: string;
  };
  ruralFlag: boolean;
  income: number;
  employmentStatus: string;
  educationLevel: string;
  familySize: number;
  healthCondition: boolean;
  disability: boolean;
  propertyOwned: number;
  bankAccount: string;
  verificationStatus: string;
  vulnerabilityScore: number;
  createdAt: Date;
}

const CitizenProfileSchema = new Schema<ICitizenProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: { type: String },
    aadhaarNumber: { type: String, unique: true, sparse: true },
    phone: { type: String },
    age: { type: Number },
    gender: { type: String },
    address: {
      state: { type: String },
      district: { type: String },
      village: { type: String },
      pincode: { type: String },
    },
    ruralFlag: { type: Boolean, default: false },
    income: { type: Number, default: 0 },
    employmentStatus: { type: String, default: "unemployed" },
    educationLevel: { type: String, default: "none" },
    familySize: { type: Number, default: 1 },
    healthCondition: { type: Boolean, default: false },
    disability: { type: Boolean, default: false },
    propertyOwned: { type: Number, default: 0 },
    bankAccount: { type: String },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },
    vulnerabilityScore: { type: Number, default: 0 },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Delete stale cached model to avoid schema mismatch during dev hot reloads
if (mongoose.models.CitizenProfile) {
  delete mongoose.models.CitizenProfile;
}

const CitizenProfile: Model<ICitizenProfile> = mongoose.model<ICitizenProfile>(
  "CitizenProfile",
  CitizenProfileSchema,
);

export default CitizenProfile;
