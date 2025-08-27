// app/api/admin/gallery/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { put } from "@vercel/blob";

function isAdmin(email?: string | null) {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS || "";
  return raw.split(",").map(s => s.trim().toLowerCase()).includes(email.toLowerCase());
}

// GET: return latest gallery items
export async function GET() {
  const items = await prisma.galleryItem.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ ok: true, items });
}

// POST: admin only – upload image to Blob & create DB row
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const form = await req.formData();
    const title = String(form.get("title") || "").trim();
    const tagsStr = String(form.get("tags") || "").trim(); // comma separated
    const file = form.get("file") as File | null;

    if (!title || !file) {
      return NextResponse.json({ ok: false, error: "Title and file are required" }, { status: 400 });
    }

    // Upload στο Vercel Blob
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const filename = `gallery/${Date.now()}-${file.name.replace(/\s+/g, "-")}`;

    const { url } = await put(filename, buffer, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // από τα Environment Variables
      contentType: file.type || "application/octet-stream",
      cacheControlMaxAge: 31536000,
    });

    // Save στη DB
    const tags = tagsStr
      ? tagsStr.split(",").map(s => s.trim()).filter(Boolean)
      : [];

    const item = await prisma.galleryItem.create({
      data: {
        title,
        imageUrl: url,
        tags,          // Prisma Json[]
        published: true,
      },
    });

    return NextResponse.json({ ok: true, item });
  } catch (err: any) {
    console.error("admin/gallery POST error:", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
