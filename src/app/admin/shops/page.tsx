// src/app/admin/shops/page.tsx
import connectDB from "@/lib/db";
import Shop from "@/models/Shop";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Store } from "lucide-react";
import { ShopDialog } from "@/components/admin/shop-dialog"; // Обновленный импорт
import { DeleteShopButton } from "@/components/admin/delete-shop-button"; // Создадим ниже

export const dynamic = "force-dynamic";

export default async function AdminShopsPage() {
  await connectDB();
  // Сериализуем данные для передачи в клиентские компоненты
  const shops = (await Shop.find().sort({ createdAt: -1 }).lean()).map(
    (shop: any) => ({
      ...shop,
      _id: shop._id.toString(),
      createdAt: shop.createdAt.toISOString(),
      updatedAt: shop.updatedAt.toISOString(),
    }),
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Магазини</h1>
        <ShopDialog mode="create" />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Назва</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Email</TableHead>
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

                    {/* Кнопка Редактирования */}
                    <ShopDialog mode="edit" shop={shop} />

                    {/* Кнопка Удаления */}
                    <DeleteShopButton id={shop._id} name={shop.name} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {shops.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  Магазинів поки немає.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
