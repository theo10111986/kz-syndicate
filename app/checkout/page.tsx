import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import CheckoutForm from "@/components/CheckoutForm";

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/auth/login?callbackUrl=/checkout");
  }

  return (
    <div
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        paddingTop: "120px", // κάτω από το fixed navbar
        display: "flex",
        justifyContent: "center",
        paddingLeft: "1rem",
        paddingRight: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 900,
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
          Checkout
        </h1>

        <CheckoutForm />
      </div>
    </div>
  );
}
