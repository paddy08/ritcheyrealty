"use client";

import { Children, useEffect, useRef, useState } from "react";

const STEP = 90; // ms between agents

/**
 * The agents hung from a datum.
 *
 * As the row comes into view a brass tick drops from the rule above each card
 * in turn, left to right, and the card fades up beneath it. It is the range
 * line's own device doing a second job: the same rule, the same tick, the same
 * left-to-right stagger — so the foot of the page answers the head of it, and
 * the six read as one set rather than five separate cards.
 *
 * One observer for the whole row; the stagger is pure transition-delay.
 *
 * Takes already-rendered cards rather than a render prop — this is a client
 * component and the caller is a server one, and a function can't cross that
 * boundary. Rendered nodes can.
 */
export function AgentRoster({ children }: { children: React.ReactNode }) {
  const cards = Children.toArray(children);
  const [shown, setShown] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = rowRef.current;
    if (!node) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || !("IntersectionObserver" in window)) {
      setShown(true);
      return;
    }

    // Stays subscribed rather than unobserving, so the cascade replays every
    // time the row comes back into view instead of firing once per page load.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) setShown(entry.isIntersecting);
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rowRef}>
      <div className="datum" />
      {/* Below sm, a wrapping grid wraps 5 cards into an uneven 2-2-1 stack,
          which reads as a hierarchy (like a leader on their own row) rather
          than the flat, no-hierarchy line this is meant to be. A single
          horizontally-scrolling row keeps everyone on the same line, same
          pattern the range line above uses for the eight towns. */}
      <ul className="no-scrollbar scroll-fade flex gap-6 overflow-x-auto sm:grid sm:grid-cols-3 sm:gap-x-6 sm:gap-y-10 sm:overflow-visible lg:grid-cols-5">
        {cards.map((card, i) => (
          // No top padding: the tick is the first thing in the cell so it
          // hangs from the datum rather than floating below it.
          // Fixed width, not a min-width: flex-none sizes to content, so a
          // longer role line ("Marketing & Events Director") stretched that
          // one card — and its portrait with it — wider than the rest. The
          // text wraps now instead; every plate is the same size.
          <li key={i} className="w-[9.5rem] flex-none sm:w-auto sm:min-w-0">
            {/* Delays apply on the way in only. Staggering the exit as well
                would make scrolling away its own little performance; this way
                the row resets at once and the cascade belongs to the entrance. */}
            <span
              aria-hidden="true"
              style={shown ? { transitionDelay: `${i * STEP}ms` } : undefined}
              className={`block h-7 w-px origin-top bg-brass-deep transition-transform duration-500 ease-out ${
                shown ? "scale-y-100" : "scale-y-0"
              }`}
            />
            <div
              style={
                shown ? { transitionDelay: `${i * STEP + 140}ms` } : undefined
              }
              className={`mt-4 transition-[opacity,transform] duration-500 ease-out motion-reduce:transition-none ${
                shown
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
              }`}
            >
              {card}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
