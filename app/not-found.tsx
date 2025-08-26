export default function NotFound() {
  return (
    <main style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#000",
      color: "#0ff",
      textAlign: "center",
      padding: "24px"
    }}>
      <div>
        <h1 style={{ fontSize: "2rem", marginBottom: 8 }}>404</h1>
        <p style={{ opacity: .9, marginBottom: 16 }}>Η σελίδα δεν βρέθηκε.</p>
        <a href="/" style={{ textDecoration: "underline", color: "#0ff" }}>Επιστροφή στην αρχική</a>
      </div>
    </main>
  );
}
