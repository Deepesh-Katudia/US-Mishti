import type { Metadata } from "next";
import { SITE } from "@/lib/site";

export const metadata: Metadata = { title: "Privacy Policy" };

const SECTIONS = [
  {
    title: "What we collect",
    body: "When you submit an inquiry we collect your name, email address, optional phone number and company, your area of interest and your message.",
  },
  {
    title: "How we use it",
    body: "We use these details solely to respond to your inquiry and, for trade customers, to evaluate account eligibility. We never sell your information.",
  },
  {
    title: "Where it is stored",
    body: "Inquiries are stored securely in our database hosted by Supabase, with access restricted to authorised US Mishti staff.",
  },
  {
    title: "Your rights",
    body: `You may request access to, correction of, or deletion of your data at any time by emailing ${SITE.contact.email}.`,
  },
];

export default function PrivacyPage() {
  return (
    <section className="bg-navy px-4 pb-28 pt-40 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="eyebrow mb-6">Legal</p>
        <h1 className="font-display text-6xl font-normal">Privacy policy</h1>
        <p className="mt-6 text-mist">
          {SITE.legalName} respects your privacy. This notice explains how we handle information submitted through this
          website.
        </p>
        <div className="mt-16 space-y-12">
          {SECTIONS.map((s) => (
            <div key={s.title} className="border-t border-gold/15 pt-8">
              <h2 className="font-display text-3xl font-normal text-gold-soft">{s.title}</h2>
              <p className="mt-4 leading-relaxed text-ivory/80">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
