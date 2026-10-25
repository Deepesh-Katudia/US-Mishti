"use client";

import Image from "next/image";
import { useRef, type PointerEvent } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SHAPES, type Shape } from "@/lib/content";

const MAX_TILT = 10;

function ShapeCard({ shape, index }: { shape: Shape; index: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(e.currentTarget, { rotateY: x * MAX_TILT * 2, rotateX: -y * MAX_TILT * 2, duration: 0.6, ease: "power3.out" });
  };

  const handleLeave = () => {
    gsap.to(ref.current, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <div data-shape className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="sheen group relative overflow-hidden rounded-[2px] bg-ivory p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]"
      >
        <span className="absolute left-4 top-3 font-display text-sm italic text-navy/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative mx-auto aspect-square w-full max-w-[200px]">
          <Image
            src={shape.image}
            alt={`${shape.name} cut diamond`}
            fill
            sizes="(min-width:1024px) 16vw, (min-width:640px) 30vw, 45vw"
            className="object-contain mix-blend-multiply transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:rotate-6"
          />
        </div>
        <div className="mt-3 border-t border-navy/10 pt-3 text-center">
          <h3 className="font-display text-xl text-navy">{shape.name}</h3>
          <p className="mt-1 min-h-[2.6em] text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-navy/60">{shape.note}</p>
        </div>
      </div>
    </div>
  );
}

export function Shapes() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        // Tiles flip down into place in a diagonal wave, like a jewel tray being laid out.
        gsap.from("[data-shape]", {
          y: 60,
          autoAlpha: 0,
          rotateX: -85,
          transformPerspective: 1000,
          transformOrigin: "50% 0%",
          duration: 1.3,
          ease: "expo.out",
          stagger: { each: 0.07, grid: "auto", from: "start" },
          scrollTrigger: { trigger: "[data-shape-grid]", start: "top 80%", once: true },
        });
      });
    },
    { scope: root },
  );

  return (
    <section id="shapes" ref={root} className="relative bg-navy py-28 md:py-40" aria-label="Diamond shapes">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[60%] bg-[radial-gradient(ellipse_at_top,rgba(212,178,106,0.12),transparent_65%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-16 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6">The Shape Atlas</p>
            <SplitHeading
              lines={["Every silhouette", "of *brilliance.*"]}
              className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-normal leading-[1] tracking-tight"
            />
          </div>
          <p className="max-w-sm text-lg leading-relaxed text-mist">
            Thirty cuts on call through our supplier network — from the classic round brilliant to architectural step
            cuts and rare fancy shapes. Hover to examine each stone.
          </p>
        </div>

        <div data-shape-grid className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
          {SHAPES.map((shape, i) => (
            <ShapeCard key={shape.name} shape={shape} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
