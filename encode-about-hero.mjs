/**
 * Encode the About hero backdrop from its original in media/.
 *
 * Run once after dropping a new original in: `node encode-about-hero.mjs`.
 *
 * Two encodes, because /public assets bypass the custom next/image loader and
 * are served exactly as they sit on disk — there is no srcset to fall back on,
 * so the phone would otherwise download the desktop file. The About hero picks
 * between them with a <picture media> switch.
 *
 * Widths are chosen for the job, not for the source: this is a background
 * behind a scrim at 30-55% limestone, so it is never read closely and does not
 * need to survive a 2x crop. 1800px covers a 1440 viewport at DPR 1.25 and
 * still looks clean at 2x once the scrim is over it.
 *
 * Once both files exist, add them to TARGETS in optimize-images.mjs so the
 * regular pass keeps them at their floor.
 */
import sharp from "sharp";
import { existsSync, statSync } from "fs";

const SRC = "media/about-hero.png";

const OUTPUTS = [
  { file: "public/about-hero.webp", width: 2000, quality: 76 },
  // Not "half the desktop file". The hero is min-h-dvh, so on a portrait phone
  // this landscape frame has to cover ~844px of height from ~940px of source —
  // object-cover scales it up to about 1500px wide before the crop, and a 3x
  // screen then wants 3x that again. At 900px the result was visibly soft. The
  // phone needs a LARGER file than its viewport width, not a smaller one.
  { file: "public/about-hero-mobile.webp", width: 1500, quality: 72 },
];

if (!existsSync(SRC)) {
  console.error(
    `Missing ${SRC}.\n` +
      `Save the hero artwork there (PNG or JPG, largest version you have), then re-run.`
  );
  process.exit(1);
}

const meta = await sharp(SRC).metadata();
console.log(`source: ${SRC} — ${meta.width}x${meta.height}\n`);

for (const { file, width, quality } of OUTPUTS) {
  await sharp(SRC)
    .resize(width, null, { withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(file);
  const kb = (statSync(file).size / 1024).toFixed(1);
  console.log(`${file.padEnd(34)} ${String(width).padStart(5)}px  ${kb.padStart(7)} KB`);
}
