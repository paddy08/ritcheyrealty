import Image from "next/image";
import type { Listing } from "@/lib/site";

export function ListingCard({
  listing,
  priority = false,
}: {
  listing: Listing;
  priority?: boolean;
}) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl bg-cream-deep/60 ring-1 ring-charcoal/5 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(43,42,38,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={listing.image}
          alt={listing.alt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          priority={priority}
        />
        <span className="absolute left-4 top-4 rounded-full bg-cream/90 px-3 py-1 text-[11px] font-medium uppercase tracking-widest text-charcoal">
          {listing.status}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <p className="font-serif text-lg text-charcoal">{listing.title}</p>
        <p className="mt-1 text-sm text-charcoal-muted">
          {listing.address} · {listing.city}
        </p>

        <p className="mt-4 font-serif text-xl text-charcoal">{listing.price}</p>

        <div className="mt-4 flex items-center gap-4 border-t border-charcoal/10 pt-4 text-sm text-charcoal-soft">
          <span>{listing.beds} bd</span>
          <span className="text-charcoal/20">|</span>
          <span>{listing.baths} ba</span>
          <span className="text-charcoal/20">|</span>
          <span>{listing.sqft} sqft</span>
        </div>
      </div>
    </article>
  );
}
