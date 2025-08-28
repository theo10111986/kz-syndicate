"use client";
import { useEffect, useState } from "react";

export default function GalleryPage() {
  const categories = [
    { name: "Sneakers", image: "/sneakers.png", color: "#0ff" },
    { name: "Caps", image: "/caps.png", color: "#00f" },
    { name: "Clothes", image: "/clothes.png", color: "#f0f" },
    { name: "Art", image: "/art.png", color: "#f90" },
  ];

  const images: Record<string, string[]> = {
    Sneakers: [
      "/Gallery/SNEAKER1.webp",
      "/Gallery/SNEAKER2.webp",
      "/Gallery/SNEAKER3.webp",
      "/Gallery/SNEAKER4.webp",
    ],
    Caps: [
      "/Gallery/CAP1.webp",
      "/Gallery/CAP2.webp",
      "/Gallery/CAP4.webp",
      "/Gallery/CAP5.webp",
      "/Gallery/CAP6.webp",
      "/Gallery/CAP7.webp",
      "/Gallery/CAP8.webp",
      "/Gallery/CAP9.webp",
      "/Gallery/CAP10.webp",
      "/Gallery/CAP11.webp",
      "/Gallery/CAP12.webp",
      "/Gallery/CAP13.webp",
      "/Gallery/CAP14.webp",
      "/Gallery/CAP15.webp",
      "/Gallery/CAP16.webp",
    ],
    Clothes: [],
    Art: [],
  };

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Esc / Arrow navigation
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight" && lightboxIndex !== null) {
        setLightboxIndex((prev) =>
          prev! + 1 < (images[selectedCategory ?? ""]?.length ?? 0)
            ? prev! + 1
            : 0
        );
      }
      if (e.key === "ArrowLeft" && lightboxIndex !== null) {
        setLightboxIndex((prev) =>
          prev! - 1 >= 0
            ? prev! - 1
            : (images[selectedCategory ?? ""]?.length ?? 1) - 1
        );
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, selectedCategory]);

  return (
    <div
      style={{
        backgroundColor: "#000",
        color: "#0ff",
        minHeight: "100vh",
        paddingTop: "80px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1
        style={{
          fontSize: "2.5rem",
          fontWeight: "bold",
          textShadow: "0 0 15px #0ff, 0 0 30px #0ff",
          marginBottom: "3rem",
        }}
      >
        Gallery Categories
      </h1>

      {/* Κατηγορίες */}
      <div
        style={{
          display: "flex",
          gap: "3rem",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        {categories.map((cat) => {
          const isHovered = hovered === cat.name;

          return (
            <div
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              onMouseEnter={() => setHovered(cat.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                cursor: "pointer",
                backgroundColor: "#000",
                borderRadius: "1.5rem",
                padding: "2rem",
                textAlign: "center",
                boxShadow: isHovered
                  ? `0 0 25px ${cat.color}, 0 0 45px ${cat.color}, 0 0 70px ${cat.color}`
                  : "0 0 15px #0ff4",
                transition: "all 0.3s ease-in-out",
                width: "250px",
              }}
            >
              <img
                src={cat.image}
                alt={cat.name}
                style={{
                  width: isHovered ? "180px" : "170px",
                  height: isHovered ? "180px" : "170px",
                  objectFit: "contain",
                  marginBottom: "1rem",
                  transition: "0.3s",
                }}
              />
              <p
                style={{
                  color: cat.color,
                  fontWeight: "bold",
                  fontSize: "1.3rem",
                  textShadow: isHovered
                    ? `0 0 12px ${cat.color}, 0 0 25px ${cat.color}`
                    : "0 0 8px #0ff4",
                }}
              >
                {cat.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* Εμφάνιση φωτογραφιών */}
      {selectedCategory && (
        <div
          style={{
            marginTop: "4rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
            gap: "1rem",
            width: "90%",
            maxWidth: "1200px",
          }}
        >
          {images[selectedCategory]?.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`${selectedCategory} ${index + 1}`}
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "1rem",
                cursor: "pointer",
                boxShadow: "0 0 15px #0ff",
              }}
              loading="lazy"
              onClick={() => setLightboxIndex(index)}
            />
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxIndex !== null && selectedCategory && (
        <div
          onClick={() => setLightboxIndex(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          {/* Κλείσιμο ❌ */}
<button
  onClick={(e) => {
    e.stopPropagation();
    setLightboxIndex(null);
  }}
  style={{
    position: "absolute",
    top: window.innerWidth < 768 ? "60px" : "5%", // mobile vs desktop
    right: "5%",
    fontSize: "2rem",
    color: "#0ff",
    background: "none",
    border: "none",
    cursor: "pointer",
  }}
  aria-label="Close"
>
  ❌
</button>


          {/* Previous */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                lightboxIndex - 1 >= 0
                  ? lightboxIndex - 1
                  : images[selectedCategory].length - 1
              );
            }}
            style={{
              position: "absolute",
              left: "5%",
              fontSize: "3rem",
              color: "#0ff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ⬅
          </button>

          {/* Εικόνα */}
          <img
            src={images[selectedCategory][lightboxIndex]}
            alt="Full view"
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: "1rem",
              boxShadow: "0 0 30px #0ff",
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(
                lightboxIndex + 1 < images[selectedCategory].length
                  ? lightboxIndex + 1
                  : 0
              );
            }}
            style={{
              position: "absolute",
              right: "5%",
              fontSize: "3rem",
              color: "#0ff",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            ➡
          </button>
        </div>
      )}
    </div>
  );
}

