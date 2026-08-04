// Central site config + placeholder demo content.
// All listing/testimonial data below is FICTIONAL sample content created for this
// demo — none of it is scraped from the live Ritchey Realty site.

// Real, published contact details for the office — not placeholders. Only the
// listings, testimonials and team portraits below are demo content.
export const site = {
  name: "Ritchey Realty",
  agent: "Kallie Ritchey",
  tagline: "Fort Worth & DFW Real Estate",
  phone: "(682) 788-9060",
  email: "team@ritcheyrealty.com",
  address: {
    street: "9800 Hillwood Parkway, Suite 140",
    locality: "Fort Worth",
    region: "TX",
    postalCode: "76244",
  },
  serviceArea:
    "Fort Worth, Grapevine, Keller, Haslet, North Richland Hills, Roanoke, Saginaw & Southlake",
};

/** One line, the way you'd write it on an envelope. */
export const officeAddress = `${site.address.street}, ${site.address.locality}, ${site.address.region} ${site.address.postalCode}`;

/**
 * Kallie's profiles. Taken verbatim from the live ritcheyrealty.com footer and
 * checked to resolve — real accounts, not placeholders, so they open in a new
 * tab and are labelled for anyone who cannot see the mark.
 */
export const social = [
  { label: "Facebook", href: "https://www.facebook.com/KallieRitcheyRealty/" },
  {
    label: "Instagram",
    href: "https://www.instagram.com/kallieritcheyrealtor/",
  },
  {
    label: "YouTube",
    href: "https://www.youtube.com/@kallieritcheyrealtor9612",
  },
  { label: "TikTok", href: "https://www.tiktok.com/@kallieritchey_realtor" },
];

/**
 * The two notices the Texas Real Estate Commission requires a licence holder to
 * publish. Not decoration and not optional — every TREC-licensed brokerage site
 * carries both, which is why they sit in the footer of every page rather than on
 * a page of their own.
 *
 * Both URLs are the live site's own. The consumer notice is served off
 * ritcheyrealty.com as `/s/TREC.jpg`; it is written absolute here because a
 * site-relative path would resolve against this domain, where no such file
 * exists. The IABS form is the brokerage's PDF on Google Drive.
 */
export const disclosures = [
  {
    label: "Information About Brokerage Services",
    href: "https://drive.google.com/file/d/1ekeTzkH0wZdisj7rb4Vl4LD7D4UzXJ-N/view?usp=sharing",
  },
  {
    label: "TREC Consumer Protection Notice",
    href: "https://www.ritcheyrealty.com/s/TREC.jpg",
  },
];

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
  /**
   * The long version, for /about. Same three paragraphs the live site runs,
   * set to this site's voice — the claims are unchanged, only the phrasing
   * that read as brochure copy ("seamless experience", "measurable success")
   * has been dropped for the plainer register the rest of the page uses.
   */
  fullBio: [
    "Kallie Spencer Ritchey has been a licensed agent since 2010 and a broker since 2015. She owns Ritchey Realty, and she coaches other agents nationally with the Tom Ferry organization — which is a roundabout way of saying she has spent fifteen years both doing the work and teaching it.",
    "She is based in Keller and works the whole north side of the metroplex. Hundreds of clients so far, across a range that runs from family neighbourhoods to custom estates in Southlake, Westlake, Trophy Club, Roanoke and Grapevine. That spread is deliberate: she does not treat a first house and a seven-figure listing as different businesses.",
    "The credentials behind it are a Master of Science from the University of Texas at Arlington and certification as a Texas Real Estate Commission instructor. The practice behind it is around fifty transactions a year — buyers, sellers and investors — with the emphasis on how a property is marketed, how the negotiation is run, and what it actually closes at.",
  ],
  /** Her stated mission, quoted from ritcheyrealty.com/about-kallie. */
  mission:
    "Deliver an exceptional real estate experience rooted in trust, expertise, and results.",
  // Real, checkable figures — not marketing rounds.
  facts: [
    { label: "Licensed since", value: "2010" },
    { label: "Broker since", value: "2015" },
    { label: "Sales a year", value: "~50" },
    { label: "Google reviews", value: "63" },
  ],
};

