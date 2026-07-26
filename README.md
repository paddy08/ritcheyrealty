# Ritchey Realty — Website Redesign Demo

A standalone demo concept for a rebuilt **Ritchey Realty** site (Kallie Ritchey,
Fort Worth / DFW). The design direction is a survey sheet: limestone paper,
bluebonnet ink, and brass drawn from the Ritchey Realty mark, with Libre Caslon
for display, Archivo for body, and DM Mono for data. The existing Ylopo IDX
property search would plug into the marked Property Search section rather than
being rebuilt here.

The homepage is organized around a **range line** — the eight towns Kallie works,
hung from a datum as survey stations and ordered true west-to-east by longitude
(see `stations` in [`lib/site.ts`](./lib/site.ts)). The same order reappears in
the footer and in the map's mobile control.

> **Demo notice:** All listings, testimonials, and imagery are fictional /
> placeholder sample content created for this concept. Nothing is copied from
> the live ritcheyrealty.com site. Stock imagery is served from Unsplash and
> would be swapped for optimized local/AI-generated assets before any real launch.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **next/image** with a custom Unsplash CDN loader (responsive `srcset` + AVIF/WebP)
- Fully **static export** (`output: "export"`) — no server runtime, deploys to any CDN
- Minimal client JS: a small IntersectionObserver reveal, the hero search field,
  and the interactive map. Everything else — the range line, the listing sheet,
  the testimonials — is a server component. No animation libraries.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

## Deployment — Cloudflare Workers (via GitHub)

This project builds to a fully static `out/` directory that is served as a
Workers **static-assets** deployment (no server runtime). Config lives in
[`wrangler.jsonc`](./wrangler.jsonc), which points `assets.directory` at `./out`.

Connected in the Cloudflare dashboard (**Workers & Pages → Create → Workers →
Connect to Git**) with:

| Setting              | Value                 |
| -------------------- | --------------------- |
| Build command        | `npx next build`      |
| Deploy command       | `npx wrangler deploy` |
| Environment variable | `NODE_VERSION` = `20` |

The Node version is also pinned via [`.nvmrc`](./.nvmrc). Every push to the
default branch triggers an automatic build and deploy to the project's
`*.workers.dev` URL. The Worker name in `wrangler.jsonc` must match the Worker
the build is attached to.

## Project structure

```
app/          App Router pages + root layout + global styles
components/    Header, Footer, RangeLine, HeroSearch, FeaturedListings, ListingCard,
              AgentIntro, NeighborhoodMap, TestimonialCarousel, Reveal
lib/          site.ts (config + placeholder content), imageLoader.ts (Unsplash loader)
```
