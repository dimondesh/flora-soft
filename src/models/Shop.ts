import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShop extends Document {
  slug: string;
  name: string;
  email: string;
  logoUrl?: string;
  isActive: boolean;
  showNameOnPdf: boolean;
  createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
    showNameOnPdf: { type: Boolean, default: false },
  },
  { timestamps: true },
);

const Shop: Model<IShop> =
  mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema);

export default Shop;
