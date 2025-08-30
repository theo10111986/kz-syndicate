// app/shop/accessories/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

const PRICE = 10.0;
const BASE = "/products/atlantis-rapper/";

type Variant = { label: string; file: string; id: string };

const VARIANTS: Variant[] = [
  { label: "Fluo Pink / White",        file: "rapperfluopinkwhite.jpg",      id: "fluopinkwhite" },
  { label: "Fluo Green / White",       file: "rapperfluogreenwhite.jpg",     id: "fluogreenwhite" },
  { label: "Bordeaux / White / Black", file: "rapperbordeauxwhiteblack.jpg", id: "bordeauxwhiteblack" },
  { label: "Pink / Black",             file: "rapperpinkblack.jpg",          id: "pinkblack" },
  { label: "White / Red / Black",      file: "rapperwhiteredblack.jpg",      id: "whiteredblack" },
  { label: "Grey / Red",               file: "rapergreyred.jpg",             id: "greyred" },
  { label: "Orange / Black",           file: "rapperorangeblack.jpg",        id: "orangeblack" },
  { label: "Black / White / Green",    file: "rapperblackwhitegreen.jpg",    id: "blackwhitegreen" },
  { label: "Red / White / Royal",      file: "rapperredwhiteroyal.jpg",      id: "redwhiteroyal" },
  { label: "Black / Orange",           file: "rapperblackorange.jpg",        id: "blackorange" },
  { label: "Black / Olive",            file: "rapperblackolive.jpg",         id: "blackolive" },
  { label: "Red / White",              file: "rapperredwhite.jpg",           id: "redwhite" },
  { label: "Royal / White",           file: "rapperroyalwhite.jpg",        id: "royalwhite" },
  { label: "Black / White",            file: "rapperblackwhite.jpg",         id: "blackwhite" },
  { label: "Yellow / White",           file: "rapperyellowwhite.jpg",        id: "yellowwhite" },
  { label: "Orange / White",           file: "rapperorangewhite.jpg",        id: "orangewhite" },
  { label: "Blue / White",             file: "rapperbluewhite.jpg",          id: "bluewhite" },
  { label: "Green / White",            file: "rappergreenwhite.jpg",         id: "greenwhite" },
  { label: "Black",                    file: "rapperblack.jpg",              id: "black" },
];

/* ---------- Κοινό Lightbox, ίδιο στυλ ---------- */
function Lightbox({ img, alt, onClose }: { img: string; alt: string; onClose: () => void }) {
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
            style={{ objectFit: "contain", background: "#000", borderRadius: "1rem" }}
            sizes="80vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Κάρτα προϊόντος (ίδιο neon στυλ) ---------- */
function ProductCardRapper() {
  const [variant, setVariant] = useState<Variant>(VARIANTS[0]);
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

  return (
    <>
      <div
        style={{
          backgroundColor: "#000",
          border: "2px solid #00ffff",
          borderRadius: "1rem",
          padding: "1.25rem",
          boxShadow: "0 0 20px #0ff",
          width: 340,
        }}
      >
        {/* Εικόνα — να φαίνεται ΟΛΟ το καπέλο: objectFit contain + ελαφρύ zoom */}
        <div
          onClick={() => setPreviewOpen(true)}
          title="Μεγέθυνση"
          style={{
            position: "relative",
            width: "100%",
            height: 240,
            marginBottom: "1rem",
            overflow: "hidden",
            borderRadius: "1rem",
            cursor: "zoom-in",
            background: "#000",
          }}
        >
          <Image
            src={BASE + variant.file}
            alt={`Atlantis Rapper — ${variant.label}`}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.06)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
              display: "block",
            }}
            onMouseEnter={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.12)")
            }
            onMouseLeave={(e) =>
              ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.06)")
            }
            sizes="(max-width: 768px) 90vw, 340px"
            priority
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>
          Atlantis — Rapper
        </h3>
        <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>{priceLabel}</p>

        {/* Επιλογή χρώματος */}
        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Χρώμα</span>
            <select
              value={variant.id}
              onChange={(e) => {
                const v = VARIANTS.find((x) => x.id === e.target.value);
                if (v) setVariant(v);
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
              }}
            >
              {VARIANTS.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* CTA – Add to cart */}
        <AddToCartButton
          id={`atlantis-rapper-${variant.id}`}
          name={`Atlantis Rapper (${variant.label})`}
          price={PRICE}
          image={BASE + variant.file}
        />
      </div>

      {previewOpen && (
        <Lightbox
          img={BASE + variant.file}
          alt={`Atlantis Rapper — ${variant.label}`}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

/* ---------- Σελίδα ---------- */
export default function AccessoriesPage() {
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
        Accessories
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        <ProductCardRapper />
      </div>
    </main>
  );
}
