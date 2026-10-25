import Link from "next/link";
import { CurrentYear } from "./CurrentYear";
import { Logo } from "./Logo";
import { COLLECTIONS } from "@/lib/content";
import { NAV_LINKS, SITE } from "@/lib/site";

const SOCIALS = [
  { label: "Instagram", href: SITE.social.instagram },
  { label: "LinkedIn", href: SITE.social.linkedin },
  { label: "Facebook", href: SITE.social.facebook },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-night pt-24">
      <div className="hairline mx-auto max-w-7xl" />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-8 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Logo />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-mist">{SITE.description}</p>
        </div>

        <nav aria-label="Collections" className="lg:col-span-2">
          <h3 className="eyebrow text-[0.62rem]">Collections</h3>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            {COLLECTIONS.map((c) => (
              <li key={c.slug}>
                <Link href={`/collections/${c.slug}`} className="transition-colors hover:text-gold">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label="Explore" className="lg:col-span-2">
          <h3 className="eyebrow text-[0.62rem]">Explore</h3>
          <ul className="mt-5 space-y-3 text-sm text-ivory/75">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <h3 className="eyebrow text-[0.62rem]">Visit</h3>
          <address className="mt-5 space-y-2 text-sm not-italic text-ivory/75">
            <p>{SITE.contact.address}</p>
            <p>
              <a href={`mailto:${SITE.contact.email}`} className="hover:text-gold">
                {SITE.contact.email}
              </a>
            </p>
          </address>
          <p className="mt-6 text-sm text-mist">
            A member of{" "}
            <a href={SITE.parent.url} target="_blank" rel="noopener noreferrer" className="text-gold-soft underline-offset-4 hover:underline">
              {SITE.parent.name}
            </a>
            , {SITE.parent.address}.
          </p>
          <ul className="mt-6 flex gap-5 text-xs uppercase tracking-[0.2em]">
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="text-ivory/60 hover:text-gold">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p
        aria-hidden
        className="pointer-events-none select-none text-center font-display text-[22vw] font-normal leading-[0.8] tracking-tighter text-ivory/[0.04]"
      >
        Mishti
      </p>

      <div className="border-t border-gold/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-mist sm:flex-row sm:justify-between sm:px-8">
          <p>
            © <CurrentYear /> {SITE.legalName}. All rights reserved.
          </p>
          <Link href="/privacy" className="hover:text-gold">
            Privacy policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
