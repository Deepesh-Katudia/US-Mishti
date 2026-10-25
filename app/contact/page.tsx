import type { Metadata } from "next";
import { Suspense } from "react";
import { Inquiry } from "@/components/sections/Inquiry";
import { INQUIRY_KINDS, type InquiryKind } from "@/lib/validation/inquiry";

export const metadata: Metadata = {
  title: "Contact",
  description: "Open a trade account or book a private diamond consultation with US Mishti.",
};

const toKind = (value: string | string[] | undefined): InquiryKind =>
  INQUIRY_KINDS.find((k) => k === value) ?? "retail";

async function ContactInquiry({ searchParams }: Pick<PageProps<"/contact">, "searchParams">) {
  const { kind } = await searchParams;
  return <Inquiry defaultKind={toKind(kind)} headingLevel="h1" />;
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <div className="pt-20">
      <Suspense fallback={<Inquiry headingLevel="h1" />}>
        <ContactInquiry searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
