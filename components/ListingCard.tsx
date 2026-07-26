import Image from "next/image";
import Link from "next/link";
import type { Listing } from "@/lib/site";

/**
 * A listing as a tall portrait plate — one exterior photograph, with the
 * details set over a gradient at its foot.
 *
 * `muted` desaturates the whole plate. The rail uses it to hold colour on the
 * leading card only, so a moving row still has one place for the eye to land.
 */
export function ListingCard({
  listing,
  priority = false,
  muted = false,
}: {
  listing: Listing;
  priority?: boolean;
  muted?: boolean;
}) {
  const isNew = listing.status === "New Listing";

  return (
    <article className="group relative">
      <div
        // Colour arrives fast and grey leaves slow, so the plate stepping into
        // the lead is already in colour as it moves rather than catching up
        // afterwards. The front of the rail is never washed out.
        className={`plate aspect-[4/5] w-full transition-[filter] ease-out ${
          muted ? "grayscale duration-700" : "grayscale-0 duration-200"
        }`}
      >
        <Image
          src={listing.image}
          alt={listing.alt}
          fill
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.04]"
        />

        {/* Gradient foot. Weighted so it is still ~85% ink at the status line —
            a listing shot against bright sky has to hold the type as well as
            one shot at dusk. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[58%] bg-gradient-to-t from-ink from-30% via-ink/85 via-65% to-transparent"
        />

        <div className="absolute inset-x-0 bottom-0 p-6 text-limestone">
          <span
            className={`inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest ${
              isNew ? "text-brass-pale" : "text-limestone/70"
            }`}
          >
            {isNew && <span aria-hidden="true" className="h-px w-3 bg-brass" />}
            {listing.status}
          </span>

          <h3 className="display mt-2 text-2xl text-limestone-pale">
            {/* Stretched link — the whole plate is the target. */}
            <Link
              href="/search"
              className="after:absolute after:inset-0 after:content-['']"
            >
              {listing.title}
            </Link>
          </h3>
          <p className="mt-1.5 text-sm text-limestone/70">
            {listing.address} · {listing.city}
          </p>

          <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-t border-limestone/25 pt-3.5 font-mono">
            <span className="text-[15px] text-limestone-pale">
              {listing.price}
            </span>
            <span className="text-xs text-limestone/70">
              {listing.beds} bd · {listing.baths} ba · {listing.sqft} sq ft
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}
