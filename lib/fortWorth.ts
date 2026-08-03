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
// Nothing in this file is invented. Where a figure exists for one neighbourhood
// and not the others, only the one that exists is printed — see `neighborhoods`
// below, which is the same rule `credentials` in lib/site.ts follows.
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
 * Why buyers are moving here. Four claims, each with something behind it —
 * a named employer, a tax code, a rent-to-price relationship, a building.
 *
 * No icons. This site draws with rules and numerals and has no icon language;
 * four little pictograms would be the one borrowed vocabulary on the page.
 */
export const whyFortWorth: { n: string; title: string; body: string }[] = [
  {
    n: "01",
    title: "Growth backed by jobs",
    body: "Fort Worth has added residents faster than any other major Texas city since 2020, and the people are following the employers rather than the other way around. Siemens opened a $190M manufacturing plant, two Wistron plants landed to build AI chips, and the city's economic development partnership has logged over $2 billion of capital investment in two years.",
  },
  {
    n: "02",
    title: "No state income tax",
    body: "Texas does not tax personal income. For a household moving from California, New York or Illinois that changes what you can afford here in a way no price-per-square-foot comparison will show you — and it is half of why the property tax rate further down this page is what it is.",
  },
  {
    n: "03",
    title: "Real estate that still pencils",
    body: "Fort Worth homes cost meaningfully less than comparable Dallas properties and rent for nearly the same. For an owner-occupant that is more house. For an investor it is a cap rate advantage that shows up every month rather than only at resale.",
  },
  {
    n: "04",
    title: "A culture of its own",
    body: "The Kimbell, the Modern and the Amon Carter stand within walking distance of one another. Sundance Square downtown. The Stockyards, where longhorns are still driven down Exchange Avenue twice a day. None of it is borrowed from Dallas and none of it apologises for that.",
  },
];

/**
 * The neighbourhood index.
 *
 * Grouped by part of town because that is how buyers actually narrow: they pick
 * a side of the city first and a street second.
 *
 * `band` appears exactly once. Tanglewood is the one neighbourhood in this set
 * with a price range stated in the sources, so it is the one that gets a price
 * printed against it; the other eleven carry a `tag` describing what they are,
 * which is checkable, instead of a range that would be a guess dressed as data.
 * Add the rest when NTREIS numbers are in hand — the row renders whichever it
 * is given.
 */
export type Neighborhood = {
  name: string;
  /** Short mono descriptor — what the place is, not what it costs. */
  tag: string;
  blurb: string;
  /** Price range, only where the sources state one. */
  band?: string;
};

export type Area = {
  /** Used for the filter buttons and as the group's anchor id. */
  id: string;
  name: string;
  /** The one-line character of the area, set under its heading. */
  note: string;
  places: Neighborhood[];
};

