import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Η τράπεζα στέλνει POST (application/x-www-form-urlencoded)
  // Παίρνουμε τα πεδία (π.χ. MerchantReference) για debug / display
  const form = await req.formData();
  const ref = String(form.get("MerchantReference") || "");

  // TODO: εδώ αργότερα κάνεις και έλεγχο HashKey αν θέλεις (προαιρετικά για το test)
  // Προς το παρόν απλά redirect στη σελίδα για να φανεί καθαρό μήνυμα.
  const url = new URL(`/checkout/payment/success?ref=${encodeURIComponent(ref)}`, req.url);
  return NextResponse.redirect(url);
}

// Προαιρετικά, αν η τράπεζα κάνει κατά λάθος GET:
export async function GET(req: Request) {
  return NextResponse.redirect(new URL("/checkout/payment/success", req.url));
}
