"use client";

import { useEffect } from "react";

/**
 * Proof of life for the head script in app/layout.tsx.
 *
 * That script hides every scroll reveal immediately, then takes the hiding back
 * after four seconds unless this mark has appeared. Mounting is the mark: if
 * React is running, the reveals are safe to keep hidden until the observer
 * plays them; if it never gets here, the page falls back to plain visible
 * markup rather than blank space.
 *
 * Renders nothing. It exists purely for the side effect of proving the bundle
 * executed, so it goes in the root layout where every route picks it up.
 */
export function HydrationMark() {
  useEffect(() => {
    document.documentElement.setAttribute("data-hydrated", "");
  }, []);

  return null;
}
