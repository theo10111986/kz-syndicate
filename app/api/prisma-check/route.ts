// src/app/api/prisma-check/route.ts
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Αν έχεις το μοντέλο User από NextAuth, αυτό θα επιστρέψει έναν αριθμό
    const userCount = await prisma.user.count();
    return Response.json({ ok: true, userCount });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ ok: false, error: err?.message ?? "Unknown error" }),
      { status: 500 }
    );
  }
}
