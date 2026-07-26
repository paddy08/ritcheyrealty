import type { Testimonial } from "@/lib/site";
import { Reveal } from "@/components/Reveal";

const STEP = 90; // ms between entries — the agent roster's cadence

/**
 * Four quotes, flat. No carousel: with four items, hiding three behind arrows
 * costs a reader more than it saves. No lead quote either — setting one larger
 * ranks the four, and no client's testimony outranks another's.
 *
 * What keeps a flat set from reading as an undifferentiated list is the device
 * rather than the weighting: every entry hangs off its own rule on a brass
 * tick, the same mark the range line and the agent roster use, and the four
 * tick in left to right on one cadence. Per-entry rules rather than one
 * section-wide datum, because at two columns the second row would otherwise
 * hang its ticks off nothing.
 */

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
 * have no photograph and never will, so a portrait-shaped plate would read as
 * a picture still loading; a square one reads as a seal.
 *
 * Overrides .plate's own limestone-deep fill, which is the exact colour of the
 * field this section sits on — the plate would otherwise be invisible.
 */
function Seal({ name }: { name: string }) {
  return (
    <span
      aria-hidden="true"
      className="plate flex h-10 w-10 flex-none items-center justify-center bg-limestone-pale"
    >
      <span className="display-sm text-[0.9375rem] text-brass-deep">
        {monogram(name)}
      </span>
    </span>
  );
}

export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  return (
    /* Below sm this is a horizontally-scrolling row, not a stack: four quotes
       stacked is ~160 words of unbroken column, and the row is the same answer
       the range line and the roster give on narrow screens. Fixed widths, not
       min-widths — flex-none sizes to content, so a min-width lets the entry
       with the longest attribution line stretch wider than its neighbours. */
    <ul className="no-scrollbar scroll-fade flex gap-8 overflow-x-auto sm:grid sm:grid-cols-2 sm:gap-x-12 sm:gap-y-12 sm:overflow-visible sm:[-webkit-mask-image:none] sm:[mask-image:none] lg:grid-cols-4 lg:gap-x-10">
      {items.map((item, i) => (
        <Reveal
          as="li"
          key={item.id}
          delay={i * STEP}
          className="w-[17rem] flex-none sm:w-auto sm:min-w-0"
        >
          {/* The rule, then the tick hanging from it — no padding between, so
              the mark reads as descending from the measure. */}
          <div className="datum" />
          <span aria-hidden="true" className="block h-7 w-px bg-brass-deep" />
          <figure className="mt-5">
            <blockquote className="display-sm text-[1.125rem] leading-[1.55] text-ink">
              {item.quote}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-4">
              <Seal name={item.name} />
              <span className="min-w-0">
                <span className="block text-sm font-medium text-ink">
                  {item.name}
                </span>
                {/* ink-soft, not ink-muted: muted is held at 4.5:1 on
                    limestone, and this section sits on the darker
                    limestone-deep, where it lands at 4.4:1. Soft clears it at
                    6.5:1 on both. */}
                <span className="mt-1 block font-mono text-[10px] uppercase tracking-widest text-ink-soft">
                  {item.detail}
                </span>
              </span>
            </figcaption>
          </figure>
        </Reveal>
      ))}
    </ul>
  );
}
