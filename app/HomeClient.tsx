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
        <div className="heroBgWrapper">
          <Image
            src="/IMG_0198.jpeg"
            alt=""
            fill
            priority
            sizes="100vw"
            quality={90}
            className="heroImg"
          />
        </div>
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

      {/* Video Section */}
      <section className="section flex flex-col items-center">
        <h3
          style={{
            fontSize: "1.2rem",
            color: "#0ff",
            textShadow: "0 0 6px #0ff, 0 0 12px #0ff",
            marginBottom: "1rem",
            textAlign: "center",
          }}
        >
          Δες εδώ πώς δουλεύει το Customizer 👟✨
        </h3>

        <div className="videoWrapper">
          <video controls>
            <source src="/0914 (1).mp4" type="video/mp4" />
            Ο browser σας δεν υποστηρίζει το video.
          </video>
        </div>
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
          width: 100%;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .heroBgWrapper {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9; /* σταθερή αναλογία */
          min-height: 300px; /* fallback ύψος */
          background: #000; /* μαύρο background όσο φορτώνει */
          z-index: 0;
        }

        .heroImg {
          object-fit: cover;
          object-position: center;
        }

        .heroTitle {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 2rem;
          color: #010101ff;
          text-shadow: 0 0 8px #0ff, 0 0 16px #0ff;
          text-align: center;
          z-index: 1;
          margin: 0;
          padding: 0 1rem;
        }

        .section {
          padding: 4rem 0;
        }

        .videoWrapper {
          position: relative;
          width: 100%;
          max-width: 800px;
          margin: 0 auto;
          aspect-ratio: 16 / 9; /* ✅ σταθερό aspect ratio */
          background: #000; /* ✅ φόντο όσο φορτώνει */
        }

        .videoWrapper video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
          box-shadow: 0 0 14px #0ff;
          display: block;
        }

        @media (max-width: 767px) {
          .heroTitle {
            font-size: 1rem;
            white-space: nowrap;
            line-height: 1.2;
            padding: 0;
          }

          .section {
            padding: 0.75rem 0;
          }
          .partners {
            padding-top: 0;
            margin-top: 0;
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

          h3 {
            font-size: 1rem;
          }

          .videoWrapper {
            width: 90%;
            max-width: 100%;
            margin: 0 auto;
          }
        }
      `}</style>
    </main>
  );
}


