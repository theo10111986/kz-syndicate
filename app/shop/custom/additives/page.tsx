"use client";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useEffect } from "react";              // ✅ ΝΕΟ
import { track } from "@/lib/analytics";        // ✅ ΝΕΟ

const additives = [
  {
    name: "2-Thin",
    img: "/products/2-Thin-1-oz.jpg",
    price: 7.5,
    description:
      "Ιδανικό για να αραιώνεις τα Angelus Leather Paints για λεπτομέρειες, airbrush και λεία στρώση.",
  },
  {
    name: "2-Soft",
    img: "/products/2-Soft-1-oz.jpg",
    price: 8.5,
    description:
      "Χρησιμοποιείται για να παραμένει η μπογιά εύκαμπτη σε υφάσματα και mesh.",
  },
  {
    name: "2-Hard",
    img: "/products/2-Hard-1-oz.jpg",
    price: 8.5,
    description:
      "Βοηθάει στην πρόσφυση της μπογιάς σε σκληρές, πλαστικές επιφάνειες όπως midsole.",
  },
  {
    name: "Leather Preparer & Deglazer",
    img: "/products/deglazer-600x600.jpg",
    price: 13.5,
    description:
      "Αφαιρεί το factory finish από δέρμα και προετοιμάζει την επιφάνεια για βαφή.",
  },
  {
    name: "Matte Finisher 4oz",
    img: "/products/matte-finisher-large.jpg",
    price: 15.5,
    description: "Μεγάλη συσκευασία Matte Finisher για προστασία και ματ αποτέλεσμα.",
  },
  {
    name: "Acrylic Finisher 4oz",
    img: "/products/No-600-4-oz.jpg",
    price: 15.5,
    description:
      "Προστατευτικό φινίρισμα για ματ/σατινέ αποτέλεσμα μετά τη βαφή. Σταθεροποιεί το αποτέλεσμα.",
  },
  {
    name: "High Gloss Finisher 4oz",
    img: "/products/High-Gloss-Finisher-4-oz.jpg",
    price: 15.5,
    description:
      "Φινίρισμα με έντονη γυαλάδα για λαμπερό επαγγελματικό αποτέλεσμα.",
  },
  {
    name: "Duller",
    img: "/products/Angelus-Duller-min-600x600.jpg",
    price: 7.5,
    description:
      "Προστίθεται σε μπογιά ή φινίρισμα για να μειώσει τη γυαλάδα και να πετύχει ματ αποτέλεσμα.",
  },
];

export default function AdditivesPage() {
  // ✅ Στέλνουμε ένα event όταν ανοίγει η κατηγορία
  useEffect(() => {
    track("View Category", { name: "Angelus – Πρόσθετα & Προεργασία" });
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
        Angelus – Πρόσθετα & Προεργασία
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "2rem",
        }}
      >
        {additives.map((item, index) => (
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
              // ✅ όταν ο χρήστης κάνει κλικ στην εικόνα, καταγράφουμε "Click Product"
              onClick={() => track("Click Product", { name: item.name, price: item.price })}
            />
            <h2 style={{ color: "#00ffff", marginBottom: "0.5rem" }}>{item.name}</h2>
            <p style={{ fontSize: "0.9rem", marginBottom: "1rem" }}>{item.description}</p>
            <p style={{ fontWeight: "bold" }}>Τιμή: €{item.price.toFixed(2)}</p>
            <AddToCartButton
              id={item.name.toLowerCase().replace(/\s+/g, "-")}
              name={item.name}
              price={item.price}
              image={item.img}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
