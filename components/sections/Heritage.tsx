import { Counter } from "@/components/motion/Counter";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { MARKETS, STATS } from "@/lib/content";

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
            <span className="script-accent text-3xl">
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

      <Reveal
        as="dl"
        className="mx-auto mt-24 grid max-w-7xl grid-cols-2 gap-px overflow-hidden border-y border-gold/15 bg-gold/15 px-0 sm:px-8 md:grid-cols-4"
        stagger={0.1}
      >
        {STATS.map((stat) => (
          <div key={stat.label} className="flex flex-col gap-2 bg-navy px-4 py-10 md:px-8">
            <dt className="order-2 text-sm font-semibold uppercase tracking-[0.22em] text-mist">{stat.label}</dt>
            <dd className="order-1 font-display text-5xl font-normal text-gold md:text-6xl">
              <Counter value={stat.value} suffix={stat.suffix} />
            </dd>
          </div>
        ))}
      </Reveal>

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
