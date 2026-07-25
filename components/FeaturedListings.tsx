import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import type { Listing } from "@/lib/site";

function Specs({ listing }: { listing: Listing }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span>{listing.beds} bd</span>
      <span className="opacity-30">·</span>
      <span>{listing.baths} ba</span>
      <span className="opacity-30">·</span>
      <span>{listing.sqft} sqft</span>
    </div>
  );
}

/** Large, image-forward feature card with text sitting over the photo. */
function FeatureCard({ listing }: { listing: Listing }) {
  return (
    <article className="group relative min-h-[440px] overflow-hidden rounded-[1.75rem] ring-1 ring-charcoal/10 lg:min-h-full">
      <Image
        src={listing.image}
        alt={listing.alt}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />
      <span className="absolute left-6 top-6 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-charcoal">
        {listing.status}
      </span>
      <div className="absolute inset-x-0 bottom-0 p-7 text-cream md:p-9">
        <p className="text-xs uppercase tracking-widest text-cream/70">
          {listing.city}
        </p>
        <h3 className="mt-2 font-serif text-3xl leading-tight sm:text-4xl">
          {listing.title}
        </h3>
        <p className="mt-1 text-cream/80">{listing.address}</p>
        <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="font-serif text-2xl">{listing.price}</p>
          <div className="text-cream/85">
            <Specs listing={listing} />
          </div>
        </div>
      </div>
    </article>
  );
}

/** Compact horizontal card — image beside text, breaks the uniform grid. */
function CompactCard({ listing }: { listing: Listing }) {
  return (
    <article className="group flex items-stretch gap-4 overflow-hidden rounded-2xl bg-cream-deep/70 p-3 ring-1 ring-charcoal/5 transition-shadow duration-300 hover:shadow-[0_16px_36px_-26px_rgba(43,42,38,0.5)]">
      <div className="relative aspect-square w-28 flex-none overflow-hidden rounded-xl sm:w-32">
        <Image
          src={listing.image}
          alt={listing.alt}
          fill
          loading="lazy"
          sizes="140px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
        />
        <span className="absolute left-2 top-2 rounded-full bg-cream/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-widest text-charcoal">
          {listing.status}
        </span>
      </div>
      <div className="flex min-w-0 flex-col justify-center pr-1">
        <p className="text-[11px] uppercase tracking-widest text-sage-deep">
          {listing.city}
        </p>
        <h3 className="mt-1 truncate font-serif text-lg text-charcoal">
          {listing.title}
        </h3>
        <p className="mt-1 font-serif text-lg text-charcoal">{listing.price}</p>
        <div className="mt-2 text-charcoal-soft">
          <Specs listing={listing} />
        </div>
      </div>
    </article>
  );
}

export function FeaturedListings({ listings }: { listings: Listing[] }) {
  const [feature, ...rest] = listings;

  return (
    <section className="container-edge py-20 md:py-28">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Featured</p>
          <h2 className="mt-3 max-w-md font-serif text-3xl leading-tight text-charcoal sm:text-4xl">
            A few homes worth a second look
          </h2>
        </div>
        <Link
          href="/search"
          className="text-sm text-charcoal-soft underline-offset-4 transition-colors hover:text-charcoal hover:underline"
        >
          View all homes &rarr;
        </Link>
      </Reveal>

      <div className="mt-12 grid gap-6 lg:grid-cols-12">
        <Reveal className="lg:col-span-7" delay={60}>
          <div className="h-full">
            <FeatureCard listing={feature} />
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 lg:col-span-5">
          {rest.map((listing, i) => (
            <Reveal key={listing.id} delay={120 + i * 90}>
              <CompactCard listing={listing} />
            </Reveal>
          ))}
        </div>
      </div>

      <p className="mt-6 text-xs text-charcoal-muted">
        Sample listings shown for demonstration — fictional properties and
        pricing.
      </p>
    </section>
  );
}
