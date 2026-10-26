"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, type PointerEvent } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { COLLECTIONS, type Collection } from "@/lib/content";

/** Track the pointer so the card's spotlight follows it. */
function handleSpotlight(e: PointerEvent<HTMLAnchorElement>) {
  const rect = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

function CollectionCard({ collection: c }: { collection: Collection }) {
  return (
    <Link
      data-card
      href={`/collections/${c.slug}`}
      onPointerMove={handleSpotlight}
      className="group relative block h-[72svh] min-h-[480px] shrink-0 overflow-hidden rounded-[3px] border border-gold/25 [clip-path:inset(0_0_0_0)] lg:h-[76svh] lg:w-[34vw]"
    >
      <div className="absolute inset-0 overflow-hidden">
        <Image
          data-card-img
          src={c.image}
          alt={c.title}
          fill
          sizes="(min-width:1024px) 40vw, 100vw"
          className="scale-[1.2] object-cover transition-[filter] duration-700 group-hover:brightness-110"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/45 to-night/5" />
      {/* Cursor spotlight */}
      <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 [background:radial-gradient(420px_circle_at_var(--mx,50%)_var(--my,50%),rgba(243,227,181,0.22),transparent_60%)] group-hover:opacity-100" />

      <div className="relative flex h-full flex-col justify-between p-7 md:p-10">
        <div className="flex items-start justify-between gap-4">
          <span className="shrink-0 overflow-hidden">
            <span data-card-index className="block font-display text-6xl text-gold/80 md:text-7xl">
              {c.index}
            </span>
          </span>
          <span
            data-card-kicker
            className="max-w-[60%] rounded-full border border-gold/50 bg-night/40 px-3.5 py-1.5 text-right text-[0.62rem] font-semibold md:text-[0.7rem] uppercase tracking-[0.22em] text-gold-pale backdrop-blur-sm"
          >
            {c.kicker}
          </span>
        </div>
        <div>
          <h3 className="overflow-hidden pb-1 font-display text-4xl leading-tight md:text-5xl">
            <span data-card-title className="block">
              {c.title}
            </span>
          </h3>
          <p data-card-body className="mt-4 max-w-sm text-base leading-relaxed text-ivory/90">
            {c.summary}
          </p>
          <span
            data-card-body
            className="mt-8 inline-flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-gold"
          >
            Discover
            <span className="h-px w-8 bg-gold transition-all duration-500 group-hover:w-20" />
          </span>
        </div>
      </div>
    </Link>
  );
}

function ClosingPanel() {
  return (
    <div
      data-card
      className="relative flex h-[50svh] min-h-[340px] shrink-0 flex-col items-start justify-center gap-6 overflow-hidden rounded-[3px] border border-gold/25 bg-navy-2 p-8 lg:h-[76svh] lg:w-[26vw] lg:p-12"
    >
      <span aria-hidden className="absolute -right-10 -top-10 h-56 w-56 rounded-full bg-gold/15 blur-3xl" />
      <p className="eyebrow">Not sure where to begin?</p>
      <p className="font-display text-4xl leading-tight">
        Let a specialist <span className="script-accent">guide you.</span>
      </p>
      <Link href="/contact" className="btn-gold mt-2 rounded-full px-7 py-4 text-sm font-semibold tracking-wide">
        Speak to an expert
      </Link>
    </div>
  );
}

export function Collections() {
  const root = useRef<HTMLElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const cards = gsap.utils.toArray<HTMLElement>("[data-card]");

      // Text inside a card rises in once the card is revealed.
      const revealCardText = (card: HTMLElement) =>
        gsap
          .timeline({ paused: true })
          .from(card.querySelectorAll("[data-card-index], [data-card-title]"), {
            yPercent: 110,
            duration: 1.1,
            stagger: 0.08,
            ease: "expo.out",
          })
          .from(card.querySelectorAll("[data-card-kicker], [data-card-body]"), {
            y: 24,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.08,
            ease: "power3.out",
          }, 0.2);

      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        const distance = () => track.current!.scrollWidth - window.innerWidth;
        const tween = gsap.to(track.current, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(COLLECTIONS.length, Math.floor(self.progress * COLLECTIONS.length) + 1);
              if (counter.current) counter.current.textContent = String(index).padStart(2, "0");
            },
          },
        });

        // Depth: the outlined word drifts slower than the cards, the rail fills with progress.
        gsap.to("[data-bg-word]", { xPercent: -30, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: 1 } });
        gsap.fromTo("[data-rail]", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: { trigger: root.current, start: "top top", end: () => `+=${distance()}`, scrub: true } });

        cards.forEach((card) => {
          const text = revealCardText(card);
          // The card unfolds from a framed, tilted window to full bleed as it slides in.
          gsap.fromTo(
            card,
            { clipPath: "inset(14% 10% 14% 10% round 6px)", rotateY: -14, transformPerspective: 1400 },
            {
              clipPath: "inset(0% 0% 0% 0% round 3px)",
              rotateY: 0,
              ease: "power2.out",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left 95%", end: "left 45%", scrub: true },
            },
          );
          // Cards already on screen when the section arrives reveal on vertical entry; the rest as they slide in.
          const isInitiallyVisible = card.offsetLeft < window.innerWidth * 0.8;
          ScrollTrigger.create({
            ...(isInitiallyVisible
              ? { trigger: root.current, start: "top 55%" }
              : { trigger: card, containerAnimation: tween, start: "left 75%" }),
            once: true,
            onEnter: () => text.play(),
          });
          const img = card.querySelector("[data-card-img]");
          if (img) {
            gsap.fromTo(img, { xPercent: -10, scale: 1.45 }, {
              xPercent: 10,
              scale: 1.15,
              ease: "none",
              scrollTrigger: { trigger: card, containerAnimation: tween, start: "left right", end: "right left", scrub: true },
            });
          }
        });
      });

      mm.add("(max-width: 1023px) and (prefers-reduced-motion: no-preference)", () => {
        cards.forEach((card) => {
          const text = revealCardText(card);
          gsap.fromTo(
            card,
            { clipPath: "inset(10% 6% 10% 6% round 6px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 3px)",
              ease: "none",
              scrollTrigger: { trigger: card, start: "top 92%", end: "top 40%", scrub: true },
            },
          );
          ScrollTrigger.create({ trigger: card, start: "top 70%", once: true, onEnter: () => text.play() });
          const img = card.querySelector("[data-card-img]");
          if (img) {
            gsap.fromTo(img, { scale: 1.4 }, { scale: 1.1, ease: "none", scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true } });
          }
        });
      });
    },
    { scope: root },
  );

  return (
    // GSAP wraps pinned elements in a spacer; this React-owned wrapper keeps that DOM change
    // out of React's reach, so navigating away doesn't crash.
    <div>
      <section
        id="collections"
        ref={root}
        className="relative overflow-hidden bg-night lg:h-svh"
        aria-label="The Collections"
      >
        {/* Giant outlined word for depth */}
        <p
          data-bg-word
          aria-hidden
          className="pointer-events-none absolute left-[4vw] top-1/2 hidden -translate-y-1/2 select-none whitespace-nowrap font-display text-[24vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(212,178,106,0.24)] lg:block"
        >
          Collections
        </p>
        <div className="pointer-events-none absolute -left-40 top-1/3 h-[480px] w-[480px] rounded-full bg-gold/[0.07] blur-[120px]" />

        <div
          ref={track}
          className="relative flex flex-col gap-8 px-4 py-24 sm:px-8 lg:h-full lg:w-max lg:flex-row lg:items-center lg:gap-12 lg:py-0 lg:pl-[8vw] lg:pr-[8vw]"
        >
          <header className="flex max-w-md shrink-0 flex-col justify-center lg:w-[30vw]">
            <p className="eyebrow mb-6">The Collections</p>
            <SplitHeading
              lines={["Three worlds", "of *light.*"]}
              className="font-display text-[clamp(2.8rem,5vw,4.75rem)] leading-[1.02]"
            />
            <p className="mt-8 text-lg leading-relaxed text-ivory/85">
              From earth-born rarities to responsibly grown brilliance and saturated colour — curated for the counter and
              the collector.
            </p>
            <p className="mt-10 hidden items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-gold lg:flex">
              Scroll to explore <span aria-hidden>⟶</span>
            </p>
          </header>

          {COLLECTIONS.map((c) => (
            <CollectionCard key={c.slug} collection={c} />
          ))}
          <ClosingPanel />
        </div>

        {/* Progress rail (desktop) */}
        <div className="absolute inset-x-[8vw] bottom-8 hidden items-center gap-6 lg:flex" aria-hidden>
          <span className="font-display text-xl text-gold">
            <span ref={counter}>01</span>
            <span className="text-ivory/40"> / {String(COLLECTIONS.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 bg-ivory/10">
            <span data-rail className="absolute inset-0 origin-left bg-gradient-to-r from-gold-deep via-gold-pale to-gold" />
          </span>
        </div>
      </section>
    </div>
  );
}
