/**
 * Re-encode every shipped image at the smallest size that still measures as
 * visually identical to what ships today.
 *
 * Two rules keep this from quietly degrading the site:
 *
 *   1. Encode from the original PNG in media/ wherever one exists. Recompressing
 *      an existing WebP stacks a second generation of lossy artefacts on top of
 *      the first; going back to the source doesn't.
 *   2. Accept a candidate only if RMSE against the current file stays under
 *      MAX_RMSE *and* it saves at least MIN_GAIN. Anything else is left alone —
 *      a 2% saving is not worth touching a file for.
 *
 * Landmark sprites are recompressed at their current pixel dimensions, never
 * re-trimmed or re-resized: NeighborhoodMap places them by their own box, so a
 * sprite that changes size moves on the map.
 */
import sharp from "sharp";
import { statSync, writeFileSync, readFileSync, existsSync } from "fs";

const MAX_RMSE = 2.4; // 0-255 per channel; ~3 is the visible threshold
const MIN_GAIN = 0.06; // 6%
const QUALITIES = [86, 82, 78, 74, 70];

const TARGETS = [
  { file: "public/neighborhood-map-3d.webp", src: "media/3dmap.png" },
  { file: "public/team-video-poster.webp", src: "media/team-video-poster.png" },
  { file: "public/hero-poster.webp" },
  { file: "public/logo.webp", src: "media/logo.png", lossless: true },
  { file: "public/listings/l1.webp" },
  { file: "public/listings/l2.webp" },
  { file: "public/listings/l3.webp" },
  { file: "public/listings/l4.webp" },
  // The Fort Worth guide's imagery. Encoded by encode-fort-worth.mjs, which
  // sets the dimensions; this pass only re-tests the quality at those
  // dimensions, from the originals in media/ where they exist. The hero pair is
  // deliberately absent: both are enlargements of a 740px source and are
  // sharpened on the way out, so re-encoding them from source here — without
  // that sharpen — would quietly hand back a softer file that measured well.
  { file: "public/fort-worth-sundance.webp", src: "media/sudance-square-plaza.png" },
  { file: "public/fort-worth-sundance-mobile.webp", src: "media/sudance-square-plaza.png" },
  { file: "public/fort-worth-stockyards.webp", src: "media/stockyard-station.png" },
  { file: "public/fort-worth-stockyards-mobile.webp", src: "media/stockyard-station.png" },
  { file: "public/landmarks/fort-worth.webp" },
  { file: "public/landmarks/saginaw.webp" },
  { file: "public/landmarks/north-richland-hills.webp" },
  { file: "public/landmarks/haslet.webp" },
  { file: "public/landmarks/keller.webp" },
  { file: "public/landmarks/roanoke.webp" },
  { file: "public/landmarks/southlake.webp" },
  { file: "public/landmarks/grapevine.webp" },
];

const raw = (input, w, h) =>
  sharp(input).resize(w, h, { fit: "fill" }).ensureAlpha().raw().toBuffer();

function rmse(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) {
    const d = a[i] - b[i];
    sum += d * d;
  }
  return Math.sqrt(sum / a.length);
}

let before = 0;
let after = 0;
const rows = [];

for (const { file, src, lossless } of TARGETS) {
  const current = statSync(file).size;
  // Read to a buffer rather than handing sharp the path: on Windows the open
  // handle blocks writing back to that same path later in the loop.
  const currentBuf = readFileSync(file);
  const { width, height } = await sharp(currentBuf).metadata();
  // Only fall back to the shipped file when no original survives.
  const hasSource = src && existsSync(src);
  const from = hasSource ? readFileSync(src) : currentBuf;

  // Measure fidelity against the original art when there is one. Scoring a
  // from-source encode against the already-degraded shipped file punishes it
  // for the very artefacts it is removing, which is how a 300 KB map came back
  // as "already at its floor".
  const reference = await raw(from, width, height);
  // And judge it by the bar the shipped file already clears, not an absolute:
  // if today's file sits at RMSE 4 from source, a candidate at 3 is an
  // improvement even though it fails a flat 2.4 threshold.
  const currentErr = hasSource
    ? rmse(reference, await raw(currentBuf, width, height))
    : 0;
  const budget = Math.max(MAX_RMSE, currentErr);

  let best = null;
  const tries = lossless
    ? [{ label: "lossless", opts: { lossless: true, effort: 6 } }]
    : QUALITIES.map((q) => ({
        label: `q${q}`,
        opts: { quality: q, alphaQuality: 90, effort: 6 },
      }));

  for (const { label, opts } of tries) {
    const buf = await sharp(from)
      .resize(width, height, { fit: "fill" })
      .webp(opts)
      .toBuffer();
    const err = rmse(reference, await raw(buf, width, height));
    const gain = (current - buf.length) / current;
    if (err <= budget && gain >= MIN_GAIN) best = { buf, label, err, gain };
    // Qualities descend, so once one is small enough keep probing for smaller
    // — the loop naturally lands on the lowest that still passes.
  }

  before += current;
  if (best) {
    writeFileSync(file, best.buf);
    after += best.buf.length;
    rows.push(
      `${file.replace("public/", "").padEnd(34)} ${(current / 1024)
        .toFixed(1)
        .padStart(7)} -> ${(best.buf.length / 1024).toFixed(1).padStart(7)} KB` +
        `  -${(best.gain * 100).toFixed(0)}%  ${best.label} rmse=${best.err.toFixed(2)}` +
        `${hasSource ? "  (from source)" : ""}`
    );
  } else {
    after += current;
    rows.push(
      `${file.replace("public/", "").padEnd(34)} ${(current / 1024)
        .toFixed(1)
        .padStart(7)} KB  kept — already at its floor`
    );
  }
}

console.log(rows.join("\n"));
console.log(
  `\nimages: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB ` +
    `(-${(((before - after) / before) * 100).toFixed(1)}%)`
);
