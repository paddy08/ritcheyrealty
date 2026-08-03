"use client";

import { useEffect, useRef, useState } from "react";
import { credentials } from "@/lib/site";

const STEP = 70; // ms between marks

/**
 * The credential line — the range line's grammar doing a second job.
 *
 * Same ink band, same datum, same brass ticks hanging from it in a left-to-right
 * cascade. On the homepage that device projects eight towns onto one axis; here
 * it hangs six credentials off the same rule, so /about reads as the same
 * drawing as the page that sent you here rather than as a different site.
 *
 * What it deliberately is not is a timeline. Two of the six carry a year because
 * two of them have one on the record; the rest carry the issuing body. Spacing
 * is even and the order is roughly chronological where it can be, but no axis is
 * claimed — see the note on `credentials` in lib/site.ts.
 *
 * One observer for the whole row, stagger by transition-delay, and the hidden
 * state rides on `data-shown` so it is scoped to html[data-js] — a dead bundle
 * leaves six legible credentials rather than a blank ink band. Same contract as
 * AgentRoster, which this is modelled on.
 */
export function CredentialLine() {
  const [shown, setShown] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    // Stays subscribed: the cascade replays when the band comes back into view.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setShown(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);

    // An observer that never fires would strand a row we hid on purpose.
    const failsafe = window.setTimeout(() => {
      const box = node.getBoundingClientRect();
      if (box.bottom > 0 && box.top < (window.innerHeight || 0) && box.height > 0)
        setShown(true);
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={rowRef} className="relative bg-ink text-limestone">
      <div className="datum-on-ink absolute inset-x-0 top-0" />
      <div className="container-edge">
        <ol className="no-scrollbar scroll-fade flex overflow-x-auto lg:grid lg:grid-cols-6 lg:overflow-visible">
          {credentials.map((c, i) => (
            // No top padding — the tick is the first thing in the cell, so it
            // hangs from the datum rather than floating under it.
            <li
              key={c.detail}
              className="min-w-[10.5rem] flex-none pb-14 pr-8 lg:min-w-0 lg:pr-5"
            >
              {/* Delays apply on the way in only. Staggering the exit too would
                  turn scrolling past into its own performance. */}
              <span
                aria-hidden="true"
                data-shown={shown ? "true" : "false"}
                style={shown ? { transitionDelay: `${i * STEP}ms` } : undefined}
                className="reveal-tick block h-9 w-px bg-brass"
              />
              <div
                data-shown={shown ? "true" : "false"}
                style={
                  shown ? { transitionDelay: `${i * STEP + 120}ms` } : undefined
                }
                className="reveal reveal-slow"
              >
                {/* The mark sets large enough to carry an ink band on its own —
                    at the range line's caption size the band read as an empty
                    stripe with writing in the top of it. It wraps rather than
                    stretching its cell: "Tom Ferry" is two words and every
                    station is one width. */}
                <p className="display mt-6 text-[2rem] leading-[1.05] text-limestone-pale sm:text-[2.25rem]">
                  {c.mark}
                </p>
                <p className="caption-on-ink mt-4 leading-[1.6]">{c.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        {/* Below lg only two marks are on screen at once. The count is stated
            outright so nobody has to scroll to discover there are six — the
            same fix the range line makes for its eight towns. */}
        <p className="caption-on-ink pb-6 lg:hidden">Six, on the record</p>
      </div>
    </div>
  );
}
