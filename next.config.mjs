/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Origins allowed to reach the dev server's internal /_next/* endpoints.
  //
  // Without this, `next dev` only trusts localhost. Open the site from a phone
  // on the LAN and the document and assets still load — so the page looks
  // fine — but the dev runtime's socket handshake is refused, React never
  // hydrates, and nothing that depends on JavaScript runs: no scroll reveals,
  // no listings rotation, no map pop-out. Desktop hides the problem entirely
  // because it comes in on localhost.
  //
  // Dev only; `next build` ignores it. The wildcards cover the usual home and
  // hotspot ranges so a DHCP lease change doesn't silently break testing again.
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "192.168.0.102",
    "192.168.*.*",
    "10.*.*.*",
    "172.16.*.*",
  ],

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
