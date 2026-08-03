import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon } from "@/components/ComingSoon";
import { communityHref, stations } from "@/lib/site";

export const metadata: Metadata = {
  title: "Communities",
};

export default function CommunitiesPage() {
  return (
    <ComingSoon
      title="Communities"
      description="A deeper look at each of the eight towns Ritchey Realty covers — character, schools, and what your money buys in each. Fort Worth is written; the rest are on the way."
      // The first town with a page of its own. Once a second one is written,
      // this placeholder is what should be replaced — not extended.
      secondaryCta={{
        label: "Read the Fort Worth guide",
        href: "/communities/fort-worth",
      }}
    >
      {/* The eight towns, west to east, so the page says what the range is even
          while most of it is unwritten. The one that is written is a link; the
          rest are set as plain type rather than as links to nowhere. */}
      <ul className="mt-10 flex max-w-2xl flex-wrap gap-x-6 gap-y-3">
        {stations.map((c) => {
          const href = communityHref(c.name);
          const written = href !== "/communities";
          return (
            <li key={c.name} className="font-mono text-[11px] uppercase tracking-widest">
              {written ? (
                <Link
                  href={href}
                  className="text-brass-deep underline decoration-brass-deep/40 underline-offset-4 transition-colors hover:decoration-brass-deep"
                >
                  {c.name}
                </Link>
              ) : (
                <span className="text-ink-muted">{c.name}</span>
              )}
            </li>
          );
        })}
      </ul>
    </ComingSoon>
  );
}
