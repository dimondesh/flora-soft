// src/proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const secretKey = process.env.JWT_SECRET || "default_secret";
const key = new TextEncoder().encode(secretKey);

export async function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/shop")) {
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

  if (req.nextUrl.pathname.startsWith("/admin")) {
    const cookie = req.cookies.get("admin_session");
    let isValid = false;

    if (cookie?.value) {
      try {
        await jwtVerify(cookie.value, key);
        isValid = true;
      } catch (e) {
        isValid = false;
      }
    }

    if (!isValid) {
      if (req.nextUrl.pathname === "/admin") {
        return NextResponse.next();
      }

      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/shop/:path*"],
};
