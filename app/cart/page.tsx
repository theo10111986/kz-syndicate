"use client";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { cart, removeFromCart, clearCart } = useCart();
  const [accepted, setAccepted] = useState(false);

  const total = useMemo(
    () => cart.reduce((sum, it) => sum + it.price * it.quantity, 0),
    [cart]
  );

  function goCheckout() {
    if (!accepted) {
      alert("Παρακαλώ αποδέξου το disclaimer για να συνεχίσεις.");
      return;
    }
    router.push("/checkout");
  }

  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        paddingTop: "120px", // κάτω από navbar
        display: "flex",
        justifyContent: "center",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "900px",
          background:
            "linear-gradient(180deg, rgba(0,255,255,0.06) 0%, rgba(0,255,255,0.03) 100%)",
          border: "1px solid #0ff",
          borderRadius: 16,
          padding: "2rem",
          color: "#cfffff",
          boxShadow: "0 0 14px rgba(0,255,255,.25)",
        }}
      >
        <h1
          style={{
            color: "#00ffff",
            textShadow: "0 0 8px #0ff",
            marginBottom: "1.5rem",
            textAlign: "center",
          }}
        >
          Your Cart
        </h1>

        {/* Disclaimer */}
        <div
          style={{
            marginBottom: "2rem",
            padding: "1rem",
            border: "1px solid #0ff",
            borderRadius: 12,
            background:
              "linear-gradient(180deg, rgba(0,255,255,0.08) 0%, rgba(0,255,255,0.04) 100%)",
          }}
        >
          <span
            style={{
              display: "inline-block",
              fontWeight: 900,
              color: "#00191b",
              background: "#00ffff",
              padding: "2px 8px",
              borderRadius: 8,
              marginBottom: 8,
            }}
          >
            Disclaimer
          </span>
          <ul style={{ margin: "8px 0 0 18px", lineHeight: 1.6 }}>
            <li>
              Όλα τα προϊόντα είναι <b>χειροποίητα custom</b>. Μικρές αποκλίσεις
              στο τελικό αποτέλεσμα είναι φυσιολογικές.
            </li>
            <li>
              Εκτιμώμενος χρόνος υλοποίησης: <b>7–14 εργάσιμες</b>.
            </li>
            <li>
              Οι <b>custom παραγγελίες</b> δεν επιστρέφονται/ακυρώνονται αφότου
              ξεκινήσει η εργασία.
            </li>
            <li>
              Οι αποχρώσεις μπορεί να διαφέρουν ελαφρώς λόγω φωτισμού/οθονών.
            </li>
            <li>
              Φροντίδα: καθάρισμα με νωπό πανί. <b>Όχι</b> πλυντήριο/χημικά.
            </li>
            <li>
              Αν μας στείλεις δικό σου προϊόν, δεν φέρουμε ευθύνη για ελαττώματα.
            </li>
            <li>
              Ερωτήσεις;{" "}
              <a
                href="mailto:info@kzsyndicate.com"
                style={{ color: "#00ffff" }}
              >
                info@kzsyndicate.com
              </a>
            </li>
          </ul>

          <label
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginTop: 12,
            }}
          >
            <input
              type="checkbox"
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
            />
            <span>Διάβασα & αποδέχομαι το disclaimer</span>
          </label>
        </div>

        {cart.length === 0 ? (
          <p style={{ textAlign: "center" }}>Το καλάθι σου είναι άδειο.</p>
        ) : (
          <>
            {cart.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  marginBottom: "1rem",
                  borderBottom: "1px solid #444",
                  paddingBottom: "1rem",
                }}
              >
                <img src={item.image} alt={item.name} width={60} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0 }}>{item.name}</p>
                  <p style={{ margin: 0 }}>
                    {item.price}€ x {item.quantity}
                  </p>
                </div>
                <button
                  onClick={() => removeFromCart(item.id)}
                  style={{
                    background: "red",
                    color: "#fff",
                    border: "none",
                    padding: "0.5rem 0.75rem",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </div>
            ))}

            {/* Σύνολο & κουμπιά */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: "1rem",
                marginTop: "1rem",
              }}
            >
              <div style={{ fontWeight: 900, color: "#aef" }}>
                Σύνολο: {total.toFixed(2)}€
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <button
                  onClick={clearCart}
                  style={{
                    background: "transparent",
                    color: "#00ffff",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    border: "1px solid #00ffff",
                    fontWeight: 800,
                    cursor: "pointer",
                  }}
                >
                  Καθαρισμός Καλαθιού
                </button>
                <button
                  onClick={goCheckout}
                  disabled={!accepted}
                  style={{
                    background: accepted ? "#00ffff" : "#044a4a",
                    color: accepted ? "#000" : "#7bcaca",
                    padding: "0.75rem 1rem",
                    borderRadius: 10,
                    border: "none",
                    fontWeight: 800,
                    cursor: accepted ? "pointer" : "not-allowed",
                    boxShadow: accepted
                      ? "0 0 14px rgba(0,255,255,.35)"
                      : "none",
                  }}
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
