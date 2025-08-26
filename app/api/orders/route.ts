import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// --- Δημιουργία παραγγελίας ---
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total, currency = "EUR", shipping } = body || {};

    // Έλεγχοι δεδομένων
    if (!Array.isArray(items) || items.length === 0) {
      return Response.json({ ok: false, error: "Το καλάθι είναι άδειο." }, { status: 400 });
    }
    if (typeof total !== "number" || !isFinite(total) || total < 0) {
      return Response.json({ ok: false, error: "Μη έγκυρο σύνολο." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true },
    });

    if (!user) {
      return Response.json({ ok: false, error: "User not found" }, { status: 404 });
    }

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        items, // Json
        total: new Prisma.Decimal(total),
        currency,
        // shipping: shipping ? JSON.stringify(shipping) : null // Αν θες να το κρατάς
      },
      select: { id: true, createdAt: true },
    });

    return Response.json(
      { ok: true, id: order.id, createdAt: order.createdAt },
      { status: 201 }
    );
  } catch (err) {
    console.error("Create order error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}

// --- Λήψη παραγγελιών για το /account ---
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: { user: { email: session.user.email } },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ ok: true, orders });
  } catch (err) {
    console.error("Fetch orders error:", err);
    return Response.json({ ok: false, error: "Server error" }, { status: 500 });
  }
}
