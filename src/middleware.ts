import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Проверяем, если пользователь идет в админку
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Получаем заголовок авторизации
    const basicAuth = req.headers.get("authorization");

    if (basicAuth) {
      const authValue = basicAuth.split(" ")[1];
      // Декодируем из base64 (формат user:password)
      const [user, pwd] = atob(authValue).split(":");

      // Сравниваем с переменными окружения
      if (
        user === process.env.ADMIN_USER &&
        pwd === process.env.ADMIN_PASSWORD
      ) {
        return NextResponse.next();
      }
    }

    // Если нет авторизации или пароль не подошел — требуем ввод
    return new NextResponse("Auth required", {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Secure Area"',
      },
    });
  }

  return NextResponse.next();
}

// Указываем, для каких путей запускать middleware
export const config = {
  matcher: "/admin/:path*",
};
