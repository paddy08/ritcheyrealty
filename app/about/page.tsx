import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CredentialLine } from "@/components/CredentialLine";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { MessageTrigger } from "@/components/MessageTrigger";
import { RangeLine } from "@/components/RangeLine";
import { Reveal } from "@/components/Reveal";
import { ReviewScores } from "@/components/Testimonials";
import {
  agent,
  communities,
  faqs,
  formatCoords,
  officeAddress,
  press,
  reviewSources,
  services,
  site,
} from "@/lib/site";

// Her base, for the coordinate readout at the head of the sheet. Read out of
// `communities` rather than typed again, so it stays the same figure the map
// and the range line project from.
const keller = communities.find((c) => c.name === "Keller");

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
      <section className="container-edge flex min-h-dvh flex-col justify-center pb-16 pt-28 md:pb-20 md:pt-32">
        {/* The head of the sheet: what it is, and where it was drawn. The
            coordinate is Keller's, from `communities` — she is based there, and
            it is the same readout the map uses. */}
        <div className="flex items-baseline justify-between gap-6">
          <p className="animate-rise label">About</p>
          <p
            className="animate-rise font-mono text-[10px] uppercase tracking-widest text-ink-muted"
            style={{ animationDelay: "80ms" }}
          >
            <span className="hidden sm:inline">Based in Keller — </span>
            {keller ? formatCoords(keller) : null}
          </p>
        </div>
        <div
          className="datum animate-draw mt-4"
          style={{ animationDelay: "160ms" }}
        />

        {/* Centred against the plate rather than top-aligned with it. The type
            column is a third shorter than a 4:5 portrait, and hanging both from
            the same top edge dumped all of that slack into one dead corner
            under the buttons. Split, it reads as margin. */}
        <div className="mt-10 grid gap-12 md:mt-12 md:grid-cols-[minmax(0,1fr)_minmax(0,20rem)] md:items-center md:gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,23rem)] lg:gap-20">
          <div>
            {/* Broken at the clause, as on the homepage — not at a character
                count. Set a step under the homepage's 5rem so the two heroes
                are the same voice at different volumes. */}
            <h1 className="display max-w-2xl text-[3.25rem] text-ink sm:text-6xl lg:text-[4.75rem]">
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
              className="animate-rise mt-7 max-w-lg text-lg leading-relaxed text-ink-soft"
              style={{ animationDelay: "600ms" }}
            >
              {agent.statement} Traditional and luxury markets alike, from Fort
              Worth up through Keller, Southlake and Grapevine.
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
          </div>

          <div>
            {/* The marks sit outside the plate, so they cannot live inside the
                Reveal: its plate variant clips its children to the plate's own
                box on the way in, which would crop them away. */}
            <div className="relative">
              {/* The plate uncovers from its bottom edge while the photograph
                  settles back from an over-scale — the same print-being-laid-
                  down reveal the intro video gets on the homepage. */}
              <Reveal variant="plate" delay={420}>
                <div className="plate aspect-[4/5] w-full">
                  <Image
                    src={agent.photo}
                    alt={`${agent.name}, ${agent.role} at ${site.name}`}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 23rem"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              {/* Outset less on a phone. The plate runs the full width of the
                  container there, so a 12px outset put the right-hand marks
                  within a few pixels of the screen edge and they read as type
                  that had escaped rather than as trim marks. */}
              {[
                ["-left-2 -top-2 border-l border-t sm:-left-3 sm:-top-3", "1080ms"],
                ["-right-2 -top-2 border-r border-t sm:-right-3 sm:-top-3", "1140ms"],
                ["-bottom-2 -left-2 border-b border-l sm:-bottom-3 sm:-left-3", "1200ms"],
                ["-bottom-2 -right-2 border-b border-r sm:-bottom-3 sm:-right-3", "1260ms"],
              ].map(([pos, delay]) => (
                <span
                  key={pos}
                  aria-hidden="true"
                  className={`crop-mark animate-rise ${pos}`}
                  style={{ animationDelay: delay }}
                />
              ))}
            </div>
            <p
              className="animate-rise mt-5 font-mono text-[11px] leading-relaxed text-ink-muted"
              style={{ animationDelay: "1260ms" }}
            >
              Licensing: {agent.license}
            </p>
          </div>
        </div>

        {/* The title block — the figures a drawing carries in its bottom
            corner. Real, checkable numbers, the same four the homepage prints
            under her bio. */}
        <div className="mt-12 md:mt-14">
          <div
            className="datum animate-draw"
            style={{ animationDelay: "1100ms" }}
          />
          <dl className="grid grid-cols-2 gap-x-8 gap-y-7 pt-6 sm:grid-cols-4">
            {agent.facts.map((fact, i) => (
              <div
                key={fact.label}
                className="animate-rise"
                style={{ animationDelay: `${1200 + i * 90}ms` }}
              >
                <dt className="font-mono text-[10px] uppercase leading-relaxed tracking-widest text-ink-muted">
                  {fact.label}
                </dt>
                <dd className="display mt-2 text-3xl text-brass-deep sm:text-4xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ---------- The record: the range line's device, applied to a career ----------

          Introduced above the band, the way "Where she works" introduces the
          range line further down. Dropped straight in under the hero it read as
          a stripe the page had not accounted for. */}
      <section>
        <div className="container-edge pb-12 pt-20 md:pb-14 md:pt-24">
          <Reveal className="grid gap-8 md:grid-cols-2 md:items-end md:gap-16">
            <div>
              <p className="label">The record</p>
              <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
                What&apos;s on paper
              </h2>
            </div>
            <p className="max-w-md leading-relaxed text-ink-soft md:pb-2">
              Two of these carry a year because two of them have one. The rest
              carry the body that issued them — nothing here is dated by
              guesswork.
            </p>
          </Reveal>
        </div>
        <CredentialLine />
      </section>

      {/* ---------- The long version ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="label">The long version</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            How she got here, and what she actually does
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-12 md:grid-cols-[minmax(0,1fr)_minmax(0,18rem)] md:gap-16">
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

          {/* Her stated mission, set as a quotation and attributed. It is the
              one line of brochure register on the page, and quoting it rather
              than absorbing it into the body copy is what makes that honest —
              it reads as her claim about herself, which is what it is. */}
          <Reveal delay={160} className="md:pt-2">
            <figure className="border-t border-ink/15 pt-6">
              <blockquote className="display-sm text-xl leading-[1.45] text-ink">
                &ldquo;{agent.mission}&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {agent.name} — ritcheyrealty.com
              </figcaption>
            </figure>
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

          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {services.map((s, i) => (
              // Numbered off a datum, the way the listing sheet and the roster
              // both hang their content from a rule.
              // The rule inks up under the pointer and the numeral comes with
              // it — the whole column is the target, so the cue belongs to the
              // column rather than to a link inside it.
              <Reveal key={s.n} delay={80 + i * 80} className="group">
                <div className="h-px w-full bg-ink/15 transition-colors duration-300 group-hover:bg-brass-deep" />
                <p className="display mt-5 text-3xl leading-none text-ink/25 transition-colors duration-300 group-hover:text-brass-deep">
                  {s.n}
                </p>
                <h3 className="display-sm mt-4 text-2xl text-ink">{s.title}</h3>
                <p className="mt-4 leading-relaxed text-ink-soft">{s.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- On the record: press ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
          <div>
            <p className="label">On the record</p>
            {/* Balanced: at this column width the last word otherwise drops to
                a line of its own. */}
            <h2 className="display mt-4 text-balance text-4xl text-ink sm:text-5xl">
              Where she turns up
            </h2>
            <p className="mt-6 max-w-sm leading-relaxed text-ink-soft">
              Set as type rather than as a wall of borrowed logos — no mark on
              this page belongs to anyone but Ritchey Realty.
            </p>
          </div>

          {/* The closing rule is the list's own bottom border rather than an
              empty trailing <li>, which would put a contentless item in the
              accessibility tree just to draw a line. */}
          <ul className="border-b border-ink/15 md:pt-3">
            {press.map((p) => (
              // Each row steps right under the pointer, the way a line being
              // read is followed with a finger. Nothing here is a link — there
              // is no clipping to link to — so the cue stops at the type.
              <li key={p.outlet} className="group border-t border-ink/15">
                <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 py-5">
                  <span className="display-sm text-xl text-ink transition-transform duration-300 ease-out group-hover:translate-x-2 motion-reduce:group-hover:translate-x-0 sm:text-2xl">
                    {p.outlet}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted transition-colors duration-300 group-hover:text-brass-deep">
                    {p.kind}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      {/* ---------- Where she works: the homepage's own line, reused ---------- */}
      <section>
        <div className="container-edge pb-12">
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

      {/* ---------- Common questions ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="label">Common questions</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            The things people ask first
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
            Eight answers, each one checkable against something published. What
            isn&apos;t here — commission, timelines, whether a particular house
            is worth it — is worth a conversation rather than a paragraph.
          </p>
        </Reveal>

        <Reveal className="mt-12" delay={80}>
          <Faq items={faqs} />
        </Reveal>
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
