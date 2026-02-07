/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Shop from "@/models/Shop"; // импорт нужен, даже если не используется напрямую, для populate
import { CardPdfDocument } from "@/components/pdf-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id).populate("shopId");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Приведение типов и логика имени
    const shop = order.shopId as any;
    // Проверяем: существует ли магазин И включена ли опция
    const pdfShopName = shop && shop.showNameOnPdf ? shop.name : "";

    // Генерируем поток
    const pdfStream = await renderToStream(
      <CardPdfDocument
        text={order.customerText}
        signature={order.customerSign}
        designId={order.designId}
        shopName={pdfShopName} // <-- передаем результат проверки
        fontId={order.fontId}
      />,
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk as Uint8Array);
    }
    const pdfBuffer = Buffer.concat(chunks);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="card-${order.shortId}.pdf"`,
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
