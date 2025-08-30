"use client";

export default function ComingSoonJerseys() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "2rem",
      }}
    >
      <h1
        style={{
          color: "#00e5ff",
          fontSize: "2.5rem",
          fontWeight: "bold",
          textShadow: "0 0 12px #00e5ff",
          marginBottom: "1rem",
        }}
      >
        Jerseys – Coming Soon
      </h1>
      <p style={{ maxWidth: 500, opacity: 0.8 }}>
        Η κατηγορία Jackets ετοιμάζεται... μείνε συντονισμένος!  
        {"\n"}Join the underground, wear the code.
      </p>
    </main>
  );
}
