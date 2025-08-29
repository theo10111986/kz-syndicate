"use client";
import { useCart } from "@/context/CartContext";

export default function CartView() {
  const {
    cart,
    removeFromCart,
    clearCart,
    // ✅ νέα από το CartContext
    subtotal,
    shipping,
    total,
    shippingZone,
    setShippingZone,
    shippingMethod,
    setShippingMethod,
    formatCurrency,
  } = useCart();

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

      {/* ✅ Μεταφορικά & Σύνολα */}
      <div className="mt-6 grid gap-3 p-4 border border-cyan-400 rounded-lg shadow-[0_0_12px_rgba(0,255,255,0.35)]">
        <h3 className="text-cyan-300 font-semibold text-center">Μεταφορικά &amp; Σύνολα</h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-xs text-cyan-200/80">Ζώνη αποστολής</span>
            <select
              value={shippingZone}
              onChange={(e) => setShippingZone(e.target.value as any)}
              className="bg-black text-white border border-cyan-400 rounded-md px-3 py-2 outline-none"
            >
              <option value="GR">Ελλάδα</option>
              <option value="EU">Ευρωπαϊκή Ένωση</option>
              <option value="INT">Διεθνώς</option>
            </select>
          </label>

          <label className="grid gap-1">
            <span className="text-xs text-cyan-200/80">Τρόπος αποστολής</span>
            <select
              value={shippingMethod}
              onChange={(e) => setShippingMethod(e.target.value as any)}
              className="bg-black text-white border border-cyan-400 rounded-md px-3 py-2 outline-none"
            >
              <option value="standard">Standard</option>
              <option value="express">Express</option>
              <option value="pickup">Παραλαβή από κατάστημα</option>
            </select>
          </label>
        </div>

        <div className="border-t border-cyan-400/40 pt-3 text-sm">
          <div className="flex justify-between mb-1">
            <span>Υποσύνολο</span>
            <strong>{formatCurrency(subtotal)}</strong>
          </div>
          <div className="flex justify-between mb-1">
            <span>Μεταφορικά</span>
            <strong>{formatCurrency(shipping)}</strong>
          </div>
          <div className="flex justify-between mt-1 text-base">
            <span className="text-cyan-300">Σύνολο</span>
            <strong className="text-cyan-300">{formatCurrency(total)}</strong>
          </div>
          <p className="mt-2 text-xs text-cyan-100/70">
            * Ελλάδα: δωρεάν Standard ≥ 60€, Express ≥ 100€.
          </p>
        </div>
      </div>

      <div className="flex justify-between items-center mt-6">
        <span className="text-xl font-bold">Σύνολο: {formatCurrency(total)}</span>
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
