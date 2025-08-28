// app/shop/page.tsx
import Script from "next/script";

export const metadata = {
  title: "Shop | KZ Syndicate",
  description: "Ανακάλυψε custom sneakers, clothes, accessories & custom tools.",
};

export const revalidate = 3600; // cache 1 ώρα

import ShopClient from "./ShopClient";

export default function ShopPage() {
  return (
    <>
      <ShopClient />

      {/* Breadcrumbs (αν τα έχεις ήδη, άστα όπως ήταν) */}
      <Script
        id="breadcrumbs-shop"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.kzsyndicate.com/" },
              { "@type": "ListItem", "position": 2, "name": "Shop", "item": "https://www.kzsyndicate.com/shop" }
            ]
          }),
        }}
      />
    </>
  );
}
