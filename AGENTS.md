# AGENTS.md — Mandatory instructions for AI

**Read this file, `docs/ARCHITECTURE.md`, and `docs/SECURITY.md` before writing or modifying any project file.**

This repository is a portfolio (Vite + Vanilla TypeScript + CSS, MPA) with a **Supabase** evaluator area (schema ready; **users and private assets added later**). Rules below are **non-negotiable**. **Security and reliability come first.**

**Current focus:** DA fil rouge (marbre / antique / splash peinture-fusain) + motion fluide (GSAP prévu) — see `docs/ROADMAP.md` Phase D. **Architecture is always priority** over `reference/legacy-portfolio/` (content inspiration only). **Later:** Supabase Auth users (evaluators) + Storage uploads for private media (`project_assets`).

---

## Pre-flight checklist (every task)

1. Read `docs/ARCHITECTURE.md` (full architecture).
2. Read `docs/SECURITY.md` (mandatory — especially for auth, private content, Supabase).
3. Read `docs/SUPABASE.md` when changing auth, Storage, RLS, or evaluator features.
4. Read `docs/DOCUMENTATION.md` if adding or editing source files.
4. Use **English** for all file names, folders, `data-*`, BEM blocks, TS/CSS symbols, and code comments.
5. Keep **HTML / CSS / TS** strictly separated.
6. Add or update the **file documentation header** (line 1) on every created/edited `.html`, `.css`, `.ts` file.
7. Never hardcode **colors** outside `src/styles/variables.css`.
8. Never commit secrets; respect `.gitignore` and `.env.example` (names only).

---

## Stack (do not change without user approval)

- **Vite** — build tool
- **Vanilla TypeScript** — no React/Vue/Svelte
- **MPA** — one HTML file per route under `pages/`
- **Netlify** — static hosting (public site)
- **Supabase** (evaluator area) — auth, RLS, Storage; see `docs/SUPABASE.md`
- **No custom Node backend** unless explicitly requested

---

## Security (summary — full rules in `docs/SECURITY.md`)

- **Never** `service_role` in front or Git — anon key only (`VITE_*`).
- **Never** private media in `public/` or static bundle on public pages.
- **Always** RLS on private Supabase tables; Storage policies on private buckets.
- **Roles** (`evaluator`) in DB — not client-only checks.
- **No** `innerHTML` with user/API content (XSS).
- **Signed URLs** for private video / 3D assets.
- Keep `public/_headers` updated.
- Run deploy checklist in `docs/SECURITY.md` §10 before shipping auth/private features.

---

## Where to put code

| Need | Location |
|------|----------|
| Page markup & SEO text | `pages/*.html` |
| Evaluator page (future) | `pages/evaluator.html` |
| Brand colors only | `src/styles/variables.css` |
| Other design tokens | `src/styles/tokens.css` |
| Component styles | `src/styles/components/<block>.css` |
| Page-specific CSS | `src/styles/pages/<page>.css` |
| Page bootstrapping | `src/scripts/entries/<page>.ts` |
| Reusable DOM logic | `src/scripts/components/` |
| Hero canvas / Three.js | `src/scripts/features/` |
| Auth / evaluator (future) | `src/scripts/features/auth/`, `evaluator/` |
| Typed **public** content | `src/data/` |
| Private media | Supabase Storage — not Git |

---

## Hero reveal & Three.js

- **Home hero (current):** `features/three-scene/bust-hero*` — 3D fractured bust + Rapier
  force field + right-click-drag camera orbit (`bust-hero-orbit.ts`, spring-back on release),
  target `[data-hero-3d]` / `[data-hero-3d-canvas]`; text and the static `<img
  data-hero-3d-fallback>` stay in HTML.
- **Hero brush (archived, not deleted):** `features/hero-reveal/` only; target
  `[data-hero-reveal]`; lives on `pages/hero-legacy.html` (unlisted), not the home hero anymore.
- **Home cursor brush (current):** `features/home-brush/` only; target `[data-home-brush]`
  (canvas spanning `<main>`; z-index above sections, below `--z-hero-stage` so the bust
  stays in front; `mix-blend-mode: screen`); continuous pressure-aware chalk stroke
  while left mouse / primary pointer is held (multi-pigment), colors from
  `variables.css` only, no-op under `prefers-reduced-motion`.
- **Page motion (GSAP):** `features/page-motion/` only when added; lazy / page-scoped; ask before adding the dependency.
- **Three.js:** `features/three-scene/` only; lazy `import()`; not on pages without 3D.
- Respect `prefers-reduced-motion` (skip mask / reduce motion / static GSAP fallbacks).

---

## CSS import order (entries)

```ts
import '../../styles/variables.css';
import '../../styles/tokens.css';
import '../../styles/base.css';
import '../../styles/layout.css';
// then components, then pages/*.css
```

---

## Forbidden actions

- Adding React, Vue, or another framework without user request
- Inline `<script>` or `<style>` in HTML
- Colors outside `variables.css`
- French or accented **file/folder** names
- `utils.ts` / `helpers.ts` / `misc.ts` junk drawers
- `innerHTML` for editorial or API/user content
- Global Three.js on all pages
- Skipping JSDoc file headers or public export docs
- Committing `.env`, keys, `dist/`, `node_modules/`
- **Security:** `service_role` in client; private tables without RLS; public buckets for evaluator files; hardcoded private URLs in public pages

---

## When unsure

- Prefer **smallest change** that follows architecture and security.
- Propose `ARCHITECTURE.md` / `SECURITY.md` updates instead of inventing patterns.
- Ask the user before introducing new dependencies.
- If a feature weakens security, **stop** and document the trade-off first.

---

## Cursor rules

Enforced via `.cursor/rules/*.mdc` (`alwaysApply: true` on preflight + security).

**Priority if conflict:** `docs/SECURITY.md` → `docs/ARCHITECTURE.md` → `AGENTS.md`.
