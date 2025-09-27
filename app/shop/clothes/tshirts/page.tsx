"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const BASE = "/products/creait_wear/"; // φάκελος εικόνων

type Variant = {
  label: string;
  file: string | string[];
  id: string;
  size?: string; // προκαθορισμένο μέγεθος (αν υπάρχει)
  sizes?: string[]; // για πολλαπλά μεγέθη
  stock?: number;
  price: number;
};
type Size = "S" | "M" | "L" | "XL";

const VARIANTS: Variant[] = [
  {
    label: "NBA San Antonio Spurs – Tim Duncan T-Shirt",
    file: "1.jpg",
    id: "timduncan",
    size: "XL",
    stock: 1,
    price: 20,
  },
  {
    label: "Boston Celtics Garage Hero T-Shirt - Kelly Green",
    file: "bostonkelly.avif",
    id: "bostonkelly",
    size: "M",
    stock: 1,
    price: 40,
  },
  {
    label: "NBA Chicago Bulls – Dennis Rodman",
    file: "dennis.jpg",
    id: "rodman",
    size: "L",
    stock: 1,
    price: 55,
  },
  {
    label: "NBA Nike TEE Spurs – Victor Wembanyama",
    file: "victor.jpg",
    id: "wemby",
    sizes: ["M", "L"],
    stock: 1,
    price: 35,
  },
  {
    label: "NBA Lakers – Magic Johnson",
    file: ["magic.jpg", "magic2.jpg"],
    id: "magic",
    size: "L",
    stock: 2,
    price: 45,
  },
  { label: "creait_wear-Roy Tarpley", file: "tarpley_result.webp", id: "tarpley", price: 40 },
  { label: "creait_wear-Tony White", file: "tonywhite_result.webp", id: "tonywhite", price: 40 },
  { label: "creait_wear-Henry Turner", file: "turner_result.webp", id: "turner", price: 40 },
  { label: "creait_wear-Dominique Wilkins", file: "wilkins_result.webp", id: "wilkins", price: 40 },
  { label: "creait_wear-Kenneth Barlow", file: "barlow_result.webp", id: "barlow", price: 40 },
  { label: "creait_wear-Mitchell Wiggins", file: "wiggins_result.webp", id: "wiggins", price: 40 },
  { label: "creait_wear-David Ancrum", file: "ancrum_result.webp", id: "ancrum", price: 40 },

  //
  
];

/* ---------- Lightbox ---------- */
function Lightbox({
  img,
  alt,
  onClose,
}: {
  img: string;
  alt: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
            zIndex: 1,
          }}
        >
          ×
        </button>

        <div
          style={{
            position: "relative",
            width: "80vw",
            height: "70vh",
            borderRadius: "1rem",
            overflow: "hidden",
          }}
        >
          <Image
            src={img}
            alt={alt}
            fill
            style={{
              objectFit: "contain",
              background: "#000",
              borderRadius: "1rem",
            }}
            sizes="80vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Κάρτα προϊόντος ---------- */
function ProductCardTshirt({ variant }: { variant: Variant }) {
  const { status } = useSession();
  const [size, setSize] = useState<Size | "">("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [soldOut, setSoldOut] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const priceLabel = useMemo(
    () =>
      variant.price.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }),
    [variant.price]
  );

  useEffect(() => {
    if (variant.size) {
      setSize(variant.size as Size);
    }
  }, [variant.size]);

  const currentImage =
    Array.isArray(variant.file) && variant.file.length > 1
      ? variant.file[imageIndex]
      : Array.isArray(variant.file)
      ? variant.file[0]
      : variant.file;

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
          title="Μεγέθυνση"
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
            src={BASE + currentImage}
            alt={`creait_wear — ${variant.label}`}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.12)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
              display: "block",
            }}
            sizes="(max-width: 768px) 90vw, 360px"
            priority
          />
        </div>

        {/* thumbnails αν έχει παραπάνω από μία */}
        {Array.isArray(variant.file) && variant.file.length > 1 && (
          <div
            style={{
              display: "flex",
              gap: 8,
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            {variant.file.map((f, i) => (
              <Image
                key={i}
                src={BASE + f}
                alt={`${variant.label} thumb ${i + 1}`}
                width={60}
                height={60}
                style={{
                  cursor: "pointer",
                  border: i === imageIndex ? "2px solid #00ffff" : "2px solid transparent",
                  borderRadius: 8,
                }}
                onClick={() => setImageIndex(i)}
              />
            ))}
          </div>
        )}

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>
          {variant.label}
        </h3>
        <p
          style={{
            textAlign: "center",
            marginBottom: 12,
            fontWeight: 700,
          }}
        >
          {priceLabel}
        </p>

        {/* Επιλογή Μεγέθους */}
        {variant.sizes ? (
          <select
            value={size}
            onChange={(e) => setSize(e.target.value as Size)}
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
            {variant.sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        ) : variant.size ? (
          <p
            style={{
              textAlign: "center",
              marginBottom: 12,
              fontWeight: 700,
              color: "#00ffff",
            }}
          >
            Μέγεθος: {variant.size}
          </p>
        ) : null}

        {/* CTA */}
        {soldOut ? (
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
        ) : status !== "authenticated" || (!size && variant.sizes) ? (
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
          <div
            onClick={() => {
              if (variant.stock === 1) setSoldOut(true);
            }}
          >
            <AddToCartButton
              id={`creait-wear-tshirt-${variant.id}-${size}`}
              name={`creait_wear T-Shirt • ${variant.label} (Size ${size || variant.size})`}
              price={variant.price}
              image={BASE + currentImage}
            />
          </div>
        )}
      </div>

      {previewOpen && (
        <Lightbox
          img={BASE + currentImage}
          alt={`creait_wear — ${variant.label}`}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Σελίδα ---------- */
export default function TshirtsPage() {
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
        T-Shirts
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        {VARIANTS.map((v) => (
          <ProductCardTshirt key={v.id} variant={v} />
        ))}
      </div>
    </main>
  );
}


