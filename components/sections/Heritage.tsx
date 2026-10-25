import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { StatsBand } from "./StatsBand";
import { MARKETS } from "@/lib/content";

export function Heritage() {
  return (
    <section className="relative overflow-hidden bg-navy py-28 md:py-40" aria-label="Our lineage">
      <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <p className="eyebrow mb-6">Our lineage</p>
          <SplitHeading
            lines={["Hatton Garden heritage.", "*American* reach."]}
            className="font-display text-[clamp(2.4rem,5.5vw,4.75rem)] font-normal leading-[1] tracking-tight"
          />
        </div>
        <Reveal className="space-y-6 text-mist lg:col-span-5 lg:pt-16" stagger={0.15}>
          <p className="text-xl leading-relaxed text-ivory">
            <span className="script-accent text-[2.6rem] leading-none">
              US Mishti
            </span>{" "}
            is the American house of DiaHearts Ltd — the London platform trusted by jewellers, traders and retailers to
            buy diamonds directly from the source.
          </p>
          <p className="text-lg leading-relaxed">
            We bring that same network of verified suppliers, rigorous grading and insured logistics to the United States,
            serving the trade and private clients alike with brilliance they can count on.
          </p>
        </Reveal>
      </div>

      <StatsBand />

      <div className="mt-20 overflow-hidden" aria-label="Markets served">
        <div className="marquee-track flex w-max gap-12 whitespace-nowrap font-display text-3xl font-normal italic text-ivory/25 md:text-5xl">
          {[...MARKETS, ...MARKETS].map((market, i) => (
            <span key={`${market}-${i}`} className="flex items-center gap-12" aria-hidden={i >= MARKETS.length}>
              {market}
              <span className="text-xl not-italic text-gold/60">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
