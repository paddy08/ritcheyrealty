import type { Metadata } from "next";
import { Archivo, DM_Mono, Libre_Caslon_Display } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HydrationMark } from "@/components/HydrationMark";
import { MessageWidget } from "@/components/MessageWidget";

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
    // suppressHydrationWarning: the head script below stamps `data-js` on this
    // element before React hydrates, so the live <html> always carries one
    // attribute the server never rendered. That is the point of the script —
    // it has to run first — and it is the only difference here, so the warning
    // is noise rather than a real mismatch. Scoped to this element only; every
    // child is still checked normally.
    <html
      lang="en"
      suppressHydrationWarning
      className={`${caslon.variable} ${archivo.variable} ${dmMono.variable}`}
    >
      <head>
        {/* Listing and team photographs still come from other origins, so the
            first request to each pays a DNS + TLS round trip. Opening the
            connections up front takes that off the critical path — worth a few
            hundred ms on a mobile link. Remove once the imagery is local. */}
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://images.squarespace-cdn.com" />
        {/* The hero still is the first paint that matters; start it with the
            document rather than after the parser reaches the component. */}
        <link rel="preload" as="image" href="/hero-poster.webp" fetchPriority="high" />
        {/* The switch the scroll reveals hang from.

            `js` goes on immediately, during parse, so animated content is
            hidden before it ever paints and the entrance plays in full — for
            everything, including what is already on screen at load.

            The timer is the important half. If the bundle is disabled, blocked,
            or throws before React mounts, nothing would ever reveal that
            content and the page would render as blank space. So React marks the
            document hydrated on mount, and if that mark hasn't appeared in four
            seconds the class comes back off and every reveal drops to plain,
            visible markup. Animation when the page is alive; legible text when
            it isn't. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "document.documentElement.setAttribute('data-js','');" +
              "setTimeout(function(){" +
              "if(!document.documentElement.hasAttribute('data-hydrated'))" +
              "document.documentElement.removeAttribute('data-js');" +
              "},4000);",
          }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <HydrationMark />
        <Header />
        <main>{children}</main>
        <Footer />
        <MessageWidget />
      </body>
    </html>
  );
}
