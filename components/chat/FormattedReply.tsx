import Link from "next/link";
import type { ReactNode } from "react";

// Only on-site paths become links — the model can't inject arbitrary URLs.
const INLINE_TOKEN = /(\*\*[^*]+\*\*|\/contact(?:\?kind=(?:trade|retail))?|\/collections\/(?:natural|lab-grown|gemstones))/g;

function renderInline(text: string): ReactNode[] {
  return text.split(INLINE_TOKEN).map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-gold-pale">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("/contact") || part.startsWith("/collections/")) {
      return (
        <Link key={i} href={part} className="text-gold underline decoration-gold/40 underline-offset-2 hover:decoration-gold">
          {part}
        </Link>
      );
    }
    return part;
  });
}

/** Minimal, XSS-safe renderer for the concierge's plain-text replies: paragraphs, "- " bullets, **bold**. */
export function FormattedReply({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  let bullets: string[] = [];

  const flush = () => {
    if (bullets.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-2 space-y-1.5">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span aria-hidden className="mt-[0.15em] text-[0.6em] text-gold">◆</span>
            <span>{renderInline(b)}</span>
          </li>
        ))}
      </ul>,
    );
    bullets = [];
  };

  text.split("\n").forEach((line, i) => {
    const bullet = line.match(/^\s*[-•]\s+(.*)$/);
    if (bullet) {
      bullets.push(bullet[1]);
      return;
    }
    flush();
    if (line.trim()) blocks.push(<p key={`p-${i}`} className="my-1.5">{renderInline(line)}</p>);
  });
  flush();

  return <>{blocks}</>;
}
