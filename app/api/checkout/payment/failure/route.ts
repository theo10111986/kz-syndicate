import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "failure",
    message: "Η πληρωμή απέτυχε."
  });
}
