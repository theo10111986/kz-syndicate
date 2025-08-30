import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";

// Εξασφαλίζουμε Node.js runtime σε Vercel (όχι Edge)
export const runtime = "nodejs";

// --- Δημιουργία παραγγελίας ---
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
        items, // JSON column
        total: new Prisma.Decimal(total),
        currency,
        // shipping: shipping ? JSON.stringify(shipping) : null,
      },
      select: { id: true, createdAt: true },
    });

    // --- Send confirmation email (δεν μπλοκάρει την παραγγελία αν αποτύχει) ---
    try {
      const host = process.env.EMAIL_SERVER_HOST;
      const port = Number(process.env.EMAIL_SERVER_PORT || 465);
      const userEmail = process.env.EMAIL_SERVER_USER;
      const pass = process.env.EMAIL_SERVER_PASSWORD;

      if (!host || !userEmail || !pass) {
        console.error("Missing SMTP env vars (EMAIL_SERVER_HOST/USER/PASSWORD).");
      } else {
        const transporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465, // SSL για 465
          auth: { user: userEmail, pass },
        });

        const from =
          process.env.EMAIL_FROM || // π.χ. "KZ Syndicate" <info@kzsyndicate.com>
          process.env.MAIL_FROM ||  // fallback
          userEmail;

        const prettyTotal = new Intl.NumberFormat("el-GR", {
          style: "currency",
          currency,
        }).format(total);

        await transporter.sendMail({
          from: from,
          to: user.email, // στέλνουμε στον πελάτη που έκανε login
          subject: "Λάβαμε την παραγγελία σου ✅",
          text: `Γεια σου${user.name ? " " + user.name : ""}, λάβαμε την παραγγελία σου #${
            order.id
          }. Ποσό: ${prettyTotal}. Είναι σε διαδικασία επεξεργασίας—θα ενημερωθείς όταν σταλεί.`,
          html: `
            <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
              <h2 style="color:#00ffff;margin:0 0 8px">KZ Syndicate</h2>
              <p>Γεια σου${user.name ? " <strong>" + user.name + "</strong>" : ""}, λάβαμε την παραγγελία σου.</p>
              <p>Αρ. παραγγελίας: <strong>#${order.id}</strong></p>
              <p>Σύνολο: <strong>${prettyTotal}</strong> (${currency})</p>
              <p style="margin-top:12px">Η παραγγελία είναι σε διαδικασία επεξεργασίας. Θα σου στείλουμε ενημέρωση όταν αποσταλεί.</p>
              <p style="margin-top:16px;opacity:.8;font-size:.9rem">Join the underground, wear the code.</p>
            </div>
          `,
        });
      }
    } catch (emailErr) {
      console.error("Order confirmation email error:", emailErr);
      // δεν ρίχνουμε error στον χρήστη
    }

    return Response.json(
      { ok: true, id: order.id, createdAt: order.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// --- Λήψη παραγγελιών για το /account ---
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


