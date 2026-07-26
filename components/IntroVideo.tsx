"use client";

import { useState } from "react";
import { introVideo } from "@/lib/site";

/**
 * Click-to-play YouTube plate.
 *
 * A person talking is not ambient footage, so this never autoplays and never
 * plays muted — it waits for a real press, then loads with sound. Nothing from
 * YouTube is requested until then: the poster is a static thumbnail and the
 * player iframe is only mounted on click, which keeps the page's cost and its
 * third-party cookies at zero for anyone who doesn't watch.
 */
export function IntroVideo() {
  const { youtubeId, title, poster } = introVideo;
  const [playing, setPlaying] = useState(false);

  // A supplied still always wins. Otherwise fall back to the best thumbnail
  // YouTube actually has for this upload: maxres and sd 404 (and answer with a
  // valid grey 120x90 JPEG, so onError never fires), leaving sd1 at 640x480.
  const still = poster || `https://i.ytimg.com/vi/${youtubeId}/sd1.jpg`;

  if (!youtubeId) {
    return (
      <div className="plate flex aspect-video w-full items-center justify-center bg-ink">
        <p className="caption-on-ink text-center">
          Intro video — add the YouTube ID to <code>introVideo</code> in
          lib/site.ts
        </p>
      </div>
    );
  }

  return (
    <div className="plate aspect-video w-full bg-ink">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="group absolute inset-0 h-full w-full"
          aria-label={`Play video: ${title}`}
        >
          {/* Plain img: the project's next/image loader is host-aware and
              YouTube isn't one of its hosts. A missing local poster is a real
              404, so unlike YouTube's fake-200 thumbnails this onError does
              fire and the fallback works. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={still}
            onError={(e) => {
              const img = e.currentTarget;
              if (!img.dataset.fallback) {
                img.dataset.fallback = "1";
                img.src = `https://i.ytimg.com/vi/${youtubeId}/sd1.jpg`;
              }
            }}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 bg-ink/35 transition-colors duration-500 group-hover:bg-ink/20"
          />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-limestone/50 bg-ink/40 transition-all duration-300 group-hover:scale-105 group-hover:border-brass-pale"
          >
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-limestone-pale">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          {/* No title overlay: the supplied poster already has the film's
              title set into the artwork, and printing it twice would fight it.
              The label lives on the button's accessible name instead. */}
          <span className="absolute right-0 top-0 p-6">
            <span className="caption-on-ink">Watch</span>
          </span>
        </button>
      )}
    </div>
  );
}
