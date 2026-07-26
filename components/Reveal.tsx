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
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced || !("IntersectionObserver" in window)) {
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
    return () => observer.disconnect();
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

  return (
    <Tag
      ref={ref as never}
      style={visible ? { transitionDelay: `${delay}ms` } : undefined}
      className={[
        "transition-[opacity,transform] duration-300 ease-out motion-reduce:transition-none",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-3 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100",
        className,
      ].join(" ")}
    >
      {children}
    </Tag>
  );
}
