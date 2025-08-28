import Script from "next/script";

export const metadata = {
  title: "Custom Yourself | KZ Syndicate",
  description: "Διάλεξε υποκατηγορία (Angelus, Πρόσθετα/Προεργασία) και ξεκίνα το customization σου.",
};

export default function CustomLandingPage() {
  return (
    <>
      {/* ...το UI σου (ή <CustomClient />) ... */}

      <Script
        id="breadcrumbs-shop-custom"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://www.kzsyndicate.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Shop",
                "item": "https://www.kzsyndicate.com/shop"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Custom",
                "item": "https://www.kzsyndicate.com/shop/custom"
              }
            ]
          }),
        }}
      />
    </>
  );
}

