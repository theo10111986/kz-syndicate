import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, orderId } = await req.json();

    if (!to) {
      return NextResponse.json({ ok: false, error: "Missing recipient email" }, { status: 400 });
    }

    // Transporter με τα στοιχεία που έχεις ήδη στη .env
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === "true", 
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Email που στέλνουμε
    await transporter.sendMail({
      from: process.env.MAIL_FROM, // π.χ. info@kzsyndicate.com
      to,
      subject: "Λάβαμε την παραγγελία σου ✅",
      html: `
        <div style="font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif">
          <h2 style="color:#00ffff;margin-bottom:8px">KZ Syndicate</h2>
          <p>Λάβαμε την παραγγελία σου${orderId ? ` με αριθμό <b>#${orderId}</b>` : ""}.</p>
          <p>Η παραγγελία σου είναι σε διαδικασία επεξεργασίας, θα ενημερωθείς σύντομα!</p>
          <p style="margin-top:16px;font-size:0.9rem;opacity:0.8">
            Join the underground, wear the code.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order confirmation error:", err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
