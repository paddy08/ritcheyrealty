"use client";

import { useEffect, useState } from "react";

/**
 * The hero's backdrop: a still frame always, the footage only where it can be
 * afforded.
 *
 * hero.webm is 1.57MB against a 2.8MB page. On a throttled mobile link that
 * single file owns the connection for seconds, and everything else — including
 * whatever ends up being the largest contentful paint — queues behind it. It
 * measured as 87% "render delay" on an LCP that had otherwise loaded in 210ms.
 *
 * So the poster is the real backdrop, sized and prioritised to be painted
 * early, and the video is mounted afterwards only on a viewport wide enough to
 * be worth it. Nothing is downloaded on phones, which is where the budget is
 * tightest. Also respects Save-Data and reduced-motion, both of which are
 * explicit requests not to be served an autoplaying 1.5MB loop.
 */
export function HeroBackdrop() {
  const [showVideo, setShowVideo] = useState(false);

  useEffect(() => {
    // Deliberately after paint: mounting the video during render would put it
    // back in the critical path and undo the point of this component.
    const wide = window.matchMedia("(min-width: 768px)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (wide && !reduced && !conn?.saveData) setShowVideo(true);
  }, []);

  return (
    <div className="absolute inset-0 -z-10">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {/* Explicit dimensions and no aria-hidden: this is the largest thing on
          the screen and it needs to be counted as the largest contentful
          paint. Left as a hidden decorative node it was skipped as a
          candidate, and LCP fell through to whatever small element painted
          last — a 70px header logo, five seconds in. */}
      <img
        src="/hero-poster.webp"
        alt=""
        width={1600}
        height={900}
        fetchPriority="high"
        decoding="async"
        className="h-full w-full object-cover object-center"
      />
      {showVideo && (
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/hero-poster.webp"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover object-center"
        >
          <source src="/hero.webm" type="video/webm" />
          <source src="/hero.mp4" type="video/mp4" />
        </video>
      )}

      {/* Scrims: weighted to the bottom-left, where the type sits. */}
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/10 to-transparent" />
    </div>
  );
}
