# Ritchey Realty — Website Redesign Demo

A standalone demo concept for a rebuilt **Ritchey Realty** site (Kallie Ritchey,
Fort Worth / DFW). Built to showcase a fast, modern, "quiet luxury" redesign of
the site shell — the existing Ylopo IDX property search would plug into the
marked Property Search section rather than being rebuilt here.

> **Demo notice:** All listings, testimonials, and imagery are fictional /
> placeholder sample content created for this concept. Nothing is copied from
> the live ritcheyrealty.com site. Stock imagery is served from Unsplash and
> would be swapped for optimized local/AI-generated assets before any real launch.

## Tech stack

- **Next.js 16** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **next/image** with a custom Unsplash CDN loader (responsive `srcset` + AVIF/WebP)
- Fully **static export** (`output: "export"`) — no server runtime, deploys to any CDN
- Minimal client JS: a small IntersectionObserver reveal, the interactive map, and
  a CSS scroll-snap testimonial carousel. No animation libraries.

## Local development

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export → ./out
```

## Deployment — Cloudflare Pages (via GitHub)

This project builds to a fully static `out/` directory. Connect the GitHub repo
in the Cloudflare dashboard (**Workers & Pages → Create → Pages → Connect to
Git**) with these build settings:

| Setting                  | Value                              |
| ------------------------ | ---------------------------------- |
| Framework preset         | Next.js (Static HTML Export)       |
| Build command            | `npx next build`                   |
| Build output directory   | `out`                              |
| Root directory           | `/` (default)                      |
| Environment variable     | `NODE_VERSION` = `20`              |

The Node version is also pinned via [`.nvmrc`](./.nvmrc). Every push to the
default branch triggers an automatic build and deploy to the project's
`*.pages.dev` URL.

## Project structure

```
app/          App Router pages + root layout + global styles
components/    Header, Footer, FeaturedListings, NeighborhoodMap, TestimonialCarousel, Reveal
lib/          site.ts (config + placeholder content), imageLoader.ts (Unsplash loader)
```
