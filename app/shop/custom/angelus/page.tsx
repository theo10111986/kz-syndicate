"use client";
import Image from "next/image";
import AddToCartButton from "@/components/AddToCartButton";
import { useEffect } from "react";          // ✅ ΝΕΟ
import { track } from "@/lib/analytics";    // ✅ ΝΕΟ

const products = [
  { name: "Bronze 29,5ml", img: "/products/Bronze.jpg", price: 7.99 },
  { name: "Play in the Sand 29,5ml", img: "/products/Play-in-the-Sand.jpg", price: 7.99 },
  { name: "Luggage Brown 29,5ml", img: "/products/Luggage-Brown.jpg", price: 7.99 },
  { name: "Bronze 29,5ml", img: "/products/Bronze.jpg", price: 7.99 },
  { name: "Play in the Sand 29,5ml", img: "/products/Play-in-the-Sand.jpg", price: 7.99 },
  { name: "Luggage Brown 29,5ml", img: "/products/Luggage-Brown.jpg", price: 7.99 },
  { name: "Dark Taupe 29,5ml", img: "/products/Dark-Taupe.jpg", price: 7.99 },
  { name: "Satchel Tan 29,5ml", img: "/products/Satchel-Tan.jpg", price: 7.99 },
  { name: "Capezio Tan 29,5ml", img: "/products/capezio-tan.jpg", price: 7.99 },
  { name: "Orange 29,5ml", img: "/products/Orange.jpg", price: 7.99 },
  { name: "Neon Rio Red 29,5ml", img: "/products/Neon-Rio-Red.jpg", price: 7.99 },
  { name: "Navy Blue 29,5ml", img: "/products/Navy-Blue.jpg", price: 7.99 },
  { name: "Dark Brown 29,5ml", img: "/products/Dark-Brown.jpg", price: 7.99 },
  { name: "Parisian Pink 29,5ml", img: "/products/Parisian-Pink.jpg", price: 7.99 },
  { name: "Flat White 119ml", img: "/products/Flat-White.jpg", price: 15.99 },
  { name: "Violet 29,5ml", img: "/products/Violet.jpg", price: 7.99 },
  { name: "Salmon 29,5ml", img: "/products/Salmon.jpg", price: 7.99 },
  { name: "Pink 29,5ml", img: "/products/Pink.jpg", price: 7.99 },
  { name: "Pale Yellow 29,5ml", img: "/products/Pale-Yellow.jpg", price: 7.99 },
  { name: "Olive 29,5ml", img: "/products/Olive.jpg", price: 7.99 },
  { name: "Natural 29,5ml", img: "/products/Natural.jpg", price: 7.99 },
  { name: "Dark Grey 29,5ml", img: "/products/Dark-Grey.jpg", price: 7.99 },
  { name: "Chocolate 29,5ml", img: "/products/Chocolate.jpg", price: 7.99 },
  { name: "Champagne 29,5ml", img: "/products/Champagne.jpg", price: 7.99 },
  { name: "Fire Red 29,5ml", img: "/products/Fire-Red.jpg", price: 7.99 },
  { name: "Raspberry 29,5ml", img: "/products/Raspberry.jpg", price: 7.99 },
  { name: "Grey 29,5ml", img: "/products/Grey.jpg", price: 7.99 },
  { name: "Pewter 29,5ml", img: "/products/pewter.jpg", price: 7.99 },
  { name: "Neon Amazon Green 29,5ml", img: "/products/Neon-Amazon-Green.jpg", price: 7.99 },
  { name: "Mint 29,5ml", img: "/products/Mint.jpg", price: 7.99 },
  { name: "Gift Box Blue 29,5ml", img: "/products/Gift-Box-Blue.jpg", price: 7.99 },
  { name: "Pale Blue 29,5ml", img: "/products/Pale-Blue.jpg", price: 7.99 },
  { name: "Bone 29,5ml", img: "/products/Bone.jpg", price: 7.99 },
  { name: "Mauve 29,5ml", img: "/products/Mauve.jpg", price: 7.99 },
  { name: "Magenta 29,5ml", img: "/products/Magenta.jpg", price: 7.99 },
  { name: "Light Green 29,5ml", img: "/products/Light-Green.jpg", price: 7.99 },
  { name: "Bahama Blue 29,5ml", img: "/products/Bahama-Blue.jpg", price: 7.99 },
  { name: "Copper 29,5ml", img: "/products/Copper.jpg", price: 7.99 },
  { name: "Cognac 29,5ml", img: "/products/Cognac.jpg", price: 7.99 },
  { name: "Saddle 29,5ml", img: "/products/Saddle.jpg", price: 7.99 },
  { name: "Dark Bone 29,5ml", img: "/products/Dark-Bone.jpg", price: 7.99 },
  { name: "Sand 29,5ml", img: "/products/Sand.jpg", price: 7.99 },
  { name: "Putty 29,5ml", img: "/products/Putty.jpg", price: 7.99 },
  { name: "English Tan 29,5ml", img: "/products/English-Tan.jpg", price: 7.99 },
  { name: "Tan 29,5ml", img: "/products/Tan.jpg", price: 7.99 },
  { name: "Midnite Green 29,5ml", img: "/products/Midnite-Green.jpg", price: 7.99 },
  { name: "Burgundy 29,5ml", img: "/products/Burgundy.jpg", price: 7.99 },
  { name: "Dark Green 29,5ml", img: "/products/Dark-Green.jpg", price: 7.99 },
  { name: "Taupe 29,5ml", img: "/products/Taupe.jpg", price: 7.99 },
  { name: "Vanilla 29,5ml", img: "/products/Vanilla.jpg", price: 7.99 },
  { name: "Mustard 29,5ml", img: "/products/Mustard.jpg", price: 7.99 },
  { name: "Mist 29,5ml", img: "/products/Mist.jpg", price: 7.99 },
  { name: "Shell Pink 29,5ml", img: "/products/Shell-Pink.jpg", price: 7.99 },
  { name: "Sapphire 29,5ml", img: "/products/Sapphire.jpg", price: 7.99 },
  { name: "Light Blue 29,5ml", img: "/products/Light-Blue.jpg", price: 7.99 },
  { name: "Matte 29,5ml", img: "/products/Matte.jpg", price: 7.99 },
  { name: "Light Grey 29,5ml", img: "/products/Light-Grey.jpg", price: 7.99 },
  { name: "Turquoise 29,5ml", img: "/products/Turquoise.jpg", price: 7.99 },
  { name: "Cream 29,5ml", img: "/products/Cream.jpg", price: 7.99 },
  { name: "Rich Brown 29,5ml", img: "/products/Rich-Brown.jpg", price: 7.99 },
  { name: "Light Brown 29,5ml", img: "/products/Light-Brown.jpg", price: 7.99 },
  { name: "Gold 29,5ml", img: "/products/Gold.jpg", price: 7.99 },
  { name: "Silver 29,5ml", img: "/products/Silver.jpg", price: 7.99 },
  { name: "Vachetta 29,5ml", img: "/products/Vachetta.jpg", price: 7.99 },
  { name: "Georgia Peach 29,5ml", img: "/products/Georgia-Peach.jpg", price: 7.99 },
  { name: "Dark Blue 29,5ml", img: "/products/Dark-Blue.jpg", price: 7.99 },
  { name: "Beige 29,5ml", img: "/products/Beige.jpg", price: 7.99 },
  { name: "Brown 29,5ml", img: "/products/Brown.jpg", price: 7.99 },
  { name: "Purple 29,5ml", img: "/products/Purple.jpg", price: 7.99 },
  { name: "Lilac 29,5ml", img: "/products/Lilac.jpg", price: 7.99 },
  { name: "Hot Pink 29,5ml", img: "/products/Hot-Pink.jpg", price: 7.99 },
  { name: "Green 29,5ml", img: "/products/Green.jpg", price: 7.99 },
  { name: "Blue 29,5ml", img: "/products/Blue.jpg", price: 7.99 },
  { name: "Red 29,5ml", img: "/products/Red.jpg", price: 7.99 },
  { name: "Yellow 29,5ml", img: "/products/Yellow.jpg", price: 7.99 },
  { name: "White 29,5ml", img: "/products/White.jpg", price: 7.99 },
  { name: "Black 29,5ml", img: "/products/Black.jpg", price: 7.99 },
];

