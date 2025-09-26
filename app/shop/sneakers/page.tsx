// app/shop/sneakers/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useSession, signIn } from "next-auth/react";

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

/* ---------- Stock (μόνο για GitHub) ---------- */
const AF1_STOCK: Record<Gender, Record<number, number>> = {
  men: {
    38.5: 1, 39: 1, 40: 1, 40.5: 1, 41: 1, 42: 1, 42.5: 1, 43: 1,
    44: 1, 44.5: 1, 45: 1, 45.5: 1, 46: 1, 47: 1, 48: 0,
  },
  women: {
    35.5: 1, 36: 1, 36.5: 1, 37.5: 1, 38: 1, 38.5: 1, 39: 1, 40: 1, 40.5: 1,
  },
};

/* ---------- Stock για AF1 Black (προσθήκη) ---------- */
const AF1_BLACK_STOCK: Record<Gender, Record<number, number>> = {
  men: {
    38.5: 2, 39: 2, 40: 2, 40.5: 2, 41: 2, 42: 2, 42.5: 2, 43: 2,
    44: 2, 44.5: 2, 45: 2, 45.5: 2, 46: 2, 47: 2, 48: 1,
  },
  women: {
    35.5: 2, 36: 2, 36.5: 2, 37.5: 2, 38: 2, 38.5: 2, 39: 2, 40: 2, 40.5: 2,
  },
};


/* ---------- Μικρό neon button για τοπική χρήση ---------- */
function NeonButton({
  onClick,
  children,
  disabled,
  ariaLabel,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      disabled={disabled}
      style={{
        width: "100%",
        padding: "0.75rem 1rem",
        borderRadius: 12,
        border: "2px solid #00ffff",
        background: disabled ? "#001418" : "#000",
        color: disabled ? "#66f7ff" : "#00ffff",
        fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: "0 0 16px #0ff",
        transition: "transform .15s ease",
      }}
      onMouseDown={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(0.98)";
      }}
      onMouseUp={(e) => {
        (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)";
      }}
    >
      {children}
    </button>
  );
}

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
  const { status } = useSession();
  const [gender, setGender] = useState<Gender>("men");
  const [size, setSize] = useState<number | "">("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string>("");

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

  const isValid = size !== "";

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
        {/* Εικόνα */}
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
          <Image
            src={img}
            alt={name}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.08)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
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
                setError("");
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
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                if (val !== "" && AF1_STOCK[gender][val] === 0) {
                  setError("Το μέγεθος δεν είναι διαθέσιμο");
                  return;
                }
                setSize(val);
                setError("");
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
                outline: isValid ? "none" : size === "" ? "2px solid #ff2e2e" : "none",
              }}
            >
              <option value="">Επίλεξε μέγεθος</option>
              {sizes.map((eu) => (
                <option
                  key={`${gender}-${eu}`}
                  value={eu}
                  disabled={AF1_STOCK[gender][eu] === 0}
                  style={{ color: AF1_STOCK[gender][eu] === 0 ? "#555" : "#fff" }}
                >
                  {eu}
                </option>
              ))}
            </select>
          </label>
        </div>

        {status !== "authenticated" ? (
          <NeonButton onClick={() => signIn()} ariaLabel="Σύνδεση">
            Σύνδεση για αγορά
          </NeonButton>
        ) : !isValid ? (
          <>
            <NeonButton
              onClick={() => setError("Συμπλήρωσε όλα τα πεδία")}
              ariaLabel="Συμπλήρωσε όλα τα πεδία"
            >
              Συμπλήρωσε όλα τα πεδία
            </NeonButton>
            {error && (
              <p style={{ marginTop: 8, fontSize: 12, color: "#ff6b6b", textAlign: "center" }}>
                {error} (Απαιτείται μέγεθος)
              </p>
            )}
          </>
        ) : (
          <AddToCartButton
            id={`${id}-${gender}-${size || "nosize"}`}
            name={`${name} (${genderLabel}${size ? ` EU ${size}` : ""})`}
            price={PRICE_BASIC}
            image={img}
          />
        )}
      </div>

      {previewOpen && <Lightbox img={img} alt={name} onClose={() => setPreviewOpen(false)} />}
    </>
  );
}

/* ---------- ΝΕΟ προϊόν: AF1 με Rope Laces ---------- */
type AF1Color = "white" | "black";
type RopeColor = "white" | "black" | "beige";

const ROPE_IMAGE: Record<AF1Color, Partial<Record<RopeColor, string>>> = {
  white: {
    white: "/products/Nike_Air_Force_1_White_Rope_Laces_White_-_frontal.webp",
    beige: "/products/Nike_Air_Force_1_White_Rope_Laces_Creme_-_frontal_1080x.webp",
  },
  black: {
    black: "/products/Nike_Air_Force_1_Black_Rope_Laces_Black_frontal_1080x.webp",
  },
};

