import Link from "next/link";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${className}`} aria-label="US Mishti — home">
      <svg viewBox="0 0 32 32" className="h-8 w-8 transition-transform duration-700 group-hover:rotate-[360deg]" aria-hidden>
        <defs>
          <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#f3e3b5" />
            <stop offset="0.5" stopColor="#d4b26a" />
            <stop offset="1" stopColor="#a8853f" />
          </linearGradient>
        </defs>
        <path d="M6 11 11 5h10l5 6-10 16Z" fill="none" stroke="url(#logo-gold)" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M6 11h20M11 5l5 6 5-6M11 11l5 16 5-16" fill="none" stroke="url(#logo-gold)" strokeWidth="0.9" strokeLinejoin="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-2xl font-medium tracking-[0.04em]">
          US <span className="script-accent text-[1.45em]">Mishti</span>
        </span>
        <span className="mt-1 text-[0.55rem] uppercase tracking-[0.4em] text-mist">Fine Diamonds</span>
      </span>
    </Link>
  );
}
