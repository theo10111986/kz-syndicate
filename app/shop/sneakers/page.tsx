// app/shop/sneaker/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";

// Τιμές
const PRICE_BASIC = 119.99;
const PRICE_ROPE = 169.99;

// Nike Air Force 1 — EU sizes
const AF1_MEN_EU = [
  38.5, 39, 40, 40.5, 41, 42, 42.5, 43, 44, 44.5, 45, 45.5, 46, 47, 48,
] as const;

const AF1_WOMEN_EU = [
  35.5, 36, 36.5, 37.5, 38, 38.5, 39, 40, 40.5,
] as const;

type Gender = "men" | "women";

/* ---------- Κοινό Lightbox ---------- */
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
          borderRadius: "1rem",           // rounded στο frame
          boxShadow: "0 0 30px #0ff",
          overflow: "hidden",              // clip στις γωνίες
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
            clipPath: "inset(0 round 1rem)",   // ✅ σταθερό στρογγύλεμα
          }}
        >
          <Image
            src={img}
            alt={alt}
            fill
            style={{ objectFit: "contain", background: "#000", borderRadius: "1rem" }} // ✅
            sizes="80vw"
            priority
          />
        </div>
      </div>
    </div>
  );
}

/* ---------- Κάρτα βασικού AF1 (White/Black) ---------- */
function ProductCardBasic({
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

  const priceLabel = PRICE_BASIC.toLocaleString("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

  useEffect(() => {
    if (!previewOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPreviewOpen(false);
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
        {/* Εικόνα — rounded + μικρό “ζουμ” + hover */}
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
            clipPath: "inset(0 round 1rem)",   // ✅ κρατάει τις γωνίες στρογγυλές
            cursor: "zoom-in",
          }}
        >
          <Image
            src={img}
            alt={name}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.08)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem", // ✅
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.14)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            sizes="(max-width: 768px) 90vw, 320px"
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
                setGender(e.target.value as Gender);
                setSize("");
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
          price={PRICE_BASIC}
          image={img}
        />
        <p style={{ marginTop: 8, fontSize: 12, opacity: 0.8, textAlign: "center" }}>
        </p>
      </div>

      {previewOpen && <Lightbox img={img} alt={name} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}

/* ---------- ΝΕΟ προϊόν: AF1 με Rope Laces ---------- */
type AF1Color = "white" | "black";
type RopeColor = "white" | "black" | "beige";

// Διαθέσιμες εικόνες (ό,τι μου έδωσες)
const ROPE_IMAGE: Record<AF1Color, Partial<Record<RopeColor, string>>> = {
  white: {
    white: "/products/Nike_Air_Force_1_White_Rope_Laces_White_-_frontal.webp",
    beige: "/products/Nike_Air_Force_1_White_Rope_Laces_Creme_-_frontal_1080x.webp",
    // δεν έχουμε white AF1 με black rope → θα γίνει fallback (βλ. παρακάτω)
  },
  black: {
    black: "/products/Nike_Air_Force_1_Black_Rope_Laces_Black_frontal_1080x.webp",
  },
};

const ROPE_COLORS_ALL: RopeColor[] = ["white", "black", "beige"];

function ProductCardRope() {
  const [af1Color, setAf1Color] = useState<AF1Color>("white");
  const [rope, setRope] = useState<RopeColor>("white");
  const [gender, setGender] = useState<Gender>("men");
  const [size, setSize] = useState<number | "">("");
  const [previewOpen, setPreviewOpen] = useState(false);

  // Υπολογισμός εικόνας + αν είναι fallback
  const { img, isFallback } = useMemo(() => {
    const exact = ROPE_IMAGE[af1Color][rope];
    if (exact) return { img: exact, isFallback: false };
    // Fallback: αν δεν έχουμε white AF1 με black rope, δείξε την black/black για προεπισκόπηση
    if (af1Color === "white" && rope === "black") {
      return {
        img: ROPE_IMAGE.black.black!,
        isFallback: true,
      };
    }
    // default ασφαλείας
    return {
      img:
        ROPE_IMAGE[af1Color].white ||
        ROPE_IMAGE[af1Color].beige ||
        ROPE_IMAGE.black.black!,
      isFallback: true,
    };
  }, [af1Color, rope]);

  const sizes = gender === "men" ? AF1_MEN_EU : AF1_WOMEN_EU;
  const genderLabel = gender === "men" ? "Men" : "Women";

  const priceLabel = PRICE_ROPE.toLocaleString("el-GR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  });

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
        {/* Εικόνα — rounded + μικρό “ζουμ” + hover */}
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
            clipPath: "inset(0 round 1rem)",   // ✅ κρατάει τις γωνίες στρογγυλές
            cursor: "zoom-in",
          }}
        >
          <Image
            src={img}
            alt={`AF1 ${af1Color} με Rope ${rope}`}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.08)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem", // ✅
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.14)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)")}
            sizes="(max-width: 768px) 90vw, 320px"
          />
        </div>

        <h3 style={{ color: "#00ffff", textAlign: "center", marginBottom: 6 }}>
          Nike Air Force 1 — Rope Laces
        </h3>
        <p style={{ textAlign: "center", marginBottom: 12, fontWeight: 700 }}>
          {priceLabel}
        </p>

        {/* Σημείωση αν είναι ενδεικτική προεπισκόπηση */}
        {isFallback && (
          <p style={{ textAlign: "center", fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            * Ενδεικτική προεπισκόπηση για τον συνδυασμό που επέλεξες.
          </p>
        )}

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          {/* AF1 χρώμα */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>AF1 Χρώμα</span>
            <select
              value={af1Color}
              onChange={(e) => setAf1Color(e.target.value as AF1Color)}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </label>

          {/* Rope χρώμα — πάντα δείχνω και τα 3 */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Χρώμα σχοινιού</span>
            <select
              value={rope}
              onChange={(e) => setRope(e.target.value as RopeColor)}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              {ROPE_COLORS_ALL.map((rc) => (
                <option key={rc} value={rc}>
                  {rc === "white" ? "White" : rc === "black" ? "Black" : "Beige"}
                </option>
              ))}
            </select>
          </label>

          {/* Φύλο */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Φύλο</span>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as Gender);
                setSize("");
              }}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              <option value="men">Men</option>
              <option value="women">Women</option>
            </select>
          </label>

          {/* Μέγεθος */}
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Μέγεθος (EU)</span>
            <select
              value={size === "" ? "" : String(size)}
              onChange={(e) => setSize(e.target.value ? Number(e.target.value) : "")}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              <option value="">Επίλεξε μέγεθος</option>
              {(gender === "men" ? AF1_MEN_EU : AF1_WOMEN_EU).map((eu) => (
                <option key={`${gender}-${eu}`} value={eu}>
                  {eu}
                </option>
              ))}
            </select>
          </label>
        </div>

        <AddToCartButton
          id={`af1-rope-${af1Color}-${rope}-${gender}-${size || "nosize"}`}
          name={`AF1 ${af1Color} • Rope ${rope} (${genderLabel}${size ? ` EU ${size}` : ""})`}
          price={PRICE_ROPE}
          image={img}
        />
      </div>

      {previewOpen && (
        <Lightbox img={img} alt={`AF1 ${af1Color} • Rope ${rope}`} onClose={() => setPreviewOpen(false)} />
      )}
    </>
  );
}

/* ---------- Σελίδα ---------- */
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
        Nike Air Force 1 — White & Black + Rope Laces
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        {/* Βασικά AF1 (119,99€) — επαναφέρω .avif για να μην “χαθούν” */}
        <ProductCardBasic id="af1-white" name="Nike Air Force 1 '07 White" img="/products/af1-white.avif" />
        <ProductCardBasic id="af1-black" name="Nike Air Force 1 '07 Black" img="/products/af1-black.avif" />

        {/* ΝΕΟ: Rope Laces (169,99€) */}
        <ProductCardRope />
      </div>
    </main>
  );
}

