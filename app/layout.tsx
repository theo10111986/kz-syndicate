import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Providers } from "./Providers";

export const metadata: Metadata = {
  title: "KZ Syndicate",
  description: "Join the underground, wear the code.",
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
          {/* Navbar */}
          <Navbar />
          {/* Spacer για navbar */}
          <div aria-hidden style={{ height: 96 }} />
          {/* Κύριο περιεχόμενο */}
          <main className="min-h-screen">{children}</main>
          {/* Footer */}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