/**
 * The credential line on /about — the range line's grammar, applied to a
 * career instead of a map.
 *
 * Two of these carry a year because two of them have one on the record. The
 * other four carry an institution. Nothing here is dated by inference: a
 * plausible-looking year against a real person's licence is exactly the kind
 * of invention the rest of this file avoids. That is why it is a credential
 * line and not a timeline.
 */
export type Credential = {
  /** The large figure — a year, or the issuing body. */
  mark: string;
  /** The mono label under it. */
  detail: string;
};

export const credentials: Credential[] = [
  { mark: "2010", detail: "Licensed agent" },
  { mark: "2015", detail: "Texas broker" },
  { mark: "UTA", detail: "Master of Science" },
  { mark: "TREC", detail: "Certified instructor" },
  { mark: "Tom Ferry", detail: "National coach" },
  { mark: "Owner", detail: "Ritchey Realty" },
];

/**
 * Media mentions listed on ritcheyrealty.com. Set as type, not logos — we hold
 * no licence to reproduce anyone's mark, and a wall of borrowed logos would be
 * the one un-drawn thing on a page built like a survey sheet.
 */
export const press: { outlet: string; kind: string }[] = [
  { outlet: "Real Producers Magazine", kind: "Feature" },
  { outlet: "570 AM · Real Estate Talk", kind: "Radio" },
  { outlet: "Local television", kind: "Segments" },
  { outlet: "Podcasts", kind: "Guest" },
];

/**
 * The three shapes of work the live site names: preparing a home for sale,
 * navigating a move-up purchase, and managing a high-end listing. Kept to
 * those three rather than expanded into a service menu we'd have to invent.
 */
export const services: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Selling",
    body: "Getting the house ready, pricing it against what is actually moving, and marketing it properly. The listing is the product, and it gets treated like one.",
  },
  {
    n: "02",
    title: "Moving up",
    body: "The hardest version of this job: selling and buying at once, on two timelines that have to meet. Most of the work is in sequencing, and most of the stress comes out of it when the sequencing is right.",
  },
  {
    n: "03",
    title: "Luxury listings",
    body: "Custom estates in Southlake, Westlake and Trophy Club. Same process, longer runway, and a much smaller pool of buyers to reach — which is a marketing problem before it is a pricing one.",
  },
];

/**
 * FAQ — /about.
 *
 * Every answer here is traceable to something already in this file or published
 * on ritcheyrealty.com; the source is named in a comment above each one. That
 * constraint is why there are eight and not fourteen. Questions this file
 * cannot answer honestly — commission, average days on market, whether she'll
 * take a particular listing — are left off rather than filled in with a
 * plausible number, because a real business would be held to whatever this page
 * says.
 *
 * Rendered by components/Faq.tsx and, from the same array, as FAQPage JSON-LD.
 * One source, so the markup cannot drift from the visible text.
 */
export type Faq = { q: string; a: string };

