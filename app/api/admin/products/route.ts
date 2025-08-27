// app/api/admin/products/route.ts
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

/* ───────────────── helpers ───────────────── */
function isAdminEmail(email?: string | null) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && admins.includes(email.toLowerCase());
}

function slugify(s: string) {
  return (s || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function parsePriceEUR(input: string): number {
  // δέχεται "149.90", "149,90", "149"
  const clean = (input || "").trim().replace(/\s+/g, "").replace(",", ".");
  const n = Number(clean);
  if (!isFinite(n)) return NaN;
  return Math.round(n * 100);
}

/* ───────────────── GET: λίστα προϊόντων ───────────────── */
export async function GET() {
  try {
    const items = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ ok: true, items });
  } catch (err: any) {
    console.error("admin/products GET error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}

/* ───────────────── POST: νέο προϊόν ───────────────── */
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdminEmail(session?.user?.email)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 403 });
    }

    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const priceEUR = String(form.get("priceEUR") || "").trim();
    const category = String(form.get("category") || "").trim();
    const description = String(form.get("description") || "").trim();
    const file = form.get("image");

    if (!title || !priceEUR) {
      return NextResponse.json(
        { ok: false, error: "Συμπλήρωσε τίτλο και τιμή." },
        { status: 400 }
      );
    }
    if (!(file instanceof File)) {
      return NextResponse.json(
        { ok: false, error: "Δεν βρέθηκε εικόνα." },
        { status: 400 }
      );
    }
    if (!/^image\//i.test(file.type)) {
      return NextResponse.json(
        { ok: false, error: "Η εικόνα πρέπει να είναι image/*." },
        { status: 400 }
      );
    }

    const priceCents = parsePriceEUR(priceEUR);
    if (!isFinite(priceCents) || priceCents <= 0) {
      return NextResponse.json(
        { ok: false, error: "Μη έγκυρη τιμή." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(title);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    // 🔹 Ανεβάζουμε απευθείας το File (Blob) — ΟΧΙ Uint8Array
    const key =
      `products/${Date.now()}-${baseSlug}${file.name ? "-" + file.name : ""}`.slice(0, 200);

    const { url } = await put(key, file, {
      access: "public",
      contentType: file.type || "image/jpeg",
      addRandomSuffix: false,
    });

    const item = await prisma.product.create({
      data: {
        title,
        slug,
        priceCents,
        description: description || null,
        imageUrl: url,
        category: category || null,
      },
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (err: any) {
    console.error("admin/products POST error:", err);
    return NextResponse.json(
      { ok: false, error: err?.message || "Server error" },
      { status: 500 }
    );
  }
}


