import type { Metadata } from "next";
// 1. Импортируем красивые шрифты
import { Inter, Playfair_Display, Great_Vibes } from "next/font/google";
import "./globals.css";

// 2. Настраиваем их
const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});
const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair",
});
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vibes",
});

export const metadata: Metadata = {
  title: "FloraSoft",
  description: "Card service for florists",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body
        // 3. Добавляем переменные шрифтов в body
        className={`${inter.variable} ${playfair.variable} ${greatVibes.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
