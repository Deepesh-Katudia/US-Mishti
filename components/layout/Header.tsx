"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Logo } from "./Logo";
import { NAV_LINKS } from "@/lib/site";

const SCROLL_THRESHOLD = 40;

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > SCROLL_THRESHOLD);
      setIsHidden(y > lastY && y > 400);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // While the full-screen menu is open: lock scroll, make the page behind it inert,
  // move focus into the menu and let Escape close it.
  useEffect(() => {
    if (!isOpen) return;
    const background = [document.querySelector("main"), document.querySelector("footer")];
    document.documentElement.style.overflow = "hidden";
    background.forEach((el) => el?.setAttribute("inert", ""));
    document.querySelector<HTMLAnchorElement>("#mobile-menu a")?.focus();

    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.documentElement.style.overflow = "";
      background.forEach((el) => el?.removeAttribute("inert"));
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-700 ease-[var(--ease-out-expo)] ${
        isHidden && !isOpen ? "-translate-y-full" : "translate-y-0"
      } ${isScrolled ? "border-b border-gold/10 bg-night/70 backdrop-blur-xl" : "bg-transparent"}`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-8">
        <Logo />
        <nav aria-label="Main navigation" className="hidden items-center gap-10 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group relative text-[0.78rem] font-medium uppercase tracking-[0.22em] text-ivory/80 transition-colors hover:text-ivory"
            >
              {link.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-right scale-x-0 bg-gold transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          ))}
          <Link href="/#inquire" className="btn-gold rounded-full px-5 py-2.5 text-[0.78rem] font-semibold tracking-wide">
            Inquire
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setIsOpen((o) => !o)}
          className="relative z-10 flex h-11 w-11 flex-col items-center justify-center gap-1.5 lg:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <span className={`h-px w-6 bg-ivory transition-transform duration-500 ${isOpen ? "translate-y-[3.5px] rotate-45" : ""}`} />
          <span className={`h-px w-6 bg-ivory transition-transform duration-500 ${isOpen ? "-translate-y-[3.5px] -rotate-45" : ""}`} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile navigation"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 -z-0 flex h-svh flex-col justify-center gap-2 bg-night px-6 lg:hidden"
          >
            {[...NAV_LINKS, { label: "Inquire", href: "/#inquire" }].map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.06, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="block py-2 font-display text-5xl font-normal transition-colors hover:text-gold"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
