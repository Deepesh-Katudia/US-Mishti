"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

interface CounterProps {
  value: number;
  suffix?: string;
  className?: string;
}

const format = (n: number) => Math.round(n).toLocaleString("en-US");

export function Counter({ value, suffix = "", className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(() => {
    const el = ref.current!;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const state = { n: 0 };
      el.textContent = format(0) + suffix;
      gsap.to(state, {
        n: value,
        duration: 2.2,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 90%", once: true },
        onUpdate: () => {
          el.textContent = format(state.n) + suffix;
        },
      });
    });
  });

  return (
    <span ref={ref} className={className}>
      {format(value)}
      {suffix}
    </span>
  );
}
