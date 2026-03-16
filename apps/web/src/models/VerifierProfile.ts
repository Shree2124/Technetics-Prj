import mongoose, { Schema, Document, Model } from "mongoose";

export interface IVerifierProfile extends Document {
  user: mongoose.Types.ObjectId;
  department: string;
  designation: string;
  employeeId: string;
  assignedRegion: string;
  verifiedCitizens: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const VerifierProfileSchema = new Schema<IVerifierProfile>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    department: { type: String, default: "" },
    designation: { type: String, default: "" },
    employeeId: { type: String, default: "" },
    assignedRegion: { type: String, default: "" },
    verifiedCitizens: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const VerifierProfile: Model<IVerifierProfile> =
  mongoose.models.VerifierProfile ||
  mongoose.model<IVerifierProfile>("VerifierProfile", VerifierProfileSchema);

export default VerifierProfile;
