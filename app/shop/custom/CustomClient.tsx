"use client";
import Image from "next/image";
import Link from "next/link";

const customCategories = [
  {
    title: "Angelus – Χρώμα για λείο δέρμα",
    img: "/shop-categories/angelus.png",
    link: "/shop/custom/angelus",
  },
  {
    title: "Πρόσθετα & Προεργασία",
    img: "/shop-categories/additives.png",
    link: "/shop/custom/additives",
  },
  {
    title: "Rit – Βαφή για ύφασμα",
    img: "/shop-categories/rit.png",
    link: "/shop/custom/rit",
  },
];

export default function CustomClient() {
  return (
    <main
      style={{
        backgroundColor: "#000",
        minHeight: "100vh",
        padding: "4rem 2rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
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
        Custom Yourself
      </h1>
      <p style={{ color: "#fff", marginBottom: "2rem" }}>
        Επίλεξε υποκατηγορία για να ξεκινήσεις το customization σου.
      </p>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "2rem",
        }}
      >
        {customCategories.map((cat, index) => (
          <Link key={index} href={cat.link} className="card-link">
            <div className="card">
              <Image
                src={cat.img}
                alt={cat.title}
                width={150}
                height={150}
                style={{ marginBottom: "1rem" }}
              />
              <p
                style={{
                  color: "#00ffff",
                  fontWeight: "bold",
                  textShadow: "0 0 8px #0ff",
                  textAlign: "center",
                }}
              >
                {cat.title}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .card {
          background-color: #000;
          border: 2px solid #00ffff;
          border-radius: 2rem;
          padding: 2rem;
          width: 230px;
          height: 260px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 15px #0ff;
          transition: transform 0.3s, box-shadow 0.3s;
          text-align: center;
        }
        .card:hover {
          transform: scale(1.08);
          box-shadow: 0 0 30px #0ff;
        }
      `}</style>
    </main>
  );
}



