"use client";
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

// Τύπος για προϊόν
export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

// Ζώνες/μέθοδοι αποστολής
type ShippingZone = "GR" | "EU" | "INT";
type ShippingMethod = "pickup" | "standard" | "express";

// Τύπος για context (✅ διατηρεί τις υπάρχουσες υπογραφές & προσθέτει νέα πεδία)
type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;

  // Νέα (προαιρετική) λειτουργία
  updateQty: (id: string, quantity: number) => void;

  // Shipping state
  shippingZone: ShippingZone;
  setShippingZone: (z: ShippingZone) => void;
  shippingMethod: ShippingMethod;
  setShippingMethod: (m: ShippingMethod) => void;

  // Σύνολα
  subtotal: number;
  shipping: number;
  total: number;

  // Helper μορφοποίησης
  formatCurrency: (n: number) => string;
};

// Δημιουργία του context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Κανόνες μεταφορικών (εύκολα αλλάζουν)
function calcShipping(subtotal: number, zone: ShippingZone, method: ShippingMethod): number {
  if (method === "pickup") return 0;

  // GR: standard 3.90€ (free ≥ 60€), express 6.90€ (free ≥ 100€)
  // EU: standard 12€, express 20€ (χωρίς free by default)
  // INT: standard 18€, express 30€ (χωρίς free by default)
  const rules = {
    GR: { base: { standard: 3.9, express: 6.9 }, freeOver: { standard: 60, express: 100 } },
    EU: { base: { standard: 12,  express: 20  }, freeOver: { standard: Infinity, express: Infinity } },
    INT:{ base: { standard: 18,  express: 30  }, freeOver: { standard: Infinity, express: Infinity } },
  } as const;

  const r = rules[zone];
  if (subtotal >= r.freeOver[method]) return 0;
  return r.base[method];
}

function formatCurrency(n: number) {
  return n.toLocaleString("el-GR", { style: "currency", currency: "EUR", minimumFractionDigits: 2 });
}

// Provider
export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [shippingZone, setShippingZone] = useState<ShippingZone>("GR");
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");

  // Load από localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("kz_cart_v1");
      if (raw) setCart(JSON.parse(raw));

      const z = localStorage.getItem("kz_ship_zone") as ShippingZone | null;
      const m = localStorage.getItem("kz_ship_method") as ShippingMethod | null;
      if (z) setShippingZone(z);
      if (m) setShippingMethod(m);
    } catch {}
  }, []);

  // Persist σε localStorage
  useEffect(() => {
    try { localStorage.setItem("kz_cart_v1", JSON.stringify(cart)); } catch {}
  }, [cart]);
  useEffect(() => {
    try {
      localStorage.setItem("kz_ship_zone", shippingZone);
      localStorage.setItem("kz_ship_method", shippingMethod);
    } catch {}
  }, [shippingZone, shippingMethod]);

  // Σύνολα
  const subtotal = useMemo(() => cart.reduce((sum, i) => sum + i.price * i.quantity, 0), [cart]);
  const shipping = useMemo(() => calcShipping(subtotal, shippingZone, shippingMethod), [subtotal, shippingZone, shippingMethod]);
  const total = useMemo(() => subtotal + shipping, [subtotal, shipping]);

  // Υπάρχουσες μέθοδοι (ίδιες υπογραφές)
  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
        );
      } else {
        return [...prev, item];
      }
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // ΝΕΟ: ενημέρωση ποσότητας (προαιρετικό)
  const updateQty = (id: string, quantity: number) => {
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i))
    );
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,

        updateQty,

        shippingZone,
        setShippingZone,
        shippingMethod,
        setShippingMethod,

        subtotal,
        shipping,
        total,

        formatCurrency,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
