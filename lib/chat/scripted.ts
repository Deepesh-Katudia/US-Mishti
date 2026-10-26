import { CERTIFICATIONS, COLLECTIONS, CRAFT_STEPS, LOGISTICS, MARKETS, PATHS, PROCESS, SHAPES, type Collection, type Shape } from "@/lib/content";
import { SITE } from "@/lib/site";

/**
 * Predefined concierge answers: no LLM, no API key, no token cost.
 * Every answer is built from the site's own content, so it can't drift from what the pages say.
 */

const bullets = (items: readonly string[]) => items.map((item) => `- ${item}`).join("\n");

const collectionAnswer = (c: Collection) =>
  `**${c.title}** — ${c.kicker.toLowerCase()}.\n\n${c.description}\n\n${bullets(c.highlights)}\n\nSee the full collection at /collections/${c.slug}`;

const shapeAnswer = (s: Shape) =>
  `**${s.name}** — ${s.note.toLowerCase()}.\n\n${s.description}\n\n` +
  bullets([`Cut style: ${s.cut}`, `Facets: ${s.facets}`, `Typical length-to-width ratio: ${s.ratio}`]) +
  `\n\nYou can turn it in 3D in the Shape atlas on our home page, or ask a specialist to source one at /contact`;

const [natural, labGrown, gemstones] = COLLECTIONS;
const { trade, retail } = PATHS;

const ANSWERS = {
  greeting:
    "Hello, and welcome to US Mishti. I can tell you about our diamonds and gemstones, the 12 shapes we offer, certification, and how to buy as a jeweller or a private client. What would you like to know?",
  thanks: "My pleasure. If you'd like a quote or a private consultation, a specialist is a message away at /contact",
  products:
    `We offer three collections:\n\n` +
    bullets(COLLECTIONS.map((c) => `**${c.title}** — ${c.summary} /collections/${c.slug}`)) +
    `\n\nFor trade partners we also provide custom cutting and polishing. Tell me which interests you, or speak to a specialist at /contact`,
  natural: collectionAnswer(natural),
  labGrown: collectionAnswer(labGrown),
  gemstones: collectionAnswer(gemstones),
  compare:
    `Both are real diamonds, graded to the same standard by independent labs.\n\n` +
    bullets([
      `**Natural** — ${natural.summary} Choose natural for rarity and a story formed over a billion years.`,
      `**Lab-grown** — ${labGrown.summary} Choose lab-grown for a larger stone within the same budget and consistent bulk supply.`,
    ]) +
    `\n\nCompare them at /collections/natural and /collections/lab-grown, or ask a specialist at /contact`,
  shapes:
    `We source 12 signature shapes:\n\n` +
    bullets(SHAPES.map((s) => `**${s.name}** — ${s.note}`)) +
    `\n\nAsk me about any shape by name, or open the Shape atlas on our home page to turn each one in 3D.`,
  largest:
    `Elongated shapes spread their weight across a larger face, so they look bigger per carat:\n\n` +
    bullets([
      "**Marquise** — the long, pointed silhouette maximises the visible size of each carat.",
      "**Oval** — round-brilliant fire in an elongated form that flatters the finger.",
      "**Pear** — a teardrop that pairs brilliance with a slimming outline.",
    ]) +
    `\n\nA well-proportioned cut matters as much as the shape. A specialist can shortlist stones for you at /contact`,
  certification:
    `Every stone is graded by an independent lab before it ships:\n\n` +
    bullets(CERTIFICATIONS.map((c) => `**${c.code}** — ${c.name}`)) +
    `\n\nA grading report records the 4Cs (cut, colour, clarity and carat), the stone's measurements and a unique report number you can verify on the lab's own website.`,
  fourCs:
    `The 4Cs describe every diamond:\n\n` +
    bullets([
      "**Cut** — how well the facets return light. It drives sparkle more than any other factor.",
      "**Colour** — graded from D (colourless) downward; the less colour, the rarer the stone.",
      "**Clarity** — how free the stone is from inclusions, from Flawless to Included.",
      "**Carat** — the stone's weight; one carat is 0.2 grams.",
    ]) +
    `\n\nAll four appear on the GIA, IGI or HRD Antwerp report that comes with each stone.`,
  trade:
    `**${trade.label}** — ${trade.title.toLowerCase()}.\n\n${trade.body}\n\n${bullets(trade.points)}\n\nOpen a trade account at /contact?kind=trade`,
  retail:
    `**${retail.label}** — ${retail.title.toLowerCase()}.\n\n${retail.body}\n\n${bullets(retail.points)}\n\nBook a private consultation at /contact?kind=retail`,
  process:
    `Buying with us takes three steps:\n\n` +
    bullets(PROCESS.map((p) => `**${p.title}** — ${p.body}`)) +
    `\n\nStart by telling us what you're looking for at /contact`,
  shipping:
    `We consolidate your order into a single insured shipment, carried by trusted partners: ${LOGISTICS.join(", ")}.\n\n` +
    `We currently serve ${MARKETS.length} markets: ${MARKETS.join(", ")}.`,
  pricing:
    `Diamond prices depend on the exact stone (its 4Cs, shape and certificate) and move with the market, so we don't publish fixed prices here. ` +
    `Share your shape, size and budget at /contact and a specialist will send a quote. We can't give investment advice.`,
  craft:
    `Every stone passes through three stages:\n\n` + bullets(CRAFT_STEPS.map((s) => `**${s.title}** — ${s.body}`)),
  about:
    `${SITE.description}\n\n${SITE.legalName} is the American house of ${SITE.parent.name}, based in ${SITE.parent.address}.`,
  contact:
    `You can reach a specialist at /contact, or directly:\n\n` +
    bullets([`Email: ${SITE.contact.email}`, `Phone: ${SITE.contact.phone}`, `Hours: ${SITE.contact.hours}`]),
  fallback:
    `I'm a simple concierge with pre-written answers, so I didn't catch that one. I can help with:\n\n` +
    bullets([
      "Our products: natural, lab-grown and gemstones",
      "Diamond shapes, and which looks largest",
      "Certification and the 4Cs",
      "Trade accounts and private consultations",
      "Shipping, markets and how to order",
    ]) +
    `\n\nFor anything else, a specialist will gladly help at /contact`,
} as const;

