import { CERTIFICATIONS, COLLECTIONS, CRAFT_STEPS, LOGISTICS, MARKETS, PATHS, PROCESS, SHAPES } from "@/lib/content";
import { SITE } from "@/lib/site";

/**
 * Site knowledge for the concierge, generated from the same content the pages
 * render, so answers never drift from the website. Deterministic by design:
 * it forms the cached system-prompt prefix, so no dates or random values.
 */
export function buildKnowledgeBase(): string {
  const collections = COLLECTIONS.map(
    (c) => `### ${c.title} (/collections/${c.slug})\n${c.description}\nHighlights: ${c.highlights.join("; ")}.`,
  ).join("\n\n");

  const shapes = SHAPES.map(
    (s) => `- ${s.name}: ${s.cut} cut, ${s.facets} facets, typical length-to-width ratio ${s.ratio}. ${s.description}`,
  ).join("\n");

  const process = PROCESS.map((p) => `${p.index}. ${p.title} — ${p.body}`).join("\n");
  const craft = CRAFT_STEPS.map((s) => `- ${s.title}: ${s.body}`).join("\n");
  const paths = Object.values(PATHS)
    .map((p) => `### ${p.label}: ${p.title}\n${p.body}\nIncludes: ${p.points.join("; ")}.`)
    .join("\n\n");

  return `# ${SITE.legalName}
${SITE.description}
Parent company: ${SITE.parent.name}, ${SITE.parent.address} (${SITE.parent.url}). US Mishti is its American house, with access to 1,000+ verified suppliers.

## Collections
${collections}

## Diamond shapes available (30 shapes via the supplier network; the main 12)
${shapes}

## Who we serve
${paths}

## How buying works
${process}

## Craftsmanship
${craft}

## Certification & logistics
Grading labs: ${CERTIFICATIONS.map((c) => `${c.code} (${c.name})`).join(", ")}.
Insured shipping partners: ${LOGISTICS.join(", ")}. Orders can be consolidated into one insured shipment.
Markets served: ${MARKETS.join(", ")}.

## Contact
Email ${SITE.contact.email} · ${SITE.contact.address} · ${SITE.contact.hours}.
Trade accounts: /contact?kind=trade · Private consultations: /contact?kind=retail`;
}
