"use client";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  return (
    <html>
      <body style={{
        background:"#000", color:"#0ff", minHeight:"100vh",
        display:"flex", alignItems:"center", justifyContent:"center",
        textAlign:"center", padding:"24px"
      }}>
        <div>
          <h1 style={{ fontSize: "1.6rem", marginBottom: 8 }}>Κάτι πήγε στραβά</h1>
          <p style={{ opacity:.85, marginBottom: 16 }}>Δοκίμασε ξανά σε λίγο.</p>
          <a href="/" style={{ textDecoration: "underline", color: "#0ff" }}>Επιστροφή στην αρχική</a>
        </div>
      </body>
    </html>
  );
}
