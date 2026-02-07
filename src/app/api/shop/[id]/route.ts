/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/api/shop/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";
import cloudinary from "@/lib/cloudinary";

const getPublicIdFromUrl = (url: string) => {
  try {
    const parts = url.split("/");
    const filenameWithExt = parts.pop();
    const folder = parts.pop();
    if (!filenameWithExt || !folder) return null;

    const filename = filenameWithExt.split(".")[0];
    return `${folder}/${filename}`;
  } catch (e) {
    console.error("Error parsing Cloudinary URL:", e);
    return null;
  }
};

// --- UPDATE (PUT) ---
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, slug, email, logoUrl, isActive, showNameOnPdf } = body;

    await connectDB();

    const existingShop = await Shop.findById(id);
    if (!existingShop) {
      return NextResponse.json({ error: "Магазин не найден" }, { status: 404 });
    }

    if (existingShop.logoUrl && existingShop.logoUrl !== logoUrl) {
      const publicId = getPublicIdFromUrl(existingShop.logoUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    existingShop.name = name;
    existingShop.slug = slug;
    existingShop.email = email;
    existingShop.logoUrl = logoUrl;
    existingShop.isActive = isActive;

    if (showNameOnPdf !== undefined) {
      existingShop.showNameOnPdf = showNameOnPdf;
    }

    await existingShop.save();

    return NextResponse.json(existingShop);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// --- DELETE ---
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const shop = await Shop.findById(id);
    if (!shop) {
      return NextResponse.json({ error: "Магазин не найден" }, { status: 404 });
    }

    if (shop.logoUrl) {
      const publicId = getPublicIdFromUrl(shop.logoUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    }

    await Shop.findByIdAndDelete(id);

    return NextResponse.json({ message: "Магазин удален" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
