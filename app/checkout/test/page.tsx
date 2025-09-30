"use client";

import { useState } from "react";

export default function TestCheckoutPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startPayment() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: "100",
          merchantReference: "TEST-" + Date.now(),
          languageCode: "el-GR",
        }),
      });

      const html = await res.text();

      // Αν όλα είναι ΟΚ → το API επιστρέφει έτοιμη HTML (με form που redirectάρει στην τράπεζα)
      const newWin = window.open("", "_self"); // άνοιξε στο ίδιο tab
      newWin?.document.write(html);
      newWin?.document.close();
    } catch (err: any) {
      setError(err.message || "Σφάλμα στη συναλλαγή");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Δοκιμαστική πληρωμή</h1>
      <button onClick={startPayment} disabled={loading}>
        {loading ? "Φόρτωση..." : "Ξεκίνα πληρωμή"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

