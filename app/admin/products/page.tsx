"use client";

import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

function formatEUR(cents: number) {
  return new Intl.NumberFormat("el-GR", { style: "currency", currency: "EUR" })
    .format((cents || 0) / 100);
}

export default function AdminProductsPage() {
  const { data: session } = useSession();
  const { data, mutate, isLoading } = useSWR("/api/admin/products", fetcher);

  const [title, setTitle] = useState("");
  const [priceEUR, setPriceEUR] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!image || !title.trim() || !priceEUR.trim()) {
      setMsg("Συμπλήρωσε τίτλο, τιμή και εικόνα.");
      return;
    }
    try {
      setBusy(true); setMsg(null);
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("priceEUR", priceEUR.trim());
      fd.append("category", category.trim());
      fd.append("description", description.trim());
      fd.append("image", image);

      const res = await fetch("/api/admin/products", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.ok === false) throw new Error(json?.error || "Αποτυχία δημιουργίας");

      setTitle(""); setPriceEUR(""); setCategory(""); setDescription(""); setImage(null);
      await mutate();
      setMsg("✔ Το προϊόν προστέθηκε!");
    } catch (err: any) {
      setMsg(`❌ ${err?.message || "Κάτι πήγε στραβά"}`);
    } finally { setBusy(false); }
  }

  return (
    <main style={{ padding: "90px 16px", maxWidth: 900, margin: "0 auto", color: "#e8ffff" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Admin · Products</h1>

      {!session?.user?.email && (
        <p style={{ color: "#ffb" }}>Πρέπει να είσαι συνδεδεμένος/η και το email σου να υπάρχει στο ADMIN_EMAILS.</p>
      )}

      <form onSubmit={onSubmit} style={{ border: "1px solid #0d2b2c", borderRadius: 12, padding: 16, background: "#070a0c" }}>
        <div style={{ display: "grid", gap: 10 }}>
          <label>
            Τίτλος
            <input value={title} onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }} />
          </label>

          <label>
            Τιμή (EUR)
            <input value={priceEUR} onChange={(e) => setPriceEUR(e.target.value)}
              placeholder="π.χ. 149.90"
              style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }} />
          </label>

          <label>
            Κατηγορία (προαιρετικό)
            <input value={category} onChange={(e) => setCategory(e.target.value)}
              style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }} />
          </label>

          <label>
            Περιγραφή (προαιρετικό)
            <textarea value={description} onChange={(e) => setDescription(e.target.value)}
              style={{ width: "100%", minHeight: 80, marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }} />
          </label>

          <label>
            Εικόνα
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] || null)} style={{ display: "block", marginTop: 6 }} />
          </label>

          <button disabled={busy}
            style={{ padding: "12px 18px", borderRadius: 10, border: "none", background: "#00ffff", color: "#002224", fontWeight: 900, cursor: "pointer" }}>
            {busy ? "Ανεβάζω..." : "Δημιουργία Προϊόντος"}
          </button>

          {msg && <p>{msg}</p>}
        </div>
      </form>

      <h2 style={{ margin: "22px 0 8px" }}>Τελευταία προϊόντα</h2>
      {isLoading ? (
        <p>Φόρτωση…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12 }}>
          {(data?.items || []).map((p: any) => (
            <figure key={p.id} style={{ border: "1px solid #0d2b2c", borderRadius: 12, padding: 8, background: "#070a0c" }}>
              <img src={p.imageUrl} alt={p.title} style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: 8 }} />
              <figcaption style={{ marginTop: 6, fontSize: 14 }}>
                <strong>{p.title}</strong>
                <div style={{ opacity: 0.9 }}>{formatEUR(p.priceCents)}</div>
                {p.category && <div style={{ opacity: 0.8, fontSize: 12 }}>{p.category}</div>}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}
