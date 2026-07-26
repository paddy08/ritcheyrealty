"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ListingCard } from "@/components/ListingCard";
import type { Listing } from "@/lib/site";

const GAP = 24; // matches gap-6 on the rail
const HOLD = 3000; // ms a listing spends in the colour slot
const MOVE = 650; // ms the two survivors take to step left
const FADE = 420; // ms the leaving and arriving plates take

/**
 * The listings rail. Four properties, three on screen, rotating.
 *
 * The step is a vanish-and-shift, not a slide: the leading plate fades out
 * where it stands, the two behind it move up one slot, and the fourth fades in
 * at the back. Nothing is ever dragged across the edge of the rail, so no
 * half-cut plate is ever on screen.
 *
 * Only the leading plate holds colour — the two behind sit in greyscale — so a
 * moving row still has one place for the eye to land, and colour arriving is
 * what signals the step.
 */
export function FeaturedListings({ listings }: { listings: Listing[] }) {
  const n = listings.length;
  const [pos, setPos] = useState(0);
  const [visible, setVisible] = useState(3);
  const [paused, setPaused] = useState(false);

  // How many slots the rail is showing, so the off-stage slot is correct at
  // every breakpoint.
  useEffect(() => {
    const lg = window.matchMedia("(min-width: 1024px)");
    const sm = window.matchMedia("(min-width: 640px)");
    const sync = () => setVisible(lg.matches ? 3 : sm.matches ? 2 : 1);
    sync();
    lg.addEventListener("change", sync);
    sm.addEventListener("change", sync);
    return () => {
      lg.removeEventListener("change", sync);
      sm.removeEventListener("change", sync);
    };
  }, []);

  // Paused on hover and focus so the photo-scrub stays usable, and switched
  // off entirely for reduced motion.
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = window.setTimeout(() => setPos((v) => (v + 1) % n), HOLD);
    return () => window.clearTimeout(t);
  }, [pos, paused, n]);

  return (
    <section className="container-edge py-20 md:py-28">
      <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-xl">
          <p className="label">On the market</p>
          <h2 className="display mt-4 text-4xl text-ink sm:text-5xl">
            Homes worth a drive-by
          </h2>
        </div>
        <Link
          href="/search"
          className="font-mono text-[12px] uppercase tracking-widest text-ink transition-colors hover:text-brass-deep"
        >
          All listings &rarr;
        </Link>
      </div>

      {/* Every plate is stacked into the first cell of the grid, so each one is
          exactly one slot wide and the grid gives the rail its height. Slots
          are then reached by translating — no measurement needed. */}
      <div
        className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {listings.map((listing, i) => {
          const slot = (i - pos + n) % n;
          const onStage = slot < visible;

          // A plate only travels between slots it can be seen in. The one
          // leaving fades out where it stands, and the one arriving is placed
          // at the back slot while still transparent — both jumps happen under
          // an opacity of 0, so neither is ever seen crossing the rail.
          const travels = onStage && slot < visible - 1;
          const x = onStage ? slot : 0;

          return (
            <div
              key={listing.id}
              className="[grid-area:1/1]"
              aria-hidden={!onStage}
              style={{
                transform: `translateX(calc(${x * 100}% + ${x * GAP}px))`,
                opacity: onStage ? 1 : 0,
                pointerEvents: onStage ? "auto" : "none",
                transition: [
                  `opacity ${FADE}ms ease`,
                  travels
                    ? `transform ${MOVE}ms cubic-bezier(0.65, 0, 0.35, 1)`
                    : "",
                ]
                  .filter(Boolean)
                  .join(", "),
              }}
            >
              <ListingCard
                listing={listing}
                priority={i === 0}
                muted={slot !== 0}
                focusable={onStage}
              />
            </div>
          );
        })}
      </div>

      <p className="mt-8 font-mono text-[11px] text-ink-muted">
        Sample listings shown for demonstration — fictional properties and
        pricing.
      </p>
    </section>
  );
}
