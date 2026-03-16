import mongoose, { Schema, Document, Model } from "mongoose";

export interface IBenefitAllocation extends Document {
  applicationId: mongoose.Types.ObjectId;
  citizenId: mongoose.Types.ObjectId;
  schemeId: mongoose.Types.ObjectId;
  allocatedAmount: number;
  allocationStatus: "processing" | "allocated" | "completed";
  approvedBy: mongoose.Types.ObjectId;
  allocatedAt: Date;
}

const BenefitAllocationSchema = new Schema<IBenefitAllocation>(
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
    schemeId: {
      type: Schema.Types.ObjectId,
      ref: "Scheme",
      required: true,
    },
    allocatedAmount: { type: Number, required: true },
    allocationStatus: {
      type: String,
      enum: ["processing", "allocated", "completed"],
      default: "processing",
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: { createdAt: 'allocatedAt', updatedAt: false } },
);

const BenefitAllocation: Model<IBenefitAllocation> =
  mongoose.models.BenefitAllocation ||
  mongoose.model<IBenefitAllocation>(
    "BenefitAllocation",
    BenefitAllocationSchema,
  );

export default BenefitAllocation;
