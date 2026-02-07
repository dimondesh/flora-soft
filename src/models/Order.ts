import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOrder extends Document {
  shopId: mongoose.Types.ObjectId;
  shortId: string;
  customerText: string;
  customerSign?: string;
  customerPhoneLast4: string;
  designId: string;
  fontId?: string;
  status: "pending" | "sent" | "failed";
  pdfUrl?: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    shopId: { type: Schema.Types.ObjectId, ref: "Shop", required: true },
    shortId: { type: String },
    customerText: { type: String, required: true },
    customerSign: { type: String },
    customerPhoneLast4: { type: String, required: true },
    designId: { type: String, required: true },
    fontId: { type: String, default: "font-inter" },
    status: {
      type: String,
      enum: ["pending", "sent", "failed"],
      default: "pending",
    },
    pdfUrl: { type: String },
  },
  { timestamps: true },
);

const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;
