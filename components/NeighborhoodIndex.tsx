"use client";

import { useState } from "react";
import Link from "next/link";
import type { Neighborhood } from "@/lib/fortWorth";

/**
 * Six neighbourhoods, filtered by part of town.
 *
 * A schedule, not a card wall. Each entry is a row hung between datum rules
 * with its name in the display face, the three facts a buyer sorts on set as a
 * mono readout beside it, and the read underneath — the same grammar the press
 * list on /about and the service deck use, because a listing sheet is what this
 * site draws.
 *
 * The readout is the point of the row. Price, district and drive time are the
 * three things every one of these has an answer for, so they sit in a fixed
 * order on every row and can be compared down the column rather than hunted for
 * in prose.
 *
 * The filter is progressive: every row is in the static HTML and the buttons
 * only hide rows. With the bundle dead — the failure app/layout.tsx designs
 * around — all six stay on the page and only the filtering is lost. That also
 * means a crawler reads all six without executing anything.
 */
export function NeighborhoodIndex({ items }: { items: Neighborhood[] }) {
  // null is "all", which is the state the page loads in.
  const [only, setOnly] = useState<string | null>(null);
  // How many times the filter has been used. Zero on load, which is what keeps
  // the rows from playing their own entrance on top of the Reveal the whole
  // block already sits in — the deal below belongs to the filter, not to the
  // page arriving. It also re-keys the list, which is what makes the animation
  // run again on a set of rows React would otherwise reuse in place.
  const [pass, setPass] = useState(0);

  const pick = (side: string | null) => {
    setOnly(side);
    setPass((n) => n + 1);
  };

  // Derived from the data, in the order the data gives them, so adding a
  // seventh neighbourhood on a new side of town adds its button too.
  const sides = [...new Set(items.map((n) => n.side))];
  const shown = only ? items.filter((n) => n.side === only) : items;

  return (
    <div>
      {/* Mono, square, and set on the rule — the site's buttons are matte and
          square everywhere else, so these are too. */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <Chip active={only === null} onClick={() => pick(null)}>
          All of Fort Worth
        </Chip>
        {sides.map((side) => (
          <Chip key={side} active={only === side} onClick={() => pick(side)}>
            {side}
          </Chip>
        ))}
      </div>

      {/* Stated outright rather than left to be counted, the way the range line
          states its eight towns. `aria-live` because with the filter this
          number is the only feedback a screen reader gets that anything
          happened. */}
      <p aria-live="polite" className="mt-6 font-mono text-[11px] text-ink-muted">
        Showing {shown.length} of {items.length}
      </p>

      <ul key={pass} className="mt-8 border-b border-ink/15">
        {shown.map((n, i) => (
          // The whole row steps right under the pointer and its rule inks up
          // brass — the same cue the press list and the service deck use, and
          // it belongs to the row rather than to a link inside it because the
          // row is what you are reading.
          <li
            key={n.name}
            className={`group border-t border-ink/15 ${pass ? "row-in" : ""}`}
            style={pass ? { animationDelay: `${i * 60}ms` } : undefined}
          >
            <div className="py-6 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0">
              <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2">
                <h3 className="display-sm text-xl text-ink transition-colors duration-300 group-hover:text-brass-deep sm:text-[1.375rem]">
                  {n.name}
                </h3>
                {/* Price, district, drive — always in that order, and the
                    separators are decorative so a screen reader reads three
                    facts rather than a string of interpuncts. */}
                <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted transition-colors duration-300 group-hover:text-brass-deep">
                  {n.band}
                  {n.district && (
                    <>
                      <Dot />
                      {n.district}
                    </>
                  )}
                  <Dot />~{n.drive} min downtown
                </p>
              </div>
              <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                {n.blurb}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-8 max-w-2xl font-mono text-[11px] leading-relaxed text-ink-muted">
        Bands are stated the way the sources state them — two as ranges, two as
        positions — rather than rounded into a tidy column we would be guessing
        at.{" "}
        <Link
          href="/contact"
          className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
        >
          Ask for current numbers
        </Link>{" "}
        on any street here and you will get the real ones.
      </p>
    </div>
  );
}

/** The separator between readout facts. Decorative, so it is hidden. */
function Dot() {
  return (
    <span aria-hidden="true" className="mx-2 text-ink-muted/50">
      ·
    </span>
  );
}

/** One filter button. Square, mono, and ruled — never a pill. */
function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`btn px-4 py-2 text-[11px] ${
        active
          ? "bg-ink text-limestone-pale"
          : "border border-ink/25 text-ink-soft hover:border-ink hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
