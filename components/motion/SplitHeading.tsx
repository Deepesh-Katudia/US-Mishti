"use client";

import { useRef, type ElementType } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface SplitHeadingProps {
  /** Each entry renders as its own masked line. Wrap words in *asterisks* to gild them. */
  lines: readonly string[];
  as?: ElementType;
  className?: string;
  /** Animate immediately on mount instead of on scroll. */
  immediate?: boolean;
  delay?: number;
}

function renderWords(line: string) {
  return line.split(" ").map((word, i) => {
    const isGold = word.startsWith("*") && word.endsWith("*");
    const text = isGold ? word.slice(1, -1) : word;
    // Script swashes overshoot the em-box, so gilded words get a roomier mask (offset by negative margins).
    const mask = isGold ? "-my-[0.25em] -ml-[0.15em] -mr-[0.12em] py-[0.25em] pl-[0.15em] pr-[0.1em]" : "pb-[0.12em]";
    return (
      <span key={i} className={`inline-block overflow-hidden align-bottom ${mask}`}>
        <span data-word className={`inline-block will-change-transform ${isGold ? "script-accent gold-shimmer" : ""}`}>
          {text}
          {" "}
        </span>
      </span>
    );
  });
}

/** Masked word-by-word rise, the signature headline reveal used across the site. */
export function SplitHeading({ lines, as: Tag = "h2", className, immediate = false, delay = 0 }: SplitHeadingProps) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-word]", {
          yPercent: 110,
          rotate: 4,
          duration: 1.3,
          delay,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: immediate ? undefined : { trigger: ref.current, start: "top 85%", once: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} aria-label={lines.join(" ").replaceAll("*", "")}>
      {lines.map((line, i) => (
        <span key={i} aria-hidden className="block">
          {renderWords(line)}
        </span>
      ))}
    </Tag>
  );
}
