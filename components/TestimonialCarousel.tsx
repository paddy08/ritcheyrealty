import type { Testimonial } from "@/lib/site";

/**
 * Four quotes, set quietly. No carousel: with four items, hiding three behind
 * arrows costs a reader more than it saves. Each quote hangs from its own
 * datum, so the set reads as a column of entries rather than a row of cards.
 */
export function TestimonialCarousel({ items }: { items: Testimonial[] }) {
  return (
    <ul className="grid gap-x-16 gap-y-12 md:grid-cols-2">
      {items.map((t) => (
        <li key={t.id}>
          <figure className="border-t border-brass-deep/50 pt-6">
            <blockquote className="display-sm text-[1.375rem] leading-[1.5] text-ink">
              {t.quote}
            </blockquote>
            <figcaption className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span className="text-sm font-medium text-ink">{t.name}</span>
              <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                {t.detail}
              </span>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
