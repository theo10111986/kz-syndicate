// components/Footer.tsx
export default function Footer() {
  return (
    <footer
      style={{
        marginTop: "6rem",
        borderTop: "1px solid rgba(34, 211, 238, 0.3)", // cyan-500/30
        backgroundColor: "#000",
        color: "#e5e7eb", // gray-200
      }}
    >
      {/* Tagline */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "3rem 1rem 2rem",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "1.4rem",
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          <span
            style={{
              display: "block",
              fontSize: "1.7rem",
              fontWeight: 600,
              color: "#22d3ee", // cyan-400
              textShadow: "0 0 8px #0ff, 0 0 16px #0ff",
              marginBottom: "0.4rem",
            }}
          >
            Be customised. Be unique.
          </span>
          Κάθε κομμάτι που φτιάχνουμε είναι μοναδικό, όπως κι εσύ. Ξεχώρισε από το
          πλήθος — φόρεσε κάτι που δεν έχει κανείς άλλος.
        </p>
      </div>

      {/* Bottom row */}
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "1rem 1rem 2.5rem",
        }}
      >
        {/* Links (centered) */}
        <nav
          style={{
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "1rem",
            marginBottom: "0.8rem",
          }}
        >
          <a href="/legal/disclaimer" style={linkStyle}>Disclaimer</a>
          <a href="/legal/cookies" style={linkStyle}>Cookies</a>
          <a href="/legal/privacy" style={linkStyle}>Privacy</a>
          <a href="/legal/terms" style={linkStyle}>Terms</a>
        </nav>

        {/* Copyright */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.9rem",
            color: "rgba(229,231,235,0.75)",
            margin: 0,
          }}
        >
          © {new Date().getFullYear()} KZ Syndicate
        </p>
      </div>
    </footer>
  );
}

const linkStyle: React.CSSProperties = {
  color: "#8ef9ff",
  textDecoration: "none",
  transition: "color 150ms ease",
  fontWeight: 500,
};