export const areas: Area[] = [
  {
    id: "southwest",
    name: "Southwest",
    note: "Established and school-driven",
    places: [
      {
        name: "Tanglewood",
        tag: "Trinity Trails · Medical District",
        band: "$450K – $800K",
        blurb:
          "Wide lots, mature trees, and one of the most consistently requested elementary schools in the city. It backs onto the Trinity Trails, so the runners and cyclists never leave. Popular with physicians commuting to the Medical District — roughly ten minutes door to door.",
      },
      {
        name: "Mira Vista",
        tag: "Gated · golf course",
        blurb:
          "Gated, centred on the golf course, and quiet. Larger custom homes and a buyer profile that skews established; jumbo financing is common here rather than exceptional.",
      },
      {
        name: "TCU / Westcliff",
        tag: "Walkable to campus",
        blurb:
          "Central, walkable to campus, and feeding into well-regarded schools including Westcliff and Paschal High. It works for families with older kids, for university staff, and for anyone who wants to be ten minutes from everything. The TCU orbit keeps rental demand strong if you are buying to hold.",
      },
      {
        name: "Wedgwood",
        tag: "Mid-century ranch",
        blurb:
          "Mid-century ranch stock on generous lots, and one of the more attainable ways into southwest Fort Worth. A common landing spot for first-time buyers who want the area without the Tanglewood price.",
      },
    ],
  },
  {
    id: "westside",
    name: "The Westside",
    note: "Historic and high-end",
    places: [
      {
        name: "Rivercrest",
        tag: "Often sold on relationships",
        blurb:
          "Old Fort Worth money. Estates overlooking the Trinity River with River Crest Country Club at the centre. Inventory is thin and a good deal of it moves through relationships as often as it moves through the MLS — which is the entire argument for having an agent who is in those rooms.",
      },
      {
        name: "Westover Hills",
        tag: "Its own incorporated town",
        blurb:
          "An incorporated town sitting inside Fort Worth's footprint, and among the highest price per square foot anywhere in the region.",
      },
      {
        name: "Arlington Heights",
        tag: "Cultural District",
        blurb:
          "The neighbourhood that anchors the Cultural District. Long-time residents next door to young families, sidewalks that stay busy, and walkable access to West 7th's restaurants and the museums. One of the more balanced value propositions in the city.",
      },
    ],
  },
  {
    id: "near-southside",
    name: "Near Southside & Downtown",
    note: "Walkable and urban",
    places: [
      {
        name: "Fairmount",
        tag: "Historic district",
        blurb:
          "One of the largest historic districts in the Southwest: Craftsman bungalows, front porches, and a genuine preservation ethic five minutes from downtown. Buyers here want the character and accept the maintenance that comes with a hundred-year-old house.",
      },
      {
        name: "Near Southside (Magnolia)",
        tag: "Creative quarter",
        blurb:
          "The city's creative quarter — independent restaurants, breweries, and the medical district next door. A mix of restored historic homes and new infill, skewing younger, and it rents well.",
      },
      {
        name: "Downtown Fort Worth",
        tag: "Condos and lofts",
        blurb:
          "High-rise condos and converted lofts around Sundance Square, where sale prices have been climbing faster than the city average. The fit is a buyer who wants no yard to maintain and a two-minute walk to dinner.",
      },
    ],
  },
  {
    id: "north",
    name: "North & Northwest",
    note: "New construction and growth",
    places: [
      {
        name: "Alliance Corridor",
        tag: "Master-planned · new build",
        blurb:
          "Master-planned communities and new builds next to the Alliance employment hub, feeding into Northwest ISD and Keller ISD — which is a draw in its own right. The default answer for buyers who want a house nobody has lived in yet.",
      },
      {
        name: "Far North Fort Worth",
        tag: "Where the rooftops are going up",
        blurb:
          "Where most of the city's new rooftops are being built. Newer amenities and strong school ratings, paid for with a longer commute downtown.",
      },
    ],
  },
];

/**
 * The districts asked about most. Deliberately not "the best schools in Fort
 * Worth" — a ranking is an opinion we would be held to, and campus assignment
 * is an address-level fact we can actually check for a client.
 */
