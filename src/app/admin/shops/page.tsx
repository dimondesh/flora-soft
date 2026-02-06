// src/app/admin/shops/page.tsx
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";
import Order from "@/models/Order";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Store, Mail, Link as LinkIcon } from "lucide-react";
import { ShopDialog } from "@/components/admin/shop-dialog";
import { DeleteShopButton } from "@/components/admin/delete-shop-button";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function AdminShopsPage({ searchParams }: PageProps) {
  await connectDB();

  // 1. Пагинация
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10; // Магазинов на странице
  const skip = (page - 1) * limit;

  const totalShops = await Shop.countDocuments();
  const totalPages = Math.ceil(totalShops / limit);

  // 2. Получаем только нужную часть магазинов
  const shopsRaw = await Shop.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // 3. Подсчитываем заказы только для отображаемых магазинов
  const shops = await Promise.all(
    shopsRaw.map(async (shop: any) => {
      const count = await Order.countDocuments({ shopId: shop._id });

      return {
        ...shop,
        _id: shop._id.toString(),
        createdAt: shop.createdAt.toISOString(),
        updatedAt: shop.updatedAt.toISOString(),
        ordersCount: count,
      };
    }),
  );

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Магазини
        </h1>
        <div className="flex items-center gap-4">
          <div className="text-slate-500 text-sm hidden sm:block">
            Всього: {totalShops}
          </div>
          <ShopDialog mode="create" />
        </div>
      </div>

      {/* --- MOBILE VIEW (CARDS) --- */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {shops.map((shop) => (
          <Card key={shop._id} className="shadow-sm overflow-hidden">
            <div className="flex p-4 gap-4 items-center border-b bg-slate-50/50">
              <div className="shrink-0">
                {shop.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={shop.logoUrl}
                    alt={shop.name}
                    className="w-12 h-12 rounded-full object-cover border bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400">
                    <Store className="w-6 h-6" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg truncate">{shop.name}</h3>
                  <Badge
                    variant={shop.isActive ? "default" : "destructive"}
                    className="ml-2 shrink-0"
                  >
                    {shop.isActive ? "Active" : "Off"}
                  </Badge>
                </div>
                <div className="text-xs text-slate-500 font-mono flex items-center gap-1 truncate">
                  <LinkIcon className="w-3 h-3" /> /{shop.slug}
                </div>
              </div>
            </div>

            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center text-sm border-b pb-3">
                <span className="text-slate-500">Замовлень:</span>
                <span className="font-bold text-lg">{shop.ordersCount}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-600 truncate">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{shop.email}</span>
              </div>
            </CardContent>

            <CardFooter className="bg-slate-50 p-2 flex justify-between">
              <a
                href={`/card/${shop.slug}`}
                target="_blank"
                className="flex items-center gap-2 text-sm text-blue-600 px-3 py-2 hover:bg-blue-50 rounded-md transition-colors"
              >
                <ExternalLink className="w-4 h-4" /> Посилання
              </a>
              <div className="flex gap-1">
                <ShopDialog mode="edit" shop={shop} />
                <DeleteShopButton id={shop._id} name={shop.name} />
              </div>
            </CardFooter>
          </Card>
        ))}
        {shops.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Магазинів немає
          </div>
        )}
      </div>

      {/* --- DESKTOP VIEW (TABLE) --- */}
      <div className="hidden md:block rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Назва</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-center">Листівки</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop) => (
              <TableRow key={shop._id}>
                <TableCell className="font-medium flex items-center gap-3">
                  {shop.logoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={shop.logoUrl}
                      alt={shop.name}
                      className="w-8 h-8 rounded-full object-cover border"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-100 border flex items-center justify-center text-slate-400">
                      <Store className="w-4 h-4" />
                    </div>
                  )}
                  {shop.name}
                </TableCell>
                <TableCell className="font-mono text-xs text-slate-500">
                  {shop.slug}
                </TableCell>
                <TableCell>{shop.email}</TableCell>

                <TableCell className="text-center font-bold text-slate-700">
                  {shop.ordersCount}
                </TableCell>

                <TableCell>
                  <Badge variant={shop.isActive ? "default" : "destructive"}>
                    {shop.isActive ? "Активний" : "Вимкнено"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/card/${shop.slug}`}
                      target="_blank"
                      className="p-2 text-slate-500 hover:text-blue-600"
                      title="Відкрити сторінку"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>

                    <ShopDialog mode="edit" shop={shop} />

                    <DeleteShopButton id={shop._id} name={shop.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- PAGINATION --- */}
      {totalPages > 1 && (
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          hasNextPage={hasNextPage}
          hasPrevPage={hasPrevPage}
        />
      )}
    </div>
  );
}
