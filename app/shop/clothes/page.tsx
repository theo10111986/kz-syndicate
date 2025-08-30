"use client";

import Image from "next/image";
import Link from "next/link";

const clothesCategories = [
  {
    title: "Jerseys",
    img: "/shop-categories/jersey.png", // βάλε εδώ το jersey icon (23)
    link: "/shop/clothes/jerseys",
  },
  {
    title: "T-Shirts",
    img: "/shop-categories/tshirt.png", // neon t-shirt icon
    link: "/shop/clothes/tshirts",
  },
  {
    title: "Jackets",
    img: "/shop-categories/jacket.png", // neon jacket icon
    link: "/shop/clothes/jackets",
  },
  {
    title: "Jeans",
    img: "/shop-categories/jean.png", // neon jean icon
    link: "/shop/clothes/jeans",
  },
];

export default function ClothesPage() {
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
        Clothes
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {clothesCategories.map((cat, index) => (
          <Link key={index} href={cat.link} className="card-link">
            <div className="card">
              <Image
                src={cat.img}
                alt={cat.title}
                width={170}
                height={170}
                style={{ marginBottom: "1rem", objectFit: "contain" }}
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

      <style jsx>{`
        .card {
          background-color: #000;
          border: 2px solid #00ffff;
          border-radius: 2rem;
          padding: 2rem;
          width: 230px;
          height: 250px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px #0ff;
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
        }
        .card:hover {
          transform: scale(1.08);
          box-shadow: 0 0 30px #0ff;
        }
      `}</style>
    </main>
  );
}

