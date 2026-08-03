"use client";

import { useEffect, useRef, useState } from "react";
import type { Stat } from "@/lib/fortWorth";

const STEP = 70; // ms between marks

/**
 * A market read, hung from the same datum the range line uses.
 *
 * This is CredentialLine's device pointed at a different subject: one ink band,
 * one hairline rule across the top, and brass ticks dropping from it in a
 * left-to-right cascade. Four marks instead of six, and each carries a third
 * line — which way the figure is moving — because a median with no direction of
 * travel is a number nobody can act on.
 *
 * It is not merged with CredentialLine. That component reads `credentials`
 * directly and prints two lines; generalising it to cover both would mean an
 * optional field, a props-vs-import branch, and a component that describes
 * neither job clearly. Two small components, each obvious, beat one that has to
 * be read twice.
 *
 * One observer for the row and stagger by transition-delay, so the browser
 * animates four transforms rather than running four observers. The hidden state
 * rides on `data-shown` so the CSS can scope it to html[data-js]: a bundle that
 * never hydrates leaves four legible figures rather than a blank ink band. See
 * the head script in app/layout.tsx.
 */
export function StatLine({ items }: { items: Stat[] }) {
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
        {/* Two up on a phone rather than a horizontal scroll. Four figures is
            few enough to fit as a 2x2 block, and a grid keeps all four on
            screen at once — the comparison between them is the content. */}
        <ol className="grid grid-cols-2 lg:grid-cols-4">
          {items.map((s, i) => (
            // No top padding — the tick is the first thing in the cell, so it
            // hangs from the datum rather than floating under it.
            <li key={s.detail} className="pb-12 pr-6 lg:pr-5">
              {/* Delays apply on the way in only. Staggering the exit as well
                  would turn scrolling past into its own performance. */}
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
                {/* The figure sets large enough to carry an ink band on its
                    own, as on the credential line — at caption size the band
                    reads as an empty stripe with writing in the top of it. */}
                <p className="display text-[2.25rem] leading-[1.05] text-limestone-pale sm:text-[2.75rem]">
                  {s.mark}
                </p>
                <p className="caption-on-ink mt-4 leading-[1.6]">{s.detail}</p>
                {/* Brass, not limestone: the direction of travel is the one
                    part of the cell that is a reading rather than a label. */}
                <p className="mt-2 font-mono text-[10px] leading-[1.6] text-brass-pale">
                  {s.note}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
