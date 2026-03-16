import mongoose, { Schema, Document, Model } from "mongoose";

export interface IFraudAnalysis extends Document {
  applicationId: mongoose.Types.ObjectId;
  anomalyScore: number;
  fraudScore: number;
  fraudStatus: "clean" | "suspicious" | "high_risk";
  reasons: string[];
  checkedAt: Date;
}

const FraudAnalysisSchema = new Schema<IFraudAnalysis>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: "Application",
      required: true,
    },
    anomalyScore: { type: Number, default: 0 },
    fraudScore: { type: Number, default: 0 },
    fraudStatus: {
      type: String,
      enum: ["clean", "suspicious", "high_risk"],
      default: "clean",
    },
    reasons: [{ type: String }],
  },
  { timestamps: { createdAt: 'checkedAt', updatedAt: false } },
);

const FraudAnalysis: Model<IFraudAnalysis> =
  mongoose.models.FraudAnalysis ||
  mongoose.model<IFraudAnalysis>("FraudAnalysis", FraudAnalysisSchema);

export default FraudAnalysis;
