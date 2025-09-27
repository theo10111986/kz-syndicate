"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const BASE = "/products/jersey/";

type Size = "XS" | "S" | "M" | "L" | "XL";

type Jersey = {
  id: string;
  label: string;
  files: string[];
  sizes: { size: Size; stock: number }[];
  price: number;
};

/* ---------- Data ---------- */
const JERSEYS: Jersey[] = [
  {
    id: "mj-red",
    label: "Mitchell & Ness NBA AUTHENTIC JERSEY CHICAGO BULLS 1997-98 MICHAEL JORDAN #23",
    files: ["red.jpg", "red2.avif"],
    sizes: [{ size: "M", stock: 1 }],
    price: 249.99,
  },
  {
    id: "mj-black",
    label: "Mitchell & Ness NBA AUTHENTIC JERSEY CHICAGO BULLS 1995-96 MICHAEL JORDAN #23",
    files: ["black.avif", "black2.avif"],
    sizes: [{ size: "M", stock: 1 }],
    price: 249.99,
  },
  {
    id: "jason",
    label: "Sacramento Kings 2000 – Jason Williams",
    files: ["jason.jpg", "jason2.jpg"],
    sizes: [
      { size: "M", stock: 2 },
      { size: "L", stock: 1 },
      { size: "XL", stock: 1 },
    ],
    price: 120,
  },
  {
    id: "curry",
    label: "Golden State Warriors 2009 – Stephen Curry",
    files: ["stephen.jpg", "stephen2.jpg"],
    sizes: [
      { size: "M", stock: 1 },
      { size: "L", stock: 1 },
      { size: "XL", stock: 1 },
    ],
    price: 120,
  },
  {
    id: "stockton",
    label: "Utah Jazz 1996 – John Stockton",
    files: ["stockton.jpeg", "stockton2.jpeg"],
    sizes: [
      { size: "M", stock: 1 },
      { size: "L", stock: 1 },
    ],
    price: 120,
  },
  {
    id: "iverson",
    label: "Philadelphia 76ers 2000 – Allen Iverson",
    files: ["allen.jpeg", "allen2.jpeg"],
    sizes: [{ size: "XS", stock: 1 }],
    price: 120,
  },
  {
    id: "oneal",
    label: "Los Angeles Lakers 1999 – Shaquille O'Neal",
    files: ["oneal.jpeg", "oneal2.jpeg"],
    sizes: [{ size: "M", stock: 1 }],
    price: 120,
  },
];

/* ---------- Lightbox ---------- */
function Lightbox({
  files,
  alt,
  onClose,
}: {
  files: string[];
  alt: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % files.length);
      if (e.key === "ArrowLeft")
        setIndex((i) => (i - 1 + files.length) % files.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [files]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ position: "relative", maxWidth: "90vw", maxHeight: "85vh" }}
      >
        <Image
          src={BASE + files[index]}
          alt={alt}
          width={800}
          height={800}
          style={{ objectFit: "contain", borderRadius: "1rem" }}
        />
      </div>
    </div>
  );
}

/* ---------- Card ---------- */
function JerseyCard({ jersey }: { jersey: Jersey }) {
  const { status } = useSession();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [availableSizes, setAvailableSizes] = useState(jersey.sizes);
  const [selectedSize, setSelectedSize] = useState<Size | "">("");

  const priceLabel = useMemo(
    () =>
      jersey.price.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
      }),
    [jersey.price]
  );

  const handleBuy = () => {
    if (!selectedSize) return;
    setAvailableSizes((prev) =>
      prev
        .map((s) =>
          s.size === selectedSize ? { ...s, stock: s.stock - 1 } : s
        )
        .filter((s) => s.stock > 0)
    );
    setSelectedSize("");
  };

  const soldOut = availableSizes.length === 0;

  return (
    <>
      <div
        style={{
          background: "#000",
          border: "2px solid #00ffff",
          borderRadius: "1rem",
          padding: "1.25rem",
          width: 340,
          boxShadow: "0 0 20px #0ff",
        }}
      >
        <div
          onClick={() => setPreviewOpen(true)}
          style={{
            position: "relative",
            width: "100%",
            height: 260,
            marginBottom: "1rem",
            cursor: "zoom-in",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          <Image
            src={BASE + jersey.files[0]}
            alt={jersey.label}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center" }}>{jersey.label}</h3>
        <p style={{ textAlign: "center", fontWeight: 700 }}>{priceLabel}</p>

        {/* Sizes */}
        {availableSizes.length > 1 ? (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value as Size)}
            style={{
              width: "100%",
              marginBottom: 12,
              padding: "0.5rem",
              borderRadius: 8,
              border: "2px solid #00ffff",
              background: "#000",
              color: "#00ffff",
              fontWeight: 700,
              textAlign: "center",
            }}
          >
            <option value="">Επιλέξτε μέγεθος</option>
            {availableSizes.map((s) => (
              <option key={s.size} value={s.size}>
                {s.size}
              </option>
            ))}
          </select>
        ) : availableSizes.length === 1 ? (
          <p style={{ textAlign: "center", marginBottom: 12, color: "#00ffff" }}>
            Μέγεθος: {availableSizes[0].size}
          </p>
        ) : null}

        {/* CTA */}
        {soldOut ? (
          <button
            disabled
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid #aaa",
              background: "#111",
              color: "#777",
              fontWeight: 700,
            }}
          >
            Εξαντλημένο
          </button>
        ) : status !== "authenticated" || !selectedSize && availableSizes.length > 1 ? (
          <button
            onClick={() =>
              status !== "authenticated" ? signIn() : null
            }
            style={{
              width: "100%",
              padding: "0.75rem",
              borderRadius: 12,
              border: "2px solid #00ffff",
              background: "#000",
              color: "#00ffff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {status !== "authenticated"
              ? "Σύνδεση για αγορά"
              : "Συμπλήρωσε μέγεθος"}
          </button>
        ) : (
          <div onClick={handleBuy}>
            <AddToCartButton
              id={`jersey-${jersey.id}-${selectedSize}`}
              name={`${jersey.label} (Size ${selectedSize || availableSizes[0].size})`}
              price={jersey.price}
              image={BASE + jersey.files[0]}
            />
          </div>
        )}
      </div>

      {previewOpen && (
        <Lightbox
          files={jersey.files}
          alt={jersey.label}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Page ---------- */
export default function JerseysPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: "3rem 1.5rem",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#00e5ff",
          fontSize: "2rem",
          marginBottom: "2rem",
          textShadow: "0 0 10px #00e5ff",
        }}
      >
        Jerseys
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        {JERSEYS.map((j) => (
          <JerseyCard key={j.id} jersey={j} />
        ))}
      </div>
    </main>
  );
}
