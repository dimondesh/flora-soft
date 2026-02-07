import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Shop, { IShop } from "@/models/Shop";
import { CardPdfDocument } from "@/components/pdf-template";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    await connectDB();

    const order = await Order.findById(id).populate<{ shopId: IShop }>(
      "shopId",
    );

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const shop = order.shopId;

    const pdfShopName =
      shop && typeof shop === "object" && "name" in shop && shop.showNameOnPdf
        ? shop.name
        : "";
    const pdfStream = await renderToStream(
      <CardPdfDocument
        text={order.customerText}
        signature={order.customerSign}
        designId={order.designId}
        shopName={pdfShopName}
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