export type ScriptedTopic = keyof typeof ANSWERS;

interface Rule {
  topic: ScriptedTopic;
  pattern: RegExp;
  /** Higher wins when several rules match; specific questions outrank broad ones. */
  weight: number;
}

const RULES: readonly Rule[] = [
  { topic: "greeting", pattern: /^(hi|hello|hey|good (morning|afternoon|evening))\b/, weight: 1 },
  { topic: "thanks", pattern: /\b(thanks|thank you|cheers)\b/, weight: 1 },
  { topic: "products", pattern: /\b(products?|offer|sell|collections?|catalogu?e|inventory|range|stock)\b/, weight: 2 },
  { topic: "natural", pattern: /\b(natural|mined|earth[- ]?(born|mined))\b/, weight: 3 },
  { topic: "labGrown", pattern: /\b(lab[- ]?(grown|created|made)?|synthetic|cvd|hpht)\b/, weight: 3 },
  { topic: "gemstones", pattern: /\b(gem ?stones?|sapphires?|rub(y|ies)|coloured stones?|colored stones?)\b/, weight: 3 },
  { topic: "shapes", pattern: /\b(shapes?|cuts? (do|can|are)|which cuts?)\b/, weight: 2 },
  { topic: "largest", pattern: /\b(larg(e|er|est)|bigg(er|est)|big|size) (per|for (the|my)|looking|look)\b|\blooks? (larg|bigg)/, weight: 6 },
  { topic: "certification", pattern: /\b(gia|igi|hrd|certif\w*|grading|graded|report|lab report)\b/, weight: 4 },
  { topic: "fourCs", pattern: /\b(4 ?cs?|four cs?|clarity|colou?r grade|carat weight)\b/, weight: 4 },
  { topic: "trade", pattern: /\b(trade|wholesale|bulk|b2b|jewell?ers?|retailers?|manufacturers?|memo)\b/, weight: 4 },
  { topic: "retail", pattern: /\b(engagement|proposal|wedding|ring|heirloom|bespoke|consultation|private client)\b/, weight: 4 },
  { topic: "process", pattern: /\b(how (do|can) i (buy|order|purchase)|how to (buy|order)|buying process|place an order)\b/, weight: 4 },
  { topic: "shipping", pattern: /\b(ship\w*|deliver\w*|insur\w*|logistics|courier)\b/, weight: 4 },
  { topic: "shipping", pattern: /\b(markets?|countries|country|international|worldwide|where do you)\b/, weight: 3 },
  { topic: "pricing", pattern: /\b(price\w*|cost\w*|how much|budget|quote|cheap\w*|expensive|invest\w*)\b/, weight: 5 },
  { topic: "craft", pattern: /\b(cutting|polish\w*|craft\w*|cleav\w*)\b/, weight: 4 },
  { topic: "about", pattern: /\b(who are you|about (you|us mishti|the company)|diahearts|company|us mishti)\b/, weight: 2 },
  { topic: "contact", pattern: /\b(contact|phone|email|call|speak|talk to|specialist|human|address|hours)\b/, weight: 3 },
];

// "emerald" is a gemstone and a shape: treat it as a gemstone only when the question says so.
const EMERALD_GEM = /\bemeralds?\b.*\b(gem|green|stone colou?r|sapphire|ruby)|\b(gem|green|sapphire|ruby)\b.*\bemeralds?\b/;
const COMPARE = /\b(vs\.?|versus|compare\w*|difference|or)\b/;

function matchShape(text: string): Shape | undefined {
  return SHAPES.find((s) => new RegExp(`\\b${s.id}\\b`).test(text) && !(s.id === "emerald" && EMERALD_GEM.test(text)));
}

/** Picks the best predefined answer for a visitor's message. */
export function scriptedReply(message: string): { topic: ScriptedTopic | `shape:${string}`; reply: string } {
  const text = message.toLowerCase().replace(/\s+/g, " ").trim();

  const scores = new Map<ScriptedTopic, number>();
  for (const { topic, pattern, weight } of RULES) {
    if (pattern.test(text)) scores.set(topic, Math.max(scores.get(topic) ?? 0, weight));
  }
  if (EMERALD_GEM.test(text)) scores.set("gemstones", Math.max(scores.get("gemstones") ?? 0, 3));

  // "Natural or lab-grown?" is one question, not two.
  if (scores.has("natural") && scores.has("labGrown") && COMPARE.test(text)) return { topic: "compare", reply: ANSWERS.compare };

  const shape = matchShape(text);
  const best = [...scores.entries()].sort((a, b) => b[1] - a[1])[0];
  // A named shape is the most specific answer, unless the visitor asked about something weightier (price, size, certificate).
  if (shape && (!best || best[1] < 4)) return { topic: `shape:${shape.id}`, reply: shapeAnswer(shape) };
  if (!best) return { topic: "fallback", reply: ANSWERS.fallback };
  return { topic: best[0], reply: ANSWERS[best[0]] };
}
