"use client";

import Image from "next/image";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomeClient() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff", position: "relative" }}>
      {/* Hero Section */}
      <section
        className="hero"
        style={{
          height: "110vh",
          position: "relative",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 0,
          paddingTop: 0,
          overflow: "hidden",
        }}
      >
        {/* ✅ Background wrapper (πάνω από το body, κάτω από το κείμενο) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          <Image
            src="/IMG_0198.jpeg"          // βεβαιώσου ότι υπάρχει ακριβώς αυτό το όνομα στο /public
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className="heroBg"
            style={{
              objectFit: "contain",       // ίδιο οπτικά με πριν (desktop/tablet)
              objectPosition: "center",
            }}
          />
        </div>

        {/* Τίτλος επάνω από την εικόνα */}
        <h1
          style={{
            fontSize: "2rem",
            color: "#010101ff",
            textShadow: "0 0 8px #0ff, 0 0 16px #0ff",
            textAlign: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          Join the underground, wear the code.
        </h1>
      </section>

      {/* Our Partners */}
      <section className="section" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#161818ff",
            textShadow: "0 0 8px #0ff",
            marginBottom: "2rem",
          }}
        />
        <Partners />
      </section>

      {/* App */}
      <section className="section" style={{ padding: "4rem 0", textAlign: "center" }}>
        <h2
          style={{
            fontSize: "1.8rem",
            color: "#161818ff",
            textShadow: "0 0 8px #0ff",
            marginBottom: "1rem",
          }}
        >
          KZ Syndicate App
        </h2>
        <p style={{ opacity: 0.85, marginBottom: "1.25rem" }}>
          Κατέβασε την εφαρμογή μας για Android ή δες οδηγίες εγκατάστασης.
        </p>
        <a
          href="/app"
          style={{
            display: "inline-block",
            padding: "12px 18px",
            background: "#00ffff",
            color: "#000",
            fontWeight: 800,
            borderRadius: 12,
            boxShadow: "0 0 14px #0ff",
            textDecoration: "none",
          }}
        >
          ⬇️ Download / Οδηγίες
        </a>
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Contact */}
      <Contact />

      {/* Responsive tweaks */}
      <style jsx>{`
        .hero {
          height: 110vh;
        }
        .section {
          padding: 4rem 0;
        }

        @media (max-width: 767px) {
          .hero {
            height: 100svh; /* mobile-safe viewport height */
          }
          .heroBg {
            object-fit: cover; /* αποφυγή κενών/μπαρών στο κινητό */
          }
          .section {
            padding: 1.5rem 0;
          }
        }
      `}</style>
    </main>
  );
}

