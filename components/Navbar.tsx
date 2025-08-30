"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { cart } = useCart();
  const totalItems = (cart ?? []).reduce((sum, item) => sum + item.quantity, 0);
  const { data: session } = useSession();

  const [open, setOpen] = useState(false);

  // ESC για κλείσιμο
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const menuItems = [
    { label: "Home", href: "/" },
    { label: "Custom", href: "/custom" },
    { label: "Shop", href: "/shop" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/#contact" },
    { label: `Cart (${totalItems})`, href: "/cart" },
    session ? { label: "Account", href: "/account" } : { label: "Login", href: "/auth/login" },
  ];

  return (
    <>
      {/* ===== Desktop bar ===== */}
      <div
        className="desktopBar"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#000",
          borderBottom: "1px solid #111",
          padding: "1rem 0",
          zIndex: 10000,
          display: "flex",
          justifyContent: "center",
          gap: "2rem",
          boxShadow: "0 2px 12px rgba(0,255,255,0.08)",
        }}
      >
        {menuItems.map((item) => (
          <Link key={item.label} href={item.href}>
            <span
              style={{
                color: "#00ffff",
                fontWeight: "bold",
                textDecoration: "none",
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "transform 0.2s, text-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.textShadow = "0 0 10px #0ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              {item.label}
            </span>
          </Link>
        ))}

        {session && (
          <>
            <Link href="/account/requests">
              <span
                style={{
                  color: "#00ffff",
                  fontWeight: "bold",
                  textDecoration: "none",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "transform 0.2s, text-shadow 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.08)";
                  e.currentTarget.style.textShadow = "0 0 10px #0ff";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.textShadow = "none";
                }}
              >
                Τα αιτήματά μου
              </span>
            </Link>

            <span
              onClick={() => signOut()}
              style={{
                color: "#ff4444",
                fontWeight: "bold",
                fontSize: "1.1rem",
                cursor: "pointer",
                transition: "transform 0.2s, text-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.textShadow = "0 0 10px #f44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.textShadow = "none";
              }}
            >
              Logout
            </span>
          </>
        )}
      </div>

      {/* ===== Mobile top bar ===== */}
      <div
        className="mobileBar"
        style={{
          position: "fixed",
          top: 0,
          width: "100%",
          backgroundColor: "#000",
          borderBottom: "1px solid #111",
          padding: "0.75rem 0",
          zIndex: 10000,
          display: "none",
        }}
      >
        <div
          className="mobileInner"
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "0 12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Link href="/" style={{ color: "#00ffff", fontWeight: 700 }}>
            KZ Syndicate
          </Link>
          <button
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            style={{ color: "#00ffff", fontSize: "1.6rem", lineHeight: 1 }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Overlay για το sidebar */}
      {open && (
        <div
          onClick={() => setOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 9999,
          }}
        />
      )}

      {/* ===== Mobile sidebar ===== */}
      <aside
        role="dialog"
        aria-modal="true"
        className="mobileSidebar"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: 260,
          maxWidth: "85%",
          backgroundColor: "#0a0a0a",
          borderLeft: "1px solid #00ffff",
          padding: "1.5rem",
          zIndex: 10000,
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s ease",
          display: "none",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          style={{ alignSelf: "flex-end", color: "#00ffff", fontSize: "1.1rem", marginBottom: "0.5rem" }}
        >
          ✕
        </button>

        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            onClick={() => setOpen(false)}
            style={{
              color: "#00ffff",
              fontWeight: "bold",
              textDecoration: "none",
              fontSize: "1.05rem",
              padding: "0.5rem 0.25rem",
            }}
          >
            {item.label}
          </Link>
        ))}

        {session && (
          <>
            <Link
              href="/account/requests"
              onClick={() => setOpen(false)}
              style={{
                color: "#00ffff",
                fontWeight: "bold",
                textDecoration: "none",
                fontSize: "1.05rem",
                padding: "0.5rem 0.25rem",
              }}
            >
              Τα αιτήματά μου
            </Link>
            <span
              onClick={() => {
                setOpen(false);
                signOut();
              }}
              style={{
                color: "#ff4444",
                fontWeight: "bold",
                cursor: "pointer",
                padding: "0.5rem 0.25rem",
                fontSize: "1.05rem",
              }}
            >
              Logout
            </span>
          </>
        )}
      </aside>

      {/* Spacers */}
      <div className="spacerDesktop" aria-hidden />
      <div className="spacerMobile" aria-hidden />

      {/* Styled-JSX */}
      <style jsx>{`
        .spacerDesktop { height: 96px; display: block; }
        .spacerMobile  { height: 0;   display: none;  }

        @media (max-width: 767px) {
          .desktopBar   { display: none !important; }
          .mobileBar    { display: block !important; }
          .mobileSidebar{ display: flex !important; }

          .spacerDesktop { display: none; }
          .spacerMobile  { display: block; height: 0px; }

          /* ✅ Safe padding για notch / cutouts */
          .mobileBar .mobileInner {
            padding-left: max(12px, env(safe-area-inset-left));
            padding-right: max(12px, env(safe-area-inset-right));
          }
        }
      `}</style>
    </>
  );
}

