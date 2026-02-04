import { notFound } from "next/navigation";
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";
import CardBuilder from "@/components/card-builder";

interface PageProps {
  params: Promise<{ shop: string }>;
}

export const dynamic = "force-dynamic";

export default async function CardPage({ params }: PageProps) {
  const { shop: shopSlug } = await params;

  if (!shopSlug) {
    notFound();
  }

  await connectDB();

  const shop = await Shop.findOne({ slug: shopSlug, isActive: true }).lean();

  if (!shop) {
    notFound();
  }

  const serializedShop = {
    name: shop.name,
    logoUrl: shop.logoUrl,
    slug: shop.slug,
    _id: shop._id.toString(),
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <CardBuilder shop={serializedShop} />
    </main>
  );
}
