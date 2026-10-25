"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { PROCESS } from "@/lib/content";

export function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: root.current, start: "top 70%", end: "center 55%", scrub: 1 },
        });
        tl.fromTo("[data-process-line]", { scaleX: 0 }, { scaleX: 1, ease: "none" })
          .from("[data-process-step]", { y: 60, autoAlpha: 0, stagger: 0.25, ease: "power2.out" }, 0)
          .from("[data-process-badge]", { scale: 0, rotate: -120, stagger: 0.25, ease: "back.out(2)" }, 0);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className="relative bg-night py-28 md:py-40" aria-label="How it works">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mb-20 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div>
            <p className="eyebrow mb-6">How it works</p>
            <SplitHeading
              lines={["Simple,", "*by* *design.*"]}
              className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] leading-[1.05]"
            />
          </div>
          <p className="max-w-sm leading-relaxed text-mist">
            A seamless three-step experience — whether you need a single centre stone or a parcel of five hundred.
          </p>
        </div>

        <div className="relative">
          <span
            data-process-line
            aria-hidden
            className="absolute left-0 right-0 top-8 hidden h-px origin-left bg-gradient-to-r from-gold-deep via-gold-pale to-gold-deep md:block"
          />
          <ol className="grid gap-14 md:grid-cols-3 md:gap-10">
            {PROCESS.map((step) => (
              <li key={step.title} data-process-step className="relative">
                <span data-process-badge className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-night font-display text-2xl italic text-gold">
                  {step.index}
                </span>
                <h3 className="mt-8 font-display text-4xl font-normal">{step.title}</h3>
                <p className="mt-4 max-w-xs text-lg leading-relaxed text-mist">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
