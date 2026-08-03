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

## Hero footage

`npm run optimize` covers the images. The hero loop is encoded by hand from
[`media/hero-source.mp4`](./media/hero-source.mp4) (1920×1080), in two variants —
[`HeroBackdrop`](./components/HeroBackdrop.tsx) picks one after paint and never
loads both.

The phone variant is centre-cropped to 9:16 **before** scaling. The hero is
`min-h-dvh`, so on a portrait phone `object-cover` discards most of a 16:9
frame's width; cropping at the source keeps the encoded pixels on screen instead
of upscaling a surviving sliver.

```bash
# Wide — 1280x720, ~1.5MB. Shipped above 768px.
ffmpeg -i media/hero-source.mp4 -vf scale=1280:720 -c:v libvpx-vp9 -crf 32 -b:v 0 -an public/hero.webm
ffmpeg -i media/hero-source.mp4 -vf scale=1280:720 -c:v libx264 -preset veryslow -pix_fmt yuv420p -an -movflags +faststart public/hero.mp4

# Phone — 608x1080, first 8s. ~295KB webm / ~492KB mp4. Two-pass, rate-targeted;
# CRF overshoots badly on this footage (crf 36 landed at 1.27MB).
VF="crop=608:1080:656:0"
ffmpeg -t 8 -i media/hero-source.mp4 -vf "$VF" -c:v libvpx-vp9 -b:v 300k -maxrate 600k -bufsize 1200k -row-mt 1 -cpu-used 1 -pix_fmt yuv420p -an -pass 1 -f null /dev/null
ffmpeg -t 8 -i media/hero-source.mp4 -vf "$VF" -c:v libvpx-vp9 -b:v 300k -maxrate 600k -bufsize 1200k -row-mt 1 -cpu-used 1 -pix_fmt yuv420p -an -pass 2 public/hero-mobile.webm
ffmpeg -t 8 -i media/hero-source.mp4 -vf "$VF" -c:v libx264 -preset veryslow -profile:v main -level 4.0 -b:v 500k -maxrate 1000k -bufsize 2000k -pix_fmt yuv420p -an -movflags +faststart -pass 1 -f null /dev/null
ffmpeg -t 8 -i media/hero-source.mp4 -vf "$VF" -c:v libx264 -preset veryslow -profile:v main -level 4.0 -b:v 500k -maxrate 1000k -bufsize 2000k -pix_fmt yuv420p -an -movflags +faststart -pass 2 public/hero-mobile.mp4
```

Keep the mp4s: iOS Safari's VP9-in-WebM support is unreliable, so the mp4 is
what actually plays on an iPhone. Per [`public/_headers`](./public/_headers),
media is cached for 30 days under an unhashed name — bump the filename rather
than replacing one of these in place.

> The wide-variant commands above are reconstructed to match the shipped files,
> which predate this note; the phone commands are exactly what produced them.

### Rating the phone encode

Scored with VMAF against the native crop, so changes can be checked rather than
guessed at. `ffmpeg -i cand.webm -i ref.mkv -lavfi "[0:v]setpts=PTS-STARTPTS[d];[1:v]setpts=PTS-STARTPTS[r];[d][r]libvmaf"`
— note `-v error` suppresses the score line, it prints at info level.

Two findings worth not rediscovering. **Bytes are better spent on the crop than
on pixel count**: 540×960 @190k scored 69.7, while 608×1080 @300k on the 8s trim
scores 83.5 for effectively the same file size, because the trim pays for the
resolution. And **H.264 is far behind VP9 here** — the original 540×960 @230k
mp4 scored 47.6, which is why the mp4 rung is rated so much higher than its
size suggests it needs to be.

Above ~85 there is nothing left to buy: a 9:16 slice of a 1080p frame is only
608px wide, so a DPR-3 phone upscales it ~1.9× no matter what. AV1 was measured
(216KB @ 85.8) and rejected — it saves ~79KB over VP9, but a third `<source>`
needs an exact `codecs=` string, and if it is wrong Safari selects the AV1 file
and fails outright instead of falling through.

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
