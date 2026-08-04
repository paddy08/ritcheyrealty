import type { Metadata } from "next";
import Link from "next/link";
import { CountUpFigure } from "@/components/CountUpFigure";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { ListingCard } from "@/components/ListingCard";
import { NeighborhoodIndex } from "@/components/NeighborhoodIndex";
import { PhotoPlate } from "@/components/PhotoPlate";
import { Reveal } from "@/components/Reveal";
import { StatLine } from "@/components/StatLine";
import {
  fortWorth,
  fortWorthFaqs,
  marketStats,
  neighborhoods,
  taxingEntities,
} from "@/lib/fortWorth";
import { featuredListings, formatCoords, site } from "@/lib/site";

const PAGE_URL = "https://ritchey-realty-demo.vercel.app/communities/fort-worth";
const ORG_ID = "https://ritchey-realty-demo.vercel.app/#organization";

/** The sample inventory that is actually in this city. */
const fortWorthListings = featuredListings.filter((l) =>
  l.city.startsWith(fortWorth.name)
);

export const metadata: Metadata = {
  // Absolute, so the layout's "%s — Ritchey Realty" template doesn't append the
  // brand a second time to a title that already carries it.
  title: {
    absolute:
      "Fort Worth Homes for Sale | Neighborhoods & Market Data | Ritchey Realty",
  },
  description:
    "Fort Worth real estate with current market data, a neighborhood guide, and Texas property tax basics. Local expertise from Ritchey Realty.",
  openGraph: {
    title: "Fort Worth Homes for Sale — Ritchey Realty",
    description:
      "Market data, six neighborhoods with prices and drive times, and what Texas property tax actually costs. A buyer's guide to Fort Worth.",
    type: "website",
    images: [
      {
        url: "/fort-worth-og.jpg",
        width: 1200,
        height: 630,
        alt: "The Fort Worth skyline at dusk from across the Trinity River",
      },
    ],
  },
  // Place metadata Next has no first-class field for. It is what tells a share
  // card and a local-search crawler which Fort Worth this is — there are others.
  other: {
    "og:locality": fortWorth.name,
    "og:region": fortWorth.region,
    "og:latitude": String(fortWorth.lat),
    "og:longitude": String(fortWorth.lon),
  },
  alternates: { canonical: "/communities/fort-worth" },
  // Indexing is governed by the root layout, which keeps this demo out of search
  // results entirely. The structured data below ships anyway, so launching is a
  // one-flag change with nothing to retrofit.
};

/**
 * The graph.
 *
 * `Place` carries the coordinates, and it is what lets an answer engine tie
 * this page to the city rather than to the phrase. The agency is referenced by
 * the same @id /about defines, so the two pages describe one organisation
 * instead of two.
 */
const placeLd = {
  "@context": "https://schema.org",
  "@type": "Place",
  "@id": `${PAGE_URL}#place`,
  name: `${fortWorth.name}, ${fortWorth.state}`,
  address: {
    "@type": "PostalAddress",
    addressLocality: fortWorth.name,
    addressRegion: fortWorth.region,
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: fortWorth.lat,
    longitude: fortWorth.lon,
  },
  containedInPlace: {
    "@type": "AdministrativeArea",
    name: fortWorth.county,
  },
};

const agentLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": ORG_ID,
  name: site.name,
  url: "https://ritchey-realty-demo.vercel.app",
  telephone: site.phone,
  email: site.email,
  areaServed: { "@id": `${PAGE_URL}#place` },
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Generated from the array the section renders, so the markup can never
  // describe a page that isn't there.
  mainEntity: fortWorthFaqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

const breadcrumbLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: "https://ritchey-realty-demo.vercel.app",
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "Communities",
      item: "https://ritchey-realty-demo.vercel.app/communities",
    },
    { "@type": "ListItem", position: 3, name: fortWorth.name, item: PAGE_URL },
  ],
};

