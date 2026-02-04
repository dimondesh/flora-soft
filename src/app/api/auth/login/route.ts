// src/app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { createSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    // 1. Перевіряємо пароль (пароль все ще в .env)
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Невірний пароль" }, { status: 401 });
    }

    // 2. Якщо пароль вірний - створюємо захищений JWT токен
    await createSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Помилка сервера" }, { status: 500 });
  }
}
