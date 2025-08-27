
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { put } from "@vercel/blob";

function isAdmin(email?: string | null) {
  const list = (process.env.ADMIN_EMAILS || "").split(",").map(s => s.trim().toLowerCase()).filter(Boolean);
  return !!email && list.includes(email.toLowerCase());
}

function sanitize(name: string) {
  return name.replace(/[^\w.\-]+/g, "_");
}

export async function POST(req: Request) {
  try {
    // έλεγχος admin
    const session = await getServerSession(authOptions);
    if (!isAdmin(session?.user?.email)) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    // token για το Blob
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return NextResponse.json({ ok: false, error: "Missing BLOB_READ_WRITE_TOKEN" }, { status: 500 });
    }

    // περιμένουμε multipart/form-data με πεδίο "file"
    const form = await req.formData();
    const file = form.get("file");
    const folder = (form.get("folder") as string) || "gallery"; // προαιρετικό

    if (!(file instanceof File)) {
      return NextResponse.json({ ok: false, error: "No file" }, { status: 400 });
    }

    const fname = sanitize(file.name || "upload.png");
    const key = `${folder}/${Date.now()}-${fname}`;

    // ανέβασμα στο Vercel Blob (public)
    const { url } = await put(
      key,
      file, // μπορώ να δώσω κατευθείαν File
      { access: "public", token }
    );

    return NextResponse.json({ ok: true, url, key });
  } catch (err: any) {
    console.error("upload error", err);
    return NextResponse.json({ ok: false, error: err?.message || "Server error" }, { status: 500 });
  }
}