export default function FortWorthPage() {
  return (
    <>
      <JsonLd data={placeLd} />
      <JsonLd data={agentLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* ---------- Hero: the city at dusk, type on the ink ----------

          The one dark hero on the site outside the homepage, and it takes the
          homepage's grammar rather than the About page's: full-bleed footage,
          an ink scrim, and light type sitting on it. That is a decision about
          the artwork, not a preference — this is a night skyline, and laying it
          on limestone as a plate would have made the page open on a small dark
          rectangle instead of on the city.

          It also means the header bar has to be transparent here, the way it is
          over the home hero, or a solid limestone bar would butt against the
          top of the photograph. See DARK_HERO_ROUTES in components/Header.tsx. */}
      <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden pb-16 pt-28 md:pb-20 md:pt-32">
        {/* A plain <picture>, not next/image: local files in /public are handed
            straight back by the custom loader (lib/imageLoader.ts), so
            next/image would ship one desktop-sized file to every phone. The
            media switch is the only way to get real responsive behaviour out of
            a static export, and this is a full-bleed background on a project
            that has fought its page weight down from 2.8MB. */}
        <div className="absolute inset-0 -z-20">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/fort-worth-hero-mobile.webp"
              type="image/webp"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/fort-worth-hero.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              // object-bottom: the skyline and its reflection sit in the middle
              // and lower half of the frame, so every pixel a tall viewport has
              // to give up should come off the sky.
              className="h-full w-full object-cover object-bottom"
            />
          </picture>
        </div>

        {/* Two scrims doing two jobs. The vertical one holds the top of the
            frame under the header; the horizontal one holds the left half flat
            enough for type, and runs out before it reaches the skyline itself. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-ink/85 via-ink/45 to-ink/80"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-r from-ink/85 via-ink/50 via-45% to-transparent to-80%"
        />

        <div className="container-edge">
          <p className="animate-rise label-on-ink">
            {site.name}
            <span aria-hidden="true" className="mx-3 text-limestone/40">
              /
            </span>
            Communities
          </p>
          <div
            className="datum-on-ink animate-draw mt-4"
            style={{ animationDelay: "160ms" }}
          />

          <h1 className="display mt-9 max-w-3xl text-[2.75rem] text-limestone-pale sm:text-6xl lg:text-[4.5rem]">
            {/* rise-solid, not rise: this headline is the page's largest
                contentful paint, and a fade from opacity 0 disqualifies it
                permanently. See app/globals.css. */}
            <span
              className="animate-rise-solid block text-brass-pale"
              style={{ animationDelay: "300ms" }}
            >
              Fort Worth
            </span>
            <span
              className="animate-rise-solid block"
              style={{ animationDelay: "410ms" }}
            >
              homes for sale.
            </span>
          </h1>

          <p
            className="animate-rise mt-7 max-w-xl text-lg leading-relaxed text-limestone/80"
            style={{ animationDelay: "600ms" }}
          >
            A city of a million people that still feels like it knows your name.
            Fort Worth crossed a million residents and never lost its footing —
            the fastest-growing major city in Texas, with neighbourhoods running
            from 1920s Craftsman bungalows to new builds on the Alliance
            corridor.
          </p>

          <div
            className="animate-rise mt-9 flex flex-wrap gap-4"
            style={{ animationDelay: "740ms" }}
          >
            <Link
              href={`/search?area=${encodeURIComponent(fortWorth.name)}`}
              className="btn-brass"
            >
              Browse Fort Worth listings
            </Link>
            <Link
              href="/contact"
              className="btn border border-limestone/30 text-limestone hover:bg-limestone-pale hover:text-ink"
            >
              Talk to Kallie
            </Link>
          </div>

          {/* The coordinate is earned on this page in a way it was not on
              /about: this section is about a place, and that is the place. */}
          <p
            className="animate-rise mt-10 font-mono text-[11px] leading-relaxed text-limestone/55"
            style={{ animationDelay: "880ms" }}
          >
            {formatCoords(fortWorth)}
            <span aria-hidden="true" className="mx-3 text-limestone/30">
              ·
            </span>
            {fortWorth.county}
            <span aria-hidden="true" className="mx-3 text-limestone/30">
              ·
            </span>
            {fortWorth.zips} ZIP codes
          </p>
        </div>
      </section>

      {/* ---------- The market ---------- */}
      <section>
        <div className="container-edge pb-12 pt-20 md:pt-28">
          <Reveal className="max-w-2xl">
            <p className="label">The market</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              The market right now
            </h2>
          </Reveal>
        </div>

        <StatLine items={marketStats} />

        <div className="container-edge py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <Reveal>
              <p className="leading-relaxed text-ink-soft">
                Fort Worth has settled into something rare — a market where
                neither side holds all the leverage. Buyers can negotiate again.
                Inspection requests get honoured, concessions are back on the
                table. Sellers who price correctly still move quickly.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="leading-relaxed text-ink-soft">
                {/* The explicit {" "} after the figure is load-bearing: JSX
                    trims the leading whitespace of a text node that runs onto
                    the next line, which silently printed "26ZIP codes". */}
                The city-wide median hides enormous variation. Across{" "}
                {fortWorth.zips}{" "}
                ZIP codes the gap between the most and least
                expensive runs roughly fourfold. Which is why &ldquo;the Fort
                Worth market&rdquo; isn&apos;t a useful thing to plan around —
                the neighbourhood market is.
              </p>
            </Reveal>
          </div>

          {/* Where the figures came from and when they were read. Stated on the
              page rather than kept in a comment, because a number on a property
              site is a claim someone will act on. */}
          <Reveal className="mt-12" delay={140}>
            {/* Ruled, then written on — the rule draws itself left to right as
                the block arrives, the way the hero's datum does on load. */}
            <div className="datum rule-draw" />
            <p className="mt-5 max-w-3xl font-mono text-[11px] leading-relaxed text-ink-muted">
              Figures compiled {fortWorth.updated} from {fortWorth.sources}.
              Public sources disagree here by a wide margin because they measure
              different things — a typical-value index, a median of closed
              sales, and a median of asking prices are three different
              questions; the medians above are closings. Demo figures: replace
              with NTREIS data before this page goes live.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Neighbourhoods ----------

          One column, and a shallower top than the sections either side of it.
          There was a photograph in a second column here, bottom-aligned against
          the heading; with the photograph gone the heading has no reason to sit
          low, and the standard section top would have left it floating in the
          middle of a band with nothing above it. The index is the section, so
          it starts close to the top of it. */}
      <section className="bg-limestone-deep">
        {/* pt-16 and not less: the header bar is ~66px of opaque limestone, so
            a shallower top would tuck the label under it for anyone who lands
            on this section from a jump link. */}
        <div className="container-edge pb-20 pt-16 md:pb-28 md:pt-20">
          <Reveal className="max-w-2xl">
            <p className="label">The ground</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Find your Fort Worth
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              Fort Worth isn&apos;t one market — it&apos;s thirty. Here is how
              buyers usually narrow it down: a side of the city first, a street
              second.
            </p>
          </Reveal>

          <Reveal className="mt-10 md:mt-12" delay={80}>
            <NeighborhoodIndex items={neighborhoods} />
          </Reveal>

          {/* The schools note. It is the one thing the neighbourhood readout
              cannot say honestly on a row of its own — a district is not a
              campus — so it is said once, plainly, under the whole index. */}
          <Reveal className="mt-12" delay={120}>
            <div className="max-w-2xl border-t border-ink/15 pt-6">
              <p className="display-sm text-xl leading-snug text-ink">
                School boundaries don&apos;t follow ZIP codes.
              </p>
              <p className="mt-3 leading-relaxed text-ink-soft">
                Two houses on the same street can feed different campuses. We
                verify the assigned school for every property we show you — it
                takes minutes, and it has changed people&apos;s minds.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- On the market here ----------

          The IDX mount point. Until there is a feed, this shows the sample
          inventory that is actually in this city rather than filling the band
          with houses in other towns — a Fort Worth page listing a Southlake
          property is worse than a Fort Worth page listing one thing. Swapping
          in a real feed replaces the grid below and nothing else. */}
      {fortWorthListings.length > 0 && (
        <section className="container-edge py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:items-center md:gap-16">
            <Reveal>
              <p className="label">On the market</p>
              <h2 className="display mt-4 max-w-md text-4xl text-ink sm:text-5xl">
                What&apos;s for sale in Fort Worth
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-ink-soft">
                The full picture updates through the day, and what is worth
                seeing rarely lasts a week.{" "}
                <Link
                  href={`/search?area=${encodeURIComponent(fortWorth.name)}`}
                  className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
                >
                  Browse everything in the city
                </Link>
                , or tell us what you are after and we will send the ones that
                fit.
              </p>
              <p className="mt-8 font-mono text-[11px] leading-relaxed text-ink-muted">
                Sample listing shown for demonstration — fictional property and
                pricing.
              </p>
            </Reveal>

            <Reveal delay={80} variant="plate">
              <div className="grid gap-6">
                {fortWorthListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ---------- Property taxes ----------

          On the ink, because it is the one section here that is genuinely a
          different subject rather than a different angle on the same one — and
          because it is the part a buyer relocating from California will come
          back to. The field change is what makes it findable on a second visit. */}
      <section className="bg-ink text-limestone">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="label-on-ink">Property taxes</p>
            <h2 className="display mt-4 text-4xl text-limestone-pale sm:text-5xl">
              What out-of-state buyers need to know
            </h2>
            <p className="mt-6 leading-relaxed text-limestone/75">
              Texas has no state income tax. It funds schools and services
              through property tax instead — a higher rate than most of the
              country, and a total picture that often still comes out ahead.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              {/* The rate, set as a figure and counted up to like the market
                  band above. It is the number the section exists to explain,
                  so it is the largest thing in it. */}
              <p className="caption-on-ink">Combined rate, before exemptions</p>
              <p className="display mt-4 text-[4rem] leading-none text-brass-pale sm:text-[5rem]">
                <CountUpFigure value="~2.2%" />
              </p>
              <p className="mt-6 leading-relaxed text-limestone/75">
                Of taxable value — and it is not one levy but five, stacked on
                top of each other.
              </p>
              <ol className="mt-8 border-b border-limestone/15">
                {taxingEntities.map((e, i) => (
                  <li
                    key={e}
                    className="flex items-baseline gap-4 border-t border-limestone/15 py-3"
                  >
                    <span
                      aria-hidden="true"
                      className="font-mono text-[10px] text-brass"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="text-limestone/85">{e}</span>
                  </li>
                ))}
              </ol>
            </Reveal>

            {/* The two things a new Texas homeowner actually has to do. Set as
                instructions rather than as more explanation, because that is
                what they are. */}
            <Reveal delay={80}>
              <p className="caption-on-ink">
                Two things every new Texas homeowner should do
              </p>

              <div className="mt-8 border-t border-limestone/15 pt-6">
                <h3 className="display-sm text-2xl text-limestone-pale">
                  File your homestead exemption
                </h3>
                <p className="mt-4 leading-relaxed text-limestone/75">
                  It removes $140,000 from your school district taxable value on
                  a primary residence. It is free, it is filed with the Tarrant
                  Appraisal District, and the deadline is 30 April. Buyers who
                  skip it overpay every year until they file.
                </p>
              </div>

              <div className="mt-8 border-t border-limestone/15 pt-6">
                <h3 className="display-sm text-2xl text-limestone-pale">
                  Know your right to protest
                </h3>
                <p className="mt-4 leading-relaxed text-limestone/75">
                  The appraisal district values around 900,000 properties by
                  statistical model, not by inspection. Foundation issues and
                  hail damage get missed routinely. Protesting costs nothing and
                  most Texas protests produce some reduction.
                </p>
              </div>

              <p className="mt-8 border-t border-limestone/15 pt-6 leading-relaxed text-limestone/75">
                Once homesteaded, your taxable value can&apos;t rise more than
                10% a year regardless of what the market does.
              </p>
            </Reveal>
          </div>

          <Reveal className="mt-14" delay={120}>
            <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-limestone/60">
              Rates are adopted each autumn and exemption amounts change with
              legislation, so treat every figure here as the shape of the bill
              rather than the bill. We will walk you through the current numbers
              for the specific property you are considering.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Questions ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="label">Buyer questions</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            The five people ask first
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
            Every answer here is one of the figures already on this page, said
            plainly. What is not here — whether a particular house is worth it,
            what a seller will take — is worth a conversation rather than a
            paragraph.
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={80}>
          <Faq items={fortWorthFaqs} />
        </Reveal>
      </section>

      {/* ---------- The city, twice ----------

          Two plates and one line, immediately before the sign-off. The sections
          these photographs were shot for came out of the page in the trim, and
          this is the smallest honest place to keep them: the closing argument
          for a city is partly what it looks like on a Friday night. */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-16 md:py-20">
          <Reveal className="max-w-2xl">
            <p className="label">Life here</p>
            <h2 className="display mt-4 text-3xl text-ink sm:text-4xl">
              Thirty blocks of restored downtown, and a working stockyards
            </h2>
          </Reveal>

          <div className="mt-10 grid gap-8 md:grid-cols-2 md:gap-10">
            <Reveal variant="plate">
              <PhotoPlate
                src="/fort-worth-sundance"
                alt="Sundance Square Plaza in downtown Fort Worth at night, with the fountains running and the Chisholm Trail mural lit on the left"
                caption="Sundance Square Plaza — restaurants, Bass Performance Hall, and a centre that stays busy after dark."
                ratio="aspect-[16/10]"
              />
            </Reveal>
            <Reveal delay={90} variant="plate">
              <PhotoPlate
                src="/fort-worth-stockyards"
                alt="Stockyards Station at dusk: the lit sign spanning Exchange Avenue, brick storefronts either side, and a horse standing at the kerb"
                caption="Stockyards Station on Exchange Avenue. The cattle drive comes through twice a day, and it is not staged."
                ratio="aspect-[16/10]"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Closing: runs straight into the footer ---------- */}
      <section className="bg-ink text-limestone">
        <div className="container-edge pb-16 pt-20 md:pb-20 md:pt-28">
          <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="label-on-ink">Get in touch</p>
              <h2 className="display mt-4 max-w-md text-4xl text-limestone-pale sm:text-5xl">
                Let&apos;s find your Fort Worth
              </h2>
              <p className="mt-6 max-w-md leading-relaxed text-limestone/75">
                The listings are the easy part. Knowing which street floods,
                which school boundary is about to be redrawn, which seller will
                take a concession — that&apos;s the part we bring.
              </p>
              <p className="caption-on-ink mt-8">
                The office is in Fort Worth — {site.address.street}
              </p>
            </div>

            <div className="md:pt-2">
              <dl className="space-y-8">
                <div>
                  <dt className="caption-on-ink">Call or text</dt>
                  <dd>
                    <a
                      href={`tel:${site.phone.replace(/[^0-9]/g, "")}`}
                      className="display mt-2 inline-block text-3xl text-limestone-pale transition-colors hover:text-brass-pale sm:text-4xl"
                    >
                      {site.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="caption-on-ink">Email</dt>
                  <dd>
                    <a
                      href={`mailto:${site.email}`}
                      className="mt-2 inline-block text-lg text-limestone/85 transition-colors hover:text-brass-pale"
                    >
                      {site.email}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link
                  href={`/search?area=${encodeURIComponent(fortWorth.name)}`}
                  className="btn-brass"
                >
                  See Fort Worth homes
                </Link>
                {/* A valuation is a conversation here, not a form that returns
                    an automated number — so this goes to /contact rather than
                    promising an instant estimate the demo cannot produce. */}
                <Link
                  href="/contact"
                  className="btn border border-limestone/25 text-limestone hover:bg-limestone-pale hover:text-ink"
                >
                  Get a free home valuation
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
