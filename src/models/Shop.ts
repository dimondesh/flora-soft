import mongoose, { Schema, Document, Model } from "mongoose";

export interface IShop extends Document {
  slug: string; // Уникальный ID в URL (например, 'rose-studio')
  name: string; // Название магазина
  email: string; // Куда отправлять PDF
  logoUrl?: string; // Ссылка на лого (опционально)
  isActive: boolean;
  createdAt: Date;
}

const ShopSchema = new Schema<IShop>(
  {
    slug: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

// Предотвращаем ошибку перекомпиляции модели при хот-релоаде
const Shop: Model<IShop> =
  mongoose.models.Shop || mongoose.model<IShop>("Shop", ShopSchema);

export default Shop;
