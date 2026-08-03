"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Testimonial } from "@/lib/site";

/**
 * Client voices, read one at a time off an arc.
 *
 * The four clients hang as seals on a single drawn curve, and taking one sets
 * their quote large in Caslon beside it. A reading device rather than a wall:
 * four quotes shown flat all compete, none of them wins, and so nobody reads
 * any of them. One at a time, at display size, actually gets read.
 *
 * The arc is this section's instrument, the way the range line is the hero's
 * and the relief map is the ground's — a drafting sweep, drawn in the same
 * hairline as the datum, with the seals threaded onto it like beads on a wire.
 * It is the one curve on the site, which is what lets it read as an instrument
 * rather than as decoration.
 *
 * It also runs the clock. Rather than bolt dots or a bar onto the side, the arc
 * fills brass from the taken seal toward the next one as the dwell elapses, so
 * the thing being advanced is the thing showing the advance.
 *
 * The curve turns rather than disappears on a phone. Most of this site's
 * traffic is mobile, and dropping the section's whole device at the width where
 * most people meet it would leave them the one layout that has nothing to do
 * with the rest of the page. Both orientations bow toward the quote — right on
 * a wide screen, where the quote sits beside the rail; down on a narrow one,
 * where it sits beneath. Same instrument, same sine, same brass clock.
 *
 * No photographs, and there never will be any: these are placeholder clients,
 * and a stock face under a name that belongs to a real person misrepresents
 * them. The monogram seal is the same answer the team section gives.
 */

/** Vertical rail, lg and up. */
const ROW = 96; // px between seals down the rail
const RAIL_PAD = 44; // px of arc above the first seal and below the last
const ARC_X = 30; // px from the rail's left edge to the arc at its ends
const BOW = 58; // px the arc bows toward the quote at its middle

/**
 * Horizontal rail, below lg. Drawn in a 100-wide viewBox stretched to whatever
 * the column is, so the curve is fluid without measuring anything; the y units
 * stay real pixels, and a non-scaling stroke keeps the hairline a hairline
 * under that stretch.
 *
 * The bow always faces the quote — right when the rail is beside it on the
 * left, up now that the arc sits beneath it. That is what makes the curve read
 * as presenting the quote rather than as a stray squiggle, so if this ever
 * moves again, the sign on H_BOW moves with it.
 */
const H_SPAN = 100; // viewBox units across
const H_BASE = 68; // px from the top of the strip to the arc at its ends
const H_BOW = 30; // px the arc rises off that base at its middle
const H_HEIGHT = 96; // px of strip

const SEAL_BOX = 56; // px. Fixed, so a seal's centre stays put as it scales
const DWELL = 4500; // ms a quote holds before the next is taken

/**
 * The arc runs a little past both end seals so it reads as continuing rather
 * than as starting and stopping at the outer two clients. `t` is the seal
 * parameter — 0 at the first client, 1 at the last — and the drawn curve
 * covers [T0, T1].
 */
const T0 = -0.13;
const T1 = 1.13;

const STEPS = 120;

/**
 * Samples a curve into a polyline and measures it.
 *
 * Returns the `d` attribute and `fracAt`, which answers "what fraction of this
 * path's length is the point at parameter t". That question has to be answered
 * by measurement rather than by assuming length runs evenly with `t`: it does
 * not, and the error is what would drift the brass clock off the seal it is
 * supposed to arrive at. Polyline lengths are exact, and it is the same
 * polyline the browser measures for `pathLength`, so the two agree.
 *
 * Measuring in the curve's own units is also what makes the stretched
 * horizontal arc come out right — the browser dashes in that same space, before
 * the viewBox transform, so the fill lands on the seal whatever the column's
 * width turns out to be.
 */
function buildArc(at: (t: number) => [number, number]) {
  const pts: [number, number][] = [];
  for (let k = 0; k <= STEPS; k++) {
    pts.push(at(T0 + ((T1 - T0) * k) / STEPS));
  }

  const cum = [0];
  for (let i = 1; i < pts.length; i++) {
    cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  }
  const total = cum[STEPS] || 1;

  return {
    d: `M${pts.map(([x, y]) => `${x.toFixed(2)} ${y.toFixed(2)}`).join(" L")}`,
    fracAt(t: number) {
      const k = Math.max(0, Math.min(STEPS, ((t - T0) / (T1 - T0)) * STEPS));
      const i = Math.min(STEPS - 1, Math.floor(k));
      return (cum[i] + (cum[i + 1] - cum[i]) * (k - i)) / total;
    },
  };
}