export const faqs: Faq[] = [
  {
    // Source: `communities` above, plus the towns named in the live bio.
    q: "What areas does Kallie Ritchey cover?",
    a: "Fort Worth and the towns north and east of it: Saginaw, Haslet, Roanoke, Keller, Southlake, Grapevine and North Richland Hills. She also works Westlake and Trophy Club, and the office is on Hillwood Parkway in Fort Worth.",
  },
  {
    // Source: agent.statement / agent.license.
    q: "Is Kallie an agent or a broker?",
    a: "Both, in sequence. She has been a licensed agent since 2010 and a licensed Texas broker since 2015, and she is the Broker/Owner of Ritchey Realty. Her licence numbers are Broker 9004834 and RE 603353.",
  },
  {
    // Source: the live bio's "balanced expertise across both traditional and
    // luxury markets".
    q: "Does she only handle luxury homes?",
    a: "No. The practice is deliberately balanced across both traditional and luxury markets — family neighbourhoods and first houses alongside custom estates in Southlake, Westlake and Trophy Club. It is the same process at either end; what changes is the runway and the size of the buyer pool.",
  },
  {
    // Source: agent.facts — "~50 sales a year".
    q: "How many homes does she sell a year?",
    a: "Around fifty transactions annually. That is a working number rather than a record year, and it is the figure published on ritcheyrealty.com.",
  },
  {
    // Source: the live bio — "representing buyers, sellers, and investors".
    q: "Does she work with buyers, sellers or investors?",
    a: "All three. Buyers and sellers are most of the volume, including move-up clients doing both at once, and she also represents investors.",
  },
  {
    // Source: the live bio's credentials paragraph.
    q: "What are her qualifications?",
    a: "A Master of Science from the University of Texas at Arlington, certification as a Texas Real Estate Commission instructor, and a national coaching role with the Tom Ferry organization. She has also been featured in Real Producers Magazine and on 570 AM's Real Estate Talk.",
  },
  {
    // Source: `site.address`, `site.phone`, `site.email`.
    q: "Where is the office, and how do I get in touch?",
    a: "Ritchey Realty is at 9800 Hillwood Parkway, Suite 140, Fort Worth, TX 76244. Call or text (682) 788-9060, or email team@ritcheyrealty.com. One conversation with a named agent — no call centre.",
  },
  {
    // Source: `reviewSources` — verified against Google and Zillow directly.
    q: "What do past clients say?",
    a: "4.9 out of 5 from 63 Google reviews and 5.0 out of 5 from 39 reviews on Zillow. Both figures were checked against the platforms themselves rather than taken from marketing material.",
  },
];

/**
 * The team — DELIBERATELY ANONYMOUS.
 *
 * Nothing identifying anyone is committed here: no photographs, no names, no
 * TREC licence numbers, no direct emails or mobile numbers. This is demo work,
 * and the real team's likenesses and credentials aren't ours to republish just
 * to illustrate a layout. Stand-in faces or invented names would be worse than
 * blanks, because a plausible-looking card asserts something about a real
 * person; a numbered slot asserts nothing.
 *
 * What's left is only the shape of the roster: how many people and what each
 * one does. Fill in `name`, `photo`, `license` and `email` per member when the
 * client supplies them and each card takes the real content without any other
 * change — that's what these fields are optional for.
 */
export type TeamMember = {
  /** Placeholder slot number until a real name is supplied. */
  slot: string;
  role: string;
  name?: string;
  email?: string;
  photo?: string;
  license?: string;
};

export const team: TeamMember[] = [
  { slot: "Team member 01", role: "Marketing & Events Director" },
  { slot: "Team member 02", role: "Agent" },
  { slot: "Team member 03", role: "Agent" },
  { slot: "Team member 04", role: "Agent" },
  { slot: "Team member 05", role: "Agent" },
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

/*
 * The enquiry form deliberately has no endpoint. This is a demo build with
 * no backend — `output: "export"` in next.config.mjs — so the form validates
 * and then tells the visitor plainly that nothing was sent. Wiring it to a
 * real form service is a change to components/MessageForm.tsx, not a config
 * value sitting here pretending to be switched off.
 */

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

/**
 * Where a town's own page lives.
 *
 * A map rather than a slug function, because a slug function would happily
 * produce /communities/haslet — a URL this static export does not contain. A
 * town with no page falls back to the communities index, which is a real page
 * that says what is coming.
 */
export const communityPages: Record<string, string> = {
  "Fort Worth": "/communities/fort-worth",
};

export function communityHref(name: string) {
  return communityPages[name] ?? "/communities";
}

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
 * Real, verified figures — checked against Google and Zillow. These are the
 * one part of the testimonials section that is not demo content, which is why
 * the note under it distinguishes the two. The section renders whatever is in
 * this array, so removing a source removes its stat.
 */
export type ReviewSource = {
  source: string;
  /** Out of 5. */
  rating: number;
  /** Displayed verbatim, so "63" and "50+" both work. */
  count: string;
  /** Checked against the source itself, not taken from the marketing site. */
  verified: boolean;
};

export const reviewSources: ReviewSource[] = [
  { source: "Google", rating: 4.9, count: "63", verified: true },
  { source: "Zillow", rating: 5.0, count: "39", verified: true },
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
