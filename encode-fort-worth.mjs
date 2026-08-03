/**
 * Encode the /communities/fort-worth imagery from the originals in media/.
 *
 * Run after dropping a new original in: `node encode-fort-worth.mjs`.
 *
 * Two encodes per image, for the reason encode-about-hero.mjs sets out: assets
 * in /public bypass the custom next/image loader and are served exactly as they
 * sit on disk, so with a single file the phone downloads the desktop one. Each
 * picks between them with a <picture media> switch at 768px.
 *
 * Widths are chosen for the job each image does on the page, not for the source
 * it came from:
 *
 *  - The hero is a full-bleed background under an ink scrim at 55-80%, so it is
 *    never read closely and 1600px covers a 1440 viewport comfortably. It is
 *    capped at the source's own width rather than stretched past it: an earlier
 *    original here was 740px and had to be enlarged with a sharpening pass to
 *    survive, which is a thing to avoid and not a thing to keep. `enlarge` is
 *    the switch for that, and nothing sets it now.
 *  - The other two are plates: bounded rectangles roughly half to full container
 *    width, read at arm's length. They have real resolution behind them, so they
 *    are only ever reduced (`withoutEnlargement`) and need no sharpening.
 *
 * Sources are read by content, not by extension — the skyline original is named
 * .avif and is in fact a PNG, which sharp handles and which nothing here needs
 * to care about.
 */
import sharp from "sharp";
import { existsSync, statSync } from "fs";

/** One source, one output. `enlarge` is opt-in: see the note above. */
const JOBS = [
  {
    src: "media/fort-worth-skyline.avif",
    file: "public/fort-worth-hero.webp",
    width: 1600,
    quality: 74,
  },
  {
    src: "media/fort-worth-skyline.avif",
    file: "public/fort-worth-hero-mobile.webp",
    width: 1100,
    quality: 70,
  },
  {
    src: "media/sudance-square-plaza.png",
    file: "public/fort-worth-sundance.webp",
    width: 1400,
    quality: 68,
  },
  {
    src: "media/sudance-square-plaza.png",
    file: "public/fort-worth-sundance-mobile.webp",
    width: 900,
    quality: 68,
  },
  {
    src: "media/neighbourhood.jpg",
    file: "public/fort-worth-neighborhood.webp",
    width: 1300,
    quality: 72,
  },
  {
    src: "media/neighbourhood.jpg",
    file: "public/fort-worth-neighborhood-mobile.webp",
    width: 850,
    quality: 68,
  },
  {
    src: "media/stockyard-station.png",
    file: "public/fort-worth-stockyards.webp",
    width: 1400,
    quality: 68,
  },
  {
    src: "media/stockyard-station.png",
    file: "public/fort-worth-stockyards-mobile.webp",
    width: 900,
    quality: 68,
  },
  // The share card. Fixed 1200x630 because that is the box every platform
  // crops to, and JPEG rather than WebP because the crawlers that fetch it are
  // not browsers and not all of them decode WebP.
  {
    src: "media/fort-worth-skyline.avif",
    file: "public/fort-worth-og.jpg",
    width: 1200,
    height: 630,
    quality: 82,
  },
];

const missing = [...new Set(JOBS.map((j) => j.src))].filter(
  (s) => !existsSync(s)
);
if (missing.length) {
  console.error(
    `Missing source${missing.length > 1 ? "s" : ""}:\n  ${missing.join("\n  ")}\n` +
      `Save the artwork there (largest version you have), then re-run.`
  );
  process.exit(1);
}

let lastSrc = "";
for (const { src, file, width, height, quality, enlarge } of JOBS) {
  if (src !== lastSrc) {
    const meta = await sharp(src).metadata();
    console.log(`\nsource: ${src} — ${meta.width}x${meta.height}`);
    lastSrc = src;
  }

  // A height is only given where the box is fixed by something outside this
  // project — the share card. Everything else is resized on width alone so the
  // source's own aspect survives.
  let pipe = sharp(src).resize(width, height ?? null, {
    kernel: "lanczos3",
    fit: "cover",
    withoutEnlargement: !enlarge,
  });
  if (enlarge) pipe = pipe.sharpen({ sigma: 0.8, m1: 0.5, m2: 0.7 });

  await pipe[file.endsWith(".jpg") ? "jpeg" : "webp"]({
    quality,
    ...(file.endsWith(".jpg") ? { mozjpeg: true } : { effort: 6 }),
  }).toFile(file);

  const kb = (statSync(file).size / 1024).toFixed(1);
  console.log(
    `  ${file.padEnd(45)} ${String(width).padStart(5)}px  ${kb.padStart(7)} KB`
  );
}
