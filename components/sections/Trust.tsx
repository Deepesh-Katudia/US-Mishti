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
              className="group relative flex flex-col items-center gap-4 border border-gold/20 px-6 py-12 text-center transition-colors duration-500 hover:border-gold/60 hover:bg-gold/[0.04]"
            >
              <span className="relative flex h-24 w-24 items-center justify-center">
                <span
                  aria-hidden
                  className="absolute inset-0 rotate-45 border border-gold/50 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:rotate-[135deg]"
                />
                <span className="font-display text-3xl font-medium tracking-widest text-gold">{cert.code}</span>
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
