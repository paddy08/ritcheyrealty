"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

/**
 * The pop-out: one town, taken off the map and read properly.
 *
 * Hovering stands a model up in place, which is a glance. Clicking is a
 * decision, so it gets the full stop — the sheet goes out of focus behind a
 * scrim, the model comes up to the middle at a size you can actually look at,
 * and the town's writing sits directly under it ending in the button that
 * leaves. The model overlaps the top edge of the card rather than sitting in a
 * separate box above it, so the two read as one object.
 *
 * It covers the map block, not the viewport — deliberately. This is the map's
 * own gesture, not a site-wide modal, and scoping it here means one rule covers
 * both layouts: from md the block is exactly the plate, and below md it also
 * takes in the town strip and the card under the sheet, which is the room the
 * pop-out needs on a phone (the plate alone is a ~190px band there, too short
 * to hold a model and a paragraph).
 *
 * Note it must not use `position: fixed` to try for the viewport: Reveal wraps
 * this section in a permanent `translate-y-0`, and a transformed ancestor
 * becomes the containing block for fixed children. It would silently resolve to
 * this same box anyway — better to say so than to appear to ask for more.
 */
function PopOut({
  community,
  sprite,
  onClose,
}: {
  community: Community;
  sprite: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // preventScroll: focusing normally scrolls the element into view, which
    // would trip the scroll dismissal below the instant it mounts.
    closeRef.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Scrolling away dismisses it. The overlay is anchored to the map block,
    // so without this a phone user who flicks the page ends up with a blurred,
    // scrim-covered slab and a half-cut card trailing off the top of the
    // screen. The threshold keeps an incidental wobble — or the address bar
    // collapsing on iOS — from closing it out from under a deliberate tap.
    const from = window.scrollY;
    const onScroll = () => {
      if (Math.abs(window.scrollY - from) > 80) onClose();
    };

    document.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScroll);
    };
  }, [onClose]);

  return (
    <div className="absolute inset-0 z-50">
      {/* The scrim carries the blur itself rather than leaning on the map's own,
          so the sheet falls back by the same amount over the strip and the card
          below it as over the plate. Clicking it closes. */}
      <button
        type="button"
        aria-label={`Close ${community.name}`}
        onClick={onClose}
        className="absolute inset-0 w-full cursor-default bg-ink/45 backdrop-blur-[6px] motion-safe:animate-[fade-in_220ms_ease-out]"
      />

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-y-auto p-5">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`popout-${sprite}`}
          className="pointer-events-auto relative flex w-full max-w-[19rem] flex-col items-center motion-safe:animate-[pop-in_320ms_cubic-bezier(0.2,0.9,0.3,1.2)] md:max-w-[21rem]"
        >
          {/* Anchored to the dialog, not to the overlay's corner. The overlay
              spans the whole map block, whose top edge sits under the sticky
              header once the block is scrolled past it — which hid this button
              outright on a phone. The dialog is always centred in view, and the
              model is narrower than it, so this corner is both visible and
              clear of the artwork. */}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={`Close ${community.name}`}
            className="absolute right-0 top-0 z-10 flex h-9 w-9 items-center justify-center rounded-[3px] border border-limestone/25 bg-ink/55 text-limestone-pale outline-none transition-colors hover:bg-ink hover:text-brass-pale focus-visible:ring-2 focus-visible:ring-brass-pale"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
          </button>

          {/* The model overlaps the card's top edge rather than sitting in a
              box above it, so the two read as one object lifted off the map. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/landmarks/${sprite}.webp`}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="pointer-events-none w-[68%] max-w-[13rem] drop-shadow-[0_14px_22px_rgba(27,36,55,0.45)] md:max-w-[17rem]"
          />

          <div className="relative -mt-4 w-full rounded-[3px] border border-ink/15 bg-limestone-pale p-6 text-center shadow-[0_18px_40px_rgba(27,36,55,0.3)]">
            <p className="font-mono text-[11px] tracking-wide text-brass-deep">
              {formatCoords(community)}
            </p>
            <h3
              id={`popout-${sprite}`}
              className="display mt-2.5 text-3xl text-ink"
            >
              {community.name}
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {community.blurb}
            </p>
            <Link href="/communities" className="btn-solid mt-6 w-full">
              Explore {community.name}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export function NeighborhoodMap() {
  // Three pieces of state, because hovering and clicking mean different things.
  // `active` is what the resting panel reads, and it keeps its last town after
  // the cursor leaves so the panel never empties. `lifted` is what is standing
  // on the map, and starts at nothing — otherwise the map loads already
  // blurred. `opened` is the town taken off the map into the pop-out.
  const [active, setActive] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);
  const [opened, setOpened] = useState<number | null>(null);
  const currentTown = communities[active];

  // Where focus goes back to when the pop-out closes, so a keyboard user is
  // returned to the marker they opened rather than to the top of the document.
  const openerRef = useRef<HTMLElement | null>(null);

  const select = (i: number) => {
    setActive(i);
    setLifted(i);
  };

  const open = (i: number, opener: HTMLElement | null) => {
    openerRef.current = opener;
    setActive(i);
    setLifted(null);
    setOpened(i);
  };

  const close = useCallback(() => {
    setOpened(null);
    const opener = openerRef.current;
    openerRef.current = null;
    opener?.focus({ preventScroll: true });
    // Restoring focus fires that marker's onFocus, which stands its model back
    // up. With a mouse the next mouseleave takes it down again — on touch there
    // is no mouseleave, so the sheet stayed blurred with a model up for good.
    // Clearing after the focus call (React batches both, last write wins) fixes
    // it without suppressing onFocus, so keyboard focus still lifts normally.
    setLifted(null);
  }, []);

  const liftedTown = lifted === null ? null : communities[lifted];
  const liftedBox = liftedTown ? landmarkBox(liftedTown.name) : null;
  const liftedSprite = liftedTown ? SPRITE[liftedTown.name] : null;
  const openedTown = opened === null ? null : communities[opened];

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
            lifted !== null || opened !== null
              ? "scale-[1.02] blur-[3px] brightness-[0.97]"
              : "scale-100 blur-0"
          }`}
        />

        {/* One model at a time, mounted only once taken — eight sprites come to
            537KB and none of that should be spent before it is asked for.
            Suppressed while the pop-out is up: that model is already standing
            in the middle of the plate, and a second copy of it on the sheet
            behind the scrim reads as a duplicate. */}
        {opened === null && liftedTown && liftedBox && liftedSprite && (
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
              // Hover stands the model up in place; the click is what opens
              // the town. Focus mirrors hover so the map is still readable
              // from the keyboard, and Enter then opens it like a click.
              onMouseEnter={() => select(i)}
              onFocus={() => select(i)}
              onClick={(e) => open(i, e.currentTarget)}
              aria-label={`Open ${c.name}: ${c.blurb}`}
              aria-haspopup="dialog"
              aria-expanded={opened === i}
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
            it, so the panel covers terrain rather than anything worth seeing.
            It steps aside for the pop-out, which is the same information said
            louder; both at once would be the page repeating itself. */}
        <div
          className={`absolute left-4 top-4 z-30 hidden w-[17rem] transition-opacity duration-200 md:block lg:left-6 lg:top-6 xl:w-[19rem] ${
            opened !== null ? "opacity-0" : "opacity-100"
          }`}
          aria-hidden={opened !== null}
        >
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
                // Below md the markers on the sheet are too small to hit, so
                // this strip is the only way in — it opens the town outright
                // rather than only updating the card underneath.
                onClick={(e) => open(i, e.currentTarget)}
                aria-haspopup="dialog"
                aria-expanded={opened === i}
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

      {/* Last, and a sibling of the plate rather than a child of it: the plate
          clips its overflow, and from md the pop-out is exactly the plate
          anyway. Keyed by town so opening a second one re-runs the animation
          instead of swapping the contents of a card already on screen. */}
      {openedTown && (
        <PopOut
          key={openedTown.name}
          community={openedTown}
          sprite={SPRITE[openedTown.name]}
          onClose={close}
        />
      )}
    </div>
  );
}
