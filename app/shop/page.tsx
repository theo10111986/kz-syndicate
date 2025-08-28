import Script from "next/script";

export const metadata = {
  title: "Shop | KZ Syndicate",
  description: "Ανακάλυψε custom sneakers, clothes, accessories & custom tools.",
};

export default function ShopPage() {
  return (
    <>
      {/* ...το UI σου (ή <ShopClient />) ... */}

      <Script
        id="breadcrumbs-shop"
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
              }
            ]
          }),
        }}
      />
    </>
  );
}
