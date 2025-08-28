// app/custom/CustomClient.tsx
"use client";
import Image from "next/image";
import Link from "next/link";

const options = [
  {
    title: "Στο δικό μου sneaker",
    img: "/shop-categories/sneaker-own.png",
    href: "/customizer?source=own",
  },
  {
    title: "Αγορά sneaker (+τιμή)",
    img: "/shop-categories/sneaker-buy.png",
    href: "/customizer?source=shop",
  },
  {
    title: "Καπέλο",
    img: "/shop-categories/custom-cap-cyan.png",
    href: "/customizer-hat",
  },
];

// Σταθερό κουτί 170×170 με Next/Image fill + objectFit: "contain"
function IconBox({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: 170,
        height: 170,
        marginBottom: "0.5rem",
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </div>
  );
}

export default function CustomStartPage() {
  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "3rem 2rem",
      }}
    >
      <h1
        style={{
          color: "#00ffff",
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
          textShadow: "0 0 10px #0ff",
        }}
      >
        Ξεκίνα το δικό σου Custom Project
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        {options.map((opt, i) => (
          <Link
            key={i}
            href={opt.href}
            style={{
              width: "300px",
              height: "300px", // ίδιο ύψος με shop card
              backgroundColor: "#000",
              border: "2px solid #00ffff",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 0 20px #0ff",
              transition: "transform 0.3s, boxShadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 0 30px #0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 20px #0ff";
            }}
          >
            <IconBox src={opt.img} alt={opt.title} />
            <h3 style={{ color: "#00ffff" }}>{opt.title}</h3>
          </Link>
        ))}
      </div>
    </main>
  );
}
