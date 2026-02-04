// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "default_secret";
const key = new TextEncoder().encode(secretKey);

export async function proxy(req: NextRequest) {
  // 1. ЗАЩИТА API (Самое важное!)
  // Блокируем любые действия с магазинами, если нет токена
  if (req.nextUrl.pathname.startsWith("/api/shop")) {
    // GET разрешаем (чтобы карточки работали у клиентов)
    if (req.method === "GET") {
      return NextResponse.next();
    }

    const cookie = req.cookies.get("admin_session");
    if (!cookie?.value) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await jwtVerify(cookie.value, key);
      return NextResponse.next();
    } catch (err) {
      return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
    }
  }

  // 2. ЗАЩИТА АДМИНКИ (UI)
  if (req.nextUrl.pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("admin_session");
    let isValid = false;

    // Проверяем токен, если он есть
    if (cookie?.value) {
      try {
        await jwtVerify(cookie.value, key);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
    }

    // ЕСЛИ НЕ АВТОРИЗОВАН:
    if (!isValid) {
      // А) Если мы на главной странице админки (/admin) - пропускаем,
      // чтобы Layout показал форму входа.
      if (req.nextUrl.pathname === "/admin") {
        return NextResponse.next();
      }

      // Б) Если мы на любой внутренней странице (/admin/shops и т.д.) -
      // ВЫКИДЫВАЕМ НА ЛЕНДИНГ (или можно на /admin, как захочешь)
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*", // Ловим все страницы админки
    "/api/shop/:path*", // Ловим API запросы
  ],
};
