"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities, formatCoords, stations } from "@/lib/site";
import type { Community } from "@/lib/site";

/**
 * The geographic bounds of public/neighborhood-map-v2.webp.
 *
 * Marker positions are derived from each town's real lat/lon in lib/site.ts
 * rather than hand-placed, so swapping the map only means updating these four
 * numbers — and every pin lands by arithmetic instead of by eye.
 *
 * Solved rather than estimated. The map is a Google render, so it is a Web
 * Mercator projection; fitting one shared scale across both axes (the
 * projection's real geometry, instead of letting each axis stretch
 * independently) against the seven town labels on the annotated copy of this
 * screenshot gives these corners. Two landmarks nobody fitted against confirm
 * it: DFW Airport lands at 87.1% across where it is drawn at 87.2%, and
 * Grapevine Lake at 79.7% where it is drawn at 79.6%.
 *
 * Individual towns sit up to ~1 mile from their label, because Google places a
 * city label at its polygon's centroid while lib/site.ts carries town-centre
 * coordinates. The corners are what is accurate here, not any one label.
 */
const MAP_BOUNDS = { west: -97.6523, east: -96.9468, north: 33.0345, south: 32.7053 };

/** Project a coordinate onto the map as a percentage of its box. */
function project({ lat, lon }: { lat: number; lon: number }) {
  const { west, east, north, south } = MAP_BOUNDS;
  return {
    x: ((lon - west) / (east - west)) * 100,
    y: ((north - lat) / (north - south)) * 100,
  };
}

/**
 * A pin's card is roughly half the height of the map box at lg. So a pin in
 * the top half cannot carry its card above it without running off the sheet —
 * those flip and hang below the pin instead.
 */
const FLIP_BELOW_ABOVE_Y = 50;

/** The readout: a paper card, where the coordinates are earned. */
function Readout({
  community,
  className = "",
}: {
  community: Community;
  className?: string;
}) {
  return (
    <div
      className={`rounded-[3px] border border-ink/15 bg-limestone-pale p-6 ${className}`}
    >
      <p className="font-mono text-[11px] tracking-wide text-brass-deep">
        {formatCoords(community)}
      </p>
      <h3 className="display mt-3 text-3xl text-ink">{community.name}</h3>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">
        {community.blurb}
      </p>
      <Link
        href="/communities"
        className="mt-6 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-ink transition-colors hover:text-brass-deep"
      >
        Explore {community.name}
        <span aria-hidden="true">&rarr;</span>
      </Link>
    </div>
  );
}

export function NeighborhoodMap() {
  const [active, setActive] = useState(0);
  const current = communities[active];
  const currentPos = project(current);
  const below = currentPos.y < FLIP_BELOW_ABOVE_Y;

  return (
    <div className="relative">
      {/* The plate matches the asset's own 1683x935 ratio exactly, so
          object-cover crops nothing. A square box here would cut ~44% off the
          width — taking Fort Worth and Grapevine, the two outermost towns,
          straight off the map. */}
      <div className="plate aspect-[1683/935] w-full">
        <Image
          src="/neighborhood-map-v2.webp"
          alt="Map of the Fort Worth and north-east Tarrant County area showing the eight communities Ritchey Realty serves"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className="object-cover"
        />

        {/* Survey pins over each town: a brass ring that closes to a filled
            mark when selected.

            Selection is on click and focus, not hover. Hover only grows the
            pin — a card that opened on hover would chase the cursor across the
            map, and the point of the affordance is to say "click me". */}
        {communities.map((c, i) => {
          const pos = project(c);
          const isActive = i === active;
          return (
            <button
              key={c.name}
              type="button"
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${c.name}: ${c.blurb}`}
              aria-pressed={isActive}
              className="group absolute flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer items-center justify-center text-brass-deep md:h-12 md:w-12"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                // The selected pin rides above its neighbours so its label
                // isn't overlapped by theirs.
                zIndex: isActive ? 20 : 10,
              }}
            >
              {/* Halo — seats the mark on a busy sheet. Always faintly present
                  now: an invisible-until-hover control reads as decoration. */}
              <span
                aria-hidden="true"
                className={`absolute rounded-full bg-limestone-pale transition-all duration-300 ${
                  isActive
                    ? "h-9 w-9 opacity-90"
                    : "h-7 w-7 opacity-70 group-hover:h-9 group-hover:w-9 group-hover:opacity-90"
                }`}
              />
              {/* Crosshair ticks — the survey mark */}
              <span
                aria-hidden="true"
                className={`absolute w-px bg-brass-deep transition-all duration-300 ${
                  isActive
                    ? "h-9 opacity-100"
                    : "h-7 opacity-0 group-hover:opacity-70"
                }`}
              />
              <span
                aria-hidden="true"
                className={`absolute h-px bg-brass-deep transition-all duration-300 ${
                  isActive
                    ? "w-9 opacity-100"
                    : "w-7 opacity-0 group-hover:opacity-70"
                }`}
              />
              {/* The mark itself */}
              <span
                aria-hidden="true"
                className={`relative block rounded-full border-2 border-brass-deep transition-all duration-300 ${
                  isActive
                    ? "h-5 w-5 bg-brass"
                    : "h-3.5 w-3.5 bg-limestone-pale group-hover:h-4 group-hover:w-4 group-hover:bg-brass"
                }`}
              />
              {/* The town's name, on the map. The asset carries no labels of
                  its own, so without this a reader can see eight pins but not
                  tell which town any of them is until they click. */}
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute left-full ml-1.5 hidden whitespace-nowrap rounded-[2px] px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-widest transition-colors duration-200 md:block ${
                  isActive
                    ? "bg-ink text-limestone-pale"
                    : "bg-limestone-pale/85 text-ink group-hover:bg-ink group-hover:text-limestone-pale"
                }`}
              >
                {c.name}
              </span>
            </button>
          );
        })}

      </div>

      {/* The card, hung off the active pin rather than parked in the corner,
          so the reading belongs to the point it describes. A brass stem
          bridges the gap — the page's own tick, at map scale.

          Deliberately a sibling of the plate, not a child: .plate is
          overflow-hidden, and at the narrow end of lg a card above a pin in
          the upper half would be clipped by a few pixels rather than simply
          overhanging the map's edge. At lg and up the strip and the stacked
          card are both hidden, so this wrapper is exactly the plate's box and
          the percentages still line up with the pins.

          lg and up only: at md the map box is ~390px tall against a ~250px
          card, which leaves nowhere for it to sit. Below lg it drops
          underneath the map instead. */}
      <div
        className="pointer-events-none absolute z-30 hidden w-[19rem] lg:block xl:w-[21rem]"
        style={{
          left: `${currentPos.x}%`,
          top: `${currentPos.y}%`,
          transform: `translate(-50%, ${below ? "0" : "-100%"}) translateY(${
            below ? "1.75rem" : "-1.75rem"
          })`,
        }}
      >
        <span
          aria-hidden="true"
          className={`absolute left-1/2 h-7 w-px bg-brass-deep ${
            below ? "bottom-full" : "top-full"
          }`}
        />
        <Readout community={current} className="pointer-events-auto" />
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

      {/* Under lg the card can't sit on the map, so it sits beneath it. */}
      <Readout community={current} className="mt-5 lg:hidden" />
    </div>
  );
}
