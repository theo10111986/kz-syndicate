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
        <div className="heroFrame">
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
              src="/IMG_0198.jpeg"
              alt=""
              fill
              priority
              sizes="100vw"
              quality={85}
              className="heroBg"
            />
          </div>

          <h1 className="heroTitle">Join the underground, wear the code.</h1>
        </div>
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

      <Newsletter />
      <Contact />

      <style jsx>{`
        .hero {
          height: 110vh;
        }
        .section {
          padding: 4rem 0;
        }

        .heroFrame {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .heroBg {
          object-fit: contain;
          object-position: center;
        }
        .heroTitle {
          font-size: 2rem;
          color: #010101ff;
          text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          text-align: center;
          position: relative;
          z-index: 1;
          margin: 0;
          padding: 0 1rem;
        }

        @media (max-width: 767px) {
          .hero {
            height: auto;
          }
          .heroFrame {
            width: 100vw;
            margin: 0 auto;
            aspect-ratio: 2746 / 1987; /* ✅ σωστή αναλογία */
            max-height: 100svh;
          }
          .section {
            padding: 1.5rem 0;
          }
        }
      `}</style>
    </main>
  );
}

