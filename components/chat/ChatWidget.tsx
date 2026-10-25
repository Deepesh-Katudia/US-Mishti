"use client";

import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CHAT_LIMITS } from "@/lib/chat/config";
import { FormattedReply } from "./FormattedReply";
import { useConcierge } from "./useConcierge";

const SUGGESTIONS = [
  "Natural or lab-grown — which suits me?",
  "Which shape looks largest per carat?",
  "What does a GIA report tell me?",
  "How do I open a trade account?",
] as const;

const EASE = [0.16, 1, 0.3, 1] as const;

function DiamondIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden fill="none" stroke="currentColor" strokeLinejoin="round">
      <path d="M6 11 11 5h10l5 6-10 16Z" strokeWidth="1.6" />
      <path d="M6 11h20M11 5l5 6 5-6M11 11l5 16 5-16" strokeWidth="1" />
    </svg>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1" aria-label="Concierge is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" style={{ animationDelay: `${i * 150}ms` }} />
      ))}
    </span>
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, isStreaming, notice, send, reset } = useConcierge();
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, notice]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const submit = (text: string) => {
    if (!text.trim() || isStreaming) return;
    void send(text);
    setInput("");
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    submit(input);
  };

  // Enter sends, Shift+Enter adds a new line.
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(input);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[70] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {isOpen && (
          <motion.section
            id="concierge-panel"
            role="dialog"
            aria-label="US Mishti diamond concierge"
            data-lenis-prevent
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: EASE } }}
            exit={{ opacity: 0, y: 16, scale: 0.96, transition: { duration: 0.25 } }}
            style={{ transformOrigin: "bottom right" }}
            className="flex h-[min(620px,calc(100svh-7rem))] w-[min(400px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[6px] border border-gold/30 bg-navy/95 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.85)] backdrop-blur-xl"
          >
            <header className="flex items-center gap-3 border-b border-gold/15 bg-night/60 px-5 py-4">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-gold">
                <DiamondIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="whitespace-nowrap font-display text-lg leading-tight">
                  Diamond <span className="script-accent text-[1.2em]">Concierge</span>
                </p>
                <p className="truncate text-xs text-mist">Ask anything about choosing your stone</p>
              </div>
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={reset}
                  className="rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.15em] text-mist hover:text-gold"
                >
                  New chat
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close concierge"
                className="flex h-9 w-9 items-center justify-center rounded-full text-xl text-ivory/70 hover:bg-ivory/5 hover:text-gold"
              >
                ×
              </button>
            </header>

            <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto overscroll-contain px-5 py-5" aria-live="polite">
              {messages.length === 0 ? (
                <div className="space-y-5">
                  <p className="text-[0.95rem] leading-relaxed text-ivory/90">
                    Welcome to US Mishti. I can help you compare shapes, understand grading reports, weigh natural against
                    lab-grown, or find the right way to buy. How can I help?
                  </p>
                  <div className="flex flex-col gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => submit(s)}
                        className="rounded-full border border-gold/30 px-4 py-2 text-left text-sm text-ivory/90 transition-colors hover:border-gold hover:bg-gold/10 hover:text-gold-pale"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m, i) =>
                  m.role === "user" ? (
                    <div key={i} className="ml-auto max-w-[85%] rounded-[14px] rounded-br-[4px] bg-gold/90 px-4 py-2.5 text-[0.93rem] leading-relaxed text-night">
                      {m.content}
                    </div>
                  ) : (
                    <div key={i} className="max-w-[92%] text-[0.93rem] leading-relaxed text-ivory/95">
                      {m.content ? <FormattedReply text={m.content} /> : <TypingDots />}
                    </div>
                  ),
                )
              )}
              {notice && (
                <p role="alert" className="rounded-[4px] border border-gold/30 bg-gold/10 px-3 py-2 text-sm text-gold-pale">
                  {notice}
                </p>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gold/15 bg-night/60 p-3">
              <div className="flex items-end gap-2 rounded-[4px] border border-ivory/15 bg-navy px-3 py-2 focus-within:border-gold/60">
                <label htmlFor="concierge-input" className="sr-only">
                  Ask the concierge
                </label>
                <textarea
                  id="concierge-input"
                  ref={inputRef}
                  rows={1}
                  value={input}
                  maxLength={CHAT_LIMITS.maxMessageChars}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about shapes, grading, buying…"
                  className="max-h-28 flex-1 resize-none bg-transparent py-1.5 text-[0.93rem] text-ivory placeholder:text-ivory/35 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isStreaming}
                  aria-label="Send"
                  className="btn-gold flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-base disabled:cursor-not-allowed disabled:opacity-40"
                >
                  ↑
                </button>
              </div>
              <p className="mt-2 px-1 text-[0.68rem] leading-snug text-mist/80">
                AI concierge · answers may be imperfect · not financial advice. For quotes, speak to a specialist.
              </p>
            </form>
          </motion.section>
        )}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setIsOpen((o) => !o)}
        aria-expanded={isOpen}
        aria-controls="concierge-panel"
        aria-label={isOpen ? "Close diamond concierge" : "Open diamond concierge"}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full text-night shadow-[0_18px_40px_-12px_rgba(212,178,106,0.7)] [background:var(--gold-gradient)]"
      >
        {!isOpen && <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-gold/30 [animation-duration:2.6s]" />}
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isOpen ? "close" : "open"}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative"
          >
            {isOpen ? <span className="text-2xl leading-none">×</span> : <DiamondIcon className="h-7 w-7" />}
          </motion.span>
        </AnimatePresence>
        {!isOpen && (
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full border border-gold/30 bg-night/90 px-3 py-1.5 text-xs font-semibold tracking-wide text-gold-pale opacity-0 transition-opacity group-hover:opacity-100 sm:block">
            Ask our diamond concierge
          </span>
        )}
      </motion.button>
    </div>
  );
}
