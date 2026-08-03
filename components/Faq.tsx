import type { Faq as FaqItem } from "@/lib/site";

/**
 * The questions, hung between datum rules.
 *
 * Native <details>/<summary> and no JavaScript at all. Three reasons, in order
 * of how much they matter:
 *
 * 1. Every answer is in the static HTML whether or not anything is expanded, so
 *    a crawler — or a model retrieving this page to answer "who should I call in
 *    Southlake" — reads all eight without executing a bundle. That is the entire
 *    point of the section; an accordion that mounts its answers on click would
 *    hide the content from exactly the reader it was built for.
 * 2. It survives the failure this site already designs around (see the head
 *    script in app/layout.tsx). With the bundle dead the questions still open.
 * 3. Keyboard, screen-reader and find-in-page behaviour come from the browser
 *    rather than from a re-implementation of it.
 *
 * The mark is two hairlines rather than a glyph — the same 1px rule the rest of
 * the page is drawn with — and it turns 45° into a cross when the row opens.
 */
export function Faq({ items }: { items: FaqItem[] }) {
  return (
    <div className="max-w-3xl">
      {items.map((item) => (
        <div key={item.q}>
          <div className="datum" />
          <details className="group">
            <summary
              className="flex cursor-pointer list-none items-start justify-between gap-8 py-6
                [&::-webkit-details-marker]:hidden"
            >
              <h3 className="display-sm text-xl leading-snug text-ink transition-colors duration-200 group-hover:text-brass-deep sm:text-[1.375rem]">
                {item.q}
              </h3>
              {/* Sized and centred against the first line of the question, so
                  the column of marks stays straight however many lines each
                  question runs to. */}
              <span
                aria-hidden="true"
                className="relative mt-1.5 block h-3 w-3 flex-none transition-transform duration-300 ease-out group-open:rotate-45"
              >
                <span className="absolute left-0 top-1/2 h-px w-3 -translate-y-1/2 bg-brass-deep" />
                <span className="absolute left-1/2 top-0 h-3 w-px -translate-x-1/2 bg-brass-deep" />
              </span>
            </summary>
            <p className="max-w-2xl pb-7 leading-relaxed text-ink-soft">
              {item.a}
            </p>
          </details>
        </div>
      ))}
      <div className="datum" />
    </div>
  );
}
