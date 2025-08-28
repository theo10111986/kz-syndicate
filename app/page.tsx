"use client";

export const metadata = {
  title: "KZ Syndicate | Custom Sneakers & Streetwear",
  description: "Join the underground, wear the code. Custom sneakers, ρούχα και αξεσουάρ.",
};

import Partners from "@/components/Partners";
import Newsletter from "@/components/Newsletter";
import Contact from "@/components/Contact";

export default function HomePage() {
  return (
    <main style={{ backgroundColor: "#000", color: "#fff" }}>
      {/* Hero Section με Neymar */}
      <section
        className="hero"
        style={{
          height: "110vh",
          backgroundImage: 'url("/IMG_0198.jpeg")',
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "0",   // βεβαιωνόμαστε ότι ξεκινάει πάνω-πάνω
          paddingTop: "0",
        }}
      >
        <h1
          style={{
            fontSize: "2rem",
            color: "#010101ff",
            textShadow: "0 0 8px #0ff, 0 0 16px #0ff",
            textAlign: "center",
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
        ></h2>
        <Partners />
      </section>

      {/* Newsletter */}
      <Newsletter />

      {/* Contact */}
      <Contact />

      {/* Responsive tweaks μόνο για mobile */}
      <style jsx>{`
        /* Desktop: κρατάμε Ο,ΤΙ έχεις */
        .hero { height: 110vh; }
        .section { padding: 4rem 0; }

        /* Mobile: διορθώνουμε τα κενά */
        @media (max-width: 767px) {
          .hero {
            height: calc(100vh - 60px); /* καλύπτει όλη την οθόνη κάτω από το navbar */
            background-size: cover;
            background-position: top center;
            margin-top: 0;
            padding-top: 0;
          }
          .section {
            padding: 1.5rem 0; /* μικρότερα gaps */
          }
        }
      `}</style>
    </main>
  );
}
