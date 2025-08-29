// app/shop/sneaker/page.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

// Τιμή σε ευρώ (αριθμός), θα εμφανιστεί ως "119,99 €"
const PRICE = 119.99;

// Nike Air Force 1 — EU sizes
const AF1_MEN_EU = [
  38.5, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 47, 48,
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
  const [previewOpen, setPreviewOpen] = useState(false);

  const sizes = gender === "men" ? AF1_MEN_EU : AF1_WOMEN_EU;
  const genderLabel = gender === "men" ? "Men" : "Women";

  const priceLabel = PRICE.toLocaleString("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  // Κλείσιμο με ESC
  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPreviewOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [previewOpen]);

  return (
    <>
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
        {/* Εικόνα: πάντα λίγο “ζουμ” + rounded γωνίες + zoom-in cursor */}
        <div
          onClick={() => setPreviewOpen(true)}
          title="Μεγέθυνση"
          style={{
            position: "relative",
            width: "100%",
            height: 200,
            marginBottom: "1rem",
            overflow: "hidden",
            borderRadius: "1rem",
            cursor: "zoom-in",
          }}
        >
          {/* Χρησιμοποιούμε fill για καλύτερο crop μέσα στο container */}
          <Image
            src={img}
            alt={name}
            fill
            // αρχικό μικρό ζουμ + λίγο παραπάνω στο hover
            style={{
              objectFit: "contain",
              transform: "scale(1.08)",
              transition: "transform 0.3s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.14)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)";
            }}
            sizes="(max-width: 768px) 90vw, 320px"
            priority={false}
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
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
              }}
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
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
              }}
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
          AF1 συνήθως “φοράει λίγο μεγάλο” → σκέψου μισό νούμερο κάτω αν είσαι μεταξύ μεγεθών.
        </p>
      </div>

      {/* Lightbox / Preview */}
      {previewOpen && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            zIndex: 9999,
          }}
        >
          {/* Stop close when clicking on content */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              maxWidth: "90vw",
              maxHeight: "85vh",
              borderRadius: "1rem",
              boxShadow: "0 0 30px #0ff",
              overflow: "hidden",
            }}
          >
            {/* Close (X) */}
            <button
              onClick={() => setPreviewOpen(false)}
              aria-label="Κλείσιμο προεπισκόπησης"
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                width: 36,
                height: 36,
                borderRadius: 999,
                border: "2px solid #00ffff",
                background: "#000",
                color: "#00ffff",
                fontSize: 20,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 12px #0ff",
              }}
            >
              ×
            </button>

            <div style={{ position: "relative", width: "80vw", height: "70vh" }}>
              <Image
                src={img}
                alt={name}
                fill
                style={{ objectFit: "contain", background: "#000" }}
                sizes="80vw"
                priority
              />
            </div>
          </div>
        </div>
      )}
    </>
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
      </div>
    </main>
  );
}

