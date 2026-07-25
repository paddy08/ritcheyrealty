// Custom next/image loader for the static (output: "export") build.
//
// A plain static export would force images.unoptimized, which drops srcset
// generation entirely — the mobile hero would then download the full-size
// image. Instead we hand each request to Unsplash's own image CDN, which
// resizes and format-negotiates (auto=format → AVIF/WebP) on the fly. This
// keeps the site fully static AND genuinely responsive/fast on mobile.

type LoaderArgs = {
  src: string;
  width: number;
  quality?: number;
};

export default function unsplashLoader({ src, width, quality }: LoaderArgs) {
  // Local static assets (in /public) are already optimized and served as-is;
  // they aren't absolute URLs, so skip the Unsplash resizing logic.
  if (!/^https?:\/\//.test(src)) return src;

  const url = new URL(src);
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 70));
  return url.toString();
}
