// Central site config + placeholder demo content.
// All listing/testimonial data below is FICTIONAL sample content created for this
// demo — none of it is scraped from the live Ritchey Realty site.

export const site = {
  name: "Ritchey Realty",
  agent: "Kallie Ritchey",
  tagline: "Fort Worth & DFW Real Estate",
  phone: "(817) 555-0142", // placeholder
  email: "hello@ritcheyrealty.com", // placeholder
  serviceArea:
    "Fort Worth, Grapevine, Keller, Haslet, North Richland Hills, Roanoke, Saginaw & Southlake",
};

// Kallie's title, bio and figures below are taken from ritcheyrealty.com
// (/about-kallie). Nothing here is invented.
export const agent = {
  name: "Kallie Ritchey",
  role: "REALTOR® · Broker/Owner",
  photo:
    "https://images.squarespace-cdn.com/content/v1/60788ddcc0d7c6232712c990/287c2f30-59a5-4822-b7db-11b071bec47c/Kallies+New+Headshot.jpg",
  license: "Broker 9004834 | RE 603353",
  statement: "Licensed since 2010. Broker since 2015. Around 50 sales a year.",
  bio: [
    "A REALTOR®, Broker/Owner of Ritchey Realty, and a national real estate coach with the Tom Ferry organization — known for balanced expertise across both traditional and luxury markets throughout North Texas.",
    "Based in Keller, Kallie has guided hundreds of clients through homes ranging from family neighbourhoods to custom estates in Southlake, Westlake, Trophy Club, Roanoke and Grapevine. She holds a Master of Science from UT Arlington and is a certified Texas Real Estate Commission instructor.",
  ],
  // Real, checkable figures — not marketing rounds.
  facts: [
    { label: "Licensed since", value: "2010" },
    { label: "Broker since", value: "2015" },
    { label: "Sales a year", value: "~50" },
    { label: "Google reviews", value: "50+" },
  ],
};

/**
 * The team, from ritcheyrealty.com/team-page and the individual profile pages.
 * Titles and bio lines are the site's own words, trimmed — none invented.
 *
 * Two members publish a photograph; the rest fall back to a monogram, because
 * putting a stock face under a real person's name would misrepresent them.
 * Drop a URL into `photo` and it takes over.
 *
 * Direct mobile numbers and personal email addresses are published on the live
 * site but are deliberately not committed here; enquiries route to the office.
 */
export type TeamMember = {
  name: string;
  role: string;
  email?: string;
  photo?: string;
  license?: string;
};

export const team: TeamMember[] = [
  {
    name: "Kelly Saint Patrick",
    role: "Marketing & Events Director",
    email: "kelly@ritcheyrealty.com",
    photo: "/team/kelly_patrick.webp",
  },
  {
    name: "Jared Holbert",
    role: "Agent",
    license: "0601709",
    photo: "/team/jared_holbert.webp",
  },
  {
    name: "David Capps",
    role: "Agent",
    license: "819141",
    photo: "/team/david_capps.webp",
  },
  {
    name: "Brittany Terry",
    role: "Agent",
    license: "0722815",
    photo: "/team/brittany_terry.webp",
  },
  {
    name: "Chasstin Terry",
    role: "Agent",
    license: "0768595",
    photo: "/team/chasstin_terry.webp",
  },
];

/**
 * Intro video — https://youtu.be/x4Twesrbl4U
 *
 * `poster` wins when set. Point it at any file in /public and it replaces the
 * YouTube thumbnail, which for this video tops out at 640x480 and is soft on a
 * full-width plate. A 1920x1080 still is the fix.
 */
export const introVideo = {
  youtubeId: "x4Twesrbl4U",
  title: "Meet the Ritchey Realty team",
  // Save the supplied still here. If the file is absent the plate falls back
  // to YouTube's own thumbnail, so a missing poster degrades rather than breaks.
  poster: "/team-video-poster.webp",
};

