"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface RevealProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  /** Seconds between each direct child animating in. */
  stagger?: number;
  y?: number;
  delay?: number;
}

/** Fades + lifts its direct children into view as the block enters the viewport. */
export function Reveal({ children, as: Tag = "div", className, stagger = 0.12, y = 40, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(ref.current!.children, {
          y,
          autoAlpha: 0,
          duration: 1.1,
          delay,
          stagger,
          ease: "expo.out",
          scrollTrigger: { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
