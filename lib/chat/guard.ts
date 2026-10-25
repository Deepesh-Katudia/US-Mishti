/**
 * Cheap, local pre-screen that runs before any tokens are spent. It only
 * catches unambiguous manipulation attempts; topic scoping itself is done by
 * the system prompt, which handles nuance far better than keyword lists.
 */
const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(all\s+|any\s+)?(previous|prior|above|earlier)\s+(instructions|rules|prompts?)/i,
  /disregard\s+(all\s+|your\s+)?(instructions|rules|guidelines)/i,
  /(reveal|show|print|repeat|output)\s+(me\s+)?(your|the)\s+(system\s+prompt|instructions|hidden\s+rules)/i,
  /\bsystem\s+prompt\b/i,
  /\byou\s+are\s+now\b/i,
  /\b(DAN|do\s+anything\s+now)\b/i,
  /\bjailbreak\b/i,
  /\bdeveloper\s+mode\b/i,
];

export const REDIRECT_REPLY =
  "I'm the US Mishti diamond concierge, so I can only help with diamonds, gemstones and buying with US Mishti — for example choosing a shape, comparing natural and lab-grown stones, certification, or how ordering works. What would you like to know?";

export type ScreenVerdict = { allowed: true } | { allowed: false; reply: string };

export function screenMessage(text: string): ScreenVerdict {
  if (!/\p{L}/u.test(text)) return { allowed: false, reply: REDIRECT_REPLY };
  if (INJECTION_PATTERNS.some((re) => re.test(text))) return { allowed: false, reply: REDIRECT_REPLY };
  return { allowed: true };
}
