// Custom next/image loader for the static (output: "export") build.
//
// A plain static export would force images.unoptimized, which drops srcset
// generation entirely — the mobile hero would then download the full-size
// image. Instead we hand each request to the origin's own image CDN, which
// resizes and format-negotiates on the fly. This keeps the site fully static
// AND genuinely responsive/fast on mobile.

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function imageLoader({ src, width, quality }: LoaderArgs) {
  // Local static assets (in /public) are already optimized and served as-is;
  // they aren't absolute URLs, so skip the resizing logic.
  if (!/^https?:\/\//.test(src)) return src;

  const url = new URL(src);

  // Unsplash: placeholder property and community imagery.
  if (url.hostname === "images.unsplash.com") {
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    return url.toString();
  }

  // Squarespace: the team photographs still served from the current site.
  // Its CDN takes a single `format=<width>w` parameter and ignores the rest.
  if (url.hostname === "images.squarespace-cdn.com") {
    url.searchParams.set("format", `${width}w`);
    return url.toString();
  }

  // Any other host: hand the URL back untouched rather than corrupting it
  // with parameters it doesn't understand.
  return url.toString();
}
