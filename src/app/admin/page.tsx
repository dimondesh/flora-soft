import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, ExternalLink } from "lucide-react";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Shop from "@/models/Shop";

// Заставляем страницу обновляться при каждом заходе (чтобы видеть новые заказы)
export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  await connectDB();

  // Загружаем заказы с данными магазинов, сортируем от новых к старым
  // Используем .lean() для производительности
  const orders = await Order.find()
    .sort({ createdAt: -1 })
    .populate({ path: "shopId", model: Shop }) // Явно указываем модель
    .lean();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Замовлення</h1>
        <div className="text-slate-500 text-sm">Всього: {orders.length}</div>
      </div>

      <div className="rounded-md border bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Номер</TableHead>
              <TableHead>Магазин</TableHead>
              <TableHead>Дата</TableHead>
              <TableHead>Клієнт (Тел)</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead className="text-right">Дії</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order: any) => (
              <TableRow key={order._id.toString()}>
                <TableCell className="font-medium">
                  {order.shortId || "---"}
                </TableCell>
                <TableCell>
                  {order.shopId?.name || (
                    <span className="text-red-500">Видалений</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                    day: "2-digit",
                    month: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs text-slate-500">
                      ...{order.customerPhoneLast4}
                    </span>
                    <span
                      className="truncate max-w-[150px] text-xs"
                      title={order.customerText}
                    >
                      {order.customerText}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={order.status === "sent" ? "default" : "secondary"}
                    className={
                      order.status === "sent"
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                  >
                    {order.status === "sent" ? "Відправлено" : order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={`/api/order/${order._id}/download`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      PDF
                    </Button>
                  </a>
                </TableCell>
              </TableRow>
            ))}
            {orders.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Немає замовлень
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
