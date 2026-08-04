"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { communities, communityHref, formatCoords, stations } from "@/lib/site";
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
 * It covers the viewport. It used to cover the map block instead, which worked
 * only because the block happened to be tall enough: below md it took in the
 * town strip and the resting card under the sheet. With that card gone the
 * block is the plate plus the strip — around 280px on a phone — and a model and
 * a paragraph do not fit in it. Sizing a dialog off whatever happens to sit
 * under the map was the fragile part, and this is the fix for it, not a
 * workaround: the room a modal needs is the screen's to give.
 *
 * `position: fixed` is safe here. A transformed ancestor would capture it, and
 * Reveal does transform this section — but only while `data-shown="false"`, and
 * this Reveal does not repeat, so by the time there is anything to open the
 * transform is gone for good and fixed resolves to the viewport.
 *
 * z-[55] puts it over the fixed header (z-50) and under the message dock
 * (z-[60]), which is the order MessageWidget already documents.
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

    // Scrolling away dismisses it — a flick is how you back out of this on a
    // phone, and it costs nothing to honour. The threshold keeps an incidental
    // wobble, or the address bar collapsing on iOS, from closing it out from
    // under a deliberate tap.
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
    <div className="fixed inset-0 z-[55]">
      {/* The scrim carries the blur itself rather than leaning on the map's own,
          so the whole page falls back by the same amount rather than only the
          plate. Clicking it closes. */}
      <button
        type="button"
        aria-label={`Close ${community.name}`}
        onClick={onClose}
        className="absolute inset-0 w-full cursor-default bg-ink/45 backdrop-blur-[6px] motion-safe:animate-[fade-in_220ms_ease-out]"
      />

      {/* `m-auto` on the child rather than `items-center` on the parent. They
          centre identically when there is room, but a centred flex item taller
          than its container overflows equally past both ends and the top half
          cannot be scrolled back to — auto margins collapse instead of going
          negative, so the dialog stays reachable at any height. */}
      <div className="pointer-events-none absolute inset-0 flex justify-center overflow-y-auto p-5">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`popout-${sprite}`}
          // Sized off the model, not the paragraph. The sprites are wide and
          // short — 1.12 to 2.24 — so a card-width figure came out a strip.
          // The dialog is the model's width and the card sits narrower inside
          // it, which is what makes the building the thing you look at.
          className="pointer-events-auto relative m-auto flex w-full max-w-[23rem] flex-col items-center motion-safe:animate-[pop-in_320ms_cubic-bezier(0.2,0.9,0.3,1.2)] sm:max-w-[25rem] md:max-w-[29rem] lg:max-w-[33rem]"
        >
          {/* Anchored to the dialog, not to the overlay's corner, so it travels
              with the card instead of parking in a screen corner away from it.
              It sits over the model's top corner, which is why it carries its
              own solid chip rather than relying on contrast against whatever is
              behind it. */}
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
              box above it, so the two read as one object lifted off the map —
              and it runs wider than the card, which is what keeps it reading as
              the object the card is captioning.

              Just short of the dialog's full width, leaving the top-right
              corner for the close button. The height cap is what stops the near
              square sprites — Keller at 1.12 — from standing so tall on a phone
              that they push the paragraph off the bottom; it is in `vh` because
              the overlay is the viewport now, so the two agree. `object-contain`
              pillarboxes rather than stretching, and since the box is always
              wider than the sprite's aspect the letterboxing is only ever
              horizontal — a capped model still sits flush on the card's top
              edge, exactly like an uncapped one. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/landmarks/${sprite}.webp`}
            alt=""
            aria-hidden="true"
            decoding="async"
            className="pointer-events-none w-[94%] max-h-[38vh] object-contain drop-shadow-[0_14px_22px_rgba(27,36,55,0.45)] md:max-h-[46vh]"
          />

          <div className="relative -mt-5 w-[84%] rounded-[3px] border border-ink/15 bg-limestone-pale p-6 text-center shadow-[0_18px_40px_rgba(27,36,55,0.3)] md:-mt-6 md:p-7">
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
            <Link
              href={communityHref(community.name)}
              className="btn-solid mt-6 w-full"
            >
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
  // `active` is the last town touched, and all it drives now is which tick is
  // inked in the phone strip — it survives the cursor leaving, so the strip
  // remembers where you were. `lifted` is what is standing on the map, and
  // starts at nothing — otherwise the map loads already blurred. `opened` is
  // the town taken off the map into the pop-out, which is the only place the
  // writing appears at all.
  const [active, setActive] = useState(0);
  const [lifted, setLifted] = useState<number | null>(null);
  const [opened, setOpened] = useState<number | null>(null);

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
              // No mark at rest. The artwork already names and draws every town,
              // so a printed dot on top of it was decoration the map didn't need
              // — and at phone widths eight of them read as specks of dirt on the
              // sheet. The affordance is the model standing up on hover, and the
              // focus ring for anyone arriving by keyboard.
              className="group absolute cursor-pointer rounded-[3px] outline-none focus-visible:ring-2 focus-visible:ring-brass-pale"
              style={{
                left: `${box.left}%`,
                top: `${box.top}%`,
                width: `${box.width}%`,
                height: `${box.height}%`,
                // The standing model owns the space; its own hit area drops
                // behind it rather than sitting on top of the roof.
                zIndex: isLifted ? 10 : 15,
              }}
            />
          );
        })}

        {/* Nothing is printed over the sheet. The panel that used to sit in this
            corner said, quietly, what the pop-out says properly a click later —
            and it covered a corner of artwork to do it. Hovering now only stands
            the model up; the reading is the reward for taking a town. */}
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
                // Below md the hit areas on the sheet are too small to tap
                // reliably, so this strip is the dependable way in. It opens
                // the pop-out outright, which is where the writing lives.
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

      {/* Last, and a sibling of the plate rather than a child of it — the plate
          clips its overflow. It is fixed to the viewport, so where it sits in
          this tree is only a question of what clips it. Keyed by town so opening
          a second one re-runs the animation instead of swapping the contents of
          a card already on screen. */}
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