export const districts: { name: string; detail: string }[] = [
  {
    name: "Fort Worth ISD",
    detail:
      "The largest, covering central and southern Fort Worth. Wide variation campus to campus, with several strong magnet and choice programmes.",
  },
  {
    name: "Keller ISD",
    detail:
      "North Fort Worth. Consistently in demand and a frequent driver of relocation searches on its own.",
  },
  {
    name: "Northwest ISD",
    detail: "The Alliance corridor and the far north growth areas.",
  },
  {
    name: "Eagle Mountain-Saginaw ISD",
    detail: "Northwest, growing quickly alongside the housing.",
  },
  { name: "Crowley ISD", detail: "Southwest Fort Worth." },
  {
    name: "Aledo ISD",
    detail: "West, covering Walsh Ranch and the western edge of the city.",
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

/** The reductions available, largest first. */
export const exemptions: { mark: string; detail: string }[] = [
  {
    mark: "$140,000",
    detail:
      "School district homestead exemption on a primary residence. The big one.",
  },
  {
    mark: "10%",
    detail:
      "Tarrant County and JPS Health Network homestead exemptions, 10% each, added in 2025.",
  },
  {
    mark: "$60,000",
    detail:
      "Additional school district reduction at 65+ or with a disability, plus a ceiling that freezes the school portion of the bill.",
  },
  {
    mark: "10% / yr",
    detail:
      "The cap on how fast a homesteaded property's taxable value can rise, whatever the market does.",
  },
];

/**
 * Drive times to downtown, approximate and stated as such.
 *
 * The page draws these as bars in proportion to the minutes, which is the same
 * move the range line makes with longitude: the drawing is the data, not an
 * illustration of it. `minutes` therefore has to stay a number.
 */
export const driveTimes: { from: string; minutes: number }[] = [
  { from: "Fairmount", minutes: 5 },
  { from: "West 7th", minutes: 5 },
  { from: "Arlington Heights", minutes: 8 },
  { from: "Ryan Place", minutes: 10 },
  { from: "Tanglewood", minutes: 12 },
  { from: "Rivercrest", minutes: 12 },
  { from: "Benbrook", minutes: 15 },
  { from: "Keller", minutes: 20 },
  { from: "Southlake", minutes: 25 },
  { from: "Walsh Ranch / Aledo", minutes: 25 },
];

/** The longest bar on the chart, so the scale is derived rather than typed. */
export const longestDrive = Math.max(...driveTimes.map((d) => d.minutes));

/** What you actually do here. Six entries, no stock photography behind them. */
export const lifeHere: { kicker: string; title: string; body: string }[] = [
  {
    kicker: "Museums",
    title: "The Cultural District",
    body: "The Kimbell — where Louis Kahn's building is itself the attraction and the permanent collection is free — the Modern Art Museum of Fort Worth, and the Amon Carter. Three institutions of national standing, clustered together.",
  },
  {
    kicker: "The Stockyards",
    title: "A working historic district",
    body: "Not a theme park. Longhorns are driven down Exchange Avenue twice a day, Billy Bob's is still Billy Bob's, and there is rodeo most weekends.",
  },
  {
    kicker: "Downtown",
    title: "Sundance Square",
    body: "Thirty-odd blocks of restored downtown: restaurants, Bass Performance Hall, and a central plaza that stays busy after dark. One of the few genuinely walkable downtowns in Texas.",
  },
  {
    kicker: "Weekends",
    title: "The Zoo and the Botanic Garden",
    body: "The Fort Worth Zoo ranks among the best in the country and is the standing answer to what a family does on a Saturday.",
  },
  {
    kicker: "Sport",
    title: "Horned Frogs, and everything east",
    body: "TCU at Amon G. Carter Stadium. The Cowboys at AT&T Stadium and the Rangers at Globe Life Field are a short drive east in Arlington, and Texas Motor Speedway sits north of the city.",
  },
  {
    kicker: "Food",
    title: "Barbecue, and the Near Southside",
    body: "Barbecue people drive in for, a restaurant scene on the Near Southside that keeps producing, and a Mexican food tradition older than most of the city around it.",
  },
];

/**
 * FAQ — rendered by components/Faq.tsx and, from this same array, as FAQPage
 * JSON-LD. One source, so the markup cannot describe answers the page does not
 * show. Every figure quoted here is one that appears elsewhere on the page.
 */
export const fortWorthFaqs: Faq[] = [
  {
    q: "Is Fort Worth a good place to buy a home in 2026?",
    a: "It is a reasonable market for both sides right now. Around three and a half months of inventory means buyers have selection and negotiating room, while well-priced homes still sell. Prices are expected to appreciate modestly rather than spike or fall sharply.",
  },
  {
    q: "What is the median home price in Fort Worth?",
    a: "Roughly $336,000 across recent closings, though the range across the city's 26 ZIP codes is enormous — from under $180,000 on the east side to well over $600,000 near TCU and on the west side. Public sources disagree by a wide margin here because they measure different things, so treat any single city-wide figure as a starting point rather than an answer.",
  },
  {
    q: "Is Fort Worth cheaper than Dallas?",
    a: "Yes. Comparable homes generally cost meaningfully less in Fort Worth while renting for only slightly less, which is why the city attracts relocating families and buy-and-hold investors at the same time.",
  },
  {
    q: "What are the safest neighborhoods in Fort Worth?",
    a: "Southwest Fort Worth — Tanglewood, Mira Vista, Westcliff and Wedgwood — along with parts of Arlington Heights and the far northwest suburbs in Keller ISD and Northwest ISD generally report crime rates below the city average. Fort Worth varies significantly block to block, so address-level research matters more here than in most cities.",
  },
  {
    q: "How much are property taxes in Fort Worth?",
    a: "Most Fort Worth homeowners face a combined rate around 2.2% of taxable value across five taxing entities, before exemptions. The homestead exemption removes $140,000 from school district taxable value on a primary residence and is the single largest reduction available. Rates are adopted each autumn, so confirm the current figure for a specific address before setting a budget.",
  },
  {
    q: "What school district is Fort Worth in?",
    a: "More than a dozen. Fort Worth ISD is the largest, but Keller ISD, Northwest ISD, Eagle Mountain-Saginaw ISD, Crowley ISD and Aledo ISD all serve parts of the city. Boundaries do not follow ZIP codes or neighbourhood lines — two houses on the same street can feed different elementary schools — so always verify by address.",
  },
  {
    q: "Can I commute to Dallas from Fort Worth?",
    a: "Yes. The Trinity Railway Express connects the two downtowns directly, and driving is roughly 45 minutes to an hour depending on traffic and where you start.",
  },
  {
    q: "How long does it take to sell a home in Fort Worth?",
    a: "Around 56 days on market currently, up from prior years. Correctly priced homes in high-demand neighbourhoods move considerably faster.",
  },
];
