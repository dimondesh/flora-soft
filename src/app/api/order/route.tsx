// src/app/api/order/route.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import { Resend } from "resend";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { CardPdfDocument } from "@/components/pdf-template";

export const maxDuration = 60;

const MAX_TEXT_LENGTH = Number(process.env.NEXT_PUBLIC_MAX_SYMBOLS_TEXT) || 200;
const MAX_SIGNATURE_LENGTH =
  Number(process.env.NEXT_PUBLIC_MAX_SYMBOLS_SIGN) || 20;

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shopId, text, signature, designId, fontId, phoneLast4 } = body;

    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: "Текст привітання обов'язковий" },
        { status: 400 },
      );
    }

    if (text.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Текст занадто довгий (максимум ${MAX_TEXT_LENGTH} символів)`,
        },
        { status: 400 },
      );
    }

    if (signature && signature.length > MAX_SIGNATURE_LENGTH) {
      return NextResponse.json(
        {
          error: `Підпис занадто довгий (максимум ${MAX_SIGNATURE_LENGTH} символів)`,
        },
        { status: 400 },
      );
    }

    await connectDB();

    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const shortPrefix = shop.slug.substring(0, 3).toUpperCase();
    const shortId = `${shortPrefix}-${randomSuffix}`;

    const newOrder = await Order.create({
      shopId: shop._id,
      shortId,
      customerText: text,
      customerSign: signature,
      customerPhoneLast4: phoneLast4,
      designId,
      fontId: fontId || "font-inter",
      status: "pending",
    });

    try {
      const pdfShopName = shop.showNameOnPdf ? shop.name : "";

      const pdfStream = await renderToStream(
        <CardPdfDocument
          text={text}
          signature={signature}
          designId={designId}
          fontId={fontId}
          shopName={pdfShopName}
        />,
      );

      const chunks: Uint8Array[] = [];
      for await (const chunk of pdfStream) {
        chunks.push(chunk as Uint8Array);
      }
      const pdfBuffer = Buffer.concat(chunks);

      const { data, error } = await resend.emails.send({
        from: `FloraSoft <noreply@florasoft.website>`,
        to: [shop.email],
        subject: `Листівка до замовлення #${shortId}`,
        html: `
          <div style="font-family: sans-serif; padding: 20px; background-color: #f8fafc;">
            <div style="background: white; padding: 20px; border-radius: 8px; max-width: 500px; margin: 0 auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h2 style="color: #334155; margin-top: 0;">Нова листівка!</h2>
                <p style="color: #64748b;">Клієнт створив листівку для магазину <strong>${shop.name}</strong>.</p>
                <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                <p><strong>Номер замовлення:</strong> <span style="font-family: monospace; font-size: 1.1em; background: #eee; padding: 2px 6px; border-radius: 4px;">${shortId}</span></p>
                <p><strong>Телефон клієнта (останні 4 цифри):</strong> <span style="font-size: 1.2em; font-weight: bold; color: #0f172a;">${phoneLast4}</span></p>
                <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 6px; color: #0369a1; font-size: 0.9em;">
                    Файл PDF прикріплено до цього листа. Роздрукуйте його у форматі A6.
                </div>
            </div>
          </div>
        `,
        attachments: [
          {
            filename: `card-${shortId}.pdf`,
            content: pdfBuffer,
          },
        ],
      });

      if (error) {
        console.error("Resend error:", error);
        throw new Error(error.message);
      }

      newOrder.status = "sent";
      await newOrder.save();
    } catch (backgroundError) {
      console.error(
        "Помилка генерації PDF або відправки Email:",
        backgroundError,
      );

      newOrder.status = "failed";
      await newOrder.save();
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
      shortId: shortId,
    });
  } catch (error: any) {
    console.error("Критична помилка створення замовлення:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
