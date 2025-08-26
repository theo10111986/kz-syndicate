"use client";
import { useCart } from "@/context/CartContext";

export default function AddToCartButton({ id, name, price, image }: {
  id: string;
  name: string;
  price: number;
  image: string;
}) {
  const { addToCart } = useCart();

  return (
    <button
    onClick={() => {
  addToCart({
    id,
    name,
    price,
    image,
    quantity: 1,
  });

  alert(`${name} added to cart!`);
}}

      style={{
        padding: "0.5rem 1rem",
        backgroundColor: "#00ffff",
        color: "#000",
        border: "none",
        borderRadius: "10px",
        fontWeight: "bold",
        cursor: "pointer",
        boxShadow: "0 0 10px #0ff",
      }}
    >
      Add to Cart
    </button>
  );
}
