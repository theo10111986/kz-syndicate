// app/shop/page.tsx
export const metadata = {
  title: "Shop | KZ Syndicate",
  description: "Ανακάλυψε custom sneakers, clothes, accessories & custom tools.",
};

import ShopClient from "./ShopClient";

export default function ShopPage() {
  return <ShopClient />;
}

