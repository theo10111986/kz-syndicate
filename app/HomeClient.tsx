"use client";

import Image from "next/image";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomeClient() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff", position: "relative" }}>
      {/* Hero Section */}
      <section className="hero">
        {/* ✅ Background wrapper */}
        <div className="heroBgWrapper">
          <Image
            src="/IMG_0198.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={85}
            className="heroImg"
          />
        </div>

        {/* Τίτλος */}
        <h1 className="heroTitle">Join the underground, wear the code.</h1>
      </section>

      {/* Our Partners */}
      <section className="section partners" style={{ textAlign: "center" }}>
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
      <section className="section" style={{ textAlign: "center" }}>
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
        /* ---------- Desktop/Tablet ---------- */
        .hero {
          height: 110vh; /* full screen */
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .heroBgWrapper {
          position: absolute;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }

        .heroImg {
          object-fit: contain;
          object-position: center;
        }

        .heroTitle {
          font-size: 2rem;
          color: #010101ff;
          text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          text-align: center;
          z-index: 1;
          margin: 0;
          padding: 0 1rem;
          position: relative; /* ✅ στο PC κάθεται με flexbox */
        }

        .section {
          padding: 4rem 0;
        }

        /* ---------- Mobile ---------- */
        @media (max-width: 767px) {
          .hero {
            height: auto; /* όχι vh στο κινητό */
            display: block; /* βγάζουμε το flex για να δουλέψει το absolute */
          }
          .heroBgWrapper {
            position: relative;
            aspect-ratio: 2746 / 1987;
            width: 100%;
            max-height: 100svh;
          }
          .heroTitle {
            position: absolute; /* ✅ στο κινητό απόλυτη τοποθέτηση */
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 1.3rem;
            line-height: 1.1;
          }

          .section {
            padding: 0.5rem 0;
          }
          .partners {
            padding-top: 0 !important;
            margin-top: 0 !important;
          }
          .partners h2 {
            margin: 0 !important;
          }

          .section h2:empty {
            display: none;
            margin: 0;
          }

          p {
            margin-bottom: 0.5rem;
          }
        }
      `}</style>
    </main>
  );
}


