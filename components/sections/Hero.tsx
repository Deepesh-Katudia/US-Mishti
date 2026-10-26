"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SITE } from "@/lib/site";

const HeroCanvas = dynamic(() => import("@/components/three/HeroCanvas"), { ssr: false });

const noopSubscribe = () => () => {};

let webglSupport: boolean | undefined;

/** Probes once per page load and releases the probe context so it never counts toward the browser's limit. */
function supportsWebGL(): boolean {
  if (webglSupport !== undefined) return webglSupport;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    webglSupport = Boolean(gl);
  } catch {
    webglSupport = false;
  }
  return webglSupport;
}

/** Static still for SSR, reduced-motion visitors and devices without WebGL. */
function HeroFallback() {
  return (
    <div className="absolute inset-0">
      <Image
        src="/images/homepage_image/natural-diamond.webp"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,178,106,0.18),transparent_60%)]" />
    </div>
  );
}

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const progress = useRef(0);
  const [isOnScreen, setIsOnScreen] = useState(true);
  const canRender3D = useSyncExternalStore(
    noopSubscribe,
    () => supportsWebGL() && !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false,
  );

  // Pause the WebGL render loop once the hero has scrolled out of view.
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => setIsOnScreen(entry.isIntersecting));
    observer.observe(root.current!);
    return () => observer.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-hero-fade]", { autoAlpha: 0, y: 24, duration: 1.2, stagger: 0.12, delay: 0.9, ease: "expo.out" });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=110%",
            pin: true,
            scrub: 0.8,
            onUpdate: (self) => {
              progress.current = self.progress;
            },
          },
        });
        tl.to("[data-hero-cue]", { autoAlpha: 0, duration: 0.15, ease: "none" }, 0)
          .to("[data-hero-copy]", { yPercent: -35, autoAlpha: 0, ease: "none" }, 0)
          .to("[data-hero-scrim]", { opacity: 0.55, ease: "none" }, 0.5);
      });
    },
    { scope: root },
  );

  return (
    // GSAP wraps pinned elements in a spacer; this React-owned wrapper keeps that DOM change
    // out of React's reach, so navigating away doesn't crash.
    <div>
      <section ref={root} className="relative h-svh min-h-[640px] overflow-hidden bg-navy" aria-label="Introduction">
        <div className="absolute inset-0">{canRender3D ? <HeroCanvas progress={progress} isActive={isOnScreen} /> : <HeroFallback />}</div>
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(7,9,14,0.55)_0%,transparent_30%,transparent_65%,rgba(11,14,22,1)_100%)]" />
        {/* Mobile: deepen the lower half so the stacked copy keeps contrast over the glow. */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[70%] bg-gradient-to-t from-navy via-navy/80 to-transparent md:hidden" />
        <div data-hero-scrim className="pointer-events-none absolute inset-0 bg-navy opacity-0" />

        <div
          data-hero-copy
          className="pointer-events-none relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-4 pb-16 sm:px-8 md:pb-24"
        >
          <p data-hero-fade className="eyebrow mb-6">
            {SITE.legalName} · A DiaHearts Company
          </p>
          <SplitHeading
            as="h1"
            immediate
            delay={0.2}
            lines={["Brilliance,", "sourced *without* *borders.*"]}
            className="font-display text-[clamp(3rem,9vw,8.5rem)] font-normal leading-[0.92] tracking-[-0.02em]"
          />
          <div className="mt-10 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p data-hero-fade className="max-w-md text-base leading-relaxed text-mist md:text-lg">
              Certified natural and lab-grown diamonds, rare gemstones and master craftsmanship — from Hatton Garden&apos;s
              finest network to America&apos;s jewellers and collectors.
            </p>
            <div data-hero-fade className="pointer-events-auto flex flex-wrap gap-3">
              <a
                href={`mailto:${SITE.contact.email}?subject=${encodeURIComponent("Trade account enquiry")}`}
                className="btn-gold rounded-full px-7 py-4 text-sm font-semibold tracking-wide"
              >
                For Jewellers — Trade
              </a>
              <Link href="/#collections" className="btn-ghost rounded-full px-7 py-4 text-sm font-semibold tracking-wide">
                Find your diamond
              </Link>
            </div>
          </div>
        </div>

        <div data-hero-cue className="absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 md:flex">
          <span className="eyebrow text-[0.6rem] text-mist">Scroll</span>
          <span className="h-10 w-px animate-pulse bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>
    </div>
  );
}
