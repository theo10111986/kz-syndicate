// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    // Απλό validation
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { ok: false, error: "INVALID_EMAIL" },
        { status: 400 }
      );
    }

    // Hostinger SMTP
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_SERVER_USER!,
        pass: process.env.EMAIL_SERVER_PASSWORD!, // βεβαιώσου ότι είναι συμπληρωμένο στο .env
      },
    });

    // Στείλε ειδοποίηση στον admin
    await transporter.sendMail({
      from:
        process.env.EMAIL_FROM ||
        process.env.MAIL_FROM ||
        process.env.EMAIL_SERVER_USER,
      to: process.env.MAIL_TO || "info@kzsyndicate.com",
      subject: "Νέα εγγραφή στο Newsletter",
      text: `Νέος συνδρομητής: ${email}`,
      html: `<p>Νέος συνδρομητής: <strong>${email}</strong></p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[NEWSLETTER_SEND_ERROR]", err);
    return NextResponse.json({ ok: false, error: "SEND_FAILED" }, { status: 500 });
  }
}
