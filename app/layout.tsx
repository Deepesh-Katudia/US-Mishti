import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Manrope, Pinyon_Script } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/chat/ChatWidget";
import { chatMode } from "@/lib/chat/config";
import { SmoothScroll } from "@/components/motion/SmoothScroll";
import { SITE } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  variable: "--font-bodoni",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});

const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Certified Natural & Lab-Grown Diamonds`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.description,
  keywords: [
    "wholesale diamonds USA",
    "lab-grown diamonds",
    "natural diamonds",
    "GIA certified diamonds",
    "diamond supplier",
    "US Mishti",
    "DiaHearts",
  ],
  openGraph: {
    type: "website",
    siteName: SITE.name,
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#0b0e16",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${bodoni.variable} ${pinyon.variable} ${manrope.variable} antialiased`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-full focus:bg-gold focus:px-5 focus:py-3 focus:text-night"
        >
          Skip to content
        </a>
        <SmoothScroll />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ChatWidget mode={chatMode()} />
        <div className="grain" aria-hidden />
      </body>
    </html>
  );
}
