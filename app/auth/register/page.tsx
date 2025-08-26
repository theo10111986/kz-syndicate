"use client";

import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "",
    addressLine1: "", addressLine2: "", city: "", postalCode: "",
    country: "Greece", phone: "",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null); setErr(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data?.error ?? "Κάτι πήγε στραβά."); return; }
      setMsg("Επιτυχής εγγραφή! Μεταφορά σε σελίδα σύνδεσης…");
      setTimeout(() => { window.location.href = "/api/auth/signin"; }, 1200);
    } catch (e: any) {
      setErr(e?.message ?? "Σφάλμα δικτύου.");
    } finally { setBusy(false); }
  };

  // inline styles για να “κολλάνε” με τα υπόλοιπα pages σου
  const pageStyle: React.CSSProperties = {
    backgroundColor: "#000",
    color: "#0ff",
    minHeight: "100vh",
    paddingTop: "80px",    // χώρο για το fixed navbar σου
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "1.5rem",
    padding: "2rem",
    width: "100%",
    maxWidth: 560,
    boxShadow: "0 0 15px #0ff4",
    border: "1px solid #0ff6",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "2rem",
    fontWeight: "bold",
    textShadow: "0 0 15px #0ff, 0 0 30px #0ff",
    marginBottom: "1.5rem",
    textAlign: "center",
  };

  const labelStyle: React.CSSProperties = {
    color: "#9ef", fontSize: "0.9rem", marginBottom: "0.25rem",
    display: "block",
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: "12px",
    backgroundColor: "#000",
    border: "1px solid #0ff6",
    color: "#fff",
    outline: "none",
    boxShadow: "inset 0 0 6px #0ff2",
  };

  const rowStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
  };

  const buttonStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px",
    borderRadius: "14px",
    background: "#0ff",
    color: "#000",
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 0 25px #0ff, 0 0 45px #0ff",
  };

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Δημιουργία λογαριασμού</h1>

        <form onSubmit={onSubmit} style={{ display: "grid", gap: "1rem" }}>
          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Όνομα</label>
              <input name="firstName" value={form.firstName} onChange={onChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Επώνυμο</label>
              <input name="lastName" value={form.lastName} onChange={onChange} style={inputStyle} required />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Email</label>
            <input type="email" name="email" value={form.email} onChange={onChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Κωδικός (min 8 χαρακτήρες)</label>
            <input type="password" name="password" minLength={8} value={form.password} onChange={onChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Διεύθυνση</label>
            <input name="addressLine1" value={form.addressLine1} onChange={onChange} style={inputStyle} required />
          </div>

          <div>
            <label style={labelStyle}>Διεύθυνση (συμπληρωματική)</label>
            <input name="addressLine2" value={form.addressLine2} onChange={onChange} style={inputStyle} />
          </div>

          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Πόλη</label>
              <input name="city" value={form.city} onChange={onChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>T.K.</label>
              <input name="postalCode" value={form.postalCode} onChange={onChange} style={inputStyle} required />
            </div>
          </div>

          <div style={rowStyle}>
            <div>
              <label style={labelStyle}>Χώρα</label>
              <input name="country" value={form.country} onChange={onChange} style={inputStyle} required />
            </div>
            <div>
              <label style={labelStyle}>Τηλέφωνο</label>
              <input name="phone" value={form.phone} onChange={onChange} style={inputStyle} required />
            </div>
          </div>

          {err && <p style={{ color: "#f77", textAlign: "center" }}>{err}</p>}
          {msg && <p style={{ color: "#7f7", textAlign: "center" }}>{msg}</p>}

          <button type="submit" style={buttonStyle} disabled={busy}>
            {busy ? "Γίνεται εγγραφή..." : "Εγγραφή"}
          </button>

          <p style={{ color: "#9ef", textAlign: "center" }}>
            Έχεις ήδη λογαριασμό;{" "}
            <Link href="/api/auth/signin" style={{ color: "#0ff", textDecoration: "underline" }}>
              Σύνδεση
            </Link>
          </p>
        </form>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