/** The seal parameter for item `i` of `n`. */
const seatT = (i: number, n: number) => (n === 1 ? 0 : i / (n - 1));

/**
 * The filled fraction of an arc, `f` of the way through item `i`'s dwell. The
 * last item sweeps to the end of the drawn curve rather than to a seal that
 * isn't there, so every dwell arrives exactly on time.
 */
function sweep(i: number, f: number, n: number, fracAt: (t: number) => number) {
  if (n < 2) return f;
  const from = fracAt(seatT(i, n));
  const to = i < n - 1 ? fracAt(seatT(i + 1, n)) : 1;
  return from + f * (to - from);
}

const STAR =
  "M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z";

/**
 * Five marks, filled to `value`. Drawn as two stacked rows — an empty one and a
 * brass one clipped to a percentage — so 4.9 renders as four and nine-tenths
 * rather than rounding up to a five it hasn't earned.
 */
function Stars({
  value,
  size = 12,
  className = "",
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / 5)) * 100;
  const row = (tone: string) => (
    <span className={`flex w-max gap-px ${tone}`}>
      {Array.from({ length: 5 }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          className="flex-none"
          style={{ width: size, height: size }}
        >
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );

  return (
    <span
      role="img"
      aria-label={`${value} out of 5`}
      className={`relative inline-block align-middle ${className}`}
    >
      {row("text-ink/20")}
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        {row("text-brass-deep")}
      </span>
    </span>
  );
}

/**
 * Initials as a seal. Drops a leading "The" and any non-alphabetic token, so
 * "The Alvarez Family" reads AF and "Dana & Michael R." reads DM.
 */
function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /^[A-Za-z]/.test(w))
    .filter((w, i) => !(i === 0 && w.toLowerCase() === "the"))
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
}

/**
 * A square plate, not the 4:5 portrait the team section uses. These clients
 * have no photograph and never will, so a portrait-shaped plate would read as a
 * picture still loading; a square one reads as a seal.
 *
 * Overrides .plate's own limestone-deep fill, which is the exact colour of the
 * field this section sits on — the plate would otherwise be invisible. The
 * taken seal swaps to the ink field so the arc has one clear head on it.
 */
function Seal({ name, active }: { name: string; active: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={`plate flex h-[52px] w-[52px] flex-none items-center justify-center transition-[transform,background-color,box-shadow] duration-300 ease-out motion-reduce:transition-none ${
        active
          ? "scale-100 bg-ink shadow-[inset_0_0_0_1px_rgba(110,90,14,0.9)]"
          : "scale-[0.72] bg-limestone-pale"
      }`}
    >
      <span
        className={`display-sm text-[1.0625rem] ${
          active ? "text-brass-pale" : "text-brass-deep"
        }`}
      >
        {monogram(name)}
      </span>
    </span>
  );
}

