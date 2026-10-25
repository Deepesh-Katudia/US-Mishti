"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CRAFT_STEPS } from "@/lib/content";

export function Craft() {
  const root = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step, i) => {
        // Hand-off at a single line: no gaps between steps, so one is always active.
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          onEnter: () => setActive(i),
          onLeaveBack: () => setActive(Math.max(0, i - 1)),
        });
      });

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.utils.toArray<HTMLElement>("[data-step]").forEach((step) => {
          gsap.from(step.children, {
            y: 50,
            autoAlpha: 0,
            duration: 1.1,
            stagger: 0.1,
            ease: "expo.out",
            scrollTrigger: { trigger: step, start: "top 80%", once: true },
          });
        });
        gsap.fromTo(
          "[data-craft-progress]",
          { scaleY: 0 },
          {
            scaleY: 1,
            ease: "none",
            scrollTrigger: { trigger: "[data-steps]", start: "top 60%", end: "bottom 60%", scrub: true },
          },
        );
      });
    },
    { scope: root },
  );

  return (
    <section id="craft" ref={root} className="relative bg-night py-28 md:py-40" aria-label="The Craft">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-20 max-w-2xl">
          <p className="eyebrow mb-6">The Craft</p>
          <SplitHeading
            lines={["From rough crystal", "to *radiant* heirloom."]}
            className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] leading-[1.05]"
          />
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Sticky visual: each step's photo wipes up over the previous one. */}
          <div className="relative hidden lg:block">
            <div className="sticky top-[15vh] h-[70vh] overflow-hidden rounded-[2px] border border-gold/20">
              {CRAFT_STEPS.map((step, i) => (
                <Image
                  key={step.title}
                  src={step.image}
                  alt={step.title}
                  fill
                  sizes="50vw"
                  style={{ zIndex: i }}
                  className={`object-cover transition-[clip-path,scale] duration-[1.3s] ease-[var(--ease-out-expo)] ${
                    i <= active ? "scale-100 [clip-path:inset(0_0_0_0)]" : "scale-125 [clip-path:inset(100%_0_0_0)]"
                  }`}
                />
              ))}
              <div className="absolute inset-0 z-10 bg-gradient-to-t from-night/70 to-transparent" />
              <span key={active} className="absolute bottom-6 left-6 z-10 animate-[fade-up_0.9s_var(--ease-out-expo)] font-display text-8xl text-gold/90">
                0{active + 1}
              </span>
            </div>
          </div>

          <ol data-steps className="relative space-y-[18vh] border-l border-gold/15 pl-8 lg:py-[12vh] lg:pl-12">
            <span
              data-craft-progress
              aria-hidden
              className="absolute -left-px top-0 h-full w-px origin-top bg-gradient-to-b from-gold-pale via-gold to-gold-deep"
            />
            {CRAFT_STEPS.map((step, i) => (
              <li
                key={step.title}
                data-step
                className={`transition-opacity duration-700 ${i === active ? "opacity-100" : "lg:opacity-35"}`}
              >
                <span className="eyebrow">Step 0{i + 1}</span>
                <h3 className="mt-4 font-display text-4xl font-normal md:text-5xl">{step.title}</h3>
                <p className="mt-5 max-w-md text-lg leading-relaxed text-mist">{step.body}</p>
                <div className="relative mt-8 aspect-[4/3] overflow-hidden rounded-[2px] lg:hidden">
                  <Image src={step.image} alt="" fill sizes="100vw" className="object-cover" />
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
