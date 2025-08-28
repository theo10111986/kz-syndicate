// app/gallery/page.tsx
export const metadata = {
  title: "Gallery | KZ Syndicate",
  description: "Δες τη συλλογή με custom Sneakers, Caps, Clothes & Art από το KZ Syndicate.",
};

export const revalidate = 3600; // SSG + CDN cache 1 ώρα

import GalleryPageClient from "./GalleryPageClient";

export default function GalleryPage() {
  return <GalleryPageClient />;
}


