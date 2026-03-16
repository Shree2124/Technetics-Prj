import mongoose, { Schema, Document, Model } from "mongoose";

export interface IRecommendation extends Document {
  citizenId: mongoose.Types.ObjectId;
  recommendedSchemes: {
    schemeId: mongoose.Types.ObjectId;
    score: number;
    reason: string;
  }[];
  generatedAt: Date;
}

const RecommendationSchema = new Schema<IRecommendation>(
  {
    citizenId: {
      type: Schema.Types.ObjectId,
      ref: "CitizenProfile",
      required: true,
    },
    recommendedSchemes: [
      {
        schemeId: {
          type: Schema.Types.ObjectId,
          ref: "Scheme",
          required: true,
        },
        score: { type: Number, required: true },
        reason: { type: String, required: true },
      },
    ],
  },
  { timestamps: { createdAt: 'generatedAt', updatedAt: false } },
);

const Recommendation: Model<IRecommendation> =
  mongoose.models.Recommendation ||
  mongoose.model<IRecommendation>("Recommendation", RecommendationSchema);

export default Recommendation;
