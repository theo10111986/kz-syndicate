"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const PRICE = 40.0;
const BASE = "/products/creait_wear/"; // φάκελος εικόνων

type Variant = { label: string; file: string; id: string };
type Size = "S" | "M" | "L" | "XL";

const VARIANTS: Variant[] = [
  { label: "Roy Tarpley", file: "tarpley_result.webp", id: "tarpley" },
  { label: "Tony White", file: "tonywhite_result.webp", id: "tonywhite" },
  { label: "Henry Turner", file: "turner_result.webp", id: "turner" },
  { label: "Dominique Wilkins", file: "wilkins_result.webp", id: "wilkins" },
  { label: "Kenneth Barlow", file: "barlow_result.webp", id: "barlow" },
  { label: "Mitchell Wiggins", file: "wiggins_result.webp", id: "wiggins" },
  { label: "David Ancrum", file: "ancrum_result.webp", id: "ancrum" },

  // ΝΕΟ T-SHIRT
  {
    label: "Boston Celtics Garage Hero T-Shirt - Kelly Green",
    file: "bostonkelly.avif",
    id: "bostonkelly",
  },
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

  const priceLabel = useMemo(
    () =>
      PRICE.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }),
    []
  );

  const isValid = size !== "";

  const isBoston = variant.id === "bostonkelly";

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
            src={BASE + variant.file}
            alt={`creait_wear — ${variant.label}`}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.12)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
              display: "block",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform =
                "scale(1.18)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform =
                "scale(1.12)")
            }
            sizes="(max-width: 768px) 90vw, 360px"
            priority
          />
        </div>

        <h3
          style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}
        >
          creait_wear — {variant.label}
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

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          {/* Μέγεθος */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Μέγεθος</span>
            <select
              value={size}
              onChange={(e) => setSize((e.target.value || "") as Size | "")}
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
                outline: isValid ? "none" : "2px solid #ff2e2e",
              }}
            >
              <option value="">Επίλεξε μέγεθος</option>

              {isBoston ? (
                <option value="M">Medium</option>
              ) : (
                (["S", "M", "L", "XL"] as Size[]).map((s) => (
                  <option key={s} value={s}>
                    {s === "XL"
                      ? "XLarge"
                      : s === "L"
                      ? "Large"
                      : s === "M"
                      ? "Medium"
                      : "Small"}
                  </option>
                ))
              )}
            </select>
          </label>
        </div>

        {/* CTA */}
        {status !== "authenticated" || !isValid ? (
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
            {status !== "authenticated"
              ? "Σύνδεση για αγορά"
              : "Συμπλήρωσε μέγεθος"}
          </button>
        ) : isBoston && size === "M" ? (
          // Εδώ μπορείς να κάνεις state όταν εξαντληθεί (π.χ. disabled)
          <AddToCartButton
            id={`creait-wear-tshirt-${variant.id}-${size}`}
            name={`creait_wear T-Shirt • ${variant.label} (Size ${size})`}
            price={PRICE}
            image={BASE + variant.file}
          />
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
          img={BASE + variant.file}
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

