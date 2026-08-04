import Image from "next/image";
import Link from "next/link";
import {
  communityHref,
  disclosures,
  nav,
  officeAddress,
  site,
  social,
  stations,
} from "@/lib/site";

/**
 * The marks, drawn rather than fetched — four inline paths cost nothing next to
 * an icon font or a sprite request, and this footer is on every page. Keyed by
 * the label in lib/site.ts so adding a profile there without a mark here fails
 * visibly rather than rendering an empty square.
 */
const MARKS: Record<string, string> = {
  Facebook:
    "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  Instagram:
    "M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm7.846-10.405a1.441 1.441 0 01-2.88 0 1.44 1.44 0 012.88 0z",
  YouTube:
    "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  TikTok:
    "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
};

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

        {/* Columns 2 and 3 are flex so their second block can be pushed to the
            foot of the row. Grid items already stretch to the tallest column —
            the contact block — so `mt-auto` below lands the notices and the
            marks on one baseline with the email address instead of leaving the
            right of the footer trailing off into empty ink. */}
        <div className="flex flex-col">
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

          {/* The two TREC notices, under the nav because they are the same kind
              of thing — places to go, listed. Both open in a new tab: one is a
              PDF on Drive, the other a scan on the brokerage's own domain, and
              neither is a page of this site. */}
          <p className="caption-on-ink mt-auto pt-10">Required notices</p>
          <ul className="mt-5 space-y-3 text-sm">
            {disclosures.map((d) => (
              <li key={d.label}>
                <a
                  href={d.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-limestone/75 transition-colors hover:text-limestone-pale"
                >
                  {d.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col">
          <p className="caption-on-ink">
            The range
          </p>
          {/* The eight towns again, in the same west-to-east order as the line
              at the top of the page. Each goes to its own page where one is
              written and to the communities index where it isn't — see
              communityHref in lib/site.ts, the same routing the map pop-out and
              the index list already use. These used to point at /search?area=,
              a filter the search placeholder never read. */}
          <ul className="mt-5 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
            {stations.map((c) => (
              <li key={c.name}>
                <Link
                  href={communityHref(c.name)}
                  className="text-limestone/75 transition-colors hover:text-limestone-pale"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>

          {/* Square and ruled like the site's other buttons — never a circle. */}
          <p className="caption-on-ink mt-auto pt-10">Follow</p>
          <ul className="mt-5 flex flex-wrap gap-3">
            {social.map((s) => (
              <li key={s.label}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${site.agent} on ${s.label}`}
                  className="flex h-10 w-10 items-center justify-center rounded-[3px] border border-limestone/20 text-limestone/65 transition-colors hover:border-limestone/50 hover:text-limestone-pale focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brass-pale"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-[18px] w-[18px]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d={MARKS[s.label]} />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-limestone/15">
        <div className="container-edge flex flex-col gap-2 py-6 font-mono text-[11px] text-limestone/65 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright and build credit read as one line on a wide screen and
              stack on a narrow one — the interpunct is the separator everywhere
              else on this site, and it is decorative, so it is hidden from a
              screen reader rather than read out between two sentences. */}
          <p className="flex flex-col gap-1 sm:flex-row sm:items-center">
            <span>© {new Date().getFullYear()} Ritchey Realty</span>
            <span aria-hidden="true" className="hidden sm:inline sm:mx-2.5">
              ·
            </span>
            <span>Developed by Altered Reality Experience Pvt Ltd</span>
          </p>
          <p>Demo design concept · Sample content, not live listings</p>
        </div>
      </div>
    </footer>
  );
}
