"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const BASE = "/products/jersey/";

type Jacket = {
  id: string;
  label: string;
  images: string[];
  price: number;
  sizes: { [key: string]: number };
};

const JACKETS: Jacket[] = [
  {
    id: "magic-jacket",
    label: "NBA 75th Anniversary Warm Up Jacket – ORLANDO MAGIC",
    images: ["magic.jpeg", "magic2.jpeg"],
    price: 150,
    sizes: { XL: 1 },
  },
];

/* ---------- Lightbox ---------- */
function Lightbox({
  images,
  startIndex,
  alt,
  onClose,
}: {
  images: string[];
  startIndex: number;
  alt: string;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(startIndex);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + images.length) % images.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [images.length, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
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
        <button
          onClick={onClose}
          aria-label="Κλείσιμο"
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
            zIndex: 1,
          }}
        >
          ×
        </button>

        <div style={{ position: "relative", width: "80vw", height: "70vh" }}>
          <Image
            src={BASE + images[index]}
            alt={alt}
            fill
            style={{ objectFit: "contain", background: "#000" }}
            sizes="80vw"
            priority
          />
        </div>

        {images.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => (i - 1 + images.length) % images.length)}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.6)",
                border: "2px solid #0ff",
                color: "#0ff",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              ‹
            </button>
            <button
              onClick={() => setIndex((i) => (i + 1) % images.length)}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                background: "rgba(0,0,0,0.6)",
                border: "2px solid #0ff",
                color: "#0ff",
                padding: "0.5rem 1rem",
                cursor: "pointer",
                borderRadius: 8,
              }}
            >
              ›
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/* ---------- Jacket Card ---------- */
function JacketCard({ jacket }: { jacket: Jacket }) {
  const { status } = useSession();
  const [stocks, setStocks] = useState({ ...jacket.sizes });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const size = Object.keys(jacket.sizes)[0]; // μόνο XL

  const priceLabel = useMemo(
    () =>
      jacket.price.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
      }),
    [jacket.price]
  );

  const available = stocks[size] > 0;

  const handleAddToCart = () => {
    if (available) {
      setStocks((prev) => ({ ...prev, [size]: prev[size] - 1 }));
    }
  };

  return (
    <>
      <div
        style={{
          backgroundColor: "#000",
          border: "2px solid #00ffff",
          borderRadius: "1rem",
          padding: "1.25rem",
          boxShadow: "0 0 20px #0ff",
          width: 360,
        }}
      >
        <div
          onClick={() => setPreviewOpen(true)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            position: "relative",
            width: "100%",
            height: 280,
            marginBottom: "1rem",
            overflow: "hidden",
            borderRadius: "1rem",
            cursor: "zoom-in",
            background: "#000",
          }}
        >
          <Image
            src={BASE + (hovered && jacket.images[1] ? jacket.images[1] : jacket.images[0])}
            alt={jacket.label}
            fill
            style={{ objectFit: "contain", borderRadius: "1rem" }}
            sizes="(max-width: 768px) 90vw, 360px"
            priority
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>{jacket.label}</h3>
        <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>{priceLabel}</p>
        <p style={{ textAlign: "center", marginBottom: 12, color: "#00ffff" }}>Μέγεθος: {size}</p>

        {available ? (
          status !== "authenticated" ? (
            <button
              type="button"
              onClick={() => signIn()}
              style={{
                width: "100%",
                padding: "0.75rem 1rem",
                borderRadius: 12,
                border: "2px solid #00ffff",
                background: "#000",
                color: "#00ffff",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 0 16px #0ff",
              }}
            >
              Σύνδεση για αγορά
            </button>
          ) : (
            <div onClick={handleAddToCart}>
              <AddToCartButton
                id={`jacket-${jacket.id}-${size}`}
                name={`Jacket • ${jacket.label} (Size ${size})`}
                price={jacket.price}
                image={BASE + jacket.images[0]}
              />
            </div>
          )
        ) : (
          <button
            disabled
            style={{
              width: "100%",
              padding: "0.75rem 1rem",
              borderRadius: 12,
              border: "2px solid #aaa",
              background: "#111",
              color: "#777",
              fontWeight: 700,
              cursor: "not-allowed",
            }}
          >
            Εξαντλημένο
          </button>
        )}
      </div>

      {previewOpen && (
        <Lightbox
          images={jacket.images}
          startIndex={0}
          alt={jacket.label}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Σελίδα ---------- */
export default function JacketsPage() {
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
        Jackets
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        {JACKETS.map((j) => (
          <JacketCard key={j.id} jacket={j} />
        ))}
      </div>
    </main>
  );
}
