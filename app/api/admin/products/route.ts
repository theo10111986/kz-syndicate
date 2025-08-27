// app/api/admin/products/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

// ── helpers ─────────────────────────────────────────────
function isAdminEmail(email?: string | null) {
  const admins = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return !!(email && admins.includes(email.toLowerCase()));
}

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function eurToCents(x: string) {
  // δέχεται "149.90" ή "149,90"
  const n = Number((x || "0").replace(",", "."));
  return Math.max(0, Math.round(n * 100));
}

// ── GET: λίστα προϊόντων ───────────────────────────────
export async function GET() {
  const items = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    select: { id: true, title: true, priceCents: true, category: true, imageUrl: true, published: true },
  });
  return NextResponse.json({ ok: true, items });
}

// ── POST: δημιουργία προϊόντος (με upload εικόνας) ─────
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const title = String(form.get("title") || "").trim();
  const priceEUR = String(form.get("priceEUR") || "").trim();
  const category = String(form.get("category") || "").trim();
  const description = String(form.get("description") || "").trim();
  const file = form.get("image") as File | null;

  if (!title || !priceEUR || !file) {
    return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  }

  // upload σε Vercel Blob
  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);
  const key = `products/${Date.now()}-${slugify(title)}${file.name ? "-" + file.name : ""}`.slice(0, 200);

  const { url } = await put(key, bytes, {
    access: "public",
    contentType: file.type || "image/jpeg",
    addRandomSuffix: false,
  });

  // unique slug
  let base = slugify(title) || "product";
  let slug = base;
  let i = 1;
  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${++i}`;
  }

  const priceCents = eurToCents(priceEUR);

  const created = await prisma.product.create({
    data: {
      title,
      slug,
      priceCents,
      description: description || null,
      imageUrl: url,
      category: category || null,
      published: true,
    },
  });

  return NextResponse.json({ ok: true, id: created.id });
}

// ── PATCH: ενημέρωση (π.χ. publish/unpublish, τιμή κλπ) ─
export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  const data: any = {};
  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.category === "string") data.category = body.category.trim() || null;
  if (typeof body.description === "string") data.description = body.description.trim() || null;
  if (typeof body.priceEUR === "string") data.priceCents = eurToCents(body.priceEUR);

  await prisma.product.update({ where: { id }, data });
  return NextResponse.json({ ok: true });
}

// ── DELETE: διαγραφή προϊόντος ─────────────────────────
export async function DELETE(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!isAdminEmail(session?.user?.email)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const id = String(body.id || "");
  if (!id) return NextResponse.json({ ok: false, error: "Missing id" }, { status: 400 });

  await prisma.product.delete({ where: { id } });
  // (Προαιρετικά: διαγραφή του blob. Το αφήνουμε για αργότερα.)
  return NextResponse.json({ ok: true });
}

