import Image from "next/image";
import Link from "next/link";
import { nav, officeAddress, site, stations } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-limestone/15 bg-ink text-limestone">
      <div className="container-edge grid gap-12 py-16 md:grid-cols-[1.5fr_1fr_1.2fr]">
        <div>
          <Image
            src="/logo.webp"
            alt="Ritchey Realty"
            width={440}
            height={404}
            className="h-auto w-32"
          />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-limestone/65">
            Boutique real estate guidance for buyers and sellers across Fort
            Worth and the north side of the metroplex.
          </p>
          <p className="label-on-ink mt-6">{site.agent}</p>

          {/* The office, in a real <address>. These are the site's genuine
              published details — the only contact block on the page that is
              not demo content. */}
          <address className="mt-6 space-y-2 text-sm not-italic leading-relaxed text-limestone/65">
            <a
              href={`https://maps.google.com/?q=${encodeURIComponent(
                `${site.name}, ${officeAddress}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block transition-colors hover:text-limestone-pale"
            >
              {site.address.street}
              <br />
              {site.address.locality}, {site.address.region}{" "}
              {site.address.postalCode}
            </a>
            <a
              href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
              className="block transition-colors hover:text-limestone-pale"
            >
              {site.phone}
            </a>
            <a
              href={`mailto:${site.email}`}
              className="block break-words transition-colors hover:text-limestone-pale"
            >
              {site.email}
            </a>
          </address>
        </div>

        <div>
          <p className="caption-on-ink">
            Explore
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-limestone/75 transition-colors hover:text-limestone-pale"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="caption-on-ink">
            The range
          </p>
          {/* The eight towns again, in the same west-to-east order as the line
              at the top of the page. */}
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {stations.map((c) => (
              <li key={c.name}>
                <Link
                  href={`/search?area=${encodeURIComponent(c.name)}`}
                  className="text-limestone/75 transition-colors hover:text-limestone-pale"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-limestone/15">
        <div className="container-edge flex flex-col gap-2 py-6 font-mono text-[11px] text-limestone/65 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ritchey Realty</p>
          <p>Demo design concept · Sample content, not live listings</p>
        </div>
      </div>
    </footer>
  );
}
