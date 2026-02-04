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
import { ExternalLink } from "lucide-react";
import { AddShopDialog } from "@/components/admin/add-shop-dialog";

export const dynamic = "force-dynamic";

export default async function AdminShopsPage() {
  await connectDB();
  const shops = await Shop.find().sort({ createdAt: -1 }).lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Магазини</h1>
        <AddShopDialog />
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Назва</TableHead>
              <TableHead>Slug (Посилання)</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Тест</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shops.map((shop: any) => (
              <TableRow key={shop._id.toString()}>
                <TableCell className="font-medium flex items-center gap-3">
                  {shop.logoUrl && (
                    <img
                      src={shop.logoUrl}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border"
                    />
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
                  <a
                    href={`/card?shop=${shop.slug}`}
                    target="_blank"
                    className="inline-flex items-center text-sm text-blue-600 hover:underline"
                  >
                    Відкрити <ExternalLink className="ml-1 w-3 h-3" />
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {shops.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="h-24 text-center text-slate-500"
                >
                  Магазинів поки немає. Створіть перший!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
