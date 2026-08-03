import type { Metadata } from "next";
import Link from "next/link";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { MessageTrigger } from "@/components/MessageTrigger";
import { NeighborhoodIndex } from "@/components/NeighborhoodIndex";
import { PhotoPlate } from "@/components/PhotoPlate";
import { Reveal } from "@/components/Reveal";
import { StatLine } from "@/components/StatLine";
import {
  areas,
  districts,
  driveTimes,
  exemptions,
  fortWorth,
  fortWorthFaqs,
  lifeHere,
  longestDrive,
  marketStats,
  taxingEntities,
  whyFortWorth,
} from "@/lib/fortWorth";
import { formatCoords, site } from "@/lib/site";

const PAGE_URL = "https://ritchey-realty-demo.vercel.app/communities/fort-worth";
const ORG_ID = "https://ritchey-realty-demo.vercel.app/#organization";

export const metadata: Metadata = {
  // Absolute, so the layout's "%s — Ritchey Realty" template doesn't append the
  // brand a second time to a title that already carries it.
  title: {
    absolute:
      "Fort Worth Homes for Sale | Neighborhoods, Market Data & Buyer Guide | Ritchey Realty",
  },
  description:
    "Fort Worth real estate with current market data, a neighborhood-by-neighborhood guide, school district information and Texas property tax basics — from Ritchey Realty, based on Hillwood Parkway in Fort Worth.",
  openGraph: {
    title: "Fort Worth Homes for Sale — Ritchey Realty",
    description:
      "Market data, twelve neighborhoods, the school districts, and what Texas property tax actually costs. A buyer's guide to Fort Worth.",
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
 * The graph for a place page.
 *
 * `Place` with real coordinates is the node that matters here: it is what lets
 * an answer engine tie this page to the city rather than to the phrase. The
 * agency is referenced by the same @id /about defines, so the two pages describe
 * one organisation instead of two.
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
            Fort Worth is the fastest-growing major city in Texas, with a
            world-class museum district, a working stockyards, and housing that
            runs from 1920s Craftsman bungalows to new builds on the Alliance
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
            <MessageTrigger className="btn border border-limestone/30 text-limestone hover:bg-limestone-pale hover:text-ink">
              Talk to Kallie about your move
            </MessageTrigger>
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
              Where the numbers actually sit
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              Four readings, and then what they mean for the side of the table
              you happen to be on.
            </p>
          </Reveal>
        </div>

        <StatLine items={marketStats} />

        <div className="container-edge py-16 md:py-20">
          <div className="grid gap-10 md:grid-cols-2 md:gap-16">
            <Reveal>
              <p className="leading-relaxed text-ink-soft">
                Fort Worth has settled into something fairly rare — a market
                where neither side holds all the leverage. Inventory sits around
                three and a half months, which is enough selection for buyers to
                be choosy without so much supply that sellers lose their footing.
                Homes take longer to move than they did two years ago, and most
                close a little under asking.
              </p>
              <p className="mt-6 leading-relaxed text-ink-soft">
                What that means in practice: buyers can negotiate again.
                Inspection requests get honoured. Closing cost concessions are
                back on the table. Sellers who price correctly out of the gate
                still move quickly, but the days of naming a number and waiting
                for six offers are over.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <p className="leading-relaxed text-ink-soft">
                The city-wide median hides an enormous spread. Fort Worth covers{" "}
                {fortWorth.zips} ZIP codes and the gap between the cheapest and
                the dearest is roughly fourfold: 76109 near TCU runs well into
                the high six figures, while parts of the east side sit under
                $180,000.
              </p>
              <p className="mt-6 leading-relaxed text-ink-soft">
                Which is why &ldquo;the Fort Worth market&rdquo; is not a useful
                thing to plan around. The neighbourhood market is, and that is
                what the index below is for.
              </p>

              {/* The callout: a rule, a line, and a link. No tinted box — this
                  site draws with rules. */}
              <div className="mt-10 border-t border-ink/15 pt-6">
                <p className="display-sm text-xl leading-snug text-ink">
                  Want the numbers for one specific neighbourhood?
                </p>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  That is a five-minute conversation, not a report.{" "}
                  <Link
                    href="/contact"
                    className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
                  >
                    Ask Kallie
                  </Link>
                  .
                </p>
              </div>
            </Reveal>
          </div>

          {/* Where the figures came from and when they were read. Stated on the
              page rather than kept in a comment, because a number on a property
              site is a claim someone will act on. */}
          <Reveal className="mt-14" delay={140}>
            <div className="datum" />
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

      {/* ---------- Why Fort Worth ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="label">Why here</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              What keeps pulling people in
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              Four reasons, each with something behind it — a named employer, a
              tax code, a rent-to-price relationship, a building you can walk
              into.
            </p>
          </Reveal>

          <Reveal className="mt-12" delay={80} variant="plate">
            <PhotoPlate
              src="/fort-worth-sundance"
              alt="Sundance Square Plaza in downtown Fort Worth at night, with the fountains running and the Chisholm Trail mural lit on the left"
              caption="Sundance Square Plaza, downtown — thirty-odd restored blocks and the closest thing Texas has to a walkable centre."
              ratio="aspect-[16/9] md:aspect-[21/9]"
            />
          </Reveal>

          {/* Numbered off a datum, the way the service deck on /about and the
              listing sheet both hang their content from a rule. Four across at
              lg, two at md — the deck's three-column deal animation is not
              reused here because it only describes three columns. */}
          <ol className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-4">
            {whyFortWorth.map((w, i) => (
              <Reveal as="li" key={w.n} delay={i * 90} className="group">
                <div className="h-px w-full bg-ink/15 transition-colors duration-300 group-hover:bg-brass-deep" />
                <p className="display mt-5 text-3xl leading-none text-ink/25 transition-colors duration-300 group-hover:text-brass-deep">
                  {w.n}
                </p>
                <h3 className="display-sm mt-4 text-2xl text-ink">{w.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{w.body}</p>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------- The neighbourhood index ---------- */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] md:items-end md:gap-14">
          <Reveal className="max-w-2xl">
            <p className="label">The ground</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Fort Worth is not one market
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              It is thirty of them, at least. Below are the ones people ask
              about most, grouped the way buyers actually narrow — pick a side
              of the city first, a street second.
            </p>
          </Reveal>

          <Reveal delay={80} variant="plate">
            <PhotoPlate
              src="/fort-worth-neighborhood"
              alt="A street of historic brick homes near downtown Fort Worth, with the downtown towers rising a few blocks behind"
              caption="Five minutes from downtown, and still a front porch. Fort Worth does this better than most cities its size."
              ratio="aspect-[4/3]"
            />
          </Reveal>
        </div>

        <Reveal className="mt-16" delay={120}>
          <NeighborhoodIndex areas={areas} />
        </Reveal>
      </section>

      {/* ---------- Schools ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          <div className="grid gap-12 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:gap-16 lg:gap-20">
            <Reveal>
              <p className="label">Schools</p>
              <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
                More than a dozen districts
              </h2>
              <p className="mt-6 leading-relaxed text-ink-soft">
                Fort Worth&apos;s city limits are served by over a dozen
                independent school districts, and the boundaries follow neither
                neighbourhood lines nor ZIP codes in any intuitive way. Two
                houses on the same street can feed different elementary schools.
              </p>
              <p className="mt-6 border-t border-ink/15 pt-6 leading-relaxed text-ink-soft">
                Always verify the assigned campus for a specific address before
                you write an offer. We pull the boundary confirmation for every
                property we show you — it takes minutes and it has changed
                people&apos;s minds.
              </p>
            </Reveal>

            <Reveal delay={80}>
              <ul className="border-b border-ink/15">
                {districts.map((d) => (
                  <li key={d.name} className="group border-t border-ink/15">
                    <div className="grid gap-x-8 gap-y-2 py-5 sm:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
                      <h3 className="display-sm text-lg text-ink transition-colors duration-300 group-hover:text-brass-deep">
                        {d.name}
                      </h3>
                      <p className="leading-relaxed text-ink-soft">
                        {d.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-muted">
                Districts are listed, not ranked. A ranking is an opinion;
                campus assignment is a fact we can check for your address.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------- Property taxes: the chapter out-of-state buyers need ----------

          On the ink, because it is the one section here that is genuinely a
          different subject rather than a different angle on the same one — and
          because it is the part a buyer relocating from California will come
          back to. The field change is what makes it findable on a second visit. */}
      <section className="bg-ink text-limestone">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="label-on-ink">Property taxes</p>
            <h2 className="display mt-4 text-4xl text-limestone-pale sm:text-5xl">
              The surprise, explained before it happens
            </h2>
            <p className="mt-6 leading-relaxed text-limestone/75">
              Texas has no state income tax. It funds schools, counties and city
              services almost entirely through property tax instead — a higher
              rate than most of the country, attached to a total tax picture
              that still often comes out ahead once income tax is in the
              calculation. This is the single biggest surprise for buyers moving
              from out of state, and it is worth understanding before you set a
              budget.
            </p>
          </Reveal>

          <div className="mt-16 grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              {/* The rate, set as a figure. It is the number the section
                  exists to explain, so it is the largest thing in it. */}
              <p className="caption-on-ink">Combined rate, before exemptions</p>
              <p className="display mt-4 text-[4rem] leading-none text-brass-pale sm:text-[5rem]">
                ~2.2%
              </p>
              <p className="mt-6 leading-relaxed text-limestone/75">
                Of taxable value — and it is not one levy but five, stacked on
                top of each other. The exact figure depends on which districts
                cover the address.
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

            <Reveal delay={80}>
              <p className="caption-on-ink">What brings it down</p>
              <ul className="mt-6">
                {exemptions.map((x) => (
                  <li key={x.mark} className="border-t border-limestone/15 py-5">
                    <p className="display text-2xl text-limestone-pale">
                      {x.mark}
                    </p>
                    <p className="mt-2 leading-relaxed text-limestone/75">
                      {x.detail}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          {/* The two things a new Texas homeowner actually has to do. Set as
              instructions rather than as more explanation, because that is what
              they are. */}
          <Reveal className="mt-16 md:mt-20" delay={120}>
            <div className="datum-on-ink" />
            <div className="mt-10 grid gap-10 md:grid-cols-2 md:gap-16">
              <div>
                <p className="label-on-ink">Do this first</p>
                <h3 className="display-sm mt-4 text-2xl text-limestone-pale">
                  File your homestead exemption
                </h3>
                <p className="mt-4 leading-relaxed text-limestone/75">
                  It is free, it is filed with the Tarrant Appraisal District,
                  and the deadline is 30 April. Buyers who skip it pay materially
                  more than they need to — every year, until they file.
                </p>
              </div>
              <div>
                <p className="label-on-ink">Then know this</p>
                <h3 className="display-sm mt-4 text-2xl text-limestone-pale">
                  You can protest the valuation
                </h3>
                <p className="mt-4 leading-relaxed text-limestone/75">
                  The appraisal district values roughly 900,000 properties with
                  statistical models rather than individual inspections.
                  Foundation issues, hail damage and hyperlocal conditions get
                  missed routinely. Protesting costs nothing to start, and most
                  Texas protests result in some reduction.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal className="mt-14" delay={160}>
            <p className="max-w-3xl font-mono text-[11px] leading-relaxed text-limestone/60">
              Rates are adopted each autumn and exemption amounts change with
              legislation, so treat every figure here as the shape of the bill
              rather than the bill. We will walk you through the current numbers
              for the specific property you are considering.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Getting around ---------- */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] md:gap-16 lg:gap-20">
          <Reveal>
            <p className="label">Getting around</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              A driving city, with two exceptions
            </h2>
            <p className="mt-6 leading-relaxed text-ink-soft">
              <span className="text-ink">TEXRail</span> runs from downtown Fort
              Worth to DFW Airport Terminal B, stopping in North Richland Hills,
              Smithfield and Grapevine. The{" "}
              <span className="text-ink">Trinity Railway Express</span> connects
              downtown Fort Worth to downtown Dallas, via Richland Hills, Hurst
              and CentrePort. If you work downtown and live in north-east
              Tarrant County, a car-free commute is genuinely viable.
            </p>
            <p className="mt-6 leading-relaxed text-ink-soft">
              The <span className="text-ink">Trinity Trails</span> run over 100
              connected miles along the river. From Fairmount, West 7th and the
              Near Southside, cycling downtown is a real option rather than a
              theoretical one.
            </p>
          </Reveal>

          <Reveal delay={80}>
            <p className="label">Approximate drive to downtown</p>
            {/* The bar is the figure, drawn to scale off `longestDrive` — the
                same move the range line makes with longitude. It carries no
                information the number beside it doesn't, so it is hidden from
                assistive technology rather than described twice. */}
            <ol className="mt-6 border-b border-ink/15">
              {driveTimes.map((d) => (
                <li key={d.from} className="group border-t border-ink/15">
                  <div className="flex items-center gap-4 py-3.5 sm:gap-6">
                    <span className="w-[9.5rem] flex-none text-ink transition-colors duration-300 group-hover:text-brass-deep sm:w-[12rem]">
                      {d.from}
                    </span>
                    <span
                      aria-hidden="true"
                      className="hidden h-px flex-1 bg-ink/15 sm:block"
                    >
                      <span
                        className="block h-px bg-brass-deep transition-[background-color] duration-300"
                        style={{
                          width: `${(d.minutes / longestDrive) * 100}%`,
                        }}
                      />
                    </span>
                    <span className="ml-auto w-16 flex-none text-right font-mono text-[11px] text-ink-muted sm:ml-0">
                      {d.minutes} min
                    </span>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-5 font-mono text-[11px] leading-relaxed text-ink-muted">
              Off-peak, and approximate. Dallas is 45 minutes to an hour
              depending on traffic and where you start.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Life here ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="label">Life here</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              What you actually do on a Saturday
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              The part no market report covers, and the part people move for.
            </p>
          </Reveal>

          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {lifeHere.map((l, i) => (
              <Reveal as="li" key={l.title} delay={(i % 3) * 90}>
                <div className="datum" />
                <p className="label mt-5">{l.kicker}</p>
                <h3 className="display-sm mt-3 text-2xl text-ink">{l.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{l.body}</p>
              </Reveal>
            ))}
          </ol>

          {/* The section closes on the photograph rather than opening on it —
              the neighbourhood block above already opens on a plate, and two
              sections that begin the same way read as one long section. */}
          <Reveal className="mt-16" delay={80} variant="plate">
            <PhotoPlate
              src="/fort-worth-stockyards"
              alt="Stockyards Station at dusk: the lit sign spanning Exchange Avenue, brick storefronts either side, and a horse standing at the kerb"
              caption="Stockyards Station on Exchange Avenue. The cattle drive comes through twice a day, and it is not staged for the photograph."
              ratio="aspect-[16/9] md:aspect-[21/9]"
            />
          </Reveal>
        </div>
      </section>

      {/* ---------- Questions ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="label">Buyer questions</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            The eight people ask first
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
                The listings are the easy part. What is harder is knowing which
                street floods, which school boundary is about to be redrawn, and
                which seller will take a concession. That is the part we bring.
              </p>
              <p className="mt-8 caption-on-ink">
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
                <MessageTrigger className="btn border border-limestone/25 text-limestone hover:bg-limestone-pale hover:text-ink">
                  Schedule a call
                </MessageTrigger>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
