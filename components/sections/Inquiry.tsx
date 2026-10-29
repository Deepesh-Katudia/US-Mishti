import { InquiryForm } from "@/components/inquiry/InquiryForm";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { SITE } from "@/lib/site";
import type { InquiryKind } from "@/lib/validation/inquiry";

interface InquiryProps {
  defaultKind?: InquiryKind;
  headingLevel?: "h1" | "h2";
}

export function Inquiry({ defaultKind = "retail", headingLevel = "h2" }: InquiryProps) {
  return (
    <section id="inquire" className="relative overflow-hidden bg-night py-28 md:py-40" aria-label="Make an inquiry">
      <div className="pointer-events-none absolute -right-40 top-20 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[140px]" />
      <div className="relative mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="eyebrow mb-6">Begin the conversation</p>
          <SplitHeading
            as={headingLevel}
            lines={["Let's find", "your *stone.*"]}
            className="font-display text-[clamp(2.6rem,6vw,5rem)] font-normal leading-[0.95] tracking-tight"
          />
          <p className="mt-8 max-w-sm text-lg leading-relaxed text-mist">
            Tell us what you&apos;re looking for. A US Mishti specialist — backed by the full DiaHearts supplier network —
            will respond personally.
          </p>
          <dl className="mt-12 space-y-6 text-sm">
            <div>
              <dt className="eyebrow text-[0.62rem] text-mist">Email</dt>
              <dd className="mt-1 text-lg">
                <a href={`mailto:${SITE.contact.email}`} className="transition-colors hover:text-gold">
                  {SITE.contact.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="eyebrow text-[0.62rem] text-mist">Hours</dt>
              <dd className="mt-1 text-ivory/80">{SITE.contact.hours}</dd>
            </div>
          </dl>
        </div>
        <div className="relative border border-gold/20 bg-navy/60 p-6 backdrop-blur-sm sm:p-10 lg:col-span-7">
          <InquiryForm defaultKind={defaultKind} />
        </div>
      </div>
    </section>
  );
}
