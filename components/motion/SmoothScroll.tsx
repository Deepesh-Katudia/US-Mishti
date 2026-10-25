"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";

let activeLenis: Lenis | null = null;

/** Pause / resume smooth scrolling, e.g. while a modal dialog is open. */
export function setPageScrollLocked(isLocked: boolean) {
  document.documentElement.style.overflow = isLocked ? "hidden" : "";
  if (isLocked) activeLenis?.stop();
  else activeLenis?.start();
}

export function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lenis = new Lenis({ duration: 1.25, smoothWheel: true, anchors: { offset: -80 } });
    activeLenis = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      activeLenis = null;
    };
  }, []);

  return null;
}
