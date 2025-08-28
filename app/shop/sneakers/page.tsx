// app/shop/sneaker/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

// Τιμή σε ευρώ (αριθμός), θα εμφανιστεί ως "119,99 €"
const PRICE = 119.99;

// Nike Air Force 1 — EU sizes
const AF1_MEN_EU = [
  38.5, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 47,
] as const;

const AF1_WOMEN_EU = [
  35.5, 36, 36.5, 37.5, 38, 38.5, 39, 40, 40.5,
] as const;

type Gender = "men" | "women";

function ProductCard({
  id,
  name,
  img,
}: {
  id: string;
  name: string;
  img: string;
}) {
  const [gender, setGender] = useState<Gender>("men");
  const [size, setSize] = useState<number | "">("");

  const sizes = gender === "men" ? AF1_MEN_EU : AF1_WOMEN_EU;
  const genderLabel = gender === "men" ? "Men" : "Women";

  const priceLabel = PRICE.toLocaleString("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  return (
    <div
      style={{
        backgroundColor: "#000",
        border: "2px solid #00ffff",
        borderRadius: "1rem",
        padding: "1.25rem",
        boxShadow: "0 0 20px #0ff",
        width: 320,
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <Image
          src={img}
          alt={name}
          width={220}
          height={160}
          style={{ objectFit: "contain", borderRadius: 12 }}
        />
      </div>

      <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>{name}</h3>
      <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>{priceLabel}</p>

      <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.9 }}>Φύλο</span>
          <select
            value={gender}
            onChange={(e) => {
              const g = e.target.value as Gender;
              setGender(g);
              setSize(""); // reset size όταν αλλάζει φύλο
            }}
            style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
          >
            <option value="men">Men</option>
            <option value="women">Women</option>
          </select>
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span style={{ fontSize: 12, opacity: 0.9 }}>Μέγεθος (EU)</span>
          <select
            value={size === "" ? "" : String(size)}
            onChange={(e) => setSize(e.target.value ? Number(e.target.value) : "")}
            style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
          >
            <option value="">Επίλεξε μέγεθος</option>
            {sizes.map((eu) => (
              <option key={`${gender}-${eu}`} value={eu}>
                {eu}
              </option>
            ))}
          </select>
        </label>
      </div>

      <AddToCartButton
        id={`${id}-${gender}-${size || "nosize"}`}
        name={`${name} (${genderLabel}${size ? ` EU ${size}` : ""})`}
        price={PRICE}
        image={img}
      />
      <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8, textAlign: "center" }}>
     </p>
    </div>
  );
}

export default function SneakersPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        backgroundColor: "#000",
        color: "#fff",
        padding: "3rem 1.5rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#00e5ff",
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "0 0 10px #00e5ff",
          marginBottom: "2rem",
        }}
      >
        Nike Air Force 1 — White & Black
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        <ProductCard
          id="af1-white"
          name="Nike Air Force 1 '07 White"
          img="/products/af1-white.avif"
        />
        <ProductCard
          id="af1-black"
          name="Nike Air Force 1 '07 Black"
          img="/products/af1-black.avif"
        />
        Sneakers – Προϊόντα έρχονται συνεχεια...
      </div>
    </main>
  );
}

