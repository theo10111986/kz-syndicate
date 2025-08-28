// app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";
import Script from "next/script";

export const metadata: Metadata = {
  title: "KZ Syndicate",
  description: "Join the underground, wear the code.",
  metadataBase: new URL("https://www.kzsyndicate.com"),
  openGraph: {
    title: "KZ Syndicate",
    description: "Join the underground, wear the code.",
    url: "https://www.kzsyndicate.com/",
    siteName: "KZ Syndicate",
    images: [
      {
        url: "https://www.kzsyndicate.com/kz-og-1200x630.jpg",
        width: 1200,
        height: 630,
        alt: "KZ Syndicate",
      },
    ],
    locale: "el_GR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "KZ Syndicate",
    description: "Join the underground, wear the code.",
    images: ["https://www.kzsyndicate.com/kz-og-1200x630.jpg"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
    other: [
      { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192" },
      { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el">
      <body className="bg-black text-white">
        <Providers>
          <Navbar />
          <div aria-hidden style={{ height: 96 }} />
          <main className="min-h-screen">{children}</main>
          <Footer />

          {/* Umami Analytics */}
          <Script
            src="https://umami-tau-tan.vercel.app/script.js"
            data-website-id="f37bba3a-96f1-4360-b3ea-50468e0dfee0"
            strategy="afterInteractive"
          />

          {/* Organization JSON-LD */}
          <Script
            id="schema-org"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "KZ Syndicate",
                url: "https://www.kzsyndicate.com/",
                logo: "https://www.kzsyndicate.com/android-chrome-192x192.png",
                image: "https://www.kzsyndicate.com/kz-og-1200x630.jpg",
                sameAs: ["https://www.instagram.com/kzsyndicate"],
              }),
            }}
          />

          {/* WebSite JSON-LD */}
          <Script
            id="schema-website"
            type="application/ld+json"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "KZ Syndicate",
                url: "https://www.kzsyndicate.com/",
                inLanguage: "el-GR",
                publisher: { "@type": "Organization", name: "KZ Syndicate" },
              }),
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

