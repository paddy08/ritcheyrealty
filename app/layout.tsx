import type { Metadata } from "next";
import { Archivo, DM_Mono, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Three roles, self-hosted via next/font — no render-blocking external requests.
//
// Display: Libre Caslon. Caslon is the face of American deeds and land titles;
// one weight, used large and sparingly.
const caslon = Libre_Caslon_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
  weight: ["400"],
});

// Body: Archivo — an American grotesque, sturdy at small sizes.
const archivo = Archivo({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
  weight: ["400", "500", "600"],
});

// Utility: DM Mono — labels, coordinates, and property data.
const dmMono = DM_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
  weight: ["300", "400", "500"],
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
    <html
      lang="en"
      className={`${caslon.variable} ${archivo.variable} ${dmMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
