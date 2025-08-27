// app/api/admin/products/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

function slugify(t: string) {
  return t
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

function sanitize(name: string) {
  return name.replace(/[^\w.\-]+/g, "_");
}

// GET: λίστα προϊόντων
export async function GET() {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ ok: true, items });
}

// POST: admin only – δημιουργία προϊόντος με upload εικόνας
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }

    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const priceEUR = String(form.get("priceEUR") || "").trim();
    const category = String(form.get("category") || "").trim();
    const description = String(form.get("description") || "").trim();
    const file = form.get("image") as File | null;

    if (!title || !priceEUR || !file) {
      return NextResponse.json({ ok: false, error: "Title, price and image are required" }, { status: 400 });
    }

    const price = Number(priceEUR.replace(",", "."));
    if (!Number.isFinite(price) || price <= 0) {
      return NextResponse.json({ ok: false, error: "Invalid price" }, { status: 400 });
    }
    const priceCents = Math.round(price * 100);

    // upload στο Blob
    const fname = sanitize(file.name || "product.png");
    const key = `products/${Date.now()}-${fname}`;
    const { url } = await put(key, file, { access: "public", token });

    // unique slug
    let slug = slugify(title);
    if (!slug) slug = "product";
    let s = slug;
    let i = 2;
    while (await prisma.product.findUnique({ where: { slug: s } })) {
      s = `${slug}-${i++}`;
    }

    const item = await prisma.product.create({
      data: {
        title,
        slug: s,
        priceCents,
        description: description || null,
        imageUrl: url,
        category: category || null,
        published: true,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (err: any) {
    console.error("admin/products POST error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