export function Testimonials({ items }: { items: Testimonial[] }) {
  const n = items.length;
  const [active, setActive] = useState(0);
  // The section is held while a pointer is over it or focus is inside it —
  // advancing a quote out from under someone who is reading or tabbing it is
  // the whole reason autoplaying carousels have a bad name.
  const [held, setHeld] = useState(false);
  const [onScreen, setOnScreen] = useState(false);
  // Starts false and is only turned on once we've asked about reduced motion,
  // which also keeps the server and first client render identical.
  const [mayAutoplay, setMayAutoplay] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const railArcRef = useRef<SVGPathElement>(null);
  const stripArcRef = useRef<SVGPathElement>(null);
  const elapsedRef = useRef(0);

  const rail = useMemo(
    () =>
      buildArc((t) => [
        ARC_X + BOW * Math.sin(Math.PI * t),
        RAIL_PAD + t * (n - 1) * ROW,
      ]),
    [n]
  );

  const strip = useMemo(
    () =>
      buildArc((t) => [
        ((t - T0) / (T1 - T0)) * H_SPAN,
        H_BASE - H_BOW * Math.sin(Math.PI * t),
      ]),
    []
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setMayAutoplay(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node || !("IntersectionObserver" in window)) {
      setOnScreen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) setOnScreen(e.isIntersecting);
      },
      { threshold: 0.25 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  /**
   * Written straight to the DOM rather than held in state: this runs every
   * frame, and re-rendering the quote sixty times a second to move a hairline
   * would be absurd. Both arcs are painted — only one is ever displayed, and
   * writing to a hidden node costs nothing.
   */
  const paint = useCallback(
    (f: number) => {
      if (railArcRef.current)
        railArcRef.current.style.strokeDashoffset = String(
          1 - sweep(active, f, n, rail.fracAt)
        );
      if (stripArcRef.current)
        stripArcRef.current.style.strokeDashoffset = String(
          1 - sweep(active, f, n, strip.fracAt)
        );
    },
    [active, n, rail, strip]
  );

  // Rewind on every change of client — including a manual one, so taking a
  // seal by hand gives that quote a full dwell rather than the tail of the
  // last one's.
  useEffect(() => {
    elapsedRef.current = 0;
    paint(0);
  }, [active, paint]);

  const running = mayAutoplay && onScreen && !held && n > 1;

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    // Accumulates rather than measuring from a start time, so being held
    // freezes the sweep where it stands and resumes from there.
    const tick = (now: number) => {
      elapsedRef.current += now - last;
      last = now;
      const f = Math.min(1, elapsedRef.current / DWELL);
      paint(f);
      if (f >= 1) {
        setActive((a) => (a + 1) % n);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, paint, n]);

  const current = items[active];
  const railH = RAIL_PAD * 2 + (n - 1) * ROW;
  const railW = ARC_X + BOW + 24;

  /** The base curve and the brass clock riding on it. */
  const arcPaths = (
    which: "rail" | "strip",
    ref: React.RefObject<SVGPathElement | null>
  ) => {
    const d = which === "rail" ? rail.d : strip.d;
    const scaled = which === "strip";
    return (
      <>
        <path
          d={d}
          stroke="currentColor"
          strokeWidth="1"
          vectorEffect={scaled ? "non-scaling-stroke" : undefined}
          className="text-ink/20"
        />
        {/* pathLength="1" renormalises the curve so the dash maths is in plain
            fractions instead of measured user units. */}
        <path
          ref={ref}
          d={d}
          stroke="currentColor"
          strokeWidth="1.25"
          vectorEffect={scaled ? "non-scaling-stroke" : undefined}
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="text-brass-deep"
        />
      </>
    );
  };

  return (
    <div
      ref={rootRef}
      onPointerEnter={() => setHeld(true)}
      onPointerLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={() => setHeld(false)}
      // The rail column is sized to the arc plus a name, not to a fraction of
      // the page: any wider and it opens a dead channel between the last seal
      // and the quote it is meant to be pointing at.
      className="lg:grid lg:grid-cols-[19rem_1fr] lg:items-center lg:gap-10 xl:grid-cols-[20rem_1fr] xl:gap-12"
    >
      {/* ---- The rail, lg and up: the arc stood on end, each seal named. ---- */}
      <ul className="relative hidden lg:block" style={{ height: railH }}>
        <svg
          aria-hidden="true"
          width={railW}
          height={railH}
          viewBox={`0 0 ${railW} ${railH}`}
          fill="none"
          className="absolute left-0 top-0"
        >
          {arcPaths("rail", railArcRef)}
        </svg>

        {items.map((item, i) => {
          const t = seatT(i, n);
          const isActive = i === active;
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={isActive}
                onClick={() => setActive(i)}
                style={{
                  top: RAIL_PAD + t * (n - 1) * ROW,
                  marginLeft: ARC_X + BOW * Math.sin(Math.PI * t) - SEAL_BOX / 2,
                }}
                // -translate-y-1/2 centres the row on its point, so the seal
                // sits on the arc rather than hanging beneath it.
                className="absolute inset-x-0 flex -translate-y-1/2 items-center gap-4 pr-4 text-left"
              >
                {/* Fixed-width box, seal scaled inside it: the seal's centre
                    stays pinned to the arc whichever one is taken. */}
                <span
                  className="flex flex-none items-center justify-center"
                  style={{ width: SEAL_BOX, height: SEAL_BOX }}
                >
                  <Seal name={item.name} active={isActive} />
                </span>
                <span className="min-w-0">
                  {/* Wraps rather than truncates: a clipped surname reads as a
                      bug, and each row is centred on its own point, so a second
                      line grows the block symmetrically off the arc. */}
                  <span
                    className={`block transition-colors duration-300 ${
                      isActive
                        ? "display-sm text-[1.1875rem] text-ink"
                        : "text-sm text-ink-soft"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span className="mt-1.5 flex items-center gap-2">
                    <Stars value={item.rating} size={isActive ? 12 : 10} />
                    {isActive && (
                      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                        {item.date}
                      </span>
                    )}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {/* ---- The quote. aria-live so the change is announced rather than
             silently swapped under a screen reader. ---- */}
      {/* Capped rather than left to fill the column: past ~50 characters a line
          of Caslon this size stops being read and starts being scanned. */}
      <figure aria-live="polite" className="xl:max-w-[46rem]">
        {/* Keyed on the client so the block replays its entrance on every
            change — the same `rise` the hero opens on. */}
        <div key={current.id} className="animate-rise">
          <span
            aria-hidden="true"
            className="block font-display text-[4.5rem] leading-[0.62] text-brass-deep"
          >
            &ldquo;
          </span>
          {/* Drop cap rather than italic: no italic Caslon is loaded, so
              `italic` here would get a synthesised oblique. */}
          <blockquote className="display-sm mt-1 text-[1.375rem] leading-[1.55] text-ink first-letter:float-left first-letter:pr-2.5 first-letter:pt-1 first-letter:text-[3.25rem] first-letter:leading-[0.78] sm:text-[1.5rem] lg:text-[1.875rem] lg:first-letter:text-[3.75rem] xl:text-[2rem]">
            {current.quote}
          </blockquote>
          <figcaption className="mt-8 flex items-start gap-4">
            <span
              aria-hidden="true"
              className="mt-[0.4rem] h-px w-8 flex-none bg-brass-deep"
            />
            {/* ink-soft, not ink-muted: muted is held at 4.5:1 on limestone,
                and this section sits on the darker limestone-deep, where it
                lands at 4.4:1. Soft clears it at 6.5:1 on both. */}
            <span className="font-mono text-[10px] uppercase leading-[1.7] tracking-widest text-ink-soft">
              {/* The name only where the rail isn't carrying it. */}
              <span className="text-ink lg:hidden">
                {current.name}
                <span aria-hidden="true" className="mx-2 text-ink/30">
                  ·
                </span>
              </span>
              {current.detail}
              <span aria-hidden="true" className="mx-2 text-ink/30">
                ·
              </span>
              {current.date}
            </span>
          </figcaption>
        </div>
      </figure>

      {/* ---- The strip, below lg: the same arc laid down, seals only, and sat
             under the quote rather than over it — the quote is what the section
             is for, and a row of monograms above it makes the reader step over
             a control to reach the thing being controlled.
             The names come off the arc and go into the attribution, where there
             is room to set them properly: four names along a phone-width curve
             would collide, and the attribution has to carry a name at this
             width anyway. That leaves four marks on a line, which is the
             simplest the device gets without ceasing to be the device. ---- */}
      <ul
        className="relative mt-12 lg:hidden"
        style={{ height: H_HEIGHT }}
      >
        <svg
          aria-hidden="true"
          viewBox={`0 0 ${H_SPAN} ${H_HEIGHT}`}
          preserveAspectRatio="none"
          fill="none"
          className="absolute inset-0 h-full w-full"
        >
          {arcPaths("strip", stripArcRef)}
        </svg>

        {items.map((item, i) => {
          const t = seatT(i, n);
          return (
            <li key={item.id}>
              <button
                type="button"
                aria-pressed={i === active}
                onClick={() => setActive(i)}
                style={{
                  left: `${((t - T0) / (T1 - T0)) * 100}%`,
                  top: H_BASE - H_BOW * Math.sin(Math.PI * t),
                }}
                // A 56px box around a seal that scales to 37px when idle: the
                // target stays thumb-sized whether or not it is the taken one.
                className="absolute flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
              >
                <span
                  className="flex items-center justify-center"
                  style={{ width: SEAL_BOX, height: SEAL_BOX }}
                >
                  <Seal name={item.name} active={i === active} />
                </span>
                <span className="sr-only">{item.name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * The aggregate, shown as this section's header stat: what the star ratings
 * actually are, rather than a claim that leaders trust us.
 */
/**
 * The source's own mark, drawn inline.
 *
 * Inline SVG rather than a hotlinked asset: these sit above the fold on the
 * home page, and neither Google nor Zillow serves a logo we should be pulling
 * across on the critical path. Full brand colour, deliberately — everything
 * else on this page is matte, and a desaturated Google G reads as a knock-off
 * rather than as attribution. They stay small enough not to fight the numbers.
 *
 * Decorative: the source is already named in the type beside them.
 */
function SourceMark({ source }: { source: string }) {
  const key = source.toLowerCase();

  if (key === "google") {
    return (
      <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="#EA4335"
          d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
        />
        <path
          fill="#4285F4"
          d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
        />
        <path
          fill="#FBBC05"
          d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
        />
        <path
          fill="#34A853"
          d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
        />
      </svg>
    );
  }

  if (key === "zillow") {
    // Zillow's house mark in Zillow blue: the overhanging roof band above a
    // plain body, which is the shape the logo reduces to at this size.
    return (
      <svg viewBox="0 0 48 48" className="h-3.5 w-3.5" aria-hidden="true">
        <path
          fill="#006AFF"
          d="M24 4.5 2 21.2l5.4 6.6L24 15.1l16.6 12.7 5.4-6.6z"
        />
        <path
          fill="#006AFF"
          d="M24 20.4 9.8 31.3V43.5h28.4V31.3z"
        />
      </svg>
    );
  }

  return null;
}

/**
 * A rating counting up to itself, once, when it comes into view.
 *
 * The number rendered on the server is the real one, and the client's first
 * render matches it — the count only starts in an effect. That ordering is the
 * whole design: a component that rendered "0.0" and relied on JavaScript to
 * correct it would publish a wrong figure to anything that doesn't run scripts,
 * and these two numbers are the one part of this section that is real and
 * checkable (see `reviewSources` in lib/site.ts). A rating is not a decoration
 * to be wrong about while a bundle loads.
 *
 * Reduced motion skips the count entirely rather than shortening it. The
 * concern there is movement, and a number spinning through forty values is
 * movement — there is no version of this effect that respects the setting, so
 * it simply doesn't run.
 *
 * rAF rather than a CSS transition because what is animating is text content,
 * which CSS cannot interpolate.
 */
function CountUpRating({ value }: { value: number }) {
  const [shown, setShown] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (!("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let start = 0;
    const DURATION = 1100;

    const step = (now: number) => {
      if (!start) start = now;
      const t = Math.min((now - start) / DURATION, 1);
      // Ease-out cubic: fast off the mark, settling onto the final figure.
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(value * eased);
      if (t < 1) raf = requestAnimationFrame(step);
      else setShown(value); // land exactly, never on a rounding artefact
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          // One-shot. A rating that re-counts every time it scrolls past reads
          // as a widget rather than as a fact.
          observer.unobserve(entry.target);
          setShown(0);
          raf = requestAnimationFrame(step);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(node);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [value]);

  // aria-hidden on the animating text, with the settled figure exposed to
  // assistive tech instead: a live count would otherwise be announced dozens of
  // times on its way up.
  return (
    <span ref={ref}>
      <span aria-hidden="true">{shown.toFixed(1)}</span>
      <span className="sr-only">{value.toFixed(1)}</span>
    </span>
  );
}

export function ReviewScores({
  sources,
}: {
  sources: { source: string; rating: number; count: string }[];
}) {
  return (
    <dl className="flex flex-wrap items-start gap-x-10 gap-y-8 sm:gap-x-14">
      {sources.map((s) => (
        <div key={s.source} className="flex-none">
          <dt className="sr-only">{s.source} rating</dt>
          <dd>
            {/* Tabular figures: the count runs through 0.0-4.9 and proportional
                digits are different widths, so without this the number and the
                "/5" beside it jitter sideways the whole way up. */}
            <span className="display block text-[2.75rem] leading-none text-ink [font-variant-numeric:tabular-nums]">
              <CountUpRating value={s.rating} />
              <span className="ml-1 align-baseline text-[1.25rem] text-ink/35">
                /5
              </span>
            </span>
            <Stars value={s.rating} size={13} className="mt-3" />
            <span className="mt-3 flex items-center font-mono text-[10px] uppercase tracking-widest text-ink-soft">
              <SourceMark source={s.source} />
              <span className="ml-2">{s.source}</span>
              <span aria-hidden="true" className="mx-2 text-ink/30">
                ·
              </span>
              {s.count} reviews
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}
