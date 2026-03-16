import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICitizenProfile extends Document {
  userId: mongoose.Types.ObjectId;
  fullName: string;
  aadhaarNumber: string;
  phone: string;
  age: number;
  gender: string;
  address: {
    state: string;
    district: string;
    village: string;
    pincode: string;
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
    fullName: { type: String, required: true },
    aadhaarNumber: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    address: {
      state: { type: String, required: true },
      district: { type: String, required: true },
      village: { type: String, required: true },
      pincode: { type: String, required: true },
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
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const CitizenProfile: Model<ICitizenProfile> =
  mongoose.models.CitizenProfile ||
  mongoose.model<ICitizenProfile>("CitizenProfile", CitizenProfileSchema);

export default CitizenProfile;
