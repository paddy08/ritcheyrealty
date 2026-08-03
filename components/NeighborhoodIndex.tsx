"use client";

import { useState } from "react";
import Link from "next/link";
import type { Area } from "@/lib/fortWorth";

/**
 * The neighbourhood index: twelve places, filtered by part of town.
 *
 * A schedule, not a card wall. Every entry is a row hung between datum rules
 * with its name in the display face, what it is in the mono utility face, and
 * the read underneath — the same grammar the press list on /about and the
 * service deck use, because a listing sheet is what this site draws.
 *
 * Why rows rather than the cards the brief sketched: twelve cards is a wall of
 * boxes that all look alike, and the thing a buyer is actually doing here is
 * scanning names to find the two or three worth reading. A schedule is built
 * for scanning. It also means a neighbourhood with a price band and one without
 * sit in the same column without one of them looking broken.
 *
 * The filter is progressive: every row is in the static HTML and the buttons
 * only hide rows. With the bundle dead — the failure app/layout.tsx designs
 * around — all twelve stay on the page and only the filtering is lost. That
 * also means a crawler reads all twelve without executing anything.
 */
export function NeighborhoodIndex({ areas }: { areas: Area[] }) {
  // null is "all", which is the state the page loads in.
  const [only, setOnly] = useState<string | null>(null);

  const shown = only ? areas.filter((a) => a.id === only) : areas;
  const count = shown.reduce((n, a) => n + a.places.length, 0);
  const total = areas.reduce((n, a) => n + a.places.length, 0);

  return (
    <div>
      {/* The filter. Mono, square, and set on the rule — the site's buttons are
          matte and square everywhere else, so these are too. */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-3">
        <Chip active={only === null} onClick={() => setOnly(null)}>
          All of Fort Worth
        </Chip>
        {areas.map((a) => (
          <Chip
            key={a.id}
            active={only === a.id}
            onClick={() => setOnly(a.id)}
          >
            {a.name}
          </Chip>
        ))}
      </div>

      {/* Stated outright rather than left to be counted, the way the range line
          states its eight towns. `aria-live` because with the filter this
          number is the only feedback a screen reader gets that anything
          happened. */}
      <p aria-live="polite" className="mt-6 font-mono text-[11px] text-ink-muted">
        Showing {count} of {total}
      </p>

      <div className="mt-8">
        {shown.map((area) => (
          <section key={area.id} className="mt-12 first:mt-0">
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
              <h3 className="display-sm text-2xl text-ink">{area.name}</h3>
              <p className="label">{area.note}</p>
            </div>

            <ul className="mt-6 border-b border-ink/15">
              {area.places.map((p) => (
                // The whole row steps right under the pointer and its rule inks
                // up brass — the same cue the press list and the service deck
                // use, and it belongs to the row rather than to a link inside
                // it because the row is what you are reading.
                <li key={p.name} className="group border-t border-ink/15">
                  <div className="py-6 transition-transform duration-300 ease-out group-hover:translate-x-1.5 motion-reduce:group-hover:translate-x-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                      <h4 className="display-sm text-xl text-ink transition-colors duration-300 group-hover:text-brass-deep sm:text-[1.375rem]">
                        {p.name}
                      </h4>
                      {/* The band where one exists, the character where one
                          does not. Never both, and never an invented range —
                          see the note on `neighborhoods` in lib/fortWorth.ts. */}
                      <p className="font-mono text-[10px] uppercase tracking-widest text-ink-muted transition-colors duration-300 group-hover:text-brass-deep">
                        {p.band ?? p.tag}
                      </p>
                    </div>
                    <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                      {p.blurb}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <p className="mt-8 max-w-2xl font-mono text-[11px] leading-relaxed text-ink-muted">
        One price band is printed here because one is published. The rest carry
        what the neighbourhood is instead of a range we would be guessing at —{" "}
        <Link
          href="/contact"
          className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
        >
          ask for current numbers
        </Link>{" "}
        on any street here and you will get the real ones.
      </p>
    </div>
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
