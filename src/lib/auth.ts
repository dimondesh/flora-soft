// src/lib/auth.ts
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const secretKey = process.env.JWT_SECRET;
const key = new TextEncoder().encode(secretKey);

export async function createSession() {
  // Створюємо токен. Можна додати будь-які дані, наприклад { role: 'admin' }
  const jwt = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // Токен живе 7 днів
    .sign(key);

  const cookieStore = await cookies();

  cookieStore.set("admin_session", jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function verifySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_session")?.value;

  if (!token) return false;

  try {
    // Перевіряємо підпис токена
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return payload.role === "admin";
  } catch (error) {
    // Якщо токен підроблений або прострочений - поверне помилку
    return false;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}
