/**
 * A photograph laid on the paper, with the caption ruled under it.
 *
 * Three of these carry the Fort Worth page, and all three need the same two
 * things, so they are said once here rather than three times in the page:
 *
 * 1. A <picture> media switch instead of next/image. Local files in /public are
 *    handed straight back by the custom loader (lib/imageLoader.ts), so
 *    next/image would generate no srcset and ship the desktop file to every
 *    phone — see the same note on the About hero. Each image is encoded twice by
 *    encode-fort-worth.mjs, and `src` names the pair: "/x" resolves to "/x.webp"
 *    and "/x-mobile.webp".
 * 2. A stated aspect ratio. The box is reserved before the bytes arrive, so a
 *    plate landing mid-scroll cannot shove the section under it down the page.
 *
 * The frame itself is the site's `plate`: near-square corners, a hairline ink
 * edge, no shadow — a print on paper rather than a card. Captions are the mono
 * utility face and say what the photograph actually is; a caption that only
 * repeats the heading above it is worth less than the line it occupies.
 */
export function PhotoPlate({
  src,
  alt,
  caption,
  ratio = "aspect-[16/9]",
  className = "",
  priority = false,
}: {
  /** Path without extension: "/fort-worth-sundance". */
  src: string;
  alt: string;
  caption?: string;
  /** Tailwind aspect utility for the frame. */
  ratio?: string;
  className?: string;
  /** Above-the-fold plates only. Everything else stays lazy. */
  priority?: boolean;
}) {
  return (
    <figure className={className}>
      <div className={`plate ${ratio}`}>
        <picture>
          <source
            media="(max-width: 768px)"
            srcSet={`${src}-mobile.webp`}
            type="image/webp"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${src}.webp`}
            alt={alt}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
            className="h-full w-full object-cover"
          />
        </picture>
      </div>
      {caption && (
        <figcaption className="mt-3 font-mono text-[11px] leading-relaxed text-ink-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
