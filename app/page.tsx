import Image from "next/image";
import Link from "next/link";
import { FeaturedListings } from "@/components/FeaturedListings";
import { NeighborhoodMap } from "@/components/NeighborhoodMap";
import { Reveal } from "@/components/Reveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { featuredListings, testimonials, site } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero: full-bleed image, headline overlapping the photo ---------- */}
      <section className="relative isolate">
        {/* Full-bleed background image (LCP) */}
        <div className="absolute inset-0 -z-10">
          <Image
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1900&q=75"
            alt="Warm, light-filled living room with natural textures"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          {/* Scrims: keep the overlapping headline legible without hiding the photo */}
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/85 via-charcoal/45 to-charcoal/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-charcoal/20" />
        </div>

        <div className="container-edge flex min-h-[86vh] flex-col justify-end pb-16 pt-28 md:min-h-[90vh] md:pb-24">
          <p className="eyebrow text-sage-pale">
            Fort Worth &amp; DFW · Boutique Real Estate
          </p>
          {/* Oversized serif headline sitting over the image */}
          <h1 className="mt-5 max-w-4xl font-serif text-[3.25rem] leading-[0.98] text-cream sm:text-7xl lg:text-[5.5rem]">
            Home is a feeling.
            <span className="mt-1 block pl-[0.06em] italic text-sage-pale">
              Let&apos;s find yours.
            </span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/85">
            I&apos;m {site.agent} — a Fort Worth agent who believes buying or
            selling a home should feel unhurried, personal, and genuinely on
            your side.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/search"
              className="btn bg-cream text-charcoal hover:bg-cream/90"
            >
              Search homes
            </Link>
            <Link
              href="/contact"
              className="btn border border-cream/40 text-cream hover:bg-cream/10"
            >
              Book a conversation
            </Link>
          </div>
          <p className="mt-10 max-w-md text-sm text-cream/60">
            Serving {site.serviceArea}
          </p>
        </div>
      </section>

      {/* ---------- Featured listings (asymmetric) ---------- */}
      <FeaturedListings listings={featuredListings} />

      {/* ---------- Intro / approach ---------- */}
      <section className="bg-cream-deep">
        <div className="container-edge grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
          <Reveal className="relative order-last aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-charcoal/10 md:order-first">
            <Image
              src="https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=70"
              alt="Agent shaking hands with clients at a bright kitchen table"
              fill
              loading="lazy"
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </Reveal>
          <Reveal className="max-w-xl" delay={80}>
            <p className="eyebrow">The approach</p>
            <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
              Boutique service, backed by the whole metroplex
            </h2>
            <p className="mt-6 leading-relaxed text-charcoal-soft">
              Working with a solo agent shouldn&apos;t mean working with fewer
              resources — it should mean working with someone who actually
              remembers your name, your must-haves, and the school district that
              matters most to you.
            </p>
            <p className="mt-4 leading-relaxed text-charcoal-soft">
              Every client gets the same thing: honest pricing, sharp
              negotiation, and steady communication from first showing to
              closing day.
            </p>
            <Link href="/about" className="btn-outline mt-8">
              More about Kallie
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ---------- Signature: interactive neighborhood map ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal className="max-w-2xl">
          <p className="eyebrow">Where I work</p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            Neighborhoods I know by heart
          </h2>
          <p className="mt-5 leading-relaxed text-charcoal-soft">
            Hover a marker to get a feel for each community — from Fort Worth&apos;s
            arts district to Southlake&apos;s master-planned calm.
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <NeighborhoodMap />
        </Reveal>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section className="bg-sage-pale/50">
        <div className="container-edge py-20 md:py-28">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">Kind words</p>
            <h2 className="mt-3 font-serif text-3xl text-charcoal sm:text-4xl">
              What clients say
            </h2>
          </Reveal>
          <Reveal className="mt-12" delay={80}>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
          <p className="mt-6 text-xs text-charcoal-muted">
            Sample testimonials written for this demo — not real client reviews.
          </p>
        </div>
      </section>

      {/* ---------- Search / IDX CTA ---------- */}
      <section className="container-edge py-20 md:py-28">
        <Reveal>
          <div className="overflow-hidden rounded-[2rem] bg-charcoal px-8 py-14 text-center text-cream md:px-16 md:py-20">
            <p className="text-xs uppercase tracking-widest text-sage">
              Ready when you are
            </p>
            <h2 className="mx-auto mt-4 max-w-2xl font-serif text-3xl leading-tight sm:text-4xl">
              Let&apos;s talk about what you&apos;re looking for
            </h2>
            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream/70">
              Whether you&apos;re browsing or ready to make a move, a quick,
              no-pressure conversation is the best place to start.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="btn bg-cream text-charcoal hover:bg-cream/90"
              >
                Get in touch
              </Link>
              <Link
                href="/search"
                className="btn border border-cream/30 text-cream hover:bg-cream/10"
              >
                Browse listings
              </Link>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
