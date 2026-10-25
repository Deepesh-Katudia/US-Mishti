export type CollectionSlug = "natural" | "lab-grown" | "gemstones";

export interface Collection {
  slug: CollectionSlug;
  index: string;
  title: string;
  kicker: string;
  summary: string;
  description: string;
  image: string;
  highlights: readonly string[];
}

export const COLLECTIONS: readonly Collection[] = [
  {
    slug: "natural",
    index: "01",
    title: "Natural Diamonds",
    kicker: "Formed over a billion years",
    summary: "Earth-born stones, GIA and IGI certified, sourced direct from the cutting floor.",
    description:
      "Every natural diamond in our network passes rigorous evaluation for cut, clarity, colour and carat before it reaches you. Buy direct from verified suppliers — no middlemen, no inflated margins, only provenance you can trace.",
    image: "/images/homepage_image/natural-diamond.webp",
    highlights: [
      "GIA, IGI & HRD Antwerp certified",
      "Direct-from-supplier pricing",
      "0.30 ct to 10 ct+ single stones",
      "Calibrated melee & matched pairs",
    ],
  },
  {
    slug: "lab-grown",
    index: "02",
    title: "Lab-Grown Diamonds",
    kicker: "Same fire, conscious origin",
    summary: "Chemically identical brilliance, grown responsibly and graded to the same standard.",
    description:
      "Lab-grown diamonds share the crystal structure, hardness and fire of mined stones at a fraction of the price. We partner with leading CVD and HPHT growers to deliver consistent, certified inventory for modern collections.",
    image: "/images/homepage_image/lab-grown-diamond.webp",
    highlights: [
      "IGI-graded CVD & HPHT stones",
      "Consistent bulk availability",
      "Fancy shapes & fancy colours",
      "Sustainably minded sourcing",
    ],
  },
  {
    slug: "gemstones",
    index: "03",
    title: "Rare Gemstones",
    kicker: "Colour with character",
    summary: "Sapphires, rubies and emeralds hand-selected for saturation, clarity and life.",
    description:
      "Beyond diamonds lies a world of colour. Our curated gemstone programme brings together sapphires, rubies, emeralds and other precious stones — perfect as a birthstone with meaning or a bespoke centre stone.",
    image: "/images/homepage_image/gemstone.webp",
    highlights: [
      "Sapphire, ruby & emerald",
      "Lab reports on request",
      "Bespoke centre-stone sourcing",
      "Calibrated accent stones",
    ],
  },
];

export const findCollection = (slug: string): Collection | undefined =>
  COLLECTIONS.find((c) => c.slug === slug);

export interface Shape {
  name: string;
  image: string;
  note: string;
}

const shape = (name: string, file: string, note: string): Shape => ({
  name,
  image: `/images/shape_pic/${file}.webp`,
  note,
});

export const SHAPES: readonly Shape[] = [
  shape("Round", "round-1", "57 facets of maximum fire"),
  shape("Princess", "princess-1", "Crisp, modern brilliance"),
  shape("Oval", "oval-1", "Elongates the hand"),
  shape("Emerald", "emerald-1", "Hall-of-mirrors clarity"),
  shape("Cushion", "cushion-1", "Romantic pillowed corners"),
  shape("Pear", "pear-1", "A teardrop of light"),
  shape("Heart", "heart-1", "The eternal symbol"),
  shape("Marquise", "marquise-1", "Regal, royal heritage"),
  shape("Radiant", "radiant-1", "Brilliance meets structure"),
  shape("Asscher", "asscher-1", "Art-deco step cut"),
  shape("Trilliant", "trilliant", "Bold triangular fire"),
  shape("Baguette", "baguette", "Architectural accents"),
];

export interface CraftStep {
  title: string;
  body: string;
  image: string;
}

export const CRAFT_STEPS: readonly CraftStep[] = [
  {
    title: "Cleave & Cut",
    body: "Master cutters study each rough crystal, then cleave along natural planes or saw the stone to unlock the largest, most luminous yield.",
    image: "/images/service/service2_1.webp",
  },
  {
    title: "Polish to Perfection",
    body: "On cast-iron scaives dressed with diamond powder, every facet is polished to precise angles — consistent quality for one stone or one thousand.",
    image: "/images/service/service1_2.webp",
  },
  {
    title: "Inspect & Certify",
    body: "Under magnification each diamond is checked for clarity and brilliance, then graded by GIA, IGI or HRD Antwerp before it ships.",
    image: "/images/homepage_image/polishing.webp",
  },
];

export interface Stat {
  value: number;
  suffix: string;
  label: string;
}

export const STATS: readonly Stat[] = [
  { value: 1000, suffix: "+", label: "Verified suppliers" },
  { value: 9, suffix: "", label: "Markets served" },
  { value: 30, suffix: "", label: "Diamond shapes" },
  { value: 3, suffix: "", label: "Grading labs" },
];

export interface ProcessStep {
  index: string;
  title: string;
  body: string;
}

export const PROCESS: readonly ProcessStep[] = [
  {
    index: "I",
    title: "Explore",
    body: "Browse a vast, live selection of natural and lab-grown stones from suppliers across India, Belgium, the UK and beyond.",
  },
  {
    index: "II",
    title: "Select",
    body: "Shortlist by shape, carat, colour and clarity. Our specialists verify every certificate and advise on value.",
  },
  {
    index: "III",
    title: "Receive",
    body: "We consolidate your order into a single insured shipment — delivered promptly and securely to your door.",
  },
];

export const PATHS = {
  trade: {
    label: "For the Trade",
    title: "Jewellers, retailers & manufacturers",
    body: "One point of contact for thousands of certified stones. Wholesale pricing, consolidated shipping and memo terms for qualified partners.",
    points: [
      "Wholesale & bulk pricing",
      "Consolidated, insured logistics",
      "Custom cutting & polishing",
      "Dedicated account specialist",
    ],
    image: "/images/homepage_image/cutting.webp",
    cta: "Open a trade account",
  },
  retail: {
    label: "For Private Clients",
    title: "Engagements, heirlooms & investment",
    body: "Find the one stone that means everything. Guided selection, independent certification and bespoke sourcing — with trade-level transparency.",
    points: [
      "One-to-one diamond consultation",
      "Certified, conflict-free stones",
      "Bespoke centre-stone sourcing",
      "Lifetime authenticity records",
    ],
    image: "/images/homepage_image/natural-diamond.webp",
    cta: "Book a private consultation",
  },
} as const;

export const CERTIFICATIONS = [
  { code: "GIA", name: "Gemological Institute of America" },
  { code: "IGI", name: "International Gemological Institute" },
  { code: "HRD", name: "HRD Antwerp" },
] as const;

export const LOGISTICS = ["Brink's", "Malca-Amit", "FedEx", "UPS", "DHL"] as const;

export const MARKETS = [
  "United States",
  "United Kingdom",
  "Belgium",
  "UAE",
  "India",
  "Hong Kong",
  "China",
  "Japan",
  "Canada",
] as const;

export const INTERESTS = [
  "Natural diamonds",
  "Lab-grown diamonds",
  "Gemstones",
  "Cutting & polishing",
  "Bespoke / engagement",
] as const;
