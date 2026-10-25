import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/motion/Reveal";
import { SplitHeading } from "@/components/motion/SplitHeading";
import { COLLECTIONS, SHAPES, findCollection } from "@/lib/content";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ type: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/collections/[type]">): Promise<Metadata> {
  const collection = findCollection((await params).type);
  if (!collection) return {};
  return {
    title: collection.title,
    description: collection.description,
    openGraph: { images: [collection.image] },
  };
}

export default async function CollectionPage({ params }: PageProps<"/collections/[type]">) {
  const collection = findCollection((await params).type);
  if (!collection) notFound();

  const others = COLLECTIONS.filter((c) => c.slug !== collection.slug);

  return (
    <>
      <section className="relative flex min-h-[88svh] items-end overflow-hidden bg-night pb-20 pt-40">
        <Image src={collection.image} alt="" fill priority sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-night/30" />
        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8">
          <Link href="/#collections" className="eyebrow inline-flex items-center gap-3 text-mist hover:text-gold">
            <span aria-hidden>⟵</span> All collections
          </Link>
          <p className="eyebrow mt-10">
            {collection.index} · {collection.kicker}
          </p>
          <SplitHeading
            as="h1"
            immediate
            lines={[collection.title.replace(/(\S+)$/, "*$1*")]}
            className="mt-5 font-display text-[clamp(3rem,9vw,8rem)] font-normal leading-[0.95] tracking-tight"
          />
          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ivory/80">{collection.summary}</p>
        </div>
      </section>

      <section className="bg-navy py-24 md:py-32">
        <div className="mx-auto grid max-w-7xl gap-16 px-4 sm:px-8 lg:grid-cols-2">
          <Reveal>
            <p className="font-display text-3xl font-normal leading-snug text-ivory/90 md:text-4xl">{collection.description}</p>
          </Reveal>
          <Reveal as="ul" className="divide-y divide-gold/15 border-y border-gold/15" stagger={0.08}>
            {collection.highlights.map((h, i) => (
              <li key={h} className="flex items-baseline gap-6 py-6">
                <span className="font-display text-xl italic text-gold">0{i + 1}</span>
                <span className="text-lg">{h}</span>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="bg-night py-24" aria-label="Available shapes">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <p className="eyebrow mb-10">Available in every classic silhouette</p>
          <Reveal className="grid grid-cols-3 gap-3 sm:grid-cols-6" stagger={0.05}>
            {SHAPES.slice(0, 6).map((s) => (
              <div key={s.name} className="bg-ivory p-3 text-center">
                <div className="relative aspect-square">
                  <Image src={s.image} alt={`${s.name} cut`} fill sizes="16vw" className="object-contain mix-blend-multiply" />
                </div>
                <p className="mt-2 font-display text-navy">{s.name}</p>
              </div>
            ))}
          </Reveal>
          <div className="mt-16 flex flex-wrap gap-4">
            <Link href="/contact?kind=trade" className="btn-gold rounded-full px-7 py-4 text-sm font-semibold">
              Request trade pricing
            </Link>
            <Link href="/contact?kind=retail" className="btn-ghost rounded-full px-7 py-4 text-sm font-semibold">
              Speak with a consultant
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy py-24" aria-label="Other collections">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-8 md:grid-cols-2">
          {others.map((c) => (
            <Link key={c.slug} href={`/collections/${c.slug}`} className="group relative block h-72 overflow-hidden border border-gold/20">
              <Image
                src={c.image}
                alt=""
                fill
                sizes="50vw"
                className="object-cover opacity-50 transition-transform duration-[1.4s] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-night to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="eyebrow">Next collection</p>
                <h2 className="mt-2 font-display text-4xl font-normal">{c.title}</h2>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
