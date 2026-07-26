import Link from "next/link";
import { AgentIntro } from "@/components/AgentIntro";
import { FeaturedListings } from "@/components/FeaturedListings";
import { HeroSearch } from "@/components/HeroSearch";
import { NeighborhoodMap } from "@/components/NeighborhoodMap";
import { RangeLine } from "@/components/RangeLine";
import { Reveal } from "@/components/Reveal";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { featuredListings, site, testimonials } from "@/lib/site";

export default function HomePage() {
  return (
    <>
      {/* ---------- Hero: footage, type set low and flush left, range line ---------- */}
      <section className="relative isolate flex min-h-dvh flex-col justify-end overflow-hidden">
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
          {/* Scrims: weighted to the bottom-left, where the type sits. */}
          <div className="absolute inset-0 bg-ink/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/10 to-transparent" />
        </div>

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
          <Reveal className="max-w-2xl">
            <p className="label">From clients</p>
            <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
              What working together looks like
            </h2>
          </Reveal>
          <Reveal className="mt-14" delay={80}>
            <TestimonialCarousel items={testimonials} />
          </Reveal>
          <p className="mt-12 font-mono text-[11px] text-ink-soft">
            Sample testimonials written for this demo — not real client reviews.
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
