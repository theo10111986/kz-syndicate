import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, orderId } = await req.json();

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST,
      port: Number(process.env.EMAIL_SERVER_PORT) || 465,
      secure: true, // 465 = SSL
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM, // π.χ. "KZ Syndicate" <info@kzsyndicate.com>
      to,
      subject: "Λάβαμε την παραγγελία σου ✅",
      text: `Η παραγγελία σου με αριθμό #${orderId ?? "—"} βρίσκεται σε διαδικασία επεξεργασίας. 
Σύντομα θα λάβεις ενημέρωση για την αποστολή.`,
      html: `
        <p>Γεια σου 👋</p>
        <p>Λάβαμε την παραγγελία σου <strong>#${orderId ?? "—"}</strong>.</p>
        <p>Η παραγγελία βρίσκεται σε διαδικασία επεξεργασίας και σύντομα θα λάβεις ενημέρωση για την αποστολή.</p>
        <p style="margin-top:20px;">Ευχαριστούμε,<br/>KZ Syndicate</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Order confirmation error:", err);
    return NextResponse.json({ ok: false, error: "Email failed" }, { status: 500 });
  }
}
