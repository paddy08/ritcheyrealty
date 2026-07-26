import Link from "next/link";
import { stations } from "@/lib/site";

/**
 * The range line — this page's signature.
 *
 * Every town Kallie works, hung from a single datum as survey stations and
 * read left to right the way you'd drive them: true west to east. The order is
 * derived from each town's longitude in lib/site.ts, so the line is a real
 * projection of her territory onto one axis rather than a decorative rule.
 * Spacing is even so the names stay legible; the W/E marks state the axis.
 */
export function RangeLine({ animate = false }: { animate?: boolean }) {
  return (
    <div className="relative bg-ink text-limestone">
      <div className="datum-on-ink absolute inset-x-0 top-0" />
      <div className="container-edge">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="hidden pt-[1.6rem] font-mono text-[10px] text-limestone/35 lg:block"
          >
            W
          </span>

          <ol className="no-scrollbar scroll-fade flex flex-1 overflow-x-auto lg:grid lg:grid-cols-8 lg:overflow-visible">
            {stations.map((c, i) => (
              <li key={c.name} className="min-w-[7.5rem] flex-none lg:min-w-0">
                <Link
                  href={`/search?area=${encodeURIComponent(c.name)}`}
                  className="group flex flex-col items-center pb-3 text-center lg:pb-5"
                >
                  <span
                    aria-hidden="true"
                    className={`block w-px bg-brass transition-[height,background-color] duration-300 group-hover:bg-brass-pale ${
                      animate ? "animate-station" : ""
                    } h-3.5 group-hover:h-6`}
                    style={
                      animate
                        ? { animationDelay: `${900 + i * 55}ms` }
                        : undefined
                    }
                  />
                  <span className="mt-2.5 font-mono text-[10px] uppercase leading-[1.6] tracking-station text-limestone/65 transition-colors duration-200 group-hover:text-limestone-pale">
                    {c.name}
                  </span>
                </Link>
              </li>
            ))}
          </ol>

          <span
            aria-hidden="true"
            className="hidden pt-[1.6rem] font-mono text-[10px] text-limestone/35 lg:block"
          >
            E
          </span>
        </div>

        {/* Below lg only three stations fit on screen, and the W/E marks that
            state the axis are off-screen too. The count is stated outright so
            no one has to scroll to find out there are eight. Sits under the
            stations, not above, so the ticks keep hanging from the datum. */}
        <p className="caption-on-ink pb-4 lg:hidden">
          Eight towns, west to east
        </p>
      </div>
    </div>
  );
}
