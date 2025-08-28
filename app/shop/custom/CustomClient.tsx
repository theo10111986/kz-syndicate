// app/shop/custom/CustomClient.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

const customCategories = [
  {
    title: "Angelus – Χρώμα για λείο δέρμα",
    img: "/shop-categories/angelus.png",
    link: "/shop/custom/angelus",
  },
  {
    title: "Πρόσθετα & Προεργασία",
    img: "/shop-categories/additives.png",
    link: "/shop/custom/additives",
  },
];

export default function CustomLandingPage() {
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
        Custom Yourself
      </h1>
      <p style={{ color: "#fff", marginBottom: "2rem" }}>
        Επίλεξε υποκατηγορία για να ξεκινήσεις το customization σου.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {customCategories.map((cat, index) => (
          <Link key={index} href={cat.link}>
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
                src={cat.img}
                alt={cat.title}
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
                {cat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}


