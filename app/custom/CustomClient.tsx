// app/custom/CustomClient.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

const options = [
  {
    title: "Στο δικό μου sneaker",
    img: "/shop-categories/sneakers.png",
    link: "/customizer",
  },
  {
    title: "Αγορά sneaker",
    img: "/shop-categories/clothes.png",
    link: "/customizer", // ίδια ροή με δικό σου sneaker
  },
  {
    title: "Καπέλο",
    img: "/shop-categories/accessories.png",
    link: "/customizer-hat",
  },
];

export default function CustomClient() {
  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#00ffff",
          fontSize: "2rem",
          marginBottom: "3rem",
          textShadow: "0 0 10px #0ff",
        }}
      >
        Custom Options
      </h1>
      <p style={{ color: "#fff", marginBottom: "2rem" }}>
        Επίλεξε με ποιο τρόπο θες να φτιάξεις το δικό σου σχέδιο.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {options.map((opt, index) => (
          <Link key={index} href={opt.link}>
            <div
              style={{
                backgroundColor: "#000",
                border: "2px solid #00ffff",
                borderRadius: "2rem",
                padding: "2rem",
                width: "200px",
                height: "180px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px #0ff",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.08)";
                e.currentTarget.style.boxShadow = "0 0 30px #0ff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "0 0 15px #0ff";
              }}
            >
              <Image
                src={opt.img}
                alt={opt.title}
                width={150}
                height={150}
                style={{ marginBottom: "1rem" }}
              />
              <p
                style={{
                  color: "#00ffff",
                  fontWeight: "bold",
                  textShadow: "0 0 8px #0ff",
                  textAlign: "center",
                }}
              >
                {opt.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
