import { NextResponse } from "next/server";
import { renderToStream } from "@react-pdf/renderer";
import nodemailer from "nodemailer";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Shop from "@/models/Shop";
import { CardPdfDocument } from "@/components/pdf-template";

// Настройка Nodemailer (для MVP).
// Для продакшена в будущем заменишь на AWS SES.
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "ethereal_user",
    pass: process.env.SMTP_PASS || "ethereal_pass",
  },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { shopId, text, signature, designId, fontId, phoneLast4 } = body;

    await connectDB();

    // 1. Проверяем магазин
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json({ error: "Shop not found" }, { status: 404 });
    }

    // 2. Генерируем короткий ID заказа
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const shortPrefix = shop.slug.substring(0, 3).toUpperCase();
    const shortId = `${shortPrefix}-${randomSuffix}`;

    // 3. Сохраняем заказ в БД
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

    // 4. Генерируем PDF
    const pdfStream = await renderToStream(
      <CardPdfDocument
        text={text}
        signature={signature}
        designId={designId}
        fontId={fontId}
        shopName={shop.name}
      />,
    );

    const chunks: Uint8Array[] = [];
    for await (const chunk of pdfStream) {
      chunks.push(chunk as Uint8Array);
    }
    const pdfBuffer = Buffer.concat(chunks);

    // 5. Отправляем email
    try {
      await transporter.sendMail({
        from: '"FloraSoft" <noreply@florasoft.com>',
        to: shop.email,
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
            contentType: "application/pdf",
          },
        ],
      });

      newOrder.status = "sent";
      await newOrder.save();
    } catch (emailError) {
      console.error("Помилка відправки email:", emailError);
      // Не фейлим запрос, если email не ушел, но заказ создан
    }

    return NextResponse.json({
      success: true,
      orderId: newOrder._id,
      shortId: shortId,
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
