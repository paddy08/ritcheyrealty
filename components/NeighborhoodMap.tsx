"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities, formatCoords, stations } from "@/lib/site";
import type { Community } from "@/lib/site";

const MAP_SRC = "/neighborhood-map-3d.webp";
const MAP_W = 1672;
const MAP_H = 941;

/**
 * An illustrated relief map with a modelled landmark per town, each named in
 * the artwork. Taking a marker blurs the sheet and stands that town's model up
 * over it.
 *
 * Two things worth knowing about how this is put together.
 *
 * First, the geometry. The previous asset was a Google render — Web Mercator —
 * so pins were projected from real lat/lon against four solved corners. This
 * map is an artistic projection, tilted and composed rather than surveyed, and
 * no set of corners describes it: Fort Worth sits at 94.7% down here against
 * 84.8% on the Mercator render. Positions are measured off the artwork in its
 * own pixels, anchored on the names set into it. The lat/lon in lib/site.ts
 * stay real and still drive the coordinate readout.
 *
 * Second, the models. They are separate renders, not cut from this map — the
 * supplied Grapevine is an airport, Roanoke a church and fountain, and none of
 * them line up with what is printed. So this cannot be, and does not attempt
 * to be, the printed building peeling off the page. The model is deliberately
 * sized larger than the illustration beneath it and covers it outright, which
 * is what lets the mismatch read as intent rather than as a glitch.
 */
const LANDMARKS: Record<string, [number, number, number, number]> = {
  "Fort Worth": [365, 605, 890, 885],
  Saginaw: [455, 443, 735, 578],
  Haslet: [555, 85, 790, 250],
  Roanoke: [905, 5, 1195, 172],
  Keller: [795, 280, 990, 458],
  Southlake: [1045, 190, 1305, 358],
  Grapevine: [1330, 243, 1575, 398],
  "North Richland Hills": [1020, 547, 1315, 738],
};

const SPRITE: Record<string, string> = {
  "Fort Worth": "fort-worth",
  Saginaw: "saginaw",
  Haslet: "haslet",
  Roanoke: "roanoke",
  Keller: "keller",
  Southlake: "southlake",
  Grapevine: "grapevine",
  "North Richland Hills": "north-richland-hills",
};

/** How much wider than the printed landmark the model stands. Much under 1.4
 *  and the illustration underneath shows around its edges. */
const COVER = 1.55;

function landmarkBox(name: string) {
  const b = LANDMARKS[name];
  if (!b) return null;
  const [x0, y0, x1, y1] = b;
  return {
    left: (x0 / MAP_W) * 100,
    top: (y0 / MAP_H) * 100,
    width: ((x1 - x0) / MAP_W) * 100,
    height: ((y1 - y0) / MAP_H) * 100,
    centreX: (((x0 + x1) / 2) / MAP_W) * 100,
    bottom: (y1 / MAP_H) * 100,
  };
}

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
  // `active` is what the panel reads, and it keeps its last town after the
  // cursor leaves so the panel never empties. `lifted` is what is currently
  // standing, and starts at nothing — otherwise the map loads already blurred.
  const [active, setActive] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);
  const currentTown = communities[active];

  const select = (i: number) => {
    setActive(i);
    setLifted(i);
  };

  const liftedTown = lifted === null ? null : communities[lifted];
  const liftedBox = liftedTown ? landmarkBox(liftedTown.name) : null;
  const liftedSprite = liftedTown ? SPRITE[liftedTown.name] : null;

  return (
    <div className="relative">
      <div
        className="plate aspect-[1672/941] w-full"
        onMouseLeave={() => setLifted(null)}
      >
        {/* The sheet falls out of focus while a model is up, so the eye goes to
            the building. Scaled a touch at the same time: blur samples past the
            image's own edges, and without the overscan you get a soft rim
            inside the plate. */}
        <Image
          src={MAP_SRC}
          alt="Illustrated relief map of the Fort Worth area, showing a landmark for each of the eight communities Ritchey Realty serves"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className={`object-cover transition-[filter,transform] duration-300 ease-out ${
            lifted !== null
              ? "scale-[1.02] blur-[3px] brightness-[0.97]"
              : "scale-100 blur-0"
          }`}
        />

        {/* One model at a time, mounted only once taken — eight sprites come to
            537KB and none of that should be spent before it is asked for. */}
        {liftedTown && liftedBox && liftedSprite && (
          <div
            key={liftedSprite}
            className="pointer-events-none absolute z-20"
            style={{
              left: `${liftedBox.centreX}%`,
              top: `${liftedBox.bottom}%`,
              width: `${liftedBox.width * COVER}%`,
              transform: "translate(-50%, -88%)",
            }}
          >
            <span
              aria-hidden="true"
              className="animate-landmark absolute inset-x-[12%] bottom-[4%] h-[14%] rounded-[50%] bg-ink/45 blur-[10px]"
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/landmarks/${liftedSprite}.webp`}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="animate-landmark relative block w-full drop-shadow-[0_10px_18px_rgba(27,36,55,0.35)]"
            />
          </div>
        )}

        {communities.map((c, i) => {
          const box = landmarkBox(c.name);
          if (!box) return null;
          const isLifted = lifted === i;
          return (
            <button
              key={c.name}
              type="button"
              // Hover on desktop, tap on mobile — a tap fires mouseenter too,
              // so both land on the same handler. Focus keeps it reachable
              // from the keyboard.
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              aria-label={`${c.name}: ${c.blurb}`}
              aria-pressed={active === i}
              className="group absolute cursor-pointer"
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                // The standing model owns the space; its own marker drops
                // behind it rather than sitting on top of the roof.
                zIndex: isLifted ? 10 : 15,
              }}
            >
              {/* A survey mark at the foot of the landmark: the affordance at
                  rest, and the point the model stands up from. */}
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-brass-deep transition-all duration-300 ease-out ${
                  isLifted
                    ? "h-3.5 w-3.5 bg-brass opacity-0"
                    : "h-2.5 w-2.5 bg-limestone-pale/90 opacity-100 group-hover:h-3.5 group-hover:w-3.5 group-hover:bg-brass"
                }`}
              />
            </button>
          );
        })}

        {/* The reading, top-left — the one corner of this map with no town in
            it, so the panel covers terrain rather than anything worth seeing. */}
        <div className="absolute left-4 top-4 z-30 hidden w-[17rem] md:block lg:left-6 lg:top-6 xl:w-[19rem]">
          <Readout community={currentTown} />
        </div>
      </div>

      {/* Below md the landmarks are too small to tap accurately, so the same
          eight towns get a thumb-sized strip. Same order as the range line. */}
      <ol className="no-scrollbar scroll-fade mt-4 flex gap-6 overflow-x-auto md:hidden">
        {stations.map((c) => {
          const i = communities.indexOf(c);
          const isActive = i === active;
          return (
            <li key={c.name} className="flex-none">
              <button
                type="button"
                onClick={() => select(i)}
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

      {/* Under md the panel can't sit on the map, so it sits beneath it. */}
      <Readout community={currentTown} className="mt-5 md:hidden" />
    </div>
  );
}
