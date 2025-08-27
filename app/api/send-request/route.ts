// app/api/send-request/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import nodemailer from "nodemailer";
import type Mail from "nodemailer/lib/mailer";

// --- ENV (ίδια με NextAuth email provider) ---
const SMTP_HOST = process.env.EMAIL_SERVER_HOST!;
const SMTP_PORT = Number(process.env.EMAIL_SERVER_PORT || 465);
const SMTP_USER = process.env.EMAIL_SERVER_USER!;
const SMTP_PASS = process.env.EMAIL_SERVER_PASSWORD!;
const EMAIL_FROM =
  process.env.MAIL_FROM ||
  process.env.EMAIL_FROM ||
  (SMTP_USER ? `KZ Syndicate <${SMTP_USER}>` : undefined);
const MAIL_TO = process.env.MAIL_TO || process.env.EMAIL_FROM || SMTP_USER;

// --- Απλό in-memory rate limit ανά IP ---
const limiter = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_REQ = 5;
function rateLimit(ip: string) {
  const now = Date.now();
  const rec = limiter.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    limiter.set(ip, { count: 1, ts: now });
    return true;
  }
  if (rec.count >= MAX_REQ) return false;
  rec.count++;
  return true;
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: SMTP_PORT,
  secure: SMTP_PORT === 465,
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// helpers
function isHttpUrl(v: any) {
  return typeof v === "string" && /^https?:\/\//i.test(v);
}
function parseDataUrl(dataUrl?: string) {
  if (!dataUrl || typeof dataUrl !== "string") return null;
  const m = dataUrl.match(/^data:([^;]+);base64,(.*)$/);
  if (!m) return null;
  return { mime: m[1], base64: m[2] };
}
function buildLegacyDescription(body: any) {
  const model = (body?.model ?? body?.productModel ?? "").toString().trim();
  const notes = (body?.notes ?? "").toString().trim();
  const colorHex = (body?.colorHex ?? "").toString().trim();
  if (!model && !notes && !colorHex) return "";
  const colorPart = colorHex ? ` Χρώμα: ${colorHex}.` : "";
  const notesPart = notes ? ` ${notes}` : "";
  return `Γεια σας, θα ήθελα προσφορά για custom ζωγραφική. ${model ? `Μοντέλο: ${model}.` : ""}${colorPart}${notesPart}`
    .replace(/\s+/g, " ")
    .trim();
}

export async function POST(req: Request) {
  try {
    // 1) Rate limit
    const ip =
      (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
    if (!rateLimit(ip)) {
      return NextResponse.json({ ok: false, error: "Rate limit" }, { status: 429 });
    }

    // 2) Session check — με email
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // 3) Input (παλιό + νέο payload)
    const body = await req.json().catch(() => ({} as any));

    const legacyDescription = typeof body.description === "string" ? body.description : "";
    const legacyImageUrlRaw = typeof body.imageUrl === "string" ? body.imageUrl : "";

    const subjectIn   = typeof body.subject === "string" ? body.subject.trim() : "";
    const textIn      = typeof body.text === "string" ? body.text.trim() : "";
    const fromEmailIn = typeof body.fromEmail === "string" ? body.fromEmail.trim() : "";
    const dataUrlIn   = typeof body.attachmentDataURL === "string" ? body.attachmentDataURL : "";
    const filenameIn  = typeof body.filename === "string" ? body.filename.trim() : "attachment.png";

    // 4) Περιγραφή
    let desc = (textIn || legacyDescription || "").trim();
    if (!desc) {
      const built = buildLegacyDescription(body);
      if (built) desc = built;
    }

    // 5) Attachments (για email) από data URLs
    const attachments: Mail.Attachment[] = [];
    const pBody = parseDataUrl(dataUrlIn);
    if (pBody?.base64) {
      attachments.push({
        filename: filenameIn || "attachment.png",
        content: pBody.base64,
        encoding: "base64",
        contentType: pBody.mime || "application/octet-stream",
      });
    }
    const pImg = parseDataUrl(legacyImageUrlRaw);
    if (pImg?.base64) {
      attachments.push({
        filename: filenameIn || "mockup.png",
        content: pImg.base64,
        encoding: "base64",
        contentType: pImg.mime || "application/octet-stream",
      });
    }

    // 6) Validation
    if (!desc && attachments.length === 0 && !legacyImageUrlRaw) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }

    // 7) Προετοιμασία imageUrl για DB
    let storedImageUrl: string | null = null;
    if (isHttpUrl(legacyImageUrlRaw)) {
      storedImageUrl = legacyImageUrlRaw;
    } else if (pImg?.base64) {
      storedImageUrl = `data:${pImg.mime || "image/png"};base64,${pImg.base64}`;
    } else if (pBody?.base64) {
      storedImageUrl = `data:${pBody.mime || "image/png"};base64,${pBody.base64}`;
    } else if (legacyImageUrlRaw) {
      storedImageUrl = legacyImageUrlRaw;
    }

    // 8) Δημιουργία εγγραφής
    const data: Prisma.PriceRequestCreateInput = {
      user: { connect: { email: session.user.email } },
      description: desc || "(no text, attachment only)",
      imageUrl: storedImageUrl,
    };

    const created = await prisma.priceRequest.create({
      data,
      select: { id: true, createdAt: true },
    });

    // 9) Αποστολή email (ΠΡΙΝ επιστρέψουμε response)
    const subject = subjectIn || `New Price Request — ${session.user.email}`;
    const extraFromInfo = fromEmailIn ? `\nFrom (client): ${fromEmailIn}` : "";
    const htmlBody = `
      <div style="font-family:system-ui,Segoe UI,Roboto,Arial;line-height:1.5">
        <h2>New Price Request</h2>
        <p><strong>User:</strong> ${session.user.email}</p>
        ${fromEmailIn ? `<p><strong>From (client):</strong> ${fromEmailIn}</p>` : ""}
        ${desc ? `<p><strong>Description:</strong><br/>${desc.replace(/\n/g, "<br/>")}</p>` : ""}
        ${storedImageUrl ? `<p><img src="${storedImageUrl}" alt="attachment" style="max-width:420px;border-radius:12px;margin-top:8px"/></p>` : ""}
        <p style="color:#888">ID: ${created.id}</p>
      </div>
    `.trim();
    const textBody =
      `User: ${session.user.email}${extraFromInfo}\n\n` +
      (desc ? `Description:\n${desc}\n\n` : "");

    await transporter.sendMail({
      to: MAIL_TO,
      from: EMAIL_FROM,
      subject,
      html: htmlBody,
      text: textBody,
      attachments,
    });

    // 10) Update status
    await prisma.priceRequest.update({
      where: { id: created.id },
      data: { emailSent: true },
    });

    // 11) Τελική απάντηση
    return NextResponse.json({
      ok: true,
      message: "Το αίτημα τιμής στάλθηκε επιτυχώς με email",
    });
  } catch (err: any) {
    console.error("send-request error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}

