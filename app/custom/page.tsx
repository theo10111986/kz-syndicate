// app/custom/page.tsx
import type { Metadata } from "next";
import CustomClient from "./CustomClient";

export const metadata: Metadata = {
  title: "Custom Sneakers, Custom Nike & Air Force 1, Custom Cap | KZ Syndicate",
  description:
    "Custom sneakers (Nike Air Force 1 κ.ά.) και custom caps από το KZ Syndicate. Φτιάξε το δικό σου design στο Customizer. Αποστολές σε όλη την Ελλάδα.",
  metadataBase: new URL("https://kzsyndicate.com"),
  alternates: { canonical: "https://kzsyndicate.com/custom" },
  openGraph: {
    title: "Custom Sneakers, Custom Nike & Air Force 1, Custom Cap | KZ Syndicate",
    description:
      "Φτιάξε μοναδικά custom sneakers (Nike Air Force 1, Nike κ.ά.) και custom caps. Παραγγελία online, αποστολές πανελλαδικά.",
    url: "https://kzsyndicate.com/custom",
    siteName: "KZ Syndicate",
    images: [
      {
        url: "https://kzsyndicate.com/kz-og-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "KZ Syndicate Custom Sneakers",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Custom Sneakers, Custom Nike & AF1, Custom Cap",
    description: "Custom sneakers & caps από το KZ Syndicate. Φτιάξε το δικό σου design.",
    images: ["https://kzsyndicate.com/kz-og-1200x630.jpg"],
  },
};

export default function CustomPage() {
  return <CustomClient />;
}
