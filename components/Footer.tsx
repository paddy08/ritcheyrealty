import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal/10 bg-charcoal text-cream">
      <div className="container-edge grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        {/* Brand */}
        <div>
          <Image
            src="/logo.webp"
            alt="Ritchey Realty"
            width={440}
            height={404}
            className="h-auto w-36"
          />
          <p className="mt-5 max-w-sm text-sm leading-relaxed text-cream/70">
            Boutique real estate guidance for buyers and sellers across Fort
            Worth and the greater DFW metroplex.
          </p>
          <p className="mt-6 text-xs uppercase tracking-widest text-sage">
            {site.agent}
          </p>
        </div>

        {/* Explore */}
        <div>
          <p className="text-xs uppercase tracking-widest text-cream/50">
            Explore
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cream/80 transition-colors hover:text-cream"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-xs uppercase tracking-widest text-cream/50">
            Get in touch
          </p>
          <ul className="mt-4 space-y-3 text-sm text-cream/80">
            <li>
              <a
                href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                className="transition-colors hover:text-cream"
              >
                {site.phone}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-cream"
              >
                {site.email}
              </a>
            </li>
            <li className="pt-2 text-cream/60">
              Serving {site.serviceArea}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-edge flex flex-col gap-2 py-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Ritchey Realty. All rights reserved.
          </p>
          <p className="text-cream/40">
            Demo design concept · Sample content, not live listings
          </p>
        </div>
      </div>
    </footer>
  );
}
