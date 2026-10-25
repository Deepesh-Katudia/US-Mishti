"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PATHS } from "@/lib/content";

type PathKey = keyof typeof PATHS;

function PathPanel({ kind }: { kind: PathKey }) {
  const path = PATHS[kind];
  return (
    <article
      data-path
      className="group relative flex min-h-[620px] flex-col justify-end overflow-hidden border border-gold/20 p-7 md:p-12"
    >
      <Image
        src={path.image}
        alt=""
        fill
        sizes="(min-width:1024px) 50vw, 100vw"
        className="object-cover opacity-70 transition-all duration-[1.6s] ease-[var(--ease-out-expo)] group-hover:scale-105 group-hover:opacity-90"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-night via-night/75 to-transparent" />

      <div className="relative">
        <p className="eyebrow">{path.label}</p>
        <h3 className="mt-5 max-w-md font-display text-4xl font-normal leading-[1.05] md:text-5xl">{path.title}</h3>
        <p data-path-item className="mt-5 max-w-md text-lg leading-relaxed text-ivory/90">{path.body}</p>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2">
          {path.points.map((point) => (
            <li key={point} data-path-item className="flex items-center gap-3 text-base text-ivory">
              <span aria-hidden className="text-gold">
                ◆
              </span>
              {point}
            </li>
          ))}
        </ul>
        <Link
          href={`/contact?kind=${kind}`}
          className={`mt-10 inline-flex rounded-full px-7 py-4 text-sm font-semibold tracking-wide ${
            kind === "trade" ? "btn-gold" : "btn-ghost"
          }`}
        >
          {path.cta}
        </Link>
      </div>
    </article>
  );
}

export function Paths() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-path]").forEach((panel) => {
          gsap.from(panel.querySelectorAll("[data-path-item]"), {
            y: 30,
            autoAlpha: 0,
            duration: 0.9,
            stagger: 0.07,
            ease: "power3.out",
            scrollTrigger: { trigger: panel, start: "top 60%", once: true },
          });
        });
      });
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        // Panels slide in from opposite sides, meeting in the middle like doors closing.
        gsap.from("[data-path]", {
          xPercent: (i) => (i === 0 ? -18 : 18),
          autoAlpha: 0,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 1 },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="paths" ref={root} className="relative overflow-hidden bg-navy py-28 md:py-40" aria-label="Two paths">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-16 text-center">
          <p className="eyebrow mb-6">Two paths, one standard</p>
          <SplitHeading
            lines={["Whether you sell brilliance", "or *wear* *it.*"]}
            className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] leading-[1.05]"
          />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <PathPanel kind="trade" />
          <PathPanel kind="retail" />
        </div>
      </div>
    </section>
  );
}
