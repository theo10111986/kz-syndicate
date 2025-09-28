"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRouter } from "next/navigation";

export default function CheckoutForm() {
  const router = useRouter();
  const {
    cart,
    clearCart,
    subtotal,
    shipping: shippingCost,
    total,
    shippingZone,
    shippingMethod,
    formatCurrency,
  } = useCart();

  // Μικρή φόρμα αποστολής
  const [shipping, setShipping] = useState({
    firstName: "",
    lastName: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    postalCode: "",
    country: "Greece",
    phone: "",
  });

  // 🔑 state για κωδικό έκπτωσης
  const [code, setCode] = useState("");
  const [discount, setDiscount] = useState(0);

  function applyCode() {
    if (code.trim().toUpperCase() === "WELCOME") {
      setDiscount(0.1); // 10%
    } else {
      setDiscount(0);
      alert("Μη έγκυρος κωδικός");
    }
  }

  const discountedTotal = total - total * discount;

  async function placeOrder(e: React.FormEvent) {
    e.preventDefault();

    if (cart.length === 0) {
      alert("Το καλάθι είναι άδειο.");
      return;
    }

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart,
          subtotal,
          shippingCost,
          total: discountedTotal, // 👈 στέλνουμε το τελικό σύνολο με την έκπτωση
          discountCode: code.toUpperCase(),
          currency: "EUR",
          shippingAddress: shipping,
          shippingZone,
          shippingMethod,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401) {
          router.push("/auth/login?callbackUrl=/checkout");
          return;
        }
        alert(data?.error || "Κάτι πήγε στραβά.");
        return;
      }

      clearCart();
      router.push(`/checkout/confirmation?id=${data.id}`);
    } catch (err: any) {
      alert("Σφάλμα δικτύου.");
    }
  }

  const label: React.CSSProperties = {
    color: "#9ef",
    fontSize: "0.9rem",
    marginBottom: 6,
    display: "block",
  };
  const input: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    borderRadius: 12,
    background: "#000",
    border: "1px solid #0ff6",
    color: "#fff",
    outline: "none",
    boxShadow: "inset 0 0 6px #0ff2",
  };

  return (
    <div style={{ display: "grid", gap: "1.5rem" }}>
      {/* Περίληψη καλαθιού */}
      <div
        style={{
          border: "1px solid #0ff",
          borderRadius: 12,
          padding: "1rem",
          background:
            "linear-gradient(180deg, rgba(0,255,255,0.08) 0%, rgba(0,255,255,0.04) 100%)",
        }}
      >
        <h2 style={{ marginTop: 0, color: "#0ff" }}>Περίληψη Παραγγελίας</h2>
        {cart.length === 0 ? (
          <p style={{ margin: 0 }}>Το καλάθι είναι άδειο.</p>
        ) : (
          <>
            {cart.map((it) => (
              <div
                key={it.id}
                style={{
                  display: "flex",
                  gap: 12,
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #123",
                }}
              >
                <img src={it.image} alt={it.name} width={50} />
                <div style={{ flex: 1 }}>
                  <div style={{ color: "#fff" }}>{it.name}</div>
                  <div style={{ color: "#9ef", fontSize: 13 }}>
                    {formatCurrency(it.price)} × {it.quantity}
                  </div>
                </div>
                <div style={{ fontWeight: 700, color: "#aef" }}>
                  {formatCurrency(it.price * it.quantity)}
                </div>
              </div>
            ))}
            <div
              style={{
                borderTop: "1px dashed #0ff6",
                marginTop: 8,
                paddingTop: 8,
              }}
            >
              {/* Shipping selectors */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                  marginBottom: 10,
                }}
              >
                <label style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#9ef" }}>
                    Ζώνη αποστολής
                  </span>
                  <select
                    value={shippingZone}
                    onChange={(e) =>
                      (window?.localStorage?.setItem?.(
                        "kz_ship_zone",
                        e.target.value
                      ),
                      location?.reload?.())
                    }
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      background: "#000",
                      color: "#fff",
                      border: "1px solid #0ff6",
                    }}
                  >
                    <option value="GR">Ελλάδα</option>
                    <option value="EU">Ευρωπαϊκή Ένωση</option>
                    <option value="INT">Διεθνώς</option>
                  </select>
                </label>
                <label style={{ display: "grid", gap: 4 }}>
                  <span style={{ fontSize: 12, color: "#9ef" }}>
                    Τρόπος αποστολής
                  </span>
                  <select
                    value={shippingMethod}
                    onChange={(e) =>
                      (window?.localStorage?.setItem?.(
                        "kz_ship_method",
                        e.target.value
                      ),
                      location?.reload?.())
                    }
                    style={{
                      padding: 8,
                      borderRadius: 10,
                      background: "#000",
                      color: "#fff",
                      border: "1px solid #0ff6",
                    }}
                  >
                    <option value="standard">Standard</option>
                    <option value="express">Express</option>
                  </select>
                </label>
              </div>

              {/* ✨ Κωδικός προσφοράς */}
              <div style={{ margin: "10px 0" }}>
                <label style={{ fontSize: 12, color: "#9ef" }}>
                  Κωδικός Προσφοράς
                </label>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="π.χ. WELCOME"
                    style={{
                      flex: 1,
                      padding: 8,
                      borderRadius: 10,
                      background: "#000",
                      color: "#fff",
                      border: "1px solid #0ff6",
                    }}
                  />
                  <button
                    type="button"
                    onClick={applyCode}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 10,
                      background: "#0ff",
                      color: "#000",
                      fontWeight: 700,
                      cursor: "pointer",
                      border: "none",
                    }}
                  >
                    Εφαρμογή
                  </button>
                </div>
                {discount > 0 && (
                  <div style={{ color: "#0f8", fontSize: 13, marginTop: 4 }}>
                    ✅ Έκπτωση 10% εφαρμόστηκε!
                  </div>
                )}
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#aef",
                  marginBottom: 4,
                }}
              >
                <span>Υποσύνολο</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  color: "#aef",
                  marginBottom: 4,
                }}
              >
                <span>Μεταφορικά</span>
                <span>
                  {typeof shippingCost === "number"
                    ? formatCurrency(shippingCost)
                    : "—"}
                </span>
              </div>

              {discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    color: "#0f8",
                    marginBottom: 4,
                  }}
                >
                  <span>Έκπτωση</span>
                  <span>-{(discount * 100).toFixed(0)}%</span>
                </div>
              )}

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 900,
                  color: "#aef",
                }}
              >
                <span>Σύνολο</span>
                <span>{formatCurrency(discountedTotal)}</span>
              </div>
              <div style={{ marginTop: 6, fontSize: 12, color: "#9ef" }}>
                Ζώνη: <b>{shippingZone}</b> • Τρόπος: <b>{shippingMethod}</b>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Στοιχεία αποστολής */}
      <form onSubmit={placeOrder} style={{ display: "grid", gap: 12 }}>
        <h2 style={{ marginTop: 0, color: "#0ff" }}>Στοιχεία Αποστολής</h2>

        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
        >
          <div>
            <label style={label}>Όνομα</label>
            <input
              style={input}
              value={shipping.firstName}
              onChange={(e) =>
                setShipping({ ...shipping, firstName: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label style={label}>Επώνυμο</label>
            <input
              style={input}
              value={shipping.lastName}
              onChange={(e) =>
                setShipping({ ...shipping, lastName: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label style={label}>Διεύθυνση</label>
          <input
            style={input}
            value={shipping.addressLine1}
            onChange={(e) =>
              setShipping({ ...shipping, addressLine1: e.target.value })
            }
            required
          />
        </div>
        <div>
          <label style={label}>Διεύθυνση (συμπληρωματική)</label>
          <input
            style={input}
            value={shipping.addressLine2}
            onChange={(e) =>
              setShipping({ ...shipping, addressLine2: e.target.value })
            }
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 12,
          }}
        >
          <div>
            <label style={label}>Πόλη</label>
            <input
              style={input}
              value={shipping.city}
              onChange={(e) =>
                setShipping({ ...shipping, city: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label style={label}>T.K.</label>
            <input
              style={input}
              value={shipping.postalCode}
              onChange={(e) =>
                setShipping({ ...shipping, postalCode: e.target.value })
              }
              required
            />
          </div>
          <div>
            <label style={label}>Χώρα</label>
            <input
              style={input}
              value={shipping.country}
              onChange={(e) =>
                setShipping({ ...shipping, country: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div>
          <label style={label}>Τηλέφωνο</label>
          <input
            style={input}
            value={shipping.phone}
            onChange={(e) =>
              setShipping({ ...shipping, phone: e.target.value })
            }
            required
          />
        </div>

        <button
          type="submit"
          style={
            {
              marginTop: 6,
              background: "#00ffff",
              color: "#000",
              padding: "0.9rem 1rem",
              borderRadius: 12,
              border: "none",
              fontWeight: 800,
              cursor: "pointer",
              boxShadow: "0 0 14px rgba(0,255,255,.35)",
            } as React.CSSProperties
          }
          disabled={cart.length === 0}
        >
          Place Order →
        </button>
      </form>
    </div>
  );
}

