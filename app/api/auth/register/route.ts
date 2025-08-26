// src/app/api/auth/register/route.ts
import { NextRequest } from "next/server";
import { z, ZodError } from "zod";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

const RegisterSchema = z.object({
  email: z.string().email().max(255),
  password: z.string().min(8).max(100),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  addressLine1: z.string().trim().min(1).max(255),
  addressLine2: z.string().trim().max(255).optional().or(z.literal("")),
  city: z.string().trim().min(1).max(120),
  postalCode: z.string().trim().min(2).max(20),
  country: z.string().trim().min(2).max(100),
  phone: z.string().trim().min(4).max(30),
});

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function POST(req: NextRequest) {
  try {
    const json = await req.json();
    const data = RegisterSchema.parse(json);

    const email = normalizeEmail(data.email);

    // Έλεγχος αν υπάρχει ήδη
    const existing = await prisma.user.findFirst({ where: { email } });
    if (existing) {
      return Response.json({ ok: false, error: "Το email υπάρχει ήδη." }, { status: 409 });
    }

    // Hash κωδικού
    const hashed = await bcrypt.hash(data.password, 12);

    // Δημιουργία χρήστη
    const user = await prisma.user.create({
      data: {
        email,
        password: hashed,
        firstName: data.firstName,
        lastName: data.lastName,
        addressLine1: data.addressLine1,
        addressLine2: data.addressLine2?.trim() ? data.addressLine2.trim() : null,
        city: data.city,
        postalCode: data.postalCode,
        country: data.country,
        phone: data.phone,
        name: `${data.firstName} ${data.lastName}`.trim(),
      },
      select: { id: true, email: true, firstName: true, lastName: true },
    });

    return Response.json({ ok: true, user }, { status: 201 });

  } catch (err: any) {
    if (err instanceof ZodError) {
      return Response.json(
        { ok: false, error: "Λάθος στοιχεία.", details: err.issues },
        { status: 400 }
      );
    }

    if (err?.code === "P2002") {
      return Response.json({ ok: false, error: "Το email υπάρχει ήδη." }, { status: 409 });
    }

    console.error("Register error:", err);
    return Response.json(
      { ok: false, error: err?.message || "Κάτι πήγε στραβά." },
      { status: 500 }
    );
  }
}
