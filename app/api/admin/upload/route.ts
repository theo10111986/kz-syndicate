// app/api/admin/upload/route.ts
export const runtime = 'nodejs'; // τρέχει σε Node.js (απαιτείται για το put)

import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(req: Request) {
  // Περιμένουμε multipart/form-data με field "file"
  const form = await req.formData();
  const file = form.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ ok: false, error: 'No file' }, { status: 400 });
  }

  const nameFromForm = (form.get('filename') as string | null)?.trim();
  const safeName = nameFromForm || file.name || 'upload.bin';

  // Ανεβάζουμε δημόσια στο Blob Store (χρησιμοποιεί το BLOB_READ_WRITE_TOKEN)
  const { url } = await put(`gallery/${Date.now()}-${safeName}`, file, {
    access: 'public',
  });

  return NextResponse.json({ ok: true, url });
}

