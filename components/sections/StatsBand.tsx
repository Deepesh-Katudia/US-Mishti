"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { STATS } from "@/lib/content";

const COUNT_DURATION = 3.2;
const format = (n: number) => Math.round(n).toLocaleString("en-US");

export function StatsBand() {
  const root = useRef<HTMLDListElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const cells = gsap.utils.toArray<HTMLElement>("[data-stat]");
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 82%", once: true },
        });

        tl.from("[data-stat-divider]", { scaleY: 0, duration: 1.2, stagger: 0.1, ease: "expo.out" }, 0)
          .from(cells, { y: 60, autoAlpha: 0, duration: 1.2, stagger: 0.12, ease: "expo.out" }, 0);

        cells.forEach((cell, i) => {
          const value = Number(cell.dataset.value);
          const suffix = cell.dataset.suffix ?? "";
          const num = cell.querySelector<HTMLElement>("[data-stat-num]")!;
          const state = { n: 0 };
          num.textContent = format(0) + suffix;
          const at = 0.15 + i * 0.12;

          // Long expo ease: races through the low numbers, then glides gently onto the final value.
          tl.to(state, {
            n: value,
            duration: COUNT_DURATION,
            ease: "expo.out",
            onUpdate: () => {
              num.textContent = format(state.n) + suffix;
            },
          }, at)
            .fromTo(num, { filter: "blur(10px)", scale: 0.85 }, { filter: "blur(0px)", scale: 1, duration: 1.6, ease: "expo.out" }, at)
            .from(cell.querySelector("[data-stat-line]"), { scaleX: 0, duration: COUNT_DURATION, ease: "expo.out" }, at);
        });

        // GSAP owns this element's transform entirely (no Tailwind translate), so it fully exits.
        tl.fromTo(
          "[data-stat-sweep]",
          { xPercent: -100, autoAlpha: 1 },
          { xPercent: 100, duration: 1.6, ease: "power2.inOut", onComplete: () => gsap.set("[data-stat-sweep]", { autoAlpha: 0 }) },
          "-=1.2",
        );
      });
    },
    { scope: root },
  );

  return (
    <dl
      ref={root}
      className="relative mt-24 grid w-full grid-cols-2 overflow-hidden border-y border-gold/20 bg-night/40 lg:grid-cols-4"
    >
      {STATS.map((stat, i) => {
        const final = format(stat.value) + stat.suffix;
        return (
          <div
            key={stat.label}
            data-stat
            data-value={stat.value}
            data-suffix={stat.suffix}
            className="relative flex flex-col items-center justify-center gap-5 px-4 py-14 text-center md:py-20 lg:py-24"
          >
            {/* Dividers between cells: vertical on every cell after the first in a row. */}
            {i % 2 === 1 && (
              <span data-stat-divider aria-hidden className="absolute inset-y-[18%] left-0 w-px origin-top bg-gold/25 lg:hidden" />
            )}
            {i > 0 && (
              <span data-stat-divider aria-hidden className="absolute inset-y-[18%] left-0 hidden w-px origin-top bg-gold/25 lg:block" />
            )}
            {i >= 2 && <span aria-hidden className="absolute inset-x-[12%] top-0 h-px bg-gold/15 lg:hidden" />}

            <dd className="order-1 font-display leading-none">
              <span className="sr-only">{final}</span>
              {/* The invisible final value reserves width so the counting digits never shift the layout. */}
              <span aria-hidden className="relative inline-grid text-[clamp(3rem,6.6vw,7.5rem)]">
                <span className="invisible col-start-1 row-start-1">{final}</span>
                <span data-stat-num className="text-gold col-start-1 row-start-1 inline-block will-change-transform">
                  {final}
                </span>
              </span>
            </dd>
            <span data-stat-line aria-hidden className="order-2 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent md:w-24" />
            <dt className="order-3 text-sm font-semibold uppercase tracking-[0.28em] text-mist md:text-base">{stat.label}</dt>
          </div>
        );
      })}
      {/* One-off light sweep once the numbers land */}
      <span
        data-stat-sweep
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 bg-[linear-gradient(100deg,transparent_35%,rgba(243,227,181,0.12)_50%,transparent_65%)]"
      />
    </dl>
  );
}
