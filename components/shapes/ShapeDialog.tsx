"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { motion } from "motion/react";
import { setPageScrollLocked } from "@/components/motion/SmoothScroll";
import { SHAPES } from "@/lib/content";

const ShapeViewer = dynamic(() => import("./ShapeViewer"), { ssr: false });

export const shapeTileLayoutId = (id: string) => `shape-tile-${id}`;

const EASE = [0.16, 1, 0.3, 1] as const;

interface ShapeDialogProps {
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

function ArrowButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous shape" : "Next shape"}
      className="flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-night/60 text-gold backdrop-blur transition-colors hover:border-gold hover:bg-gold hover:text-night"
    >
      <span aria-hidden>{direction === "prev" ? "←" : "→"}</span>
    </button>
  );
}

export function ShapeDialog({ index, onClose, onNavigate }: ShapeDialogProps) {
  const shape = SHAPES[index];
  const closeButton = useRef<HTMLButtonElement>(null);
  const total = SHAPES.length;
  const go = (step: number) => onNavigate((index + step + total) % total);

  // Lock the page behind the dialog, make it inert, and wire up keyboard controls.
  useEffect(() => {
    const background = ["main", "header", "footer"].map((sel) => document.querySelector(sel));
    const previouslyFocused = document.activeElement as HTMLElement | null;
    setPageScrollLocked(true);
    background.forEach((el) => el?.setAttribute("inert", ""));
    closeButton.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      background.forEach((el) => el?.removeAttribute("inert"));
      setPageScrollLocked(false);
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [onClose]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onNavigate((index + 1) % total);
      if (e.key === "ArrowLeft") onNavigate((index - 1 + total) % total);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [index, total, onNavigate]);

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="shape-dialog-title"
      className="fixed inset-0 z-[80] flex overflow-y-auto p-4 sm:p-8"
      data-lenis-prevent
    >
      <motion.div
        aria-hidden
        onClick={onClose}
        className="fixed inset-0 bg-night/85 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.4 } }}
      />

      <motion.div
        className="relative m-auto grid w-full max-w-6xl overflow-hidden rounded-[4px] border border-gold/25 bg-navy shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] lg:grid-cols-[1.35fr_1fr]"
        initial={{ opacity: 0, y: 40, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: EASE } }}
        exit={{ opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.35 } }}
      >
        {/* Top-right of the whole panel, so on phones it sits over the viewer and focusing it never scrolls. */}
        <button
          ref={closeButton}
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-ivory/25 bg-night/60 text-xl text-ivory/90 backdrop-blur transition-colors hover:border-gold hover:text-gold"
        >
          ×
        </button>
        {/* 3D viewer */}
        <div className="relative h-[40svh] min-h-[280px] lg:h-[74svh]">
          <motion.div
            className="absolute inset-0"
            // Clip-path, not scale: R3F measures its container with getBoundingClientRect at mount.
            initial={{ opacity: 0, clipPath: "inset(18% 18% 18% 18% round 12px)" }}
            animate={{ opacity: 1, clipPath: "inset(0% 0% 0% 0% round 0px)", transition: { delay: 0.25, duration: 0.9, ease: EASE } }}
          >
            <ShapeViewer shape={shape.id} />
          </motion.div>
          <p className="pointer-events-none absolute left-5 top-5 text-[0.7rem] font-semibold uppercase tracking-[0.3em] text-gold/80">
            Drag to rotate
          </p>
          <div className="absolute bottom-5 left-5 flex gap-3">
            <ArrowButton direction="prev" onClick={() => go(-1)} />
            <ArrowButton direction="next" onClick={() => go(1)} />
          </div>
        </div>

        {/* Details */}
        <div className="relative flex flex-col gap-7 border-t border-gold/15 p-7 sm:p-10 lg:border-l lg:border-t-0">

          <motion.div
            key={shape.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.2, duration: 0.7, ease: EASE } }}
            className="flex flex-col gap-6"
          >
            <p className="eyebrow">
              Shape {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
            </p>
            <h2 id="shape-dialog-title" className="font-display text-5xl leading-none sm:text-6xl">
              {shape.name}
              <span className="script-accent ml-3 text-[0.7em]">cut</span>
            </h2>
            <p className="text-lg leading-relaxed text-ivory/90">{shape.description}</p>

            <dl className="grid grid-cols-3 gap-px overflow-hidden border border-gold/20 bg-gold/20">
              {[
                ["Cut style", shape.cut],
                ["Facets", String(shape.facets)],
                ["L : W ratio", shape.ratio],
              ].map(([label, value]) => (
                <div key={label} className="bg-navy px-3 py-4">
                  <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-mist">{label}</dt>
                  <dd className="mt-1.5 font-display text-lg text-gold-pale">{value}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <div className="mt-auto flex items-end justify-between gap-6">
            {/* The photo tile that flew out of the grid card. */}
            <motion.div
              layoutId={shapeTileLayoutId(shape.id)}
              transition={{ duration: 0.8, ease: EASE }}
              className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-[2px] bg-ivory p-2 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.8)] sm:w-40"
            >
              <Image src={shape.image} alt={`${shape.name} cut diamond photograph`} fill sizes="160px" className="object-contain p-2 mix-blend-multiply" />
            </motion.div>
            <Link
              href={`/contact?kind=retail`}
              onClick={onClose}
              className="btn-gold rounded-full px-6 py-3.5 text-center text-sm font-semibold tracking-wide"
            >
              Inquire about {shape.name.toLowerCase()}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
