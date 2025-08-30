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
        <div className="heroFrame">
          <Image
            src="/IMG_0198.jpeg"
            alt=""
            width={2746}
            height={1987}
            priority
            quality={85}
            className="heroImg"
          />
          <h1 className="heroTitle">Join the underground, wear the code.</h1>
        </div>
      </section>

      {/* Our Partners */}
      <section className="section" style={{ textAlign: "center" }}>
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
        .hero {
          position: relative;
          margin: 0;
          padding: 0;
        }

        .heroFrame {
          width: 100%;
          position: relative;
        }

        .heroImg {
          width: 100%;
          height: auto;
          display: block;
        }

        .heroTitle {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          color: #010101ff;
          text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          margin: 0;
          padding: 0 1rem;
          z-index: 1;
          text-align: center;
        }

        .section {
          padding: 4rem 0;
        }

        @media (max-width: 767px) {
          .section {
            padding: 1.5rem 0;
          }
          .heroTitle {
            font-size: 1.5rem;
            line-height: 1.2;
          }
        }
      `}</style>
    </main>
  );
}

