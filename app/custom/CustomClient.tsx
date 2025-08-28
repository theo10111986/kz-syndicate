// app/custom/CustomClient.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script"; // ✅ για JSON-LD μόνο (αόρατο)

const options = [
  {
    title: "Στο δικό μου sneaker",
    img: "/shop-categories/sneaker-own.png",
    href: "/customizer?source=own",
  },
  {
    title: "Αγορά sneaker (+τιμή)",
    img: "/shop-categories/sneaker-buy.png",
    href: "/customizer?source=shop",
  },
  {
    title: "Καπέλο",
    img: "/shop-categories/custom-cap-cyan.png",
    href: "/customizer-hat",
  },
];

// Σταθερό κουτί 170×170 με Next/Image fill + objectFit: "contain"
function IconBox({ src, alt }: { src: string; alt: string }) {
  return (
    <div
      style={{
        position: "relative",
        width: 170,
        height: 170,
        marginBottom: "0.5rem",
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </div>
  );
}

export default function CustomStartPage() {
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
          textShadow: "0 0 10px "#0ff",
        }}
      >
        Ξεκίνα το δικό σου Custom Project
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "2rem",
        }}
      >
        {options.map((opt, i) => (
          <Link
            key={i}
            href={opt.href}
            style={{
              width: "300px",
              height: "300px", // ίδιο ύψος με shop card
              backgroundColor: "#000",
              border: "2px solid #00ffff",
              borderRadius: "1rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              boxShadow: "0 0 20px #0ff",
              transition: "transform 0.3s, boxShadow 0.3s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 0 30px #0ff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 20px #0ff";
            }}
          >
            <IconBox src={opt.img} alt={opt.title} />
            <h3 style={{ color: "#00ffff" }}>{opt.title}</h3>
          </Link>
        ))}
      </div>

      {/* ✅ JSON-LD: Breadcrumbs */}
      <Script id="schema-breadcrumbs-custom" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kzsyndicate.com/" },
            { "@type": "ListItem", "position": 2, "name": "Custom", "item": "https://kzsyndicate.com/custom" }
          ]
        })}
      </Script>

      {/* ✅ JSON-LD: WebPage με keywords (αόρατο για χρήστη, χρήσιμο για Google) */}
      <Script id="schema-webpage-custom" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Custom Sneakers, Custom Nike & Air Force 1, Custom Cap",
          "url": "https://kzsyndicate.com/custom",
          "inLanguage": "el-GR",
          "keywords": "custom sneakers, custom nike, custom air force 1, custom af1, custom cap, custom καπέλο, custom παπούτσια",
          "about": [
            { "@type": "Thing", "name": "Custom sneakers" },
            { "@type": "Thing", "name": "Custom Nike" },
            { "@type": "Thing", "name": "Custom Air Force 1" },
            { "@type": "Thing", "name": "Custom cap" }
          ],
          "publisher": { "@type": "Organization", "name": "KZ Syndicate" }
        })}
      </Script>

      {/* ✅ JSON-LD: FAQ (χωρίς να φαίνεται στο UI) */}
      <Script id="schema-faq-custom" type="application/ld+json" strategy="afterInteractive">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Κάνετε custom Air Force 1;",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι, εξειδικευόμαστε σε custom Nike Air Force 1 με premium υλικά."
              }
            },
            {
              "@type": "Question",
              "name": "Σε πόσο χρόνο παραδίδετε;",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Συνήθως 5–10 εργάσιμες, ανάλογα με το σχέδιο και τη διαθεσιμότητα."
              }
            },
            {
              "@type": "Question",
              "name": "Φτιάχνετε custom caps;",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Ναι, δημιουργούμε custom καπέλα με σχέδια, λογότυπα και ειδικά φινιρίσματα."
              }
            }
          ]
        })}
      </Script>
    </main>
  );
}
