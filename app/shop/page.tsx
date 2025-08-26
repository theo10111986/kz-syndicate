"use client";
import Image from "next/image";
import Link from "next/link";

const categories = [
  {
    title: "Sneakers",
    img: "/shop-categories/sneakers.png",
    link: "/shop/sneakers",
  },
  {
    title: "Clothes",
    img: "/shop-categories/clothes.png",
    link: "/shop/clothes",
  },
  {
    title: "Accessories",
    img: "/shop-categories/accessories.png",
    link: "/shop/accessories",
  },
  {
    title: "Custom Yourself",
    img: "/shop-categories/art.png",
    link: "/shop/custom",
  },
];

export default function ShopPage() {
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
        Shop by Category
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {categories.map((cat, index) => (
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
                width={170}
                height={170}
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
