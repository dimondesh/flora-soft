/* eslint-disable react/no-unescaped-entities */
// src/app/admin/page.tsx
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Download, Calendar, User } from "lucide-react";
import connectDB from "@/lib/db";
import Order, { IOrder } from "@/models/Order";
import Shop, { IShop } from "@/models/Shop";
import { PaginationControls } from "@/components/admin/pagination-controls";

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

type PopulatedOrder = Omit<IOrder, "shopId"> & { shopId: IShop | null };

export default async function AdminOrdersPage({ searchParams }: PageProps) {
  await connectDB();

  const params = await searchParams;
  const page = Number(params.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalOrders = await Order.countDocuments();
  const totalPages = Math.ceil(totalOrders / limit);

  const orders = (await Order.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate({ path: "shopId", model: Shop })
    .lean()) as unknown as PopulatedOrder[];

  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold tracking-tight">
          Замовлення
        </h1>
        <div className="text-slate-500 text-sm bg-white px-3 py-1 rounded-full border shadow-sm">
          Всього: {totalOrders}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:hidden">
        {orders.map((order) => (
          <Card key={order._id.toString()} className="shadow-sm">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-bold">
                    #{order.shortId || "---"}
                  </CardTitle>
                  <p className="text-sm text-slate-500 font-medium">
                    {order.shopId?.name || "Магазин видалено"}
                  </p>
                </div>
                <Badge
                  variant={order.status === "sent" ? "default" : "secondary"}
                  className={order.status === "sent" ? "bg-green-500" : ""}
                >
                  {order.status === "sent" ? "OK" : order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pb-3">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Calendar className="w-4 h-4 text-slate-400" />
                {new Date(order.createdAt).toLocaleDateString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
              <div className="flex items-start gap-2 text-sm text-slate-700 bg-slate-50 p-2 rounded-md">
                <User className="w-4 h-4 text-slate-400 mt-0.5" />
                <div>
                  <span className="font-bold block">
                    ...{order.customerPhoneLast4}
                  </span>
                  <span className="text-slate-500 italic">
                    "{order.customerText}"
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <a
                href={`/api/order/${order._id}/download`}
                target="_blank"
                rel="noreferrer"
                className="w-full"
              >
                <Button variant="outline" className="w-full gap-2">
                  <Download className="w-4 h-4" />
                  Завантажити PDF
                </Button>
              </a>
            </CardFooter>
          </Card>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-10 text-slate-500">
            Замовлень не знайдено
          </div>
        )}
      </div>

      <div className="hidden md:block rounded-md border bg-white shadow-sm">
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
            {orders.map((order) => (
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
          </TableBody>
        </Table>
      </div>

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
