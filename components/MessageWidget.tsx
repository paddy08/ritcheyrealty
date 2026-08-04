"use client";

import { usePathname } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { site } from "@/lib/site";

/**
 * The call widget: a round phone button that opens a card offering the number.
 *
 * Deliberately not a chat, and no longer a form either. It used to open the
 * six-field enquiry form in a centred modal — a scrim, a locked page and an
 * inner scrollbar, all to ask a question the phone number answers in one line.
 * That form now lives on /contact, where it has a column to itself, and the
 * widget does the one thing a floating button is good for: hand over the number
 * without taking the screen.
 *
 * So it opens where it is, above the button in the corner, rather than in the
 * middle of the viewport. Nothing behind it is covered or frozen, and whatever
 * the reader was looking at when it appeared is still there.
 */

/** Fraction of the scrollable distance that brings the card up by itself. */
const OPEN_AT = 0.4;

/**
 * Routes that never auto-open the card.
 *
 * All three already end in a contact section with the phone number, the
 * email and the office on it, so the interruption buys nothing it isn't
 * already offering — and on /about, 40% of the way down lands in the middle of
 * the bio or the FAQ, which is someone reading rather than someone stuck. The
 * Fort Worth guide is the same case at greater length: 40% down is the middle
 * of the neighbourhood index, and the person there is doing exactly what the
 * page was written for.
 * Interrupting a reader to ask whether they need help is how a helper turns
 * into a nuisance, which is the same reasoning as `autoOpenSpent` below.
 *
 * This suppresses the ambush, not the widget: the button stays on all of them.
 */
const NO_AUTO_OPEN = ["/about", "/contact", "/communities/fort-worth"];

/**
 * Routes with no button either.
 *
 * Only /contact, and only because that page is already the number, the email
 * and the form, set into the page and read in order. A button floating over it
 * offering the number a third time is the site talking over itself.
 */
const NO_DOCK = ["/contact"];

const telHref = `tel:${site.phone.replace(/[^0-9+]/g, "")}`;

export function MessageWidget() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const phoneRef = useRef<HTMLAnchorElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const uid = useId();
  const cardId = `${uid}-card`;
  const titleId = `${uid}-title`;
  const pathname = usePathname();

  // Set once the card has shown itself, and never unset. Being dismissed is an
  // answer; asking again is how a helper turns into a nuisance.
  const autoOpenSpent = useRef(false);

  const close = useCallback((restoreFocus = true) => {
    autoOpenSpent.current = true;
    setOpen(false);
    if (restoreFocus) buttonRef.current?.focus({ preventScroll: true });
  }, []);

  /**
   * Open once the reader is more than 40% of the way down.
   *
   * Measured against the distance actually scrollable rather than the document
   * height, so it means "40% of the way through" on any screen instead of
   * firing at a fixed pixel depth. A page too short to scroll never triggers,
   * and neither does a route in NO_AUTO_OPEN.
   *
   * Focus is left where it is: the card arrived uninvited, so it does not get
   * to take the caret out of whatever the reader was doing.
   */
  useEffect(() => {
    if (NO_AUTO_OPEN.includes(pathname) || NO_DOCK.includes(pathname)) return;

    const onScroll = () => {
      if (autoOpenSpent.current) return;
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      if (window.scrollY / scrollable >= OPEN_AT) {
        autoOpenSpent.current = true;
        setOpen(true);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll(); // in case the browser restored a mid-page scroll position
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    // Anywhere else is a dismissal. There is no scrim to click — the page is
    // live behind the card — so the click that dismisses it also does whatever
    // it was going to do, and focus stays wherever that click put it.
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) close(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, close]);

  if (NO_DOCK.includes(pathname)) return null;

  return (
    /* Both pieces in one bottom-anchored column, so the card sits on the button
       rather than being positioned to guess where the button is. Above the
       header (z-50) and the map pop-out.

       The container spans the width to cap the card on a phone, so it must not
       swallow clicks along the bottom of the page: pointer events are off here
       and back on for the two things that want them. */
    <div
      ref={rootRef}
      className="pointer-events-none fixed bottom-5 left-5 right-5 z-[60] flex flex-col items-end gap-3 sm:bottom-7 sm:left-7 sm:right-7"
    >
      {open && (
        <div
          id={cardId}
          role="dialog"
          aria-labelledby={titleId}
          className="pointer-events-auto relative w-full max-w-[23rem] origin-bottom-right rounded-[4px] border border-ink/12 bg-limestone-pale px-6 pb-5 pt-6 text-center shadow-[0_20px_50px_rgba(27,36,55,0.28)] motion-safe:animate-[pop-in_260ms_cubic-bezier(0.2,0.9,0.3,1.15)]"
        >
          <button
            type="button"
            onClick={() => close()}
            aria-label="Close"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-[3px] text-ink-muted transition-colors hover:bg-limestone-deep hover:text-ink"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
              <path
                d="M2 2l12 12M14 2L2 14"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
              />
            </svg>
          </button>

          <h2
            id={titleId}
            className="text-[15px] leading-relaxed text-ink-soft"
          >
            Do you have questions?
            <br />
            Call or text today, we are here to help!
          </h2>

          <a
            ref={phoneRef}
            href={telHref}
            className="mt-4 flex items-center justify-center gap-2.5 text-ink transition-colors hover:text-brass-deep"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-5 w-5 shrink-0 text-brass-deep"
              aria-hidden="true"
            >
              <path
                d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>
            <span className="display text-[26px] leading-none">
              {site.phone}
            </span>
          </a>

          {/* The number above is the only thing here that does anything, so the
              consent it carries has to be readable next to it rather than
              filed somewhere else. */}
          <p className="mt-5 text-[10px] leading-snug text-ink-muted">
            I agree to be contacted by {site.name} via text, call &amp; email.
            To opt out, reply &lsquo;stop&rsquo; or click unsubscribe.
          </p>
        </div>
      )}

      {/* Round, brass, and stays put while the card is open — the card is
          attached to it, and a button that vanishes under its own panel leaves
          nothing to press to put the panel away.

          The mark's own gold rather than the pale gold of .btn-brass: this one
          floats over whatever the page happens to be under it, ink sections
          included, and the pale tint reads as washed-out limestone there. Matte,
          like every other brass on the site — a pigment, never a gradient. The
          shadow is tinted with it so the button doesn't sit in a grey halo. */}
      <button
        ref={buttonRef}
        type="button"
        onClick={() => {
          if (open) {
            close();
            return;
          }
          autoOpenSpent.current = true;
          setOpen(true);
          // Opened on purpose, so the number is what was asked for.
          requestAnimationFrame(() =>
            phoneRef.current?.focus({ preventScroll: true })
          );
        }}
        aria-expanded={open}
        aria-controls={open ? cardId : undefined}
        aria-haspopup="dialog"
        aria-label={open ? "Close the contact card" : `Call or text ${site.phone}`}
        className="pointer-events-auto flex h-14 w-14 items-center justify-center rounded-full bg-brass text-ink shadow-[0_10px_30px_rgba(110,90,14,0.4)] transition-colors duration-200 hover:bg-brass-pale"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path
            d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
