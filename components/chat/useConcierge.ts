"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ChatTurn } from "@/lib/chat/validation";

const STORAGE_KEY = "us-mishti-concierge";

function loadHistory(): ChatTurn[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as ChatTurn[]) : [];
  } catch {
    return [];
  }
}

/** Conversation state + streaming transport for the concierge widget. */
export function useConcierge() {
  // Lazy init from sessionStorage: history only renders inside the panel, which is
  // closed on first paint, so server and client markup still match.
  const [messages, setMessages] = useState<ChatTurn[]>(() => (typeof window === "undefined" ? [] : loadHistory()));
  const [isStreaming, setIsStreaming] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (isStreaming) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch {
      // Storage unavailable (private mode) — the chat still works for this page view.
    }
  }, [messages, isStreaming]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(
    async (text: string) => {
      const content = text.trim();
      if (!content || isStreaming) return;

      const history: ChatTurn[] = [...messages, { role: "user", content }];
      setMessages([...history, { role: "assistant", content: "" }]);
      setNotice(null);
      setIsStreaming(true);

      const controller = new AbortController();
      abortRef.current = controller;
      const setReply = (reply: string) =>
        setMessages((prev) => [...prev.slice(0, -1), { role: "assistant", content: reply }]);

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const payload: { error?: string } = await res.json().catch(() => ({}));
          setMessages(history); // keep the question, drop the empty reply placeholder
          setNotice(payload.error ?? "The concierge is unavailable right now.");
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let reply = "";
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          reply += decoder.decode(value, { stream: true });
          setReply(reply);
        }
        reply += decoder.decode();
        setReply(reply || "Sorry, I couldn't answer that. Please try rephrasing.");
      } catch (error) {
        if (controller.signal.aborted) return;
        setMessages(history);
        setNotice(error instanceof Error ? "Connection lost — please try again." : "Something went wrong.");
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [messages, isStreaming],
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setNotice(null);
  }, []);

  return { messages, isStreaming, notice, send, reset };
}
