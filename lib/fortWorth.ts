// Content for /communities/fort-worth.
//
// Kept out of lib/site.ts on purpose: that file is the site's own configuration
// — contact details, nav, the eight towns, the agent's record — and this is one
// page's editorial copy. Mixing them would mean every route importing a city
// guide to read a phone number.
//
// ---------------------------------------------------------------------------
// ON THE NUMBERS. Read this before the figures below go anywhere near a real
// client's site.
//
// Every market figure here comes from a public report, and the public reports
// disagree with each other by a wide margin because they are not measuring the
// same thing: Zillow's ZHVI puts the typical Fort Worth home around $284K, an
// MLS-derived median of closed sales lands near $336K, and Realtor.com's median
// LIST price sits near $342K. A typical value index, a median of what actually
// sold, and a median of what is being asked are three different questions.
//
// The figures used below are the MLS-derived closings, because "what did homes
// actually sell for" is the question a buyer is asking. They carry an explicit
// `marketAsOf` stamp that the page prints, and the page says outright where
// they came from. Before this ships on ritcheyrealty.com proper, replace them
// with NTREIS numbers Kallie can stand behind and move the stamp forward — the
// page reads both from here, so that is a one-file change.
//
// The price bands on the neighbourhoods carry the same warning and the same
// fix. Two are stated as ranges and two as positions ("mid-range",
// "mid-to-upper") because that is how the sources put them; a range invented
// for the sake of a tidy column would be the one number on this page nobody
// could check.
// ---------------------------------------------------------------------------

import type { Faq } from "@/lib/site";

/** The place itself. Coordinates match the Fort Worth entry in `communities`. */
export const fortWorth = {
  name: "Fort Worth",
  county: "Tarrant County",
  state: "Texas",
  region: "TX",
  lat: 32.7555,
  lon: -97.3308,
  /** ZIP codes inside the city limits — the spread the city-wide median hides. */
  zips: 26,
  /** Stamped on the market section so no figure on this page is undated. */
  updated: "August 2026",
  sources:
    "MLS-derived closings, Zillow ZHVI, Realtor.com, Dallas Fed Fort Worth Economic Indicators and the Tarrant Appraisal District",
};

/**
 * The market, as four marks on a rule.
 *
 * `note` is the direction of travel, not decoration: a median with no sense of
 * which way it is moving is a number a visitor cannot act on.
 */
export type Stat = { mark: string; detail: string; note: string };

export const marketStats: Stat[] = [
  { mark: "$336K", detail: "Median sale price", note: "Trailing six months" },
  { mark: "56", detail: "Days on market", note: "Up from last year" },
  { mark: "3.4", detail: "Months of inventory", note: "Balanced to seller" },
  { mark: "98%", detail: "Sale to list", note: "Room to negotiate" },
];

/**
 * Six neighbourhoods, each with the three facts a buyer sorts on: what it
 * costs, which district it feeds, and how far downtown is.
 *
 * Six and not thirty. The intro says outright that the city has thirty of
 * these; printing all of them would be a directory, and a directory is what a
 * buyer scrolls past. These are the ones people ask about.
 *
 * `side` exists so the six can be filtered by part of town, which is how buyers
 * actually narrow — a side of the city first, a street second. `district` is
 * optional because Rivercrest and Westover Hills straddle more than one and
 * naming a single one would be wrong.
 */
export type Neighborhood = {
  name: string;
  /** Filter facet: the part of town, as a buyer would name it. */
  side: string;
  /** What it costs, in the terms the sources state it. */
  band: string;
  /** School district, where one answer is honest. */
  district?: string;
  /** Approximate minutes to downtown Fort Worth. */
  drive: number;
  blurb: string;
};

export const neighborhoods: Neighborhood[] = [
  {
    name: "Tanglewood",
    side: "Southwest",
    band: "$450K – $800K",
    district: "Fort Worth ISD",
    drive: 12,
    blurb:
      "Wide lots, mature trees, and one of the most requested elementary schools in the city. It backs onto the Trinity Trails, and it is popular with Medical District physicians — roughly ten minutes door to door.",
  },
  {
    name: "Arlington Heights",
    side: "Westside",
    band: "Mid-range",
    district: "Fort Worth ISD",
    drive: 8,
    blurb:
      "Anchors the Cultural District. Long-time residents next to young families, walkable to West 7th and the museums, and one of the better value propositions in the city.",
  },
  {
    name: "Fairmount",
    side: "Near Southside",
    band: "From ~$300K",
    district: "Fort Worth ISD",
    drive: 5,
    blurb:
      "One of the largest historic districts in the Southwest — Craftsman bungalows, front porches, and a real preservation ethic. Character, with the maintenance a hundred-year-old house implies.",
  },
  {
    name: "TCU / Westcliff",
    side: "Southwest",
    band: "Mid-to-upper",
    district: "Fort Worth ISD",
    drive: 10,
    blurb:
      "Central and walkable, feeding Westcliff and Paschal High. It works for families with older kids, and it rents well if you are buying as an investment.",
  },
  {
    name: "Rivercrest / Westover Hills",
    side: "Westside",
    band: "$800K+",
    drive: 12,
    blurb:
      "Old Fort Worth money. Estates over the Trinity with River Crest Country Club at the centre. Inventory is thin and a good deal of it moves through relationships as much as through the MLS.",
  },
  {
    name: "Alliance Corridor",
    side: "North",
    band: "New construction",
    district: "Keller & Northwest ISD",
    drive: 25,
    blurb:
      "Master-planned communities and homes nobody has lived in yet. The school districts are the primary draw, and they are the reason buyers accept the drive.",
  },
];

/**
 * The five entities stacked on a Fort Worth tax bill. Naming them is the point:
 * "2.2%" is an abstraction until you can see it is five separate levies.
 */
export const taxingEntities: string[] = [
  "The school district",
  "City of Fort Worth",
  "Tarrant County",
  "Tarrant County College",
  "JPS Health Network",
];

/**
 * FAQ — rendered by components/Faq.tsx and, from this same array, as FAQPage
 * JSON-LD. One source, so the markup cannot describe answers the page does not
 * show. Every figure quoted here is one that appears elsewhere on the page.
 */
export const fortWorthFaqs: Faq[] = [
  {
    q: "Is Fort Worth a good place to buy a home in 2026?",
    a: "Reasonable for both sides. Around 3.4 months of inventory gives buyers selection and negotiating room, while well-priced homes still sell.",
  },
  {
    q: "Is Fort Worth cheaper than Dallas?",
    a: "Yes — comparable homes cost meaningfully less while renting for only slightly less. That gap is why both relocating families and investors look here.",
  },
  {
    q: "What are the safest neighborhoods in Fort Worth?",
    a: "Southwest Fort Worth — Tanglewood, Mira Vista, Westcliff and Wedgwood — plus parts of Arlington Heights and the northwest suburbs. Fort Worth varies block to block, so address-level research matters more here than in most cities.",
  },
  {
    q: "How much are property taxes in Fort Worth?",
    a: "Around 2.2% of taxable value before exemptions, across five taxing entities. The homestead exemption is the largest reduction available, and it removes $140,000 from school district taxable value on a primary residence.",
  },
  {
    q: "Can I commute to Dallas from Fort Worth?",
    a: "Yes. The Trinity Railway Express connects both downtowns directly, and driving is 45 to 60 minutes depending on traffic and where you start.",
  },
];
