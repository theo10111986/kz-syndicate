"use client";
import { useCart } from "@/context/CartContext";

export default function CartView() {
  const { cart, removeFromCart, clearCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return <div className="text-white p-4">Το καλάθι σου είναι άδειο.</div>;
  }

  return (
    <div className="text-white p-6 bg-black rounded-xl max-w-2xl mx-auto mt-10 shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Το Καλάθι σου</h2>

      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between border-b border-gray-700 py-4"
        >
          <div className="flex items-center gap-4">
            <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm text-gray-400">
                {item.quantity} × {item.price.toFixed(2)}€
              </p>
            </div>
          </div>
          <button
            className="text-red-500 hover:text-red-400"
            onClick={() => removeFromCart(item.id)}
          >
            Αφαίρεση
          </button>
        </div>
      ))}

      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-bold">Σύνολο: {total.toFixed(2)}€</span>
        <button
          className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg"
          onClick={clearCart}
        >
          Καθαρισμός Καλαθιού
        </button>
      </div>
    </div>
  );
}
