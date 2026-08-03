import type { Metadata } from "next";
import Link from "next/link";
import { CredentialLine } from "@/components/CredentialLine";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { MessageTrigger } from "@/components/MessageTrigger";
import { RangeLine } from "@/components/RangeLine";
import { Reveal } from "@/components/Reveal";
import { ServiceDeck } from "@/components/ServiceDeck";
import { ReviewScores } from "@/components/Testimonials";
import {
  agent,
  communities,
  faqs,
  officeAddress,
  press,
  reviewSources,
  services,
  site,
} from "@/lib/site";

export const metadata: Metadata = {
  title: "About Kallie Ritchey",
  description:
    "Kallie Ritchey — REALTOR®, Broker/Owner of Ritchey Realty, and national coach with the Tom Ferry organization. Licensed since 2010, broker since 2015, around fifty sales a year across Fort Worth, Keller, Southlake, Grapevine and the north metroplex.",
  openGraph: {
    title: "About Kallie Ritchey — Ritchey Realty",
    description:
      "Fifteen years across North Texas: licensed since 2010, broker since 2015, around fifty sales a year in traditional and luxury markets alike.",
    type: "profile",
  },
  alternates: { canonical: "/about" },
  // Indexing is governed by the root layout, which keeps this demo out of
  // search results entirely. The structured data below ships anyway, so
  // launching is a one-flag change with nothing to retrofit.
};

/**
 * The entity graph.
 *
 * This is what an answer engine reads to work out who Kallie is and where she
 * operates, so it states the things a person asking "who sells houses in
 * Southlake" would need matched: the eight towns as `areaServed`, the licences,
 * the degree, the coaching role.
 *
 * `aggregateRating` is deliberately absent. Google's structured-data policy
 * disallows review markup a business supplies about itself, and the ratings
 * would be ignored at best and treated as spam at worst. The 4.9 and 5.0 are
 * still on the page for a human to read — they just aren't claimed in the graph.
 */
const PAGE_URL = "https://ritchey-realty-demo.vercel.app/about";
const ORG_ID = "https://ritchey-realty-demo.vercel.app/#organization";
const PERSON_ID = "https://ritchey-realty-demo.vercel.app/#kallie";

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": ORG_ID,
  name: site.name,
  url: "https://ritchey-realty-demo.vercel.app",
  telephone: site.phone,
  email: site.email,
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.locality,
    addressRegion: site.address.region,
    postalCode: site.address.postalCode,
    addressCountry: "US",
  },
  areaServed: communities.map((c) => ({
    "@type": "City",
    name: c.name,
    address: {
      "@type": "PostalAddress",
      addressLocality: c.name,
      addressRegion: "TX",
      addressCountry: "US",
    },
  })),
  founder: { "@id": PERSON_ID },
  employee: { "@id": PERSON_ID },
};

const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": PERSON_ID,
  name: agent.name,
  jobTitle: agent.role,
  worksFor: { "@id": ORG_ID },
  image: agent.photo,
  telephone: site.phone,
  email: site.email,
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "University of Texas at Arlington",
  },
  hasCredential: [
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "license",
      name: "Texas Real Estate Broker",
      recognizedBy: {
        "@type": "Organization",
        name: "Texas Real Estate Commission",
      },
    },
    {
      "@type": "EducationalOccupationalCredential",
      credentialCategory: "certification",
      name: "Texas Real Estate Commission certified instructor",
    },
  ],
  knowsAbout: [
    "Residential real estate",
    "Luxury real estate",
    "Listing and marketing homes",
    "Buyer representation",
    "Real estate negotiation",
    ...communities.map((c) => `${c.name}, Texas real estate`),
  ],
};

const faqLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  // Generated from the same array the section renders, so the markup can never
  // describe a page that isn't there.
  mainEntity: faqs.map((f) => ({
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
    { "@type": "ListItem", position: 2, name: "About Kallie", item: PAGE_URL },
  ],
};

export default function AboutPage() {
  return (
    <>
      <JsonLd data={organizationLd} />
      <JsonLd data={personLd} />
      <JsonLd data={faqLd} />
      <JsonLd data={breadcrumbLd} />

      {/* ---------- Hero: a sheet, ruled and then written on ----------

          Limestone, not a dark field. The header bar is already forced solid
          limestone on every route but home, so keeping the paper unbroken means
          the page opens as one continuous sheet instead of a light bar butted
          against a dark band.

          The load sequence is the point. A survey sheet is ruled before
          anything is drawn on it, so that is the order here: the head datum
          draws itself left to right, the type rises off it on the homepage's
          own stagger, the portrait is laid down as a plate, its crop marks
          register at the corners, and the title block rules itself last. Same
          grammar as the homepage hero — station ticks after the headline —
          applied to a sheet instead of footage. */}
      <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden pb-12 pt-20 md:pb-14 md:pt-24">
        {/* The sheet itself, ruled faintly. Sits under the photograph rather
            than instead of it, so if the image is ever missing the hero still
            has a surface instead of going blank. */}
        <div
          aria-hidden="true"
          // Halved on a phone. The cell is a fixed 5.5rem, so on a ~400px
          // screen only four or five columns land and the rule spacing reads as
          // a table rather than as tooth in the paper.
          className="survey-grid pointer-events-none absolute inset-0 -z-30 opacity-40 md:opacity-100"
        />

        {/* The room.
            A plain <picture>, not next/image: local files in /public are handed
            straight back by the custom loader (see lib/imageLoader.ts), so
            next/image would ship one desktop-sized file to every phone. The
            media-switched sources are the only way to get a real responsive
            behaviour out of a static export here, and this is a full-bleed
            background on a project that has already fought its page weight down
            from 2.8MB. */}
        {/* Inset from the top by the header's height rather than filling the
            section. The bar is opaque limestone, so anything the artwork puts
            up there is simply hidden behind it — and what it was putting there
            was the top of her head. Starting the image below the bar is what
            actually fixes that; anchoring alone only moved which part got
            cropped. */}
        {/* Two different jobs at two different shapes.
            From md up the artwork is full-height and the type sits beside it in
            the empty left half — the composition it was made for. On a portrait
            phone there is no beside: the frame is landscape and the viewport is
            tall, so full-bleed put the headline directly across her face. There
            it becomes a bottom band instead, with its top edge masked into the
            paper, and the type has clean limestone above it. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 -z-20 h-[52%] overflow-hidden opacity-70 [mask-image:linear-gradient(to_bottom,transparent,#000_22%)] md:top-20 md:h-auto md:opacity-100 md:[mask-image:none]">
          <picture>
            <source
              media="(max-width: 768px)"
              srcSet="/about-hero-mobile.webp"
              type="image/webp"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about-hero.webp"
              alt=""
              fetchPriority="high"
              decoding="async"
              // object-top, never centre: she stands in the upper half of the
              // frame, so every pixel this has to give up should come off the
              // bottom, which is floor and cabinet. On a portrait phone the
              // crop is horizontal instead, and it is biased right because that
              // is the side she is on.
              className="h-full w-full object-cover object-[68%_top] md:object-top"
            />
          </picture>
        </div>

        {/* One scrim, weighted entirely to the left.
            It has exactly one job: hold the type side flat enough for ink to
            sit on. It used to also knock the whole frame back, which made sense
            when the artwork was scenery behind a portrait — now that she is in
            the artwork, washing the right-hand side was washing out the subject
            of the picture. So it runs to transparent well before it reaches
            her. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 hidden bg-gradient-to-r from-limestone/95 via-limestone/70 via-45% to-transparent to-72% md:block"
        />

        <div className="container-edge">
          {/* The head of the sheet.
              No coordinate readout here any more. It printed Keller's latitude
              and longitude, which is a real figure and completely inert — there
              is nothing a visitor does with it, and it was taking the eye to the
              opposite corner from the headline on the first screen of the
              page. */}
          <p className="animate-rise label">About</p>
          <div
            className="datum animate-draw mt-4"
            style={{ animationDelay: "160ms" }}
          />

          {/* One column, not two.
              There was a cut-out portrait in a second column here. It came out
              when she was composited into the backdrop itself: the page was
              then printing her twice, once at full height in the photograph and
              again as a small figure on top of it. The type holds the left half
              and the artwork carries the right, which is what the artwork was
              built to do — so the measure below is what keeps the two apart,
              not a grid track. */}
          <div className="mt-9 md:mt-10">
            <div className="max-w-xl">
            {/* Broken at the clause, as on the homepage — not at a character
                count. Set a step under the homepage's 5rem so the two heroes
                are the same voice at different volumes. */}
            {/* A step smaller on a phone than it was: the type block has to
                finish above the artwork band rather than run into it. */}
            <h1 className="display max-w-2xl text-[2.5rem] text-ink sm:text-[3.5rem] lg:text-[4.25rem]">
              <span
                className="animate-rise block"
                style={{ animationDelay: "300ms" }}
              >
                Fifteen years of
              </span>
              <span
                className="animate-rise block text-brass-deep"
                style={{ animationDelay: "410ms" }}
              >
                North Texas.
              </span>
            </h1>
            <p
              className="animate-rise mt-6 max-w-lg leading-relaxed text-ink-soft md:mt-7 md:text-lg"
              style={{ animationDelay: "600ms" }}
            >
              {/* Deliberately not `agent.statement`, which is the homepage's
                  line and opens "Licensed since 2010. Broker since 2015" — the
                  two figures the credential band sets one screen below this.
                  The band owns the dates; this says what she actually does. */}
              Broker and owner of Ritchey Realty, and a coach to other agents
              nationally. She works the whole north side of the metroplex —
              first houses and custom estates, run the same way.
            </p>
            <div
              className="animate-rise mt-9 flex flex-wrap gap-4"
              style={{ animationDelay: "740ms" }}
            >
              {/* The live site's own call to action, kept in its words. */}
              <Link href="/contact" className="btn-solid">
                Book a meeting with Kallie
              </Link>
              <Link href="/testimonials" className="btn-line">
                Read reviews
              </Link>
            </div>
            {/* The licence numbers used to sit under the portrait. They are
                still worth stating plainly on the page she is introduced on —
                they are checkable, which is the point — so they move here
                rather than leaving with the image. */}
            <p
              className="animate-rise mt-8 font-mono text-[11px] leading-relaxed text-ink-muted"
              style={{ animationDelay: "880ms" }}
            >
              Licensing: {agent.license}
            </p>
            </div>
          </div>
        </div>

        {/* No figure strip here.

            There was one — 2010 / 2015 / ~50 / 63, set large in brass. It came
            out because every number in it is already stated twice within a
            screen of itself: the standfirst above says "Licensed since 2010,
            broker since 2015, around 50 sales a year" in prose, the credential
            band immediately below sets 2010 and 2015 as figures in exactly the
            same face, and the review scores further down carry the 63. Three
            tellings of the same four facts, the middle one adding nothing. The
            hero keeps the weight it needs from the rule, the headline and the
            plate. */}
      </section>

      {/* ---------- The record: the range line's device, applied to a career ----------

          Introduced above the band, the way "Where she works" introduces the
          range line further down. Dropped straight in under the hero it read as
          a stripe the page had not accounted for. */}
      <section>
        {/* Heading and band are one block on one field.
            They were two: a heading on limestone, then the ink band under it,
            with section padding between them and above them. That put two
            stacked gaps between the hero and the only thing this section is —
            roughly a third of a screen of empty paper introducing a strip that
            introduces itself. On the ink with the stations, it reads as one
            module and the datum still does its job as the rule the marks hang
            from. */}
        <div className="bg-ink">
          <div className="container-edge pb-10 pt-16 md:pb-12 md:pt-20">
            <Reveal>
              <p className="label-on-ink">The record</p>
              <h2 className="display mt-4 text-4xl text-limestone-pale sm:text-5xl">
                What&apos;s on paper
              </h2>
            </Reveal>
          </div>
          <CredentialLine />
        </div>
      </section>

      {/* ---------- The long version ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="label">The long version</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            How she got here, and what she actually does
          </h2>
        </Reveal>

        {/* The rail takes 22rem, not 18. The body is capped at its reading
            measure, so any width the rail does not use turns into slack inside
            the left track rather than a wider paragraph — widening the rail is
            what actually closes the gap. */}
        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-14 lg:gap-20">
          <Reveal delay={80}>
            {/* The opening paragraph takes a sunk initial — the way a deed
                opens. Only the first: a second one would read as decoration
                rather than as the start of the document. */}
            <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-ink-soft">
              {agent.fullBio.map((para, i) => (
                <p key={para.slice(0, 24)} className={i === 0 ? "dropcap" : ""}>
                  {para}
                </p>
              ))}
            </div>
          </Reveal>

          {/* The rail: a quotation, then where she turns up.
              The quote alone left most of this column empty — three long
              paragraphs beside four short lines, and the difference showing as
              a hole. The press list was in a section of its own underneath,
              which is a sidebar's worth of content given a full band of the
              page. Moving it here fills the column with something real rather
              than padding it, and takes a whole section's worth of gap out of
              the page on the way. */}
          {/* Pulled up level with the heading rather than starting where the
              body copy does. The rail is supporting material, so hanging it
              from the section's own top edge sits it beside the whole block
              instead of appearing to belong to the first paragraph. */}
          <Reveal delay={160} className="md:-mt-24 lg:-mt-28">
            {/* Her stated mission, set as a quotation and attributed. It is the
                one line of brochure register on the page, and quoting it rather
                than absorbing it into the body copy is what makes that honest —
                it reads as her claim about herself, which is what it is. */}
            <figure className="border-t border-ink/15 pt-6">
              <blockquote className="display-sm text-xl leading-[1.45] text-ink">
                &ldquo;{agent.mission}&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {agent.name} — ritcheyrealty.com
              </figcaption>
            </figure>

            <p className="label mt-12">On the record</p>
            {/* The closing rule is the list's own bottom border rather than an
                empty trailing <li>, which would put a contentless item in the
                accessibility tree just to draw a line. */}
            <ul className="mt-5 border-b border-ink/15">
              {press.map((p) => (
                // Each row steps right under the pointer, the way a line being
                // read is followed with a finger. Nothing here is a link —
                // there is no clipping to link to — so the cue stops at the
                // type.
                <li key={p.outlet} className="group border-t border-ink/15">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                    <span className="display-sm text-lg text-ink transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0">
                      {p.outlet}
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted transition-colors duration-300 group-hover:text-brass-deep">
                      {p.kind}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            <p className="mt-4 font-mono text-[11px] leading-relaxed text-ink-muted">
              Set as type, not borrowed logos — no mark on this page belongs to
              anyone but Ritchey Realty.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- How she works ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="label">How she works</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Three shapes this usually takes
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              Most of the year is one of these three. The process underneath
              them is the same; what changes is the runway.
            </p>
          </Reveal>

          {/* Numbered off a datum, the way the listing sheet and the roster
              both hang their content from a rule — and dealt out of the first
              column as the row arrives. See components/ServiceDeck.tsx. */}
          <ServiceDeck items={services} />
        </div>
      </section>

      {/* ---------- Where she works: the homepage's own line, reused ---------- */}
      <section>
        <div className="container-edge pb-12 pt-20 md:pt-24">
          <Reveal className="max-w-2xl">
            <p className="label">Where she works</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              Eight towns, west to east
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
              The territory, ordered the way you&apos;d drive it.{" "}
              <Link
                href="/communities"
                className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
              >
                A short read on each one
              </Link>{" "}
              is on the communities page.
            </p>
          </Reveal>
        </div>
        <RangeLine />
      </section>

      {/* ---------- From clients ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="grid gap-10 md:grid-cols-2 md:items-end md:gap-16">
            <div>
              <p className="label">From clients</p>
              <h2 className="display mt-4 max-w-sm text-4xl text-ink sm:text-5xl">
                Checked, not claimed
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">
                Both figures were read off the platforms themselves.{" "}
                <Link
                  href="/testimonials"
                  className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
                >
                  Read what people wrote
                </Link>
                .
              </p>
            </div>
            <ReviewScores sources={reviewSources} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Common questions ----------

          Head in a rail, questions beside it, rather than the head stacked on
          top of a list capped at its own measure — which left the right half of
          the section empty for the length of eight questions.

          The rail is sticky. Eight rows is more than a screen once a few are
          open, and a heading that scrolls away takes the section's context with
          it; pinned, "what isn't here is worth a conversation" and the way to
          start one stay next to the answers the whole way down. Sticky works
          here because the root uses `overflow-x: clip` rather than `hidden` —
          see the note in globals.css, which was written for exactly this. */}
      <section className="container-edge py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-[minmax(0,21rem)_minmax(0,1fr)] md:gap-16 lg:gap-24">
          <Reveal className="md:sticky md:top-28 md:self-start">
            <p className="label">Common questions</p>
            <h2 className="display mt-4 text-4xl text-ink">
              The things people ask first
            </h2>
            <p className="mt-6 leading-relaxed text-ink-soft">
              Eight answers, each one checkable against something published.
              What isn&apos;t here — commission, timelines, whether a particular
              house is worth it — is worth a conversation rather than a
              paragraph.
            </p>
            <Link href="/contact" className="btn-line mt-8">
              Ask something else
            </Link>
          </Reveal>

          <Reveal delay={80}>
            <Faq items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ---------- Book a meeting — runs straight into the footer ---------- */}
      <section className="bg-ink text-limestone">
        <div className="container-edge pb-16 pt-20 md:pb-20 md:pt-28">
          <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="label-on-ink">Get in touch</p>
              <h2 className="display mt-4 max-w-md text-4xl text-limestone-pale sm:text-5xl">
                Book a meeting with Kallie
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-limestone/70">
                Whether it&apos;s a first house or a listing that needs a proper
                campaign, start with one conversation. You&apos;ll know quickly
                whether it&apos;s a fit.
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
                <div>
                  <dt className="caption-on-ink">Office</dt>
                  <dd className="mt-2">
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        `${site.name}, ${officeAddress}`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="leading-relaxed text-limestone/85 transition-colors hover:text-brass-pale"
                    >
                      {site.address.street}
                      <br />
                      {site.address.locality}, {site.address.region}{" "}
                      {site.address.postalCode}
                    </a>
                  </dd>
                </div>
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
                <MessageTrigger className="btn-brass">
                  Send a message
                </MessageTrigger>
                <Link
                  href="/search"
                  className="btn border border-limestone/25 text-limestone hover:bg-limestone-pale hover:text-ink"
                >
                  Browse listings
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
