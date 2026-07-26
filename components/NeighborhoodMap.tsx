"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities, formatCoords, stations } from "@/lib/site";
import type { Community } from "@/lib/site";

const MAP_SRC = "/neighborhood-map-3d.webp";

/**
 * An illustrated relief map, one modelled landmark per town, each with its name
 * set into the artwork.
 *
 * Note why the geometry changed when this replaced the previous asset. That one
 * was a Google render — Web Mercator — so every pin could be projected from
 * real lat/lon against four solved corner coordinates. This map is an artistic
 * projection: tilted, relief-shaded, composed rather than surveyed. No set of
 * corners describes it; Fort Worth's label sits at 94.7% down here against
 * 84.8% on the Mercator render.
 *
 * So positions are measured off the artwork instead, in the asset's own pixels,
 * using the names set into the map as the anchor. The lat/lon in lib/site.ts
 * stay real and still drive the coordinate readout — they just no longer place
 * the markers.
 */
const MAP_W = 1672;
const MAP_H = 941;

/**
 * The box around each town's landmark, in asset pixels, stopping short of the
 * name printed beneath it — the building lifts, its label stays set in the map.
 *
 * Each box keeps a margin of flat ground above the landmark. That margin is
 * what the feather below needs to fade out over: a box cropped tight to a
 * water tower or a skyline leaves the mask semi-transparent exactly where the
 * building is, and the copy then ghosts against the original beneath it.
 *
 * Fort Worth is the skyline only. Its box deliberately excludes the stockyards
 * sign (which runs to x535) and clears Saginaw's label (which bottoms out at
 * y600) — both were being dragged into the lift and doubled.
 */
const LANDMARKS: Record<string, [number, number, number, number]> = {
  "Fort Worth": [585, 625, 880, 860],
  Saginaw: [465, 448, 725, 572],
  Haslet: [565, 90, 780, 240],
  Roanoke: [915, 8, 1185, 165],
  Keller: [805, 285, 980, 452],
  Southlake: [1055, 195, 1295, 352],
  Grapevine: [1340, 248, 1565, 392],
  "North Richland Hills": [1030, 552, 1305, 732],
};

/**
 * Feathers the lifted crop into the sheet, so what rises reads as the landmark
 * rather than as a rectangle of terrain peeling up. Opaque across the middle —
 * where the building is — and fading only in the outer rim.
 */
const FEATHER =
  "radial-gradient(ellipse 70% 74% at 50% 56%, #000 66%, rgba(0,0,0,0) 96%)";

function landmarkBox(name: string) {
  const b = LANDMARKS[name];
  if (!b) return null;
  const [x0, y0, x1, y1] = b;
  return {
    left: (x0 / MAP_W) * 100,
    top: (y0 / MAP_H) * 100,
    width: ((x1 - x0) / MAP_W) * 100,
    height: ((y1 - y0) / MAP_H) * 100,
  };
}

/**
 * Sizes the map inside a crop window so the window shows exactly its landmark:
 * the image is blown up to the full map's size relative to the window, then
 * pushed back by the window's own offset. All in percentages, so the crop stays
 * registered to the artwork at every viewport width.
 */
function croppedMapStyle(box: NonNullable<ReturnType<typeof landmarkBox>>) {
  return {
    width: `${(100 / box.width) * 100}%`,
    height: `${(100 / box.height) * 100}%`,
    left: `${-(box.left / box.width) * 100}%`,
    top: `${-(box.top / box.height) * 100}%`,
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
  // Two pieces of state, not one. `active` is what the panel reads, and it
  // keeps its last town after the cursor leaves so the panel never empties.
  // `lifted` is what is currently raised off the sheet, and starts at nothing —
  // otherwise the map would load already blurred behind a raised building.
  const [active, setActive] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);
  const currentTown = communities[active];

  const select = (i: number) => {
    setActive(i);
    setLifted(i);
  };

  return (
    <div className="relative">
      <div
        className="plate aspect-[1672/941] w-full"
        onMouseLeave={() => setLifted(null)}
      >
        {/* The sheet falls out of focus while a landmark is raised, so the eye
            goes to the building rather than the terrain. Scaled up a touch at
            the same time: blurring samples past the image's own edges, and
            without the overscan you get a soft grey rim inside the plate. */}
        <Image
          src={MAP_SRC}
          alt="Illustrated relief map of the Fort Worth area, showing a landmark for each of the eight communities Ritchey Realty serves"
          fill
          loading="lazy"
          sizes="(max-width: 1024px) 100vw, 66vw"
          className={`object-cover transition-[filter,transform] duration-300 ease-out ${
            lifted !== null
              ? "scale-[1.02] blur-[2.5px] brightness-[0.98]"
              : "scale-100 blur-0"
          }`}
        />

        {communities.map((c, i) => {
          const box = landmarkBox(c.name);
          if (!box) return null;
          const isLifted = lifted === i;
          // While one landmark is raised the rest are taken out entirely, so
          // the blurred sheet shows through where they were. Left in place they
          // would sit sharp against a defocused map and give the trick away.
          const dimmed = lifted !== null && !isLifted;
          return (
            <button
              key={c.name}
              type="button"
              // Hover on desktop, tap on mobile — a tap fires mouseenter too,
              // so both routes land on the same handler. Focus keeps it
              // reachable from the keyboard.
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={() => select(i)}
              aria-label={`${c.name}: ${c.blurb}`}
              aria-pressed={active === i}
              className="group absolute cursor-pointer [perspective:900px]"
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                zIndex: isLifted ? 20 : 10,
              }}
            >
              {/* The cast shadow, growing as the landmark rises. A real element
                  rather than a drop-shadow filter: filters paint before masks,
                  so a filtered shadow would be clipped by the very feather that
                  shapes the crop above it. */}
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-1/2 h-[16%] w-[68%] -translate-x-1/2 rounded-[50%] bg-ink blur-[10px] transition-all duration-300 ease-out ${
                  isLifted
                    ? "translate-y-[35%] scale-100 opacity-50"
                    : "translate-y-[10%] scale-75 opacity-0"
                }`}
              />

              {/* The landmark: the same map file, cropped to this one building
                  and laid exactly over it. At rest it is pixel-for-pixel what
                  is underneath, so it cannot be seen; raised, it tilts up off
                  the sheet it was cut from. */}
              <span
                aria-hidden="true"
                className={`absolute inset-0 origin-bottom overflow-hidden transition-[transform,opacity] duration-300 ease-out ${
                  isLifted
                    ? "will-change-transform [transform:translateY(-3%)_rotateX(-6deg)_rotateY(2.5deg)_scale(1.07)]"
                    : "[transform:none]"
                } ${dimmed ? "opacity-0" : "opacity-100"}`}
                style={{ WebkitMaskImage: FEATHER, maskImage: FEATHER }}
              >
                {/* Same URL as the plate behind it: one request, one decode. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={MAP_SRC}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute max-w-none"
                  style={croppedMapStyle(box)}
                />
              </span>

              {/* A survey mark at the foot of the landmark: the affordance at
                  rest, and the point the building appears to lift away from. */}
              <span
                aria-hidden="true"
                className={`absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rounded-full border-2 border-brass-deep transition-all duration-300 ease-out ${
                  isLifted
                    ? "h-3.5 w-3.5 bg-brass"
                    : "h-2.5 w-2.5 bg-limestone-pale/90 group-hover:h-3.5 group-hover:w-3.5 group-hover:bg-brass"
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
