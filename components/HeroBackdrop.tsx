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
 * early, and the video is mounted afterwards, at a weight the viewport can
 * afford. Phones get a separate ~290KB encode rather than nothing at all: the
 * full-size loop is still far too expensive there, but the poster alone left
 * the hero dead on the format most of the traffic arrives on. Save-Data and
 * reduced-motion still get the poster only — both are explicit requests not to
 * be served an autoplaying loop at any size.
 */

/**
 * The phone encode is cropped 9:16 at the source, not merely scaled down. The
 * hero is min-h-dvh, so on a portrait phone object-cover throws away most of a
 * 16:9 frame's width and then upscales the surviving sliver ~2.5x. Cropping
 * first spends every encoded pixel on something actually visible, and centre
 * crop is the same slice of the frame the poster already shows there.
 *
 * It runs at 608x1080 — the native ceiling, since that is all the width a 9:16
 * slice of a 1080p landscape frame has. A DPR-3 phone panel wants ~1170px, so
 * roughly 1.9x of upscale is inherent to the source and no bitrate removes it;
 * the encode is only rated to the point where compression stops being the
 * visible problem (VMAF ~83) rather than chasing that ceiling. It is also
 * trimmed to the first 8s of the dolly — bytes scale with duration, the tail
 * pushes in until the window blows out, and it loops long before then.
 */
const SOURCES = {
  wide: { webm: "/hero.webm", mp4: "/hero.mp4" },
  phone: { webm: "/hero-mobile.webm", mp4: "/hero-mobile.mp4" },
} as const;

export function HeroBackdrop() {
  const [variant, setVariant] = useState<keyof typeof SOURCES | null>(null);

  useEffect(() => {
    // Deliberately after paint: mounting the video during render would put it
    // back in the critical path and undo the point of this component.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection;
    if (reduced || conn?.saveData) return;
    // Resolved once and not re-evaluated on resize: swapping src mid-view would
    // reload the video and flash the poster, and a phone rotated into landscape
    // is the last place to start pulling the 1.5MB file.
    setVariant(window.matchMedia("(min-width: 768px)").matches ? "wide" : "phone");
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
      {variant && (
        /* The <source media> attribute is not honoured inside <video> — it was
           dropped from the spec — so the variant is picked in JS above, where
           the breakpoint is already being read. Both encodes list webm first
           and mp4 second: iOS Safari's VP9-in-WebM support is unreliable, and
           it is the mp4 that actually plays on an iPhone. */
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
          <source src={SOURCES[variant].webm} type="video/webm" />
          <source src={SOURCES[variant].mp4} type="video/mp4" />
        </video>
      )}

      {/* Scrims: weighted to the bottom-left, where the type sits. */}
      <div className="absolute inset-0 bg-ink/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/35 to-ink/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink/65 via-ink/10 to-transparent" />
    </div>
  );
}
