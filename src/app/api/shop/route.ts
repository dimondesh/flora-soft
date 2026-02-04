import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, slug, email, logoUrl } = body;

    // Валидация
    if (!name || !slug || !email) {
      return NextResponse.json(
        { error: "Заповніть обов'язкові поля" },
        { status: 400 },
      );
    }

    await connectDB();

    // Проверка уникальности slug
    const existingShop = await Shop.findOne({ slug });
    if (existingShop) {
      return NextResponse.json(
        { error: "Магазин з таким посиланням (slug) вже існує" },
        { status: 409 },
      );
    }

    // Создание
    const newShop = await Shop.create({
      name,
      slug,
      email,
      logoUrl,
      isActive: true,
    });

    return NextResponse.json(newShop, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
