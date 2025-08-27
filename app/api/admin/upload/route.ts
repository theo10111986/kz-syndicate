// app/api/admin/upload/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    await requireAdmin(); // μόνο admin

    const form = await req.formData();
    const file = form.get("file") as File | null;
    if (!file) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const ext = (file.name.split(".").pop() || "bin").toLowerCase();
    const key = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    // μετατροπή σε Buffer για το put()
    const arrayBuf = await file.arrayBuffer();
    const buf = Buffer.from(arrayBuf);

    const saved = await put(key, buf, {
      access: "public",
      token: process.env.BLOB_READ_WRITE_TOKEN, // θα το βάλουμε στο Vercel ENV
      contentType: file.type || "application/octet-stream",
    });

    return NextResponse.json({ url: saved.url });
  } catch (e: any) {
    const msg = e?.message === "FORBIDDEN" ? "Forbidden" : e?.message || "Upload error";
    return NextResponse.json({ error: msg }, { status: msg === "Forbidden" ? 403 : 500 });
  }
}
