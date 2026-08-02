/**
 * media/*.png (the supplied renders) -> public/landmarks/*.webp (what ships).
 *
 * Three steps, and only the middle one is interesting:
 *   1. Key out the background, if the render has one baked in.
 *   2. Trim to the artwork's own bounding box.
 *   3. Resize to 560 wide and encode as WebP with alpha.
 *
 * The key is a flood fill inward from the border rather than a global "delete
 * every white pixel". These are buildings with white stonework and pale
 * rooflines; a global key punches holes straight through them. A fill can only
 * reach background that is actually connected to the edge of the canvas.
 */
import sharp from "sharp";

const OUT_W = 560;
const TOL = 34; // colour distance still counted as background
const SOFT = 76; // distance at which a pixel is fully opaque again

const JOBS = [
  { src: "media/Keller.png", out: "keller", key: true },
  { src: "media/Roanoke.png", out: "roanoke", key: false },
  { src: "media/grapevine.png", out: "grapevine", key: true },
  { src: "media/Haslet.png", out: "haslet", key: false },
  { src: "media/southlake.png", out: "southlake", key: false },
];

/** Flood fill from the canvas edge, softening alpha at the boundary. */
async function keyBackground(file) {
  const img = sharp(file).ensureAlpha();
  const { data, info } = await img
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width: w, height: h } = info;
  const at = (x, y) => (y * w + x) * 4;

  // Background colour = the median of the four corners, so one stray pixel
  // can't set the key.
  const corners = [
    [0, 0],
    [w - 1, 0],
    [0, h - 1],
    [w - 1, h - 1],
  ].map(([x, y]) => {
    const i = at(x, y);
    return [data[i], data[i + 1], data[i + 2]];
  });
  const bg = [0, 1, 2].map((c) =>
    Math.round(corners.map((p) => p[c]).sort((a, b) => a - b)[1])
  );

  const dist = (i) =>
    Math.hypot(data[i] - bg[0], data[i + 1] - bg[1], data[i + 2] - bg[2]);

  // Iterative stack, not recursion — these are ~1.5M pixel canvases.
  const seen = new Uint8Array(w * h);
  const stack = [];
  for (let x = 0; x < w; x++) {
    stack.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y++) {
    stack.push([0, y], [w - 1, y]);
  }

  while (stack.length) {
    const [x, y] = stack.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const p = y * w + x;
    if (seen[p]) continue;
    const i = p * 4;
    const d = dist(i);
    if (d > SOFT) continue; // solidly part of the artwork — stop here
    seen[p] = 1;
    // Inside TOL it is background outright; between TOL and SOFT it is an
    // antialiased edge pixel, so it keeps partial alpha instead of leaving a
    // hard white fringe around the model.
    data[i + 3] =
      d <= TOL ? 0 : Math.round(255 * Math.min(1, (d - TOL) / (SOFT - TOL)));
    stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  return sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .toBuffer();
}

for (const { src, out, key } of JOBS) {
  const input = key ? await keyBackground(src) : src;
  const dst = `public/landmarks/${out}.webp`;
  const info = await sharp(input)
    .ensureAlpha()
    // Trim the transparent margin so every sprite's box is its artwork, which
    // is what the map's placement maths assumes.
    .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 2 })
    .resize({ width: OUT_W, withoutEnlargement: true })
    .webp({ quality: 82, effort: 6, alphaQuality: 90 })
    .toFile(dst);
  console.log(
    `${dst.padEnd(36)} ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`
  );
}
