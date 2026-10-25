# US Mishti — Marketing Site

Marketing website for **US Mishti Private Limited**, the American house of
[DiaHearts Ltd](https://diahearts.com) (Hatton Garden, London). It showcases
certified natural diamonds, lab-grown diamonds and gemstones for both trade
buyers and private clients.

## Stack

| Concern    | Choice                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Framework  | Next.js 16 (App Router, Cache Components, Turbopack)                   |
| Styling    | Tailwind CSS v4: tokens live in `app/globals.css` (`@theme`)            |
| Motion     | GSAP + ScrollTrigger (`useGSAP`), Lenis smooth scroll, Motion for UI    |
| 3D         | React Three Fiber + drei: a procedural brilliant-cut diamond in the hero |
| Data       | Supabase Postgres, written only from a Server Action                   |
| Validation | zod                                                                    |
| Tests      | Vitest                                                                 |

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase credentials
npm run dev                  # http://localhost:3000
```

| Script             | What it does                                  |
| ------------------ | --------------------------------------------- |
| `npm run dev`      | Start the dev server                          |
| `npm run build`    | Production build                              |
| `npm run lint`     | ESLint                                        |
| `npm test`         | Unit tests (validation, rate limit, action)   |
| `npm run coverage` | Tests with coverage                           |

## Supabase setup

1. Create a Supabase project.
2. In **SQL Editor**, run `supabase/migrations/001_inquiries.sql`.
   This creates `public.inquiries` with **RLS enabled and no policies**, so only the service role can read or write it.
3. Copy **Project URL** and the **service_role** key (Project Settings → API) into `.env.local`:
   ```
   SUPABASE_URL=...
   SUPABASE_SERVICE_ROLE_KEY=...
   ```
   The key is used only in `lib/supabase/server.ts`, which imports `server-only`. Never prefix it with `NEXT_PUBLIC_`.

Until these are set, the inquiry form shows a friendly "temporarily unavailable" message, and the server logs the missing configuration.

New inquiries appear in **Table Editor → inquiries**. The `status` column (`new` / `contacted` / `closed`) is there for your team's follow-up.

## Deploying to Vercel

```bash
npm i -g vercel
vercel link
vercel env add SUPABASE_URL
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_SITE_URL      # e.g. https://usmishti.com
vercel --prod
```

## AI diamond concierge

A chat widget (bottom right) answers buying questions, grounded in the site's own
content (`lib/chat/knowledge.ts` is generated from `lib/content.ts` / `lib/site.ts`).
It streams from `POST /api/chat` using the Anthropic SDK.

**Setup:** set `ANTHROPIC_API_KEY` (server-only), and run
`supabase/migrations/002_chat_usage.sql` to persist per-request usage.

**Guardrails, cheapest first** (all tunable in `lib/chat/config.ts`):

| Layer | What it does |
| ----- | ------------ |
| Rate limit | 15 requests / visitor / 10 min |
| Validation | user/assistant roles only, ≤1,000 chars per message, last 12 turns, ≤8,000 chars total |
| Local screen | obvious prompt-injection / jailbreak attempts get an on-topic reply with **no API call** |
| Daily budgets | 60k tokens per visitor and a global USD cap (`CHAT_DAILY_BUDGET_USD`, default $5) per server instance |
| System prompt | only answers diamond / gemstone / US Mishti questions, never invents prices or availability, no investment advice, resists instruction overrides |
| Output safety | replies render as plain text; only on-site links (`/contact`, `/collections/*`) become clickable |

**Cost controls:** default model `claude-opus-5-5` (override with
`ANTHROPIC_MODEL`), `effort: "low"`, 1,024-token reply cap, cached system
prompt, and upstream generation is cancelled when the visitor closes the chat.
Refusals are retried server-side via `fallbacks: "default"` on supported models.
Each request logs tokens and estimated USD (`lib/chat/pricing.ts`) to the server
log and the `chat_usage` table; `chat_usage_daily` is a ready-made cost view.
The in-memory budgets are per-instance, so also set a monthly spend limit in the
Anthropic Console as the hard backstop.

## Editing content

- **Company details** (name, email, phone, address, socials): `lib/site.ts`. ⚠️ The current contact details are **placeholders**.
- **Collections, shapes, craft steps, stats and copy**: `lib/content.ts`
- **Images**: `public/images/`, copied from diahearts.com by `node scripts/fetch-assets.mjs`

## Project structure

```
app/
  actions/            Server Action + state for the inquiry form
  collections/[type]  Natural / Lab-Grown / Gemstones detail pages
  contact/, privacy/
components/
  sections/           Home page sections (Hero, Collections, Shapes, Craft…)
  motion/             Reveal, SplitHeading, Counter, SmoothScroll
  three/              Hero canvas + brilliant-cut geometry
  inquiry/            Inquiry form
  layout/             Header, Footer, Logo
lib/                  content, site config, validation, rate limit, supabase
supabase/migrations/  SQL schema
```

## Accessibility & motion

All scroll animations are gated behind `prefers-reduced-motion: no-preference`. Visitors who prefer reduced motion, or whose devices lack WebGL, see a static hero image and no smooth scrolling.
