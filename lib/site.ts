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
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=70",
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
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=70",
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
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=1200&q=70",
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
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=70",
    alt: "Sample listing: bright open-plan loft interior with large windows",
  },
];

export type Community = {
  name: string;
  blurb: string;
  // Approximate position on the stylized DFW map, as % of the map box.
  x: number;
  y: number;
};

// Original short copy written for this demo (not copied from the live site).
export const communities: Community[] = [
  {
    name: "Fort Worth",
    blurb:
      "Cowtown grit meets a real arts district — Fort Worth keeps its character while the market keeps climbing.",
    x: 22,
    y: 86,
  },
  {
    name: "Saginaw",
    blurb:
      "Approachable, tight-knit, and an easy commute — a quiet foothold just north of Fort Worth.",
    x: 15,
    y: 58,
  },
  {
    name: "Haslet",
    blurb:
      "Room to breathe on the north edge — newer builds and acreage without leaving the metroplex.",
    x: 18,
    y: 24,
  },
  {
    name: "Roanoke",
    blurb:
      "The self-proclaimed Unique Dining Capital of Texas — small-town scale with a big appetite for growth.",
    x: 50,
    y: 12,
  },
  {
    name: "Keller",
    blurb:
      "Family-first neighborhoods, green trails, and a small-town feel that reliably holds its value.",
    x: 44,
    y: 36,
  },
  {
    name: "Southlake",
    blurb:
      "Top-rated schools and polished master-planned living, minutes from DFW Airport.",
    x: 74,
    y: 33,
  },
  {
    name: "Grapevine",
    blurb:
      "Historic Main Street charm, lake access, and a walkable heart with genuine personality.",
    x: 87,
    y: 37,
  },
  {
    name: "North Richland Hills",
    blurb:
      "Established, well-connected, and one of the mid-cities' best values for space.",
    x: 52,
    y: 64,
  },
];

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  detail: string;
};

// Placeholder testimonials — sample copy written for this demo, not real reviews.
export const testimonials: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Kallie made our first home purchase feel calm and clear. She answered every question — even the ones we didn't know to ask — and never once made us feel rushed.",
    name: "The Alvarez Family",
    detail: "First-time buyers · Saginaw",
  },
  {
    id: "t2",
    quote:
      "We sold above asking in under two weeks. Her pricing strategy and staging advice were spot on, and communication was honestly better than any agent we'd worked with before.",
    name: "Dana & Michael R.",
    detail: "Sellers · Keller",
  },
  {
    id: "t3",
    quote:
      "Relocating from out of state is stressful, but Kallie knew every neighborhood we asked about in detail. We felt like we had a local friend guiding us the whole way.",
    name: "Priya S.",
    detail: "Relocation buyer · Southlake",
  },
  {
    id: "t4",
    quote:
      "Professional, warm, and genuinely on our side. She negotiated repairs we never would have caught and made closing day completely painless.",
    name: "The Bennett Family",
    detail: "Move-up buyers · Grapevine",
  },
];