export default function AngelusPage() {
  // ✅ Στέλνουμε ένα event όταν ανοίγει η κατηγορία
  useEffect(() => {
    track("View Category", { name: "Custom Yourself – Angelus Leather Paints" });
  }, []);

  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "3rem 2rem",
      }}
    >
      <h1
        style={{
          color: "#00ffff",
          fontSize: "2rem",
          textAlign: "center",
          marginBottom: "2rem",
          textShadow: "0 0 10px #0ff",
        }}
      >
        Custom Yourself – Angelus Leather Paints
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "2rem",
        }}
      >
        {products.map((product, i) => (
          <div
            key={i}
            style={{
              backgroundColor: "#000",
              border: "2px solid "#00ffff",
              borderRadius: "1rem",
              padding: "1rem",
              textAlign: "center",
              boxShadow: "0 0 20px #0ff",
              transition: "transform 0.3s, boxShadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.05)";
              e.currentTarget.style.boxShadow = "0 0 30px #0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 20px #0ff";
            }}
          >
            <Image
              src={product.img}
              alt={product.name}
              width={100}
              height={100}
              style={{ marginBottom: "1rem" }}
              // ✅ όταν ο χρήστης κάνει κλικ στην εικόνα, καταγράφουμε "Click Product"
              onClick={() => track("Click Product", { name: product.name, price: product.price })}
            />
            <h3 style={{ color: "#00ffff", marginBottom: "0.5rem" }}>
              {product.name}
            </h3>
            <p style={{ color: "#fff", marginBottom: "1rem" }}>
              {product.price.toFixed(2)}€
            </p>
            <AddToCartButton
              id={`product-${i}`}
              name={product.name}
              price={product.price}
              image={product.img}
            />
          </div>
        ))}
      </div>
    </main>
  );
}

