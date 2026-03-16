import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerifierProfile extends Document {
  userId: mongoose.Types.ObjectId;
  department: string;
  region: string;
  designation: string;
  isActive: boolean;
  verifiedCitizens: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const VerifierProfileSchema = new Schema<IVerifierProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    department: { type: String, default: "" },
    region: { type: String, default: "" },
    designation: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    verifiedCitizens: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true },
);

const VerifierProfile: Model<IVerifierProfile> =
  mongoose.models.VerifierProfile ||
  mongoose.model<IVerifierProfile>("VerifierProfile", VerifierProfileSchema);

export default VerifierProfile;
