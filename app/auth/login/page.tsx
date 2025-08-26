"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const [tab, setTab] = useState<"password" | "magic">("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const pageStyle: React.CSSProperties = {
    backgroundColor: "#000",
    color: "#0ff",
    minHeight: "100vh",
    paddingTop: "80px",           // για το fixed navbar
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  };

  const cardStyle: React.CSSProperties = {
    backgroundColor: "#000",
    borderRadius: "1.5rem",
    padding: "2rem",
    width: "100%",
    maxWidth: 440,
    boxShadow: "0 0 15px #0ff4",
    border: "1px solid #0ff6",
  };

  const titleStyle: React.CSSProperties = {
    fontSize: "1.8rem",
    fontWeight: "bold",
    textShadow: "0 0 15px #0ff, 0 0 30px #0ff",
    marginBottom: "1.2rem",
    textAlign: "center",
  };

  const label: React.CSSProperties = { color: "#9ef", fontSize: "0.9rem", display: "block", marginBottom: 6 };
  const input: React.CSSProperties = {
    width: "100%", padding: "10px 12px", borderRadius: 12, background: "#000",
    border: "1px solid #0ff6", color: "#fff", outline: "none", boxShadow: "inset 0 0 6px #0ff2"
  };
  const btn: React.CSSProperties = {
    width: "100%", padding: "12px", borderRadius: 14, background: "#0ff", color: "#000",
    fontWeight: 700, border: "none", cursor: "pointer", boxShadow: "0 0 25px #0ff"
  };

  async function loginWithPassword(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    const res = await signIn("credentials", {
      email,
      password,
      callbackUrl: "/account",
      redirect: false, // χειριζόμαστε μόνοι μας το redirect
    });
    setBusy(false);
    if (res?.error) { setErr("Λάθος email ή κωδικός."); return; }
    if (res?.ok) window.location.href = res.url || "/account";
  }

  async function loginMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true); setErr(null); setMsg(null);
    const res = await signIn("email", {
      email,
      callbackUrl: "/account",
      redirect: false,
    });
    setBusy(false);
    if (res?.error) { setErr("Δεν στάλθηκε email. Έλεγξε το SMTP ή δοκίμασε ξανά."); return; }
    setMsg("Σου στείλαμε σύνδεσμο στο email. Έλεγξε το inbox/spam.");
  }

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>
        <h1 style={titleStyle}>Σύνδεση</h1>

        {/* Tabs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setTab("password")}
            style={{
              padding: 10, borderRadius: 12,
              background: tab === "password" ? "#0ff" : "transparent",
              color: tab === "password" ? "#000" : "#0ff",
              border: "1px solid #0ff6", fontWeight: 700, cursor: "pointer"
            }}
          >
            Κωδικός
          </button>
          <button
            onClick={() => setTab("magic")}
            style={{
              padding: 10, borderRadius: 12,
              background: tab === "magic" ? "#0ff" : "transparent",
              color: tab === "magic" ? "#000" : "#0ff",
              border: "1px solid #0ff6", fontWeight: 700, cursor: "pointer"
            }}
          >
            Magic Link
          </button>
        </div>

        {tab === "password" ? (
          <form onSubmit={loginWithPassword} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} required />
            </div>
            <div>
              <label style={label}>Κωδικός</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={input} required />
            </div>
            {err && <p style={{ color: "#f77", textAlign: "center" }}>{err}</p>}
            {msg && <p style={{ color: "#7f7", textAlign: "center" }}>{msg}</p>}
            <button type="submit" style={btn} disabled={busy}>
              {busy ? "Σύνδεση..." : "Σύνδεση"}
            </button>
          </form>
        ) : (
          <form onSubmit={loginMagicLink} style={{ display: "grid", gap: 12 }}>
            <div>
              <label style={label}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} style={input} required />
            </div>
            {err && <p style={{ color: "#f77", textAlign: "center" }}>{err}</p>}
            {msg && <p style={{ color: "#7f7", textAlign: "center" }}>{msg}</p>}
            <button type="submit" style={btn} disabled={busy}>
              {busy ? "Αποστολή..." : "Στείλε magic link"}
            </button>
          </form>
        )}

        <p style={{ color: "#9ef", textAlign: "center", marginTop: 16 }}>
          Δεν έχεις λογαριασμό;{" "}
          <Link href="/auth/register" style={{ color: "#0ff", textDecoration: "underline" }}>
            Εγγραφή
          </Link>
        </p>
      </div>

      <div style={{ height: 40 }} />
    </div>
  );
}
