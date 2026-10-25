"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type PointerEvent } from "react";
import { AnimatePresence, LayoutGroup, MotionConfig, motion } from "motion/react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { ShapeDialog, shapeTileLayoutId } from "@/components/shapes/ShapeDialog";
import { SHAPES, type Shape } from "@/lib/content";

const MAX_TILT = 10;

interface ShapeCardProps {
  shape: Shape;
  index: number;
  isOpen: boolean;
  onOpen: (index: number) => void;
}

function ShapeCard({ shape, index, isOpen, onOpen }: ShapeCardProps) {
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

  const handleOpen = () => {
    // Flatten the tilt first so the tile flies out from where it visibly sits.
    gsap.set(ref.current, { rotateX: 0, rotateY: 0 });
    onOpen(index);
  };

  return (
    <div data-shape className="[perspective:900px]">
      <div
        ref={ref}
        onPointerMove={handleMove}
        onPointerLeave={handleLeave}
        className="group relative rounded-[2px] bg-ivory p-5 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.8)] [transform-style:preserve-3d]"
      >
        {/* Sheen lives in its own clipped layer: the card itself can't clip, or the tile would be cut off mid-flight. */}
        <span aria-hidden className="sheen pointer-events-none absolute inset-0 overflow-hidden rounded-[2px]" />
        <span className="absolute left-4 top-3 font-display text-sm italic text-navy/40">
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="relative mx-auto aspect-square w-full max-w-[200px]">
          {/* While open, the tile lives in the dialog; this slot keeps the card's size. */}
          {!isOpen && (
            <motion.div
              layoutId={shapeTileLayoutId(shape.id)}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              // Purely visual: in the card's preserve-3d context z-index can't lift the button above it.
              className="pointer-events-none absolute inset-0 bg-ivory"
            >
              <Image
                src={shape.image}
                alt={`${shape.name} cut diamond`}
                fill
                sizes="(min-width:1024px) 16vw, (min-width:640px) 30vw, 45vw"
                className="object-contain mix-blend-multiply transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-110 group-hover:rotate-6"
              />
            </motion.div>
          )}
        </div>
        <div className="mt-3 border-t border-navy/10 pt-3 text-center">
          <h3 className="font-display text-xl text-navy">{shape.name}</h3>
          <p className="mt-1 min-h-[2.6em] text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-navy/60">{shape.note}</p>
          <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-gold-deep opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            View in 3D
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpen}
          aria-label={`View the ${shape.name} cut in 3D`}
          aria-haspopup="dialog"
          className="absolute inset-0 z-10 cursor-zoom-in rounded-[2px] focus-visible:outline-offset-4"
        />
      </div>
    </div>
  );
}

export function Shapes() {
  const root = useRef<HTMLElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const close = useCallback(() => setOpenIndex(null), []);

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
            cuts and rare fancy shapes. Select any stone to examine it in 3D.
          </p>
        </div>

        <MotionConfig reducedMotion="user">
          <LayoutGroup>
            <div data-shape-grid className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
              {SHAPES.map((shape, i) => (
                <ShapeCard key={shape.id} shape={shape} index={i} isOpen={openIndex === i} onOpen={setOpenIndex} />
              ))}
            </div>
            <AnimatePresence>
              {openIndex !== null && <ShapeDialog key="shape-dialog" index={openIndex} onClose={close} onNavigate={setOpenIndex} />}
            </AnimatePresence>
          </LayoutGroup>
        </MotionConfig>
      </div>
    </section>
  );
}
