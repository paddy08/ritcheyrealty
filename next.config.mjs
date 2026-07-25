/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Fully static build — outputs to ./out for Cloudflare Pages (no server runtime).
  output: "export",

  images: {
    // Custom loader keeps responsive srcset generation in the static export by
    // delegating resizing/format to Unsplash's CDN. See lib/imageLoader.ts.
    // Swap for optimized local/AI-generated assets before a real launch.
    loader: "custom",
    loaderFile: "./lib/imageLoader.ts",
  },
};

export default nextConfig;