function ProductCardRope() {
  const { status } = useSession();
  const [af1Color, setAf1Color] = useState<AF1Color>("white");
  const [rope, setRope] = useState<RopeColor>("white");
  const [gender, setGender] = useState<Gender>("men");
  const [size, setSize] = useState<number | "">("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [error, setError] = useState<string>("");

  const { img, isFallback } = useMemo(() => {
    const exact = ROPE_IMAGE[af1Color][rope];
    if (exact) return { img: exact, isFallback: false };
    if (af1Color === "white" && rope === "black") {
      return { img: ROPE_IMAGE.black.black!, isFallback: true };
    }
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

  const isValid = Boolean(af1Color) && Boolean(rope) && size !== "";

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
        {/* Εικόνα */}
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
          <Image
            src={img}
            alt={`AF1 ${af1Color} με Rope ${rope}`}
            fill
            style={{
              objectFit: "contain",
              transform: "scale(1.08)",
              transition: "transform 0.3s ease",
              borderRadius: "1rem",
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

        {isFallback && (
          <p style={{ textAlign: "center", fontSize: 12, opacity: 0.7, marginBottom: 8 }}>
            * Ενδεικτική προεπισκόπηση για τον συνδυασμό που επέλεξες.
          </p>
        )}

        <div style={{ display: "grid", gap: 10, marginBottom: 14 }}>
          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>AF1 Χρώμα</span>
            <select
              value={af1Color}
              onChange={(e) => {
                setAf1Color(e.target.value as AF1Color);
                setError("");
              }}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              <option value="white">White</option>
              <option value="black">Black</option>
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Χρώμα σχοινιού</span>
            <select
              value={rope}
              onChange={(e) => {
                setRope(e.target.value as RopeColor);
                setError("");
              }}
              style={{ padding: 10, borderRadius: 8, background: "#000", color: "#fff", border: "1px solid #00ffff" }}
            >
              {["white", "black", "beige"].map((rc) => (
                <option key={rc} value={rc}>
                  {rc === "white" ? "White" : rc === "black" ? "Black" : "Beige"}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={{ fontSize: 12, opacity: 0.9 }}>Φύλο</span>
            <select
              value={gender}
              onChange={(e) => {
                setGender(e.target.value as Gender);
                setSize("");
                setError("");
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
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : "";
                if (val !== "" && AF1_STOCK[gender][val] === 0) {
                  setError("Το μέγεθος δεν είναι διαθέσιμο");
                  return;
                }
                setSize(val);
                setError("");
              }}
              style={{
                padding: 10,
                borderRadius: 8,
                background: "#000",
                color: "#fff",
                border: "1px solid #00ffff",
                outline: isValid ? "none" : size === "" ? "2px solid #ff2e2e" : "none",
              }}
            >
              <option value="">Επίλεξε μέγεθος</option>
              {sizes.map((eu) => (
                <option
                  key={`${gender}-${eu}`}
                  value={eu}
                  disabled={AF1_STOCK[gender][eu] === 0}
                  style={{ color: AF1_STOCK[gender][eu] === 0 ? "#555" : "#fff" }}
                >
                  {eu}
                </option>
              ))}
            </select>
          </label>
        </div>

        {status !== "authenticated" ? (
          <NeonButton onClick={() => signIn()} ariaLabel="Σύνδεση">
            Σύνδεση για αγορά
          </NeonButton>
        ) : !isValid ? (
          <>
            <NeonButton
              onClick={() => setError("Συμπλήρωσε όλα τα πεδία")}
              ariaLabel="Συμπλήρωσε όλα τα πεδία"
            >
              Συμπλήρωσε όλα τα πεδία
            </NeonButton>
            {error && (
              <p style={{ marginTop: 8, fontSize: 12, color: "#ff6b6b", textAlign: "center" }}>
                {error}
              </p>
            )}
          </>
        ) : (
          <AddToCartButton
            id={`af1-rope-${af1Color}-${rope}-${gender}-${size || "nosize"}`}
            name={`AF1 ${af1Color} • Rope ${rope} (${genderLabel}${size ? ` EU ${size}` : ""})`}
            price={PRICE_ROPE}
            image={img}
          />
        )}
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
        Sneakers
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "2rem",
          justifyItems: "center",
        }}
      >
        <ProductCardBasic id="af1-white" name="Nike Air Force 1 '07 White" img="/products/af1-white.avif" />
        <ProductCardBasic id="af1-black" name="Nike Air Force 1 '07 Black" img="/products/af1-black.avif" />

        <ProductCardRope />
      </div>
    </main>
  );
}


