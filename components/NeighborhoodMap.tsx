"use client";

import { useState } from "react";
import Link from "next/link";
import { communities } from "@/lib/site";

export function NeighborhoodMap() {
  const [active, setActive] = useState(0);
  const current = communities[active];

  return (
    <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {/* Info panel — updates as you explore the map */}
      <div className="flex flex-col justify-between rounded-[1.75rem] bg-charcoal p-8 text-cream md:p-10">
        <div>
          <p className="text-xs uppercase tracking-widest text-sage">
            {String(active + 1).padStart(2, "0")} / {communities.length}
          </p>
          <h3
            key={current.name}
            className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl"
          >
            {current.name}
          </h3>
          <p className="mt-4 max-w-sm leading-relaxed text-cream/75">
            {current.blurb}
          </p>
        </div>
        <div className="mt-8">
          <Link
            href="/communities"
            className="inline-flex items-center gap-2 text-sm text-cream underline-offset-4 hover:underline"
          >
            Explore {current.name}
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>

      {/* Stylized map */}
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-[1.75rem] bg-cream-deep ring-1 ring-charcoal/10">
        {/* Abstract road + river network (decorative) */}
        <svg
          className="absolute inset-0 h-full w-full"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {/* Soft metro-region footprint so the panel reads as a map */}
          <path
            d="M 6 74 C 0 52, 10 28, 30 15 C 52 3, 76 9, 92 26 C 102 40, 96 62, 82 77 C 64 94, 26 94, 6 74 Z"
            fill="#8A8A6B"
            fillOpacity="0.08"
            stroke="#8A8A6B"
            strokeOpacity="0.2"
            strokeWidth="0.5"
          />
          {/* Trinity River */}
          <path
            d="M -2 66 C 18 58, 28 84, 48 74 S 82 62, 102 80"
            fill="none"
            stroke="#8A8A6B"
            strokeOpacity="0.35"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
          {/* I-35W */}
          <path
            d="M 12 -2 C 15 28, 19 58, 26 102"
            fill="none"
            stroke="#2B2A26"
            strokeOpacity="0.12"
            strokeWidth="0.9"
          />
          {/* Loop 820 */}
          <path
            d="M 40 66 C 40 50, 20 48, 15 64 C 11 78, 26 90, 40 84 C 50 80, 50 74, 40 66 Z"
            fill="none"
            stroke="#2B2A26"
            strokeOpacity="0.1"
            strokeWidth="0.9"
          />
          {/* Hwy 114 / 121 corridor (Roanoke → Grapevine) */}
          <path
            d="M 48 12 C 62 18, 74 28, 90 38"
            fill="none"
            stroke="#2B2A26"
            strokeOpacity="0.12"
            strokeWidth="0.9"
          />
          {/* Hwy 170 */}
          <path
            d="M 16 30 C 34 26, 48 24, 74 32"
            fill="none"
            stroke="#2B2A26"
            strokeOpacity="0.1"
            strokeWidth="0.9"
          />
        </svg>

        {/* Grain of a compass label */}
        <span className="pointer-events-none absolute right-5 top-4 text-[10px] uppercase tracking-widest text-charcoal-muted">
          DFW · North &uarr;
        </span>

        {/* Markers */}
        {communities.map((c, i) => {
          const isActive = i === active;
          return (
            <button
              key={c.name}
              type="button"
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => setActive(i)}
              aria-label={`${c.name}: ${c.blurb}`}
              aria-pressed={isActive}
              className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              {/* Pulse ring on active */}
              <span
                className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full transition-all duration-300 ${
                  isActive
                    ? "h-7 w-7 bg-sage/25"
                    : "h-0 w-0 bg-transparent"
                }`}
              />
              {/* Dot */}
              <span
                className={`relative block rounded-full ring-2 ring-cream transition-all duration-200 group-focus-visible:ring-sage-deep ${
                  isActive
                    ? "h-4 w-4 bg-charcoal"
                    : "h-3 w-3 bg-sage-deep group-hover:bg-charcoal"
                }`}
              />
              {/* Label — always readable, lifts to a pill on hover/active */}
              <span
                className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full text-[10px] font-medium tracking-wide transition-all duration-200 ${
                  isActive
                    ? "bg-charcoal px-2.5 py-1 text-cream shadow-sm"
                    : "px-1 py-0 text-charcoal-muted group-hover:bg-charcoal group-hover:px-2.5 group-hover:py-1 group-hover:text-cream group-focus-visible:bg-charcoal group-focus-visible:px-2.5 group-focus-visible:py-1 group-focus-visible:text-cream"
                }`}
              >
                {c.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
