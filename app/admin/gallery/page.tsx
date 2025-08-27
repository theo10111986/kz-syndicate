"use client";

import useSWR from "swr";
import { useState } from "react";
import { useSession } from "next-auth/react";

const fetcher = (url: string) => fetch(url).then(r => r.json());

export default function AdminGalleryPage() {
  const { data: session } = useSession();
  const { data, mutate, isLoading } = useSWR("/api/admin/gallery", fetcher);

  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) {
      setMsg("Συμπλήρωσε τίτλο και διάλεξε αρχείο.");
      return;
    }
    try {
      setBusy(true);
      setMsg(null);
      const fd = new FormData();
      fd.append("title", title.trim());
      fd.append("tags", tags);
      fd.append("file", file);

      const res = await fetch("/api/admin/gallery", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok || json.ok === false) {
        throw new Error(json?.error || "Αποτυχία upload");
      }
      setTitle("");
      setTags("");
      setFile(null);
      await mutate(); // refresh λίστα
      setMsg("✔ Το item προστέθηκε!");
    } catch (err: any) {
      setMsg(`❌ ${err?.message || "Κάτι πήγε στραβά"}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: "90px 16px", maxWidth: 900, margin: "0 auto", color: "#e8ffff" }}>
      <h1 style={{ fontSize: 24, marginBottom: 12 }}>Admin · Gallery</h1>
      {!session?.user?.email && (
        <p style={{ color: "#ffb" }}>Πρέπει να είσαι συνδεδεμένος/η. (Το email σου πρέπει να υπάρχει στο ADMIN_EMAILS.)</p>
      )}

      <form onSubmit={onSubmit} style={{ border: "1px solid #0d2b2c", borderRadius: 12, padding: 16, background: "#070a0c" }}>
        <label style={{ display: "block", marginBottom: 8 }}>
          Τίτλος
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 8 }}>
          Tags (χωρισμένα με κόμμα)
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="graffiti,red,air-force"
            style={{ width: "100%", marginTop: 6, padding: 10, borderRadius: 8, background: "#0b0f12", color: "#c8ffff", border: "1px solid #113" }}
          />
        </label>

        <label style={{ display: "block", marginBottom: 12 }}>
          Εικόνα
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            style={{ display: "block", marginTop: 6 }}
          />
        </label>

        <button
          disabled={busy}
          style={{ padding: "12px 18px", borderRadius: 10, border: "none", background: "#00ffff", color: "#002224", fontWeight: 900, cursor: "pointer" }}
        >
          {busy ? "Ανεβάζω..." : "Upload & Save"}
        </button>

        {msg && <p style={{ marginTop: 10 }}>{msg}</p>}
      </form>

      <h2 style={{ margin: "22px 0 8px" }}>Τελευταία items</h2>
      {isLoading ? (
        <p>Φόρτωση…</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {(data?.items || []).map((it: any) => (
            <figure key={it.id} style={{ border: "1px solid #0d2b2c", borderRadius: 12, padding: 8, background: "#070a0c" }}>
              <img src={it.imageUrl} alt={it.title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8 }} />
              <figcaption style={{ marginTop: 6, fontSize: 14 }}>
                <strong>{it.title}</strong>
                {Array.isArray(it.tags) && it.tags.length > 0 && (
                  <div style={{ opacity: 0.8, fontSize: 12 }}>{it.tags.join(", ")}</div>
                )}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </main>
  );
}
