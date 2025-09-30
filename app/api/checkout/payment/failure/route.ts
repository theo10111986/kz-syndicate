import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const form = await req.formData();
  const ref = String(form.get("MerchantReference") || "");
  const url = new URL(`/checkout/payment/failure?ref=${encodeURIComponent(ref)}`, req.url);
  return NextResponse.redirect(url);
}

export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/checkout/payment/failure", req.url));
}
