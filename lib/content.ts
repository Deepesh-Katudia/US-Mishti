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

export type ShapeId =
  | "round"
  | "princess"
  | "oval"
  | "emerald"
  | "cushion"
  | "pear"
  | "heart"
  | "marquise"
  | "radiant"
  | "asscher"
  | "trilliant"
  | "baguette";

export interface Shape {
  id: ShapeId;
  name: string;
  image: string;
  note: string;
  cut: "Brilliant" | "Step" | "Modified brilliant";
  facets: number;
  /** Typical length-to-width ratio. */
  ratio: string;
  description: string;
}

export const SHAPES: readonly Shape[] = [
  {
    id: "round", name: "Round", image: "/images/shape_pic/round-1.webp", note: "57 facets of maximum fire",
    cut: "Brilliant", facets: 57, ratio: "1.00 – 1.02",
    description: "The most studied cut in history, engineered to return the greatest possible brilliance. Timeless in solitaires, halos and eternity bands.",
  },
  {
    id: "princess", name: "Princess", image: "/images/shape_pic/princess-1.webp", note: "Crisp, modern brilliance",
    cut: "Modified brilliant", facets: 58, ratio: "1.00 – 1.05",
    description: "A square silhouette with a chevron pavilion that throws a vivid, cross-shaped sparkle. Clean lines for contemporary settings.",
  },
  {
    id: "oval", name: "Oval", image: "/images/shape_pic/oval-1.webp", note: "Elongates the hand",
    cut: "Modified brilliant", facets: 58, ratio: "1.35 – 1.50",
    description: "Round-brilliant fire in a graceful elongated form that looks larger per carat and flatters the finger.",
  },
  {
    id: "emerald", name: "Emerald", image: "/images/shape_pic/emerald-1.webp", note: "Hall-of-mirrors clarity",
    cut: "Step", facets: 57, ratio: "1.30 – 1.50",
    description: "Long, parallel step facets create broad flashes of light — a 'hall of mirrors' that rewards exceptional clarity.",
  },
  {
    id: "cushion", name: "Cushion", image: "/images/shape_pic/cushion-1.webp", note: "Romantic pillowed corners",
    cut: "Modified brilliant", facets: 58, ratio: "1.00 – 1.10",
    description: "Softly rounded corners and large facets give a romantic, candle-lit glow with heritage charm.",
  },
  {
    id: "pear", name: "Pear", image: "/images/shape_pic/pear-1.webp", note: "A teardrop of light",
    cut: "Modified brilliant", facets: 58, ratio: "1.45 – 1.75",
    description: "Half round, half marquise: a teardrop that combines brilliance with an elegant, slimming silhouette.",
  },
  {
    id: "heart", name: "Heart", image: "/images/shape_pic/heart-1.webp", note: "The eternal symbol",
    cut: "Modified brilliant", facets: 59, ratio: "0.90 – 1.10",
    description: "The most romantic of shapes, demanding a master cutter's symmetry for a crisp cleft and even lobes.",
  },
  {
    id: "marquise", name: "Marquise", image: "/images/shape_pic/marquise-1.webp", note: "Regal, royal heritage",
    cut: "Modified brilliant", facets: 58, ratio: "1.85 – 2.10",
    description: "Commissioned by Louis XV, the marquise maximises carat weight in a long, pointed silhouette.",
  },
  {
    id: "radiant", name: "Radiant", image: "/images/shape_pic/radiant-1.webp", note: "Brilliance meets structure",
    cut: "Modified brilliant", facets: 70, ratio: "1.00 – 1.35",
    description: "The outline of an emerald cut with the fire of a brilliant — trimmed corners and a lively, crushed-ice sparkle.",
  },
  {
    id: "asscher", name: "Asscher", image: "/images/shape_pic/asscher-1.webp", note: "Art-deco step cut",
    cut: "Step", facets: 58, ratio: "1.00 – 1.05",
    description: "A square step cut with deep corners that draws the eye inward in concentric, windmill-like reflections.",
  },
  {
    id: "trilliant", name: "Trilliant", image: "/images/shape_pic/trilliant.webp", note: "Bold triangular fire",
    cut: "Brilliant", facets: 50, ratio: "1.00 – 1.10",
    description: "A triangular brilliant with gently curved sides — striking as a centre stone or as side-stone accents.",
  },
  {
    id: "baguette", name: "Baguette", image: "/images/shape_pic/baguette.webp", note: "Architectural accents",
    cut: "Step", facets: 14, ratio: "2.00 – 4.00",
    description: "Slender, rectangular step cuts prized for clean architectural lines in channel and side-stone settings.",
  },
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

export interface Certification {
  code: string;
  name: string;
  /** Official logo, light-on-dark variant from the lab's own website. */
  logo: string;
  width: number;
  height: number;
}

export const CERTIFICATIONS: readonly Certification[] = [
  { code: "GIA", name: "Gemological Institute of America", logo: "/images/certifications/gia.svg", width: 546, height: 180 },
  { code: "IGI", name: "International Gemological Institute", logo: "/images/certifications/igi.webp", width: 420, height: 173 },
  { code: "HRD", name: "HRD Antwerp", logo: "/images/certifications/hrd.svg", width: 224, height: 33 },
];

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