export const nav = [
  { label: "Home", href: "/" },
  { label: "Communities", href: "/communities" },
  { label: "About", href: "/about" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Property Search", href: "/search" },
  { label: "Contact", href: "/contact" },
];

export type Listing = {
  id: string;
  title: string;
  address: string;
  city: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  status: "For Sale" | "New Listing" | "Pending";
  image: string;
  alt: string;
};

// Fictional sample listings — do not present as real inventory.
// Imagery self-hosted as WebP: served from Unsplash it cost a third-party DNS+TLS
// round trip on the critical path, which measured as 1.3s of LCP load delay.
export const featuredListings: Listing[] = [
  {
    id: "l1",
    title: "Modern Farmhouse Retreat",
    address: "412 Meadowlark Lane",
    city: "Southlake, TX",
    price: "$1,250,000",
    beds: 4,
    baths: 4,
    sqft: "3,940",
    status: "New Listing",
    image:
      "/listings/l1.webp",
    alt: "Sample listing: white modern farmhouse with a manicured front lawn",
  },
  {
    id: "l2",
    title: "Craftsman on a Corner Lot",
    address: "1809 Bluebonnet Court",
    city: "Keller, TX",
    price: "$685,000",
    beds: 3,
    baths: 3,
    sqft: "2,510",
    status: "For Sale",
    image:
      "/listings/l2.webp",
    alt: "Sample listing: brick craftsman home with a covered front porch",
  },
  {
    id: "l3",
    title: "Sunlit Transitional",
    address: "233 Trinity Bend",
    city: "Grapevine, TX",
    price: "$549,000",
    beds: 4,
    baths: 3,
    sqft: "2,780",
    status: "For Sale",
    image:
      "/listings/l3.webp",
    alt: "Sample listing: two-story transitional home at dusk with warm interior lighting",
  },
  {
    id: "l4",
    title: "Downtown Loft Living",
    address: "500 Magnolia Ave, #7",
    city: "Fort Worth, TX",
    price: "$420,000",
    beds: 2,
    baths: 2,
    sqft: "1,640",
    status: "Pending",
    image:
      "/listings/l4.webp",
    alt: "Sample listing: exterior of a brick building with ground-floor windows",
  },
];

export type Community = {
  name: string;
  blurb: string;
  // Real coordinates. These drive three things: the coordinate readout, the
  // west-to-east ordering of the range line, and — projected against the map's
  // corner bounds in NeighborhoodMap — where each pin lands on the map itself.
  lat: number;
  lon: number;
};

/** Format a coordinate pair the way a plat does: 32.7555° N, 97.3308° W */
export function formatCoords({ lat, lon }: Pick<Community, "lat" | "lon">) {
  return `${lat.toFixed(4)}° N, ${Math.abs(lon).toFixed(4)}° W`;
}

// Original short copy written for this demo (not copied from the live site).
export const communities: Community[] = [
  {
    name: "Fort Worth",
    blurb:
      "Cowtown grit meets a real arts district — Fort Worth keeps its character while the market keeps climbing.",
    lat: 32.7555,
    lon: -97.3308,
  },
  {
    name: "Saginaw",
    blurb:
      "Approachable, tight-knit, and an easy commute — a quiet foothold just north of Fort Worth.",
    lat: 32.8601,
    lon: -97.3644,
  },
  {
    name: "Haslet",
    blurb:
      "Room to breathe on the north edge — newer builds and acreage without leaving the metroplex.",
    lat: 32.9757,
    lon: -97.3478,
  },
  {
    name: "Roanoke",
    blurb:
      "The self-proclaimed Unique Dining Capital of Texas — small-town scale with a big appetite for growth.",
    lat: 33.004,
    lon: -97.2258,
  },
  {
    name: "Keller",
    blurb:
      "Family-first neighborhoods, green trails, and a small-town feel that reliably holds its value.",
    lat: 32.9346,
    lon: -97.2517,
  },
  {
    name: "Southlake",
    blurb:
      "Top-rated schools and polished master-planned living, minutes from DFW Airport.",
    lat: 32.9412,
    lon: -97.1342,
  },
  {
    name: "Grapevine",
    blurb:
      "Historic Main Street charm, lake access, and a walkable heart with genuine personality.",
    lat: 32.9343,
    lon: -97.0781,
  },
  {
    // Pinned at the I-820 / SH-121 / SH-183 interchange rather than at the
    // Mid-Cities Blvd city-hall coordinate ~0.75 mi west. Both sit inside NRH;
    // the interchange is the landmark a reader actually recognises on the map.
    name: "North Richland Hills",
    blurb:
      "Established, well-connected, and one of the mid-cities' best values for space.",
    lat: 32.83,
    lon: -97.215,
  },
];

// The range line reads left-to-right as you'd drive it: west to east. Ordering
// by longitude is the information the line carries, so it's derived, not typed.
export const stations: Community[] = [...communities].sort(
  (a, b) => a.lon - b.lon
);

// Placeholder community imagery (Unsplash). Base URLs — the custom loader adds
// sizing. Swap for local/AI-generated assets before a real launch.
export const communityImages: Record<string, { src: string; alt: string }> = {
  "Fort Worth": {
    src: "/listings/l3.webp",
    alt: "Sample imagery: a warm two-story home at dusk",
  },
  Southlake: {
    src: "/listings/l1.webp",
    alt: "Sample imagery: a modern white farmhouse",
  },
  Keller: {
    src: "/listings/l2.webp",
    alt: "Sample imagery: a brick home with a covered porch",
  },
  Grapevine: {
    src: "/listings/l4.webp",
    alt: "Sample imagery: a suburban home exterior",
  },
  "North Richland Hills": {
    src: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750",
    alt: "Sample imagery: an aerial view of a residential neighborhood",
  },
  Roanoke: {
    src: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
    alt: "Sample imagery: a bright, open interior",
  },
  Haslet: {
    src: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914",
    alt: "Sample imagery: a single-story home with a manicured lawn",
  },
  Saginaw: {
    src: "https://images.unsplash.com/photo-1512915922686-57c11dde9b6b",
    alt: "Sample imagery: a cozy suburban street",
  },
};

/**
 * Aggregate star ratings, shown as the testimonial section's header stat.
 *
 * PLACEHOLDER FIGURES. Only the review *count* is a checked fact — it comes
 * from ritcheyrealty.com and is also carried in `agent.facts` above. Neither
 * star rating has been verified against Google or Zillow, so both are marked
 * here rather than in a comment somewhere the next person won't read. Replace
 * with the real numbers before this goes anywhere near production; the section
 * renders whatever is in this array, so removing a source removes its stat.
 */
export type ReviewSource = {
  source: string;
  /** Out of 5. Placeholder — see above. */
  rating: number;
  /** Displayed verbatim, so "50+" and "31" both work. */
  count: string;
  verified: boolean;
};

export const reviewSources: ReviewSource[] = [
  { source: "Google", rating: 4.9, count: "50+", verified: false },
  { source: "Zillow", rating: 5.0, count: "20+", verified: false },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
  /** Out of 5, rendered as filled marks on the rail. */
  rating: number;
  /** Month and year only — a full date implies a record we don't hold. */
  date: string;
};

// Placeholder testimonials — sample copy written for this demo, not real reviews.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Kallie made our first home purchase feel calm and clear. She answered every question — even the ones we didn't know to ask — and never once made us feel rushed.",
    name: "The Alvarez Family",
    detail: "First-time buyers · Saginaw",
    rating: 5,
    date: "March 2025",
  },
  {
    id: "t2",
    quote:
      "We sold above asking in under two weeks. Her pricing strategy and staging advice were spot on, and communication was honestly better than any agent we'd worked with before.",
    name: "Dana & Michael R.",
    detail: "Sellers · Keller",
    rating: 5,
    date: "November 2024",
  },
  {
    id: "t3",
    quote:
      "Relocating from out of state is stressful, but Kallie knew every neighborhood we asked about in detail. We felt like we had a local friend guiding us the whole way.",
    name: "Priya S.",
    detail: "Relocation buyer · Southlake",
    rating: 5,
    date: "August 2024",
  },
  {
    id: "t4",
    quote:
      "Professional, warm, and genuinely on our side. She negotiated repairs we never would have caught and made closing day completely painless.",
    name: "The Bennett Family",
    detail: "Move-up buyers · Grapevine",
    rating: 5,
    date: "May 2024",
  },
];
