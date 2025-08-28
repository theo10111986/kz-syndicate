"use client";

import Image from "next/image";
import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomeClient() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff", position: "relative" }}>
      {/* ✅ Hero Section με next/image */}
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
        {/* Hero background */}
        <Image
          src="/IMG_0198.jpeg"
          alt="Neymar Custom Sneakers"
          fill
          priority
          quality={85}
          style={{
            objectFit: "contain", // ίδιο με before
            objectPosition: "center",
            zIndex: -1,
          }}
        />

        <h1
          style={{
            fontSize: "2rem",
            color: "#010101ff",
            textShadow: "0 0 8px #0ff, 0 0 16px #0ff",
            textAlign: "center",
            position: "relative", // για να κάθεται πάνω από την εικόνα
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
            height: calc(100vh - 60px);
          }
          .section {
            padding: 1.5rem 0;
          }
        }
      `}</style>
    </main>
  );
}

