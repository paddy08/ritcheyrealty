import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Self-hosted via next/font — no render-blocking external requests, swap display.
const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ritchey-realty-demo.vercel.app"),
  title: {
    default: "Ritchey Realty — Fort Worth & DFW Real Estate",
    template: "%s — Ritchey Realty",
  },
  description:
    "Kallie Ritchey helps buyers and sellers across Fort Worth, Southlake, Keller, Grapevine and the greater DFW area find their place with clarity and care.",
  openGraph: {
    title: "Ritchey Realty — Fort Worth & DFW Real Estate",
    description:
      "Boutique real estate service across Fort Worth and the greater DFW metroplex.",
    type: "website",
  },
  robots: {
    // Demo site — keep it out of search indexes.
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
