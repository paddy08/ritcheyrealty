"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities } from "@/lib/site";

// Marker positions (% of the illustrated map) matched to the baked-in labels
// on public/neighborhood-map.webp. Keyed by community name.
const markers: Record<string, { x: number; y: number }> = {
  "Fort Worth": { x: 31, y: 81 },
  Saginaw: { x: 30.5, y: 55 },
  Haslet: { x: 45.8, y: 37 },
  Roanoke: { x: 50.8, y: 17.5 },
  Keller: { x: 46.4, y: 51.5 },
  Southlake: { x: 62.8, y: 34.5 },
  Grapevine: { x: 79.5, y: 46.8 },
  "North Richland Hills": { x: 55.6, y: 70.5 },
};

export function NeighborhoodMap() {
  const [active, setActive] = useState(0);
  const current = communities[active];

  return (
    <div className="relative">
      {/* Illustrated, interactive map */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.75rem] bg-cream-deep ring-1 ring-charcoal/10">
        <Image
          src="/neighborhood-map.webp"
          alt="Illustrated map of the Fort Worth / DFW area showing the communities Ritchey Realty serves"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />

        {/* Interactive hotspots over each labeled town */}
        {communities.map((c, i) => {
          const pos = markers[c.name];
          if (!pos) return null;
          const isActive = i === active;
          return (
            <button
              key={c.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${c.name}: ${c.blurb}`}
              aria-pressed={isActive}
              className="group absolute flex h-[13%] w-[13%] min-h-11 min-w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full focus:outline-none"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Soft highlight ring shown on hover / focus / active */}
              <span
                className={`block h-full w-full rounded-full transition-all duration-300 ${
                  isActive
                    ? "scale-100 bg-white/25 shadow-[0_0_28px_10px_rgba(255,255,255,0.35)] ring-2 ring-white/70"
                    : "scale-50 bg-white/0 opacity-0 group-hover:scale-90 group-hover:bg-white/15 group-hover:opacity-100 group-focus-visible:scale-90 group-focus-visible:bg-white/15 group-focus-visible:opacity-100"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Info panel — overlay on desktop, stacked card on mobile */}
      <div className="glass mt-4 rounded-2xl p-6 text-cream md:absolute md:left-6 md:top-6 md:mt-0 md:max-w-xs md:p-7">
        <p className="text-[11px] uppercase tracking-widest text-sage">
          {String(active + 1).padStart(2, "0")} / {communities.length} · DFW
        </p>
        <h3
          key={current.name}
          className="mt-3 font-serif text-2xl leading-tight text-cream sm:text-3xl"
        >
          {current.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-cream/75">
          {current.blurb}
        </p>
        <Link
          href="/communities"
          className="mt-5 inline-flex items-center gap-2 text-sm text-cream underline-offset-4 hover:underline"
        >
          Explore {current.name}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
