// app/api/request-image/route.ts
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// Επιστρέφει ΜΟΝΟ την εικόνα ενός PriceRequest (είτε http link είτε data URL).
// Χρησιμοποιείται ως src στο <img>, ώστε η λίστα να μην στέλνει τεράστια base64 μέσα στο HTML.

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });
    }

    const r = await prisma.priceRequest.findUnique({
      where: { id },
      select: { imageUrl: true },
    });

    if (!r?.imageUrl) {
      // μικρό SVG placeholder (όχι 404, για να μην γεμίζουν error logs)
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="160" height="160"><rect x="10" y="10" width="140" height="140" rx="18" ry="18" fill="black" stroke="#00ffff" stroke-width="3"/><text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" font-family="Arial" font-size="12" fill="#aefcff">no image</text></svg>`;
      return new NextResponse(svg, {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    const src = r.imageUrl;

    // Αν είναι http/https link, κάνουμε απλή HTML redirect για να τη φορτώσει ο browser απευθείας
    if (/^https?:\/\//i.test(src)) {
      return NextResponse.redirect(src, { status: 302 });
    }

    // Αν είναι data URL (data:image/...;base64,....) — στείλ’ το όπως είναι
    // Για σωστό content-type, προσπαθούμε να το απομονώσουμε
    const m = src.match(/^data:([^;]+);base64,(.*)$/);
    if (m) {
      const mime = m[1] || "image/png";
      const b64 = m[2] || "";
      const buf = Buffer.from(b64, "base64");
      return new NextResponse(buf, {
        status: 200,
        headers: {
          "Content-Type": mime,
          "Cache-Control": "public, max-age=60",
        },
      });
    }

    // Αλλιώς, δεν αναγνωρίζεται — επιστροφή ως text
    return new NextResponse(src, {
      status: 200,
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=60",
      },
    });
  } catch (err: any) {
    console.error("request-image error:", err);
    return NextResponse.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
