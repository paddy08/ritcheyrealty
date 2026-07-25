"use client";

import { useRef } from "react";
import type { Testimonial } from "@/lib/site";

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 24 : track.clientWidth * 0.8;
    track.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-2"
        role="list"
      >
        {items.map((t) => (
          <figure
            key={t.id}
            data-card
            role="listitem"
            className="w-[85%] flex-none snap-start rounded-2xl bg-cream p-8 ring-1 ring-charcoal/10 sm:w-[60%] lg:w-[calc(50%-12px)]"
          >
            <span
              aria-hidden="true"
              className="font-serif text-5xl leading-none text-sage"
            >
              &ldquo;
            </span>
            <blockquote className="mt-2 font-serif text-lg leading-relaxed text-charcoal-soft">
              {t.quote}
            </blockquote>
            <figcaption className="mt-6 border-t border-charcoal/10 pt-4">
              <p className="text-sm font-medium text-charcoal">{t.name}</p>
              <p className="text-xs uppercase tracking-widest text-sage-deep">
                {t.detail}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center gap-3">
        <button
          type="button"
          onClick={() => scrollByCard(-1)}
          aria-label="Previous testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">&larr;</span>
        </button>
        <button
          type="button"
          onClick={() => scrollByCard(1)}
          aria-label="Next testimonial"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-charcoal/20 text-charcoal transition-colors hover:border-charcoal hover:bg-charcoal hover:text-cream focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2"
        >
          <span aria-hidden="true">&rarr;</span>
        </button>
      </div>
    </div>
  );
}
