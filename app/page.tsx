import Link from "next/link";
import { AgentIntro } from "@/components/AgentIntro";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HeroBackdrop } from "@/components/HeroBackdrop";
import { HeroSearch } from "@/components/HeroSearch";
import { NeighborhoodMap } from "@/components/NeighborhoodMap";
import { RangeLine } from "@/components/RangeLine";
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
      {/* ---------- Hero: footage, type set low and flush left, range line ---------- */}
      <section className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden">
        <HeroBackdrop />

        <div className="container-edge pb-14 pt-36 md:pb-16">
          <p className="animate-rise label-on-ink">
            {site.agent}
            <span aria-hidden="true" className="mx-3 text-limestone/40">
              /
            </span>
            Fort Worth &amp; North Texas
          </p>
          {/* Broken by hand into three lines so the stack holds its shape at
              every width rather than orphaning a word. */}
          <h1 className="display mt-6 text-[3.25rem] text-limestone-pale sm:text-7xl lg:text-[5rem]">
            {/* The gold carries the hook. Lines are hand-broken and kept under
                ~15 characters so the stack holds its shape down to 390px. */}
            <span
              className="animate-rise block text-brass-pale"
              style={{ animationDelay: "120ms" }}
            >
              You&apos;ll know it
            </span>
            <span
              className="animate-rise block"
              style={{ animationDelay: "230ms" }}
            >
              the moment you
            </span>
            <span
              className="animate-rise block"
              style={{ animationDelay: "330ms" }}
            >
              walk in.
            </span>
          </h1>
          <p
            className="animate-rise mt-7 max-w-sm leading-relaxed text-limestone/75"
            style={{ animationDelay: "420ms" }}
          >
            Finding that house across eight North Texas towns — and getting you
            through everything after — is what our team does.
          </p>
          <div
            className="animate-rise mt-9"
            style={{ animationDelay: "560ms" }}
          >
            <HeroSearch />
          </div>
        </div>

        <RangeLine animate />
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

          <p className="mt-16 font-mono text-[11px] leading-relaxed text-ink-soft">
            Sample testimonials written for this demo — not real client reviews.
            Star ratings are placeholders and have not been verified against
            Google or Zillow.
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
              </dl>

              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/contact" className="btn-brass">
                  Send a message
                </Link>
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
