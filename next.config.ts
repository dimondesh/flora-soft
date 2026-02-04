import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Ваши существующие домены (Cloudinary, заглушки)
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
      // 👇 Добавляем домен из ошибки
      {
        protocol: "https",
        hostname: "images.contentstack.io",
      },
    ],
  },
};

export default nextConfig;
