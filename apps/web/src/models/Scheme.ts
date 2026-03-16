import mongoose, { Schema, Document, Model } from "mongoose";

export interface IScheme extends Document {
  schemeName: string;
  category: string;
  description: string;
  eligibility: {
    minAge: number;
    maxAge: number;
    maxIncome: number;
    ruralOnly: boolean;
    minFamilySize: number;
  };
  benefitAmount: number;
  active: boolean;
  createdAt: Date;
}

const SchemeSchema = new Schema<IScheme>(
  {
    schemeName: { type: String, required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    eligibility: {
      minAge: { type: Number, default: 0 },
      maxAge: { type: Number, default: 100 },
      maxIncome: { type: Number, default: 1000000 },
      ruralOnly: { type: Boolean, default: false },
      minFamilySize: { type: Number, default: 1 },
    },
    benefitAmount: { type: Number, required: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const Scheme: Model<IScheme> =
  mongoose.models.Scheme || mongoose.model<IScheme>("Scheme", SchemeSchema);

export default Scheme;
