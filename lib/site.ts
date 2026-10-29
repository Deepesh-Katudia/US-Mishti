// Single source of truth for company details.
// TODO(US Mishti): replace placeholder contact details with real ones.
export const SITE = {
  name: "US Mishti",
  legalName: "US Mishti Private Limited",
  tagline: "Brilliance, sourced without borders.",
  description:
    "US Mishti brings certified natural diamonds, lab-grown diamonds and rare gemstones to jewellers and private clients — backed by DiaHearts' Hatton Garden heritage and a network of 1,000+ trusted suppliers.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://usmishti.com",
  parent: {
    name: "DiaHearts Ltd",
    url: "https://diahearts.com",
    address: "Hatton Garden, London EC1N 8DL, United Kingdom",
  },
  contact: {
    email: "usmishtilimited@gmail.com",
    phone: "+1 (212) 555-0147",
    address: "Diamond District, 47th Street, New York, NY 10036",
    hours: "Mon – Fri · 9:00 – 18:00 ET",
  },
  social: {
    instagram: "https://www.instagram.com/diahearts4all/",
    linkedin: "https://www.linkedin.com/company/diahearts-ltd/",
    facebook: "https://www.facebook.com/diaheartsltd",
  },
} as const;

export const NAV_LINKS = [
  { label: "Collections", href: "/#collections" },
  { label: "Shapes", href: "/#shapes" },
  { label: "Craft", href: "/#craft" },
  { label: "Trade", href: "/#paths" },
  { label: "Contact", href: "/contact" },
] as const;
