import type { Metadata } from "next";
import { Inter, Marck_Script, Great_Vibes } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
});

// "Елегантний" теперь Marck Script
const marckScript = Marck_Script({
  weight: "400",
  subsets: ["cyrillic", "latin"],
  variable: "--font-playfair", // Оставляем старое имя переменной
});

// "Рукописный" теперь Great Vibes
const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "cyrillic"], // Убедись, что шрифт поддерживает кириллицу
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
        className={`${inter.variable} ${marckScript.variable} ${greatVibes.variable} font-sans antialiased bg-slate-50 text-slate-900`}
      >
        {children}
      </body>
    </html>
  );
}
