// app/gallery/page.tsx
export const metadata = {
  title: "Gallery | KZ Syndicate",
  description: "Δες τη συλλογή με custom Sneakers, Caps, Clothes & Art από το KZ Syndicate.",
};

import GalleryPageClient from "./GalleryPageClient";

export default function GalleryPage() {
  return <GalleryPageClient />;
}

