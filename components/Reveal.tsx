"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in ms (kept small — this is meant to be quiet). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
  /**
   * "rise" (default) fades and lifts the element.
   * "plate" uncovers the contents from the bottom edge while the image inside
   * settles back from an over-scale — a print being laid down. The clip goes
   * on an inner wrapper, never on the observed element, because clip-path is
   * applied before intersection is computed.
   */
  variant?: "rise" | "plate";
  /**
   * Play again every time the element re-enters view. Off by default: most of
   * the page is body copy, and re-fading paragraphs on every scroll is noise.
   * On for the pieces that are meant to be watched.
   */
  repeat?: boolean;
};

/**
 * Subtle scroll-triggered reveal: a short fade + small upward slide the first
 * time the element enters the viewport. Uses a single IntersectionObserver per
 * instance and unobserves after firing, so there is no ongoing scroll work.
 * Fully skipped for users who prefer reduced motion.
 */
export function Reveal({
  children,
  delay = 0,
  className = "",
  as = "div",
  variant = "rise",
  repeat = false,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  // Starts hidden, so everything animates in — including whatever is already on
  // screen at load. Safe to do because the hidden state is expressed as
  // `data-shown="false"` and the CSS only honours it under `html.js`, which the
  // head script takes back off if the bundle never hydrates. So a dead script
  // costs the entrance, not the content; see app/layout.tsx.
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Reduced motion is handled entirely in CSS now — the fade stays, the
    // travel is dropped — so the observer still runs and the reveal still
    // plays. Only a browser with no IntersectionObserver at all short-circuits.
    if (!("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true);
            // One-shot unless asked to repeat — staying subscribed is what
            // lets it replay when the element comes back into view.
            if (!repeat) observer.unobserve(entry.target);
          } else if (repeat) {
            setVisible(false);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(node);

    // The observer is the only thing that reveals a hidden element, so if it
    // never fires — a threshold never met against a viewport the browser has
    // resized, say — the content is stranded. Measure directly once the page
    // has settled and show it if it is genuinely on screen.
    const failsafe = window.setTimeout(() => {
      const box = node.getBoundingClientRect();
      const onScreen =
        box.bottom > 0 && box.top < (window.innerHeight || 0) && box.height > 0;
      if (!onScreen) return;
      setVisible(true);
      if (!repeat) observer.unobserve(node);
    }, 2000);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [repeat]);

  const Tag = as;

  if (variant === "plate") {
    return (
      <Tag ref={ref as never} className={className}>
        <div
          style={visible ? { transitionDelay: `${delay}ms` } : undefined}
          className={`plate-clip ${visible ? "plate-clip-in" : ""}`}
        >
          {children}
        </div>
      </Tag>
    );
  }

  // The hidden state is an attribute, not a utility class, because the CSS that
  // acts on it is scoped to `html.js`. Written as `opacity-0` here it would
  // apply unconditionally and take the page down with the bundle.
  return (
    <Tag
      ref={ref as never}
      data-shown={visible ? "true" : "false"}
      style={visible ? { transitionDelay: `${delay}ms` } : undefined}
      className={`reveal ${className}`}
    >
      {children}
    </Tag>
  );
}
