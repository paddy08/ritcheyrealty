"use client";

import { useEffect, useRef, useState } from "react";
import type { services as Services } from "@/lib/site";

const STEP = 130; // ms between cards

/**
 * The three service cards, dealt out of the first one.
 *
 * They begin stacked on column one and slide into their own columns as the row
 * arrives — second, then third. The whole effect lives in CSS (see `.deal` in
 * globals.css); all this component does is decide when the row is on screen and
 * hand each card its position in the deal.
 *
 * One observer for the row, not one per card. The stagger is transition-delay,
 * which means the browser is animating three transforms rather than running
 * three observers and three pieces of state — the same arrangement AgentRoster
 * uses for the same reason.
 *
 * Delays apply on the way in only. Staggering the exit as well would make
 * scrolling back up its own little performance; this way the row resets at once
 * and the deal belongs to the entrance.
 *
 * The hidden state rides on `data-shown` so the CSS can scope it to
 * html[data-js] — a bundle that never hydrates leaves three plain, readable
 * cards in a row instead of two of them parked on top of the first. See the
 * head script in app/layout.tsx.
 */
export function ServiceDeck({ items }: { items: typeof Services }) {
  const [shown, setShown] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    if (!("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    // Stays subscribed rather than unobserving: the deal replays each time the
    // row comes back into view, which is what makes it feel like a scroll
    // behaviour rather than a one-off on first load.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setShown(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(node);

    // Once we have deliberately hidden the row, an observer that never fires
    // would strand it. Measure directly after the page settles.
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
    <div
      ref={rowRef}
      className="deck mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3"
    >
      {items.map((s, i) => (
        // Stacking order descends, so while they are still on top of one
        // another the first card is the one you see and the others read as
        // being underneath it rather than in front.
        <div
          key={s.n}
          data-deal={i}
          data-shown={shown ? "true" : "false"}
          style={{
            zIndex: items.length - i,
            transitionDelay: shown ? `${i * STEP}ms` : undefined,
          }}
          // The rule inks up under the pointer and the numeral comes with it —
          // the whole column is the target, so the cue belongs to the column
          // rather than to a link inside it.
          className="deal group relative"
        >
          <div className="h-px w-full bg-ink/15 transition-colors duration-300 group-hover:bg-brass-deep" />
          <p className="display mt-5 text-3xl leading-none text-ink/25 transition-colors duration-300 group-hover:text-brass-deep">
            {s.n}
          </p>
          <h3 className="display-sm mt-4 text-2xl text-ink">{s.title}</h3>
          <p className="mt-4 leading-relaxed text-ink-soft">{s.body}</p>
        </div>
      ))}
    </div>
  );
}
