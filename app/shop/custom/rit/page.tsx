"use client";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useEffect } from "react";
import { track } from "@/lib/analytics";
import { useSession, signIn } from "next-auth/react";

// Μικρό neon κουμπί για login
function NeonButton({
  children,
  onClick,
  disabled,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
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

const ritColors = [
  { name: "Golden Yellow", img: "/products/rit/golden.webp" },
  { name: "Sunshine Orange", img: "/products/rit/sunshine.webp" },
  { name: "Wine", img: "/products/rit/wine.webp" },
  { name: "Cherry Red", img: "/products/rit/cherry.webp" },
  { name: "Petal Pink", img: "/products/rit/petal.webp" },
  { name: "Hyacinth", img: "/products/rit/hyacinth.webp" },
  { name: "Purple", img: "/products/rit/purple.webp" },
  { name: "Denim Blue", img: "/products/rit/denim.webp" },
  { name: "Navy Blue", img: "/products/rit/navy.webp" },
  { name: "Tan", img: "/products/rit/tan.webp" },
  { name: "Camel", img: "/products/rit/camel.webp" },
  { name: "Taupe", img: "/products/rit/taupe.webp" },
  { name: "Cocoa Brown", img: "/products/rit/cocoa.webp" },
  { name: "Dark Brown", img: "/products/rit/dark.webp" },
  { name: "Pearl Grey", img: "/products/rit/pearl.webp" },
  { name: "Charcoal Grey", img: "/products/rit/charcoal.webp" },
  { name: "Black", img: "/products/rit/black.webp" },
];

export default function RitPage() {
  const { status } = useSession();

  // ✅ Track όταν ανοίγει η κατηγορία Rit
  useEffect(() => {
    track("View Category", { name: "Rit – All Purpose Dye" });
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "4rem 2rem",
        color: "#fff",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          color: "#00ffff",
          fontSize: "2rem",
          marginBottom: "3rem",
          textShadow: "0 0 10px #0ff",
        }}
      >
        Rit – All Purpose Dye
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {ritColors.map((item, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "#000",
              border: "2px solid #00ffff",
              borderRadius: "1rem",
              padding: "1.5rem",
              boxShadow: "0 0 15px #0ff",
              transition: "transform 0.3s, box-shadow 0.3s",
              textAlign: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 30px #0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 15px #0ff";
            }}
          >
            <Image
              src={item.img}
              alt={item.name}
              width={200}
              height={200}
              style={{ marginBottom: "1rem" }}
              onClick={() => track("Click Product", { name: item.name, price: 11 })}
            />
            <h2 style={{ color: "#00ffff", marginBottom: "0.5rem" }}>{item.name}</h2>
            <p style={{ fontWeight: "bold" }}>Τιμή: €7.50</p>

            {/* ✅ Gating: μόνο συνδεδεμένοι βλέπουν AddToCart */}
            {status === "loading" ? (
              <NeonButton disabled ariaLabel="Έλεγχος σύνδεσης">
                Έλεγχος σύνδεσης…
              </NeonButton>
            ) : status !== "authenticated" ? (
              <NeonButton
                onClick={() => {
                  track("Click Sign In CTA", { source: "Rit AddToCart Gate" });
                  signIn();
                }}
                ariaLabel="Σύνδεση για αγορά"
              >
                Σύνδεση για αγορά
              </NeonButton>
            ) : (
              <AddToCartButton
                id={item.name.toLowerCase().replace(/\s+/g, "-")}
                name={item.name}
                price={7.5}
                image={item.img}
              />
            )}
          </div>
        ))}
      </div>
    </main>
  );
}
