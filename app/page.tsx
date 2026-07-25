import Image from "next/image";
import Link from "next/link";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HeroSearch } from "@/components/HeroSearch";
import { NeighborhoodMap } from "@/components/NeighborhoodMap";
import { Reveal } from "@/components/Reveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { featuredListings, testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero: full-bleed video, centered title + search ---------- */}
      <section className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
        {/* Full-bleed background video */}
        <div className="absolute inset-0 -z-10">
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/hero-poster.jpg"
            aria-hidden="true"
            className="h-full w-full object-cover object-center"
          >
            <source src="/hero.webm" type="video/webm" />
            <source src="/hero.mp4" type="video/mp4" />
          </video>
          {/* Scrims: darken the bright interior so the centered title reads */}
          <div className="absolute inset-0 bg-charcoal/50" />
          <div className="absolute inset-0 bg-gradient-to-b from-charcoal/60 via-transparent to-charcoal/70" />
        </div>

        <div className="container-edge flex flex-col items-center pb-16 pt-24 text-center">
          <p className="eyebrow text-sage-pale">
            Fort Worth &amp; DFW · Boutique Real Estate
          </p>
          {/* Oversized serif headline, centered over the video */}
          <h1 className="mt-5 max-w-4xl font-serif text-[3.25rem] leading-[0.98] text-cream sm:text-7xl lg:text-[5.25rem]">
            Home is a feeling.
            <span className="mt-1 block italic text-sage-pale">
              Let&apos;s find yours.
            </span>
          </h1>
          <HeroSearch />
        </div>
      </section>

      {/* ---------- Featured listings (asymmetric) ---------- */}
      <FeaturedListings listings={featuredListings} />

      {/* ---------- Intro / approach — glass panel over imagery ---------- */}
      <section className="container-edge py-16 md:py-24">
        <div className="relative overflow-hidden rounded-[2.5rem] ring-1 ring-charcoal/10">
          <Image
            src="https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=70"
            alt="Bright, light-filled open-plan living space"
            fill
            loading="lazy"
            sizes="100vw"
            className="object-cover"
          />
          <div className="glass-scrim" />
          <div className="relative grid p-5 sm:p-8 md:p-14 lg:p-16">
            <Reveal className="glass rounded-[1.75rem] p-8 text-cream md:max-w-md md:justify-self-end md:p-10">
              <p className="eyebrow text-sage-pale">The approach</p>
              <h2 className="mt-3 font-serif text-3xl leading-tight sm:text-4xl">
                Boutique service, backed by the whole metroplex
              </h2>
              <p className="mt-6 leading-relaxed text-cream/80">
                Working with a solo agent shouldn&apos;t mean working with fewer
                resources — it should mean working with someone who actually
                remembers your name, your must-haves, and the school district
                that matters most to you.
              </p>
              <p className="mt-4 leading-relaxed text-cream/80">
                Every client gets the same thing: honest pricing, sharp
                negotiation, and steady communication from first showing to
                closing day.
              </p>
              <Link
                href="/about"
                className="btn mt-8 bg-cream text-charcoal hover:bg-cream/90"
              >
                More about Kallie
              </Link>
            </Reveal>
          </div>
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

      {/* ---------- Testimonials — glass cards over imagery ---------- */}
      <section className="relative overflow-hidden py-20 md:py-28">
        <Image
          src="https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1600&q=70"
          alt=""
          aria-hidden="true"
          fill
          loading="lazy"
          sizes="100vw"
          className="object-cover"
        />
        <div className="glass-scrim" />
        <div className="container-edge relative">
          <Reveal className="max-w-2xl">
            <p className="eyebrow text-sage-pale">Kind words</p>
            <h2 className="mt-3 font-serif text-3xl text-cream sm:text-4xl">
              What clients say
            </h2>
          </Reveal>
          <Reveal className="mt-12" delay={80}>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
          <p className="mt-6 text-xs text-cream/60">
            Sample testimonials written for this demo — not real client reviews.
          </p>
        </div>
      </section>

      {/* ---------- Search / IDX CTA — glass over imagery ---------- */}
      <section className="container-edge py-16 md:py-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] px-8 py-14 text-center text-cream ring-1 ring-white/10 md:px-16 md:py-20">
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=70"
              alt=""
              aria-hidden="true"
              fill
              loading="lazy"
              sizes="100vw"
              className="-z-10 object-cover"
            />
            <div className="glass-scrim -z-10 rounded-[2rem]" />
            <p className="text-xs uppercase tracking-widest text-sage-pale">
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
