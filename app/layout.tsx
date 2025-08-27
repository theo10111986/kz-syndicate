import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "KZ Syndicate",
  description: "Join the underground, wear the code.",
  metadataBase: new URL("https://kzsyndicate.com"),
  openGraph: {
    title: "KZ Syndicate",
    description: "Join the underground, wear the code.",
    url: "https://kzsyndicate.com",
    siteName: "KZ Syndicate",
    images: [
      {
        url: "https://kzsyndicate.com/kz-og.JPG", // absolute URL
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
    images: ["https://kzsyndicate.com/kz-og.JPG"], // absolute URL
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="el">
      <body className="bg-black text-white">
        <Providers>
          <Navbar />
          <div aria-hidden style={{ height: 96 }} />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

