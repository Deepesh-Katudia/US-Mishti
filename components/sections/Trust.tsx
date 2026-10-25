import Image from "next/image";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { CERTIFICATIONS, LOGISTICS } from "@/lib/content";

export function Trust() {
  return (
    <section className="relative overflow-hidden bg-navy py-28 md:py-36" aria-label="Certified and insured">
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6">Certified & insured</p>
          <SplitHeading
            lines={["Every stone graded.", "*Every* *mile* *insured.*"]}
            className="font-display text-[clamp(2.2rem,4.5vw,3.75rem)] leading-[1.1]"
          />
        </div>

        <Reveal className="mt-16 grid gap-6 sm:grid-cols-3" stagger={0.15}>
          {CERTIFICATIONS.map((cert) => (
            <div
              key={cert.code}
              className="group relative flex flex-col items-center gap-6 border border-gold/20 bg-night/30 px-6 py-10 text-center transition-colors duration-500 hover:border-gold/60 hover:bg-gold/[0.04]"
            >
              {/* Rotating diamond frames behind the official logo */}
              <span className="relative flex h-40 w-full items-center justify-center">
                <span
                  aria-hidden
                  className="absolute h-32 w-32 rotate-45 border border-gold/40 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:rotate-[135deg]"
                />
                <span
                  aria-hidden
                  className="absolute h-24 w-24 rotate-45 border border-gold/20 transition-transform duration-1000 ease-[var(--ease-out-expo)] group-hover:-rotate-45"
                />
                <Image
                  src={cert.logo}
                  alt={`${cert.name} logo`}
                  width={cert.width}
                  height={cert.height}
                  unoptimized={cert.logo.endsWith(".svg")}
                  // Very wide wordmarks (HRD) size by width; seal-style logos by height.
                  className={`relative h-auto drop-shadow-[0_6px_18px_rgba(0,0,0,0.6)] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105 ${
                    cert.width / cert.height > 4 ? "w-[82%]" : "max-h-20 w-auto max-w-[78%]"
                  }`}
                />
              </span>
              <span className="text-base text-mist">{cert.name}</span>
            </div>
          ))}
        </Reveal>
      </div>

      <div className="mt-24 border-y border-gold/15 py-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.35em] text-mist">Secure logistics partners</p>
        <div className="overflow-hidden">
          <div className="marquee-track flex w-max gap-16 whitespace-nowrap font-display text-4xl font-normal text-ivory/60 md:text-6xl [animation-direction:reverse]">
            {Array.from({ length: 4 }, () => LOGISTICS)
              .flat()
              .map((name, i) => (
                <span key={i} className="flex items-center gap-16" aria-hidden={i >= LOGISTICS.length}>
                  {name}
                  <span className="text-2xl text-gold/50">◆</span>
                </span>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}
