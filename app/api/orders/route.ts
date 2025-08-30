import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, currency = "EUR", shipping } = body || {};

    // --- Validation ---
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ ok: false, error: "Το καλάθι είναι άδειο." }, { status: 400 });
    }
    if (typeof total !== "number" || !isFinite(total) || total < 0) {
      return Response.json({ ok: false, error: "Μη έγκυρο σύνολο." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    // --- Save order to DB ---
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        items,
        total: new Prisma.Decimal(total),
        currency,
        // shipping: shipping ? JSON.stringify(shipping) : null,
      },
      select: { id: true, createdAt: true },
    });

    // --- Send confirmation email ---
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: user.email,
      subject: "Η παραγγελία σου στο KZ Syndicate",
      text: `Λάβαμε την παραγγελία σου #${order.id}. Είναι σε διαδικασία επεξεργασίας.`,
      html: `
        <h2>Ευχαριστούμε για την παραγγελία σου!</h2>
        <p>Αριθμός παραγγελίας: <strong>${order.id}</strong></p>
        <p>Το ποσό: <strong>${total} ${currency}</strong></p>
        <p>Θα ενημερωθείς με email όταν σταλεί.</p>
      `,
    });

    return Response.json(
      { ok: true, id: order.id, createdAt: order.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ ok: true, orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

