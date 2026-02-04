import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";

export async function GET() {
  try {
    await connectDB();

    // 1. Проверяем, есть ли уже такой магазин
    const existingShop = await Shop.findOne({ slug: "rose-studio" });

    if (existingShop) {
      return NextResponse.json({
        message: "Магазин уже существует",
        shop: existingShop,
      });
    }

    // 2. Создаем тестовый магазин
    const newShop = await Shop.create({
      slug: "rose-studio", // Это будет в URL: ?shop=rose-studio
      name: "Rose Studio", // Название в шапке
      email: "test-shop@example.com", // Сюда будут падать PDF (пока заглушка)
      logoUrl: "https://placehold.co/100x100/png?text=RS", // Временный лого
      isActive: true,
    });

    return NextResponse.json({
      message: "Успешно создан тестовый магазин",
      shop: newShop,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
