"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up to itself, once, when it comes into view.
 *
 * The market band and the tax rate are the two places on the Fort Worth page
 * where a number is the content rather than a label, and a number that arrives
 * by counting reads as a reading being taken — which is the register the whole
 * page is written in.
 *
 * It takes the figure as the string the page would otherwise print, splits off
 * whatever sits either side of the digits, and counts only the digits: "$336K"
 * counts 336 and keeps its dollar sign and its K, "~2.2%" counts 2.2 to one
 * decimal. Anything it cannot parse is printed verbatim, so a mark like "n/a"
 * degrades to plain text instead of to NaN.
 *
 * Two rules it shares with the review scores on /about, for the same reasons:
 *
 * 1. The server renders the real figure and the client's first render matches
 *    it — the count only ever starts inside an effect. A component that
 *    rendered 0 and relied on a bundle to correct it would publish a wrong
 *    number to anything that doesn't run scripts, and these are numbers a
 *    visitor will act on.
 * 2. One-shot. A figure that re-counts every time it scrolls past reads as a
 *    widget rather than as a fact.
 *
 * Reduced motion skips the count entirely rather than shortening it: forty
 * values flickering through an element is movement, and there is no version of
 * this that respects the setting.
 *
 * rAF rather than a CSS transition because what is animating is text content,
 * which CSS cannot interpolate.
 */
const FIGURE = /^([^\d-]*)(-?\d+(?:\.\d+)?)(.*)$/;

const DURATION = 900;

export function CountUpFigure({
  value,
  delay = 0,
  className,
}: {
  /** The figure exactly as it should read when settled, e.g. "$336K". */
  value: string;
  /** Held back this long after the element lands, to sit with a cascade. */
  delay?: number;
  className?: string;
}) {
  const parsed = FIGURE.exec(value);
  const target = parsed ? Number(parsed[2]) : NaN;
  const decimals = parsed ? (parsed[2].split(".")[1]?.length ?? 0) : 0;

  const [shown, setShown] = useState(target);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let timer = 0;
    let start = 0;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min(1, (now - start) / DURATION);
      // Ease out cubic: fast off the mark, settling rather than stopping.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(target * eased);
      if (t < 1) raf = requestAnimationFrame(step);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          observer.unobserve(entry.target);
          setShown(0);
          timer = window.setTimeout(() => {
            raf = requestAnimationFrame(step);
          }, delay);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      window.clearTimeout(timer);
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [target, delay]);

  if (!parsed) return <span className={className}>{value}</span>;

  // aria-hidden on the animating text, with the settled figure exposed to
  // assistive tech instead: a live count would otherwise be announced dozens of
  // times on its way up.
  return (
    <span ref={ref} className={className}>
      <span aria-hidden="true">
        {parsed[1]}
        {shown.toFixed(decimals)}
        {parsed[3]}
      </span>
      <span className="sr-only">{value}</span>
    </span>
  );
}
