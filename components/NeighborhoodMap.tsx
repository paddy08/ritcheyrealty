"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities, formatCoords, stations } from "@/lib/site";

/**
 * The geographic bounds of public/neighborhood-map.webp.
 *
 * Marker positions are derived from each town's real lat/lon in lib/site.ts
 * rather than hand-placed, so swapping the map only means updating these four
 * numbers — and every pin lands by arithmetic instead of by eye.
 *
 * TODO: these are estimated from landmarks (Eagle Mountain Lake, DFW Airport,
 * Lake Grapevine) and are almost certainly a little off. Replace with the
 * generator's actual corner coordinates.
 */
const MAP_BOUNDS = { west: -97.4136, east: -97.0289, north: 33.0413, south: 32.7182 };

/** Project a coordinate onto the map as a percentage of its box. */
function project({ lat, lon }: { lat: number; lon: number }) {
  const { west, east, north, south } = MAP_BOUNDS;
  return {
    x: ((lon - west) / (east - west)) * 100,
    y: ((north - lat) / (north - south)) * 100,
  };
}

export function NeighborhoodMap() {
  const [active, setActive] = useState(0);
  const current = communities[active];

  return (
    <div className="relative">
      <div className="plate aspect-square w-full">
        <Image
          src="/neighborhood-map.webp"
          alt="Illustrated map of the Fort Worth / DFW area showing the communities Ritchey Realty serves"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />

        {/* Survey pins over each labeled town: a brass ring that closes to a
            filled mark when selected. */}
        {communities.map((c, i) => {
          const pos = project(c);
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
              className="group absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center text-brass-deep md:h-11 md:w-11"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              {/* Halo — seats the mark on a busy sheet. */}
              <span
                aria-hidden="true"
                className={`absolute h-10 w-10 rounded-full bg-limestone-pale transition-opacity duration-300 ${
                  isActive
                    ? "opacity-80"
                    : "opacity-0 group-hover:opacity-50 group-focus-visible:opacity-50"
                }`}
              />
              {/* Crosshair ticks — the survey mark */}
              <span
                aria-hidden="true"
                className={`absolute w-px bg-brass-deep transition-all duration-300 ${
                  isActive
                    ? "h-8 opacity-100"
                    : "h-6 opacity-0 group-hover:opacity-70"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-px bg-brass-deep transition-all duration-300 ${
                  isActive
                    ? "w-8 opacity-100"
                    : "w-6 opacity-0 group-hover:opacity-70"
                }`}
              />
              {/* The mark itself */}
              <span
                aria-hidden="true"
                className={`relative block rounded-full border-2 border-brass-deep transition-all duration-300 ${
                  isActive
                    ? "h-3.5 w-3.5 bg-brass"
                    : "h-2.5 w-2.5 bg-limestone-pale group-hover:bg-brass"
                }`}
              />
            </button>
          );
        })}
      </div>

      {/* Below md the map is too small for eight 44px pins to be tappable, so
          the same eight towns get a thumb-sized strip instead. Same order as
          the range line. */}
      <ol className="no-scrollbar scroll-fade mt-4 flex gap-6 overflow-x-auto md:hidden">
        {stations.map((c) => {
          const i = communities.indexOf(c);
          const isActive = i === active;
          return (
            <li key={c.name} className="flex-none">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-pressed={isActive}
                className="flex flex-col items-center pt-1"
              >
                <span
                  aria-hidden="true"
                  className={`block w-px transition-all duration-300 ${
                    isActive ? "h-4 bg-brass-deep" : "h-2.5 bg-ink/25"
                  }`}
                />
                <span
                  className={`mt-2 whitespace-nowrap font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 ${
                    isActive ? "text-ink" : "text-ink-muted"
                  }`}
                >
                  {c.name}
                </span>
              </button>
            </li>
          );
        })}
      </ol>

      {/* Readout — a paper card, where the coordinates are earned. */}
      <div className="mt-5 rounded-[3px] border border-ink/15 bg-limestone-pale p-6 md:absolute md:left-6 md:top-6 md:mt-0 md:max-w-xs md:p-7">
        <p className="font-mono text-[11px] tracking-wide text-brass-deep">
          {formatCoords(current)}
        </p>
        <h3 key={current.name} className="display mt-3 text-3xl text-ink">
          {current.name}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          {current.blurb}
        </p>
        <Link
          href="/communities"
          className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:text-brass-deep"
        >
          Explore {current.name}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>
    </div>
  );
}
