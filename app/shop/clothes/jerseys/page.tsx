"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const BASE = "/products/jersey/";

type Jersey = {
  id: string;
  label: string;
  images: string[];
  price: number;
  sizes: { [key: string]: number }; // π.χ. { M:1, L:2 }
};

const JERSEYS: Jersey[] = [
  {
    id: "mj-red",
    label: "Mitchell & Ness NBA AUTHENTIC JERSEY CHICAGO BULLS 1997-98 MICHAEL JORDAN #23",
    images: ["red.jpg", "red2.avif"],
    price: 249.99,
    sizes: { M: 1 },
  },
  {
    id: "mj-black",
    label: "Mitchell & Ness NBA AUTHENTIC JERSEY CHICAGO BULLS 1995-96 MICHAEL JORDAN #23",
    images: ["black.avif", "black2.avif"],
    price: 249.99,
    sizes: { M: 1 },
  },
  {
    id: "jason",
    label: "SACRAMENTO KINGS 2000 – JASON WILLIAMS",
    images: ["jason.jpg", "jason2.jpg"],
    price: 120,
    sizes: { M: 2, L: 1, XL: 1 },
  },
  {
    id: "curry",
    label: "GOLDEN STATE WARRIORS 2009 – STEPHEN CURRY",
    images: ["stephen.jpg", "stephen2.jpg"],
    price: 120,
    sizes: { M: 1, L: 1, XL: 1 },
  },
  {
    id: "stockton",
    label: "UTAH JAZZ 1996 – JOHN STOCKTON",
    images: ["stockton.jpeg", "stockton2.jpeg"],
    price: 120,
    sizes: { M: 1, L: 1 },
  },
  {
    id: "iverson",
    label: "PHILADELPHIA 76ERS 2000 – ALLEN IVERSON",
    images: ["allen.jpeg", "allen2.jpeg"],
    price: 120,
    sizes: { XS: 1 },
  },
  {
    id: "oneal",
    label: "LOS ANGELES LAKERS 1999 – SHAQUILLE O'NEAL",
    images: ["oneal.jpeg", "oneal2.jpeg"],
    price: 120,
    sizes: { M: 1 },
  },
];

/* ---------- Lightbox με πολλαπλές εικόνες ---------- */
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

        {/* arrows */}
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

/* ---------- Jersey Card ---------- */
function JerseyCard({ jersey }: { jersey: Jersey }) {
  const { status } = useSession();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [stocks, setStocks] = useState({ ...jersey.sizes });
  const [previewOpen, setPreviewOpen] = useState(false);
  const [hovered, setHovered] = useState(false);

  const priceLabel = useMemo(
    () =>
      jersey.price.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
      }),
    [jersey.price]
  );

  const availableSizes = Object.entries(stocks).filter(([, qty]) => qty > 0);

  const handleAddToCart = () => {
    if (selectedSize && stocks[selectedSize] > 0) {
      setStocks((prev) => ({ ...prev, [selectedSize]: prev[selectedSize] - 1 }));
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
        {/* Εικόνα */}
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
            src={BASE + (hovered && jersey.images[1] ? jersey.images[1] : jersey.images[0])}
            alt={jersey.label}
            fill
            style={{ objectFit: "contain", borderRadius: "1rem" }}
            sizes="(max-width: 768px) 90vw, 360px"
            priority
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>{jersey.label}</h3>
        <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>{priceLabel}</p>

        {/* Επιλογή Μεγέθους */}
        {availableSizes.length > 1 ? (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
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
            {availableSizes.map(([size]) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        ) : (
          <p style={{ textAlign: "center", marginBottom: 12, color: "#00ffff" }}>
            Μέγεθος: {availableSizes[0]?.[0] ?? "—"}
          </p>
        )}

        {/* CTA */}
        {availableSizes.length === 0 ? (
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
        ) : status !== "authenticated" || !selectedSize ? (
          <button
            type="button"
            onClick={() => (status !== "authenticated" ? signIn() : null)}
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
            {status !== "authenticated" ? "Σύνδεση για αγορά" : "Συμπλήρωσε μέγεθος"}
          </button>
        ) : (
          <div onClick={handleAddToCart}>
            <AddToCartButton
              id={`jersey-${jersey.id}-${selectedSize}`}
              name={`Jersey • ${jersey.label} (Size ${selectedSize})`}
              price={jersey.price}
              image={BASE + jersey.images[0]}
            />
          </div>
        )}
      </div>

      {previewOpen && (
        <Lightbox
          images={jersey.images}
          startIndex={0}
          alt={jersey.label}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Σελίδα ---------- */
export default function JerseysPage() {
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
        Jerseys
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
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

