import Link from "next/link";
import { AgentIntro } from "@/components/AgentIntro";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { HeroSearch } from "@/components/HeroSearch";
import { MessageTrigger } from "@/components/MessageTrigger";
import { NeighborhoodMap } from "@/components/NeighborhoodMap";
import { Reveal } from "@/components/Reveal";
import { ReviewScores, Testimonials } from "@/components/Testimonials";
import {
  featuredListings,
  reviewSources,
  site,
  testimonials,
} from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero: footage, type centred in the frame ---------- */}
      <section className="relative isolate flex min-h-dvh flex-col justify-center overflow-hidden">
        <HeroBackdrop />

        {/* Centred on both axes. The padding is symmetric so the block sits in
            the middle of the frame rather than being pushed off it, and is deep
            enough that the fixed header never crowds the label on a short
            viewport. */}
        <div className="container-edge py-28 text-center">
          <p className="animate-rise label-on-ink">
            {site.agent}
            <span aria-hidden="true" className="mx-3 text-limestone/40">
              /
            </span>
            Fort Worth &amp; North Texas
          </p>
          {/* Two lines, broken at the clause — where the sentence itself
              breaks — not at an arbitrary character count. The old three-line
              stack was cut to hold its shape flush left at 390px; centred,
              that split "the moment you walk in" across two lines while there
              was room to spare. The measure below is what governs wrapping now,
              so the phrase stays whole wherever it fits. */}
          <h1 className="display mx-auto mt-6 max-w-4xl text-[3.25rem] text-limestone-pale sm:text-7xl lg:text-[5rem]">
            {/* rise-solid, not rise: this headline is the page's largest
                contentful paint, and a fade from opacity 0 disqualifies it
                permanently. See app/globals.css. */}
            <span
              className="animate-rise-solid block text-brass-pale"
              style={{ animationDelay: "120ms" }}
            >
              You&apos;ll know it
            </span>
            <span
              className="animate-rise-solid block"
              style={{ animationDelay: "230ms" }}
            >
              the moment you walk in.
            </span>
          </h1>
          {/* Measure matches the search rule below it, so the two read as one
              centred column under the headline. It was max-w-sm — a width set
              for a flush-left column beside empty space — which left it wrapped
              into a narrow stack under type running three times as wide. Size
              is up a step too: 16px sat too far below an 80px headline to hold
              its own in the middle of the frame. */}
          <p
            className="animate-rise mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-limestone/75"
            style={{ animationDelay: "420ms" }}
          >
            Finding that house across eight North Texas towns — and getting you
            through everything after — is what our team does.
          </p>
          <div
            className="animate-rise mt-9 flex justify-center"
            style={{ animationDelay: "560ms" }}
          >
            <HeroSearch />
          </div>
        </div>
      </section>

      {/* ---------- On the market ---------- */}
      <FeaturedListings listings={featuredListings} />

      {/* ---------- The agent ---------- */}
      <AgentIntro />

      {/* ---------- The ground: illustrated, interactive map ---------- */}
      <section className="container-edge pb-20 pt-16 md:pb-28 md:pt-20">
        <Reveal className="max-w-2xl">
          <p className="label">The ground</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            What each town is actually like
          </h2>
          <p className="mt-6 max-w-lg leading-relaxed text-ink-soft">
            A short, honest read on all eight — the character, the schools, and
            what your money buys once you get there.
          </p>
        </Reveal>
        <Reveal className="mt-12" delay={80}>
          <NeighborhoodMap />
        </Reveal>
      </section>

      {/* ---------- From clients ---------- */}
      <section className="bg-limestone-deep">
        <div className="container-edge py-20 md:py-28">
          {/* Head and scores share a row from md up: the headline is short and
              would otherwise leave half the measure empty with the scores
              stacked under it, reading as two sections instead of one. */}
          <Reveal className="grid gap-10 md:grid-cols-2 md:items-end md:gap-16">
            <div>
              <p className="label">From clients</p>
              <h2 className="display mt-4 max-w-md text-4xl text-ink sm:text-5xl">
                What working together looks like
              </h2>
            </div>
            <ReviewScores sources={reviewSources} />
          </Reveal>

          <Reveal className="mt-16 md:mt-20" delay={80}>
            <div className="datum" />
          </Reveal>

          <Reveal className="mt-14" delay={140}>
            <Testimonials items={testimonials} />
          </Reveal>

          {/* The two halves of this section have different standing, so the
              note says which is which rather than disclaiming both. */}
          <p className="mt-16 font-mono text-[11px] leading-relaxed text-ink-soft">
            Ratings above are real and verified — 4.9 from 63 Google reviews,
            5.0 from 39 on Zillow. The quotes below are sample testimonials
            written for this demo, not real client reviews.
          </p>
        </div>
      </section>

      {/* ---------- Get in touch — runs straight into the footer ---------- */}
      <section className="bg-ink text-limestone">
        <div className="container-edge pb-16 pt-20 md:pb-20 md:pt-28">
          <Reveal className="grid gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="label-on-ink">Get in touch</p>
              <h2 className="display mt-4 max-w-md text-4xl text-limestone-pale sm:text-5xl">
                Tell me what you&apos;re looking for
              </h2>
              <p className="mt-6 max-w-sm leading-relaxed text-limestone/70">
                No drip campaign, no call centre, no pressure. One conversation
                with a named agent, and you&apos;ll know whether we&apos;re the
                right fit.
              </p>
            </div>

            <div className="md:pt-2">
              <dl className="space-y-8">
                <div>
                  <dt className="caption-on-ink">
                    Call or text
                  </dt>
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
                  <dt className="caption-on-ink">
                    Email
                  </dt>
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
                  <dd className="mt-2 leading-relaxed text-limestone/85">
                    {site.address.street}
                    <br />
                    {site.address.locality}, {site.address.region}{" "}
                    {site.address.postalCode}
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
