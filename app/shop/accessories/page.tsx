"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

const PRICE = 10.0;
const BASE = "/products/atlantis-rapper/";

// ---------- FUNKO POPS ----------
type Funko = { label: string; file: string; id: string; stock: number; price: number };
const FUNKOS: Funko[] = [
  { label: "Funko Pop! Stephen Curry", file: "curry.jpg", id: "curry", stock: 2, price: 17 },
  { label: "Funko Pop! Michael Jordan", file: "jordan.jpg", id: "jordan", stock: 1, price: 17 },
  { label: "Funko Pop! Dennis Rodman", file: "rodman.jpg", id: "rodman", stock: 1, price: 17 },
  { label: "Funko Pop! Luka Doncic", file: "doncic.png", id: "doncic", stock: 1, price: 17 },
];

// ---------- HATS ----------
type Hat = { label: string; file: string; id: string; stock: number; price: number };
const HATS: Hat[] = [
  { label: "NHL Chicago Blackhawks", file: "blackhawks.jpg", id: "blackhawks", stock: 1, price: 25 },
];

// ---------- COLLECTIBLES ----------
type Collectible = { label: string; file: string; id: string; stock: number; price: number };
const COLLECTIBLES: Collectible[] = [
  { label: "Chicago Bulls Benny the Bull 25cm", file: "benny.jpg", id: "benny", stock: 1, price: 35 },
  { label: "Seattle SuperSonics Squatch 25cm", file: "squatch.jpg", id: "squatch", stock: 1, price: 35 },
  { label: "Vince Carter 25cm", file: "carter.jpg", id: "carter", stock: 1, price: 35 },
  { label: "Toronto Raptors Cuff Knit", file: "raptors.png", id: "raptors", stock: 1, price: 30 },
];

// Πρώτο Black / White, δεύτερο Black, όλα με _result.webp
type Variant = { label: string; file: string; id: string };
const VARIANTS: Variant[] = [
  { label: "Black / White", file: "rapperblackwhite_result.webp", id: "blackwhite" },
  { label: "Black", file: "rapperblack_result.webp", id: "black" },
  { label: "Fluo Pink / White", file: "rapperfluopinkwhite_result.webp", id: "fluopinkwhite" },
  { label: "Fluo Green / White", file: "rapperfluogreenwhite_result.webp", id: "fluogreenwhite" },
  { label: "Bordeaux / White / Black", file: "rapperbordeuxwhiteblack_result.webp", id: "bordeauxwhiteblack" },
  { label: "Pink / Black", file: "rapperpinkblack_result.webp", id: "pinkblack" },
  { label: "White / Red / Black", file: "rapperwhiteredblack_result.webp", id: "whiteredblack" },
  { label: "Grey / Red", file: "rappergreyred_result.webp", id: "greyred" },
  { label: "Orange / Black", file: "rapperorangeblack_result.webp", id: "orangeblack" },
  { label: "Black / White / Green", file: "rapperblackwhitegreen_result.webp", id: "blackwhitegreen" },
  { label: "Red / White / Royal", file: "rapperredwhiteroyal_result.webp", id: "redwhiteroyal" },
  { label: "Black / Orange", file: "rapperblackorange_result.webp", id: "blackorange" },
  { label: "Black / Olive", file: "rapperblackolive_result.webp", id: "blackolive" },
  { label: "Red / White", file: "rapperredwhite_result.webp", id: "redwhite" },
  { label: "Royal / White", file: "rapperroyalwhite_result.webp", id: "royalwhite" },
  { label: "Yellow / White", file: "rapperyellowwhite_result.webp", id: "yellowwhite" },
  { label: "Orange / White", file: "rapperorangewhite_result.webp", id: "orangewhite" },
  { label: "Blue / White", file: "rapperbluewhite_result.webp", id: "bluewhite" },
  { label: "Green / White", file: "rappergreenwhite_result.webp", id: "greenwhite" },
];

/* ---------- Lightbox ---------- */
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

/* ---------- Generic Card ---------- */
function ProductCard({
  label,
  file,
  id,
  price,
  stock,
}: {
  label: string;
  file: string;
  id: string;
  price: number;
  stock: number;
}) {
  const { status } = useSession();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [soldOut, setSoldOut] = useState(false);

  const priceLabel = useMemo(
    () =>
      price.toLocaleString("el-GR", {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 2,
      }),
    [price]
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
          width: 260,
        }}
      >
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
            background: "#000",
          }}
        >
          <Image
            src={BASE + file}
            alt={label}
            fill
            style={{
              objectFit: "contain",
              borderRadius: "1rem",
              display: "block",
            }}
            sizes="(max-width: 768px) 90vw, 260px"
            priority
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>{label}</h3>
        <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>{priceLabel}</p>

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
        ) : status !== "authenticated" ? (
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
          <div
            onClick={() => {
              if (stock === 1) setSoldOut(true);
            }}
          >
            <AddToCartButton id={`product-${id}`} name={label} price={price} image={BASE + file} />
          </div>
        )}
      </div>

      {previewOpen && <Lightbox img={BASE + file} alt={label} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}

/* ---------- Rapper Card ---------- */
function ProductCardRapper() {
  const { status } = useSession();
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
        {/* Εικόνα με zoom */}
        <div
          onClick={() => setPreviewOpen(true)}
          title="Μεγέθυνση"
          style={{
            position: "relative",
            width: "100%",
            height: 260,
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
              transform: "scale(1.8)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
              display: "block",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.4)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.8)")}
            sizes="(max-width: 768px) 90vw, 340px"
            priority
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>Atlantis — Rapper</h3>
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

        {/* CTA */}
        {status !== "authenticated" ? (
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
          <AddToCartButton
            id={`atlantis-rapper-${variant.id}`}
            name={`Atlantis Rapper (${variant.label})`}
            price={PRICE}
            image={BASE + variant.file}
          />
        )}
      </div>

      {previewOpen && <Lightbox img={BASE + variant.file} alt={`Atlantis Rapper — ${variant.label}`} onClose={() => setPreviewOpen(false)} />}
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

      {/* Όλα τα προϊόντα σε ενιαίο grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        {FUNKOS.map((f) => (
          <ProductCard key={f.id} {...f} />
        ))}
        {HATS.map((h) => (
          <ProductCard key={h.id} {...h} />
        ))}
        {COLLECTIBLES.map((c) => (
          <ProductCard key={c.id} {...c} />
        ))}
        <ProductCardRapper />
      </div>
    </main>
  );
}


