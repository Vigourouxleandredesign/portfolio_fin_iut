# Architecture — Portfolio (source of truth)

**Version:** 1.1  
**Stack:** Vite + Vanilla TypeScript + CSS (MPA) · optional Supabase (evaluator area)  
**Status:** Mandatory for all contributors and AI agents.

Before any change, read this document and `docs/SECURITY.md`. If a rule must change, update this file first, then `docs/SECURITY.md`, `AGENTS.md`, and `.cursor/rules/`.

---

## 1. Non-negotiable principles

1. **Separation of concerns** — HTML (structure & SEO), CSS (appearance), TS (behavior only).
2. **ES modules** — `import` / `export` only; no global scripts.
3. **SEO first** — Indexable content lives in HTML; TS enhances, never replaces critical text.
4. **Performance** — Heavy JS (Three.js, hero canvas) only on pages/sections that need it; prefer `import()`.
5. **Single source of truth** — Colors → `variables.css` only; project data → `src/data/` only.
6. **English technical naming** — File names, folders, `data-*`, CSS blocks, TS symbols, and code comments in **English**. UI copy in HTML may be **French**.
7. **Security first** — No secrets in front or Git; private data enforced by Supabase RLS + Storage policies (see `docs/SECURITY.md`).

---

## 2. Folder structure

```
portfolio/
├── AGENTS.md                    # Mandatory AI instructions
├── .cursor/rules/               # Cursor agent rules (alwaysApply)
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   ├── DOCUMENTATION.md         # File headers & doc generation
│   ├── SECURITY.md              # ★ Mandatory security (auth, RLS, storage)
│   └── SUPABASE.md              # ★ Supabase setup + official doc links
├── pages/                       # One HTML file = one route (MPA)
│   ├── index.html
│   └── evaluator.html           # Private evaluator area (Supabase auth)
├── supabase/
│   └── migrations/              # SQL schema + RLS (run in Supabase Dashboard)
├── public/                      # Static assets, robots.txt, _headers (Netlify)
├── src/
│   ├── styles/
│   │   ├── variables.css        # ★ ONLY file for brand colors
│   │   ├── tokens.css           # Typography, spacing, radii, shadows, motion (no colors)
│   │   ├── base.css
│   │   ├── layout.css
│   │   ├── components/          # One CSS file per UI block
│   │   └── pages/               # Page-specific overrides only
│   ├── scripts/
│   │   ├── entries/             # One TS entry per HTML page
│   │   ├── modules/             # Pure utilities (optional DOM)
│   │   ├── components/          # DOM logic tied to a UI block
│   │   └── features/            # hero-reveal, three-scene, auth, evaluator (private)
│   ├── assets/                  # Images, fonts (imported via Vite)
│   └── data/                    # Typed content (projects, site meta)
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## 3. HTML rules

| Rule | Detail |
|------|--------|
| Semantics | Use `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`; one `<h1>` per page |
| No inline logic | No `onclick`, no inline `<script>`, no inline `<style>` |
| TS hooks | Use `data-*` attributes, e.g. `data-hero-reveal`, `data-three-scene` |
| Links | Real `<a href="...">` for navigation and SEO |
| Meta | Each page: `title`, `description`, Open Graph, `canonical`, `<html lang="fr">` |
| Accessibility | Meaningful `alt`, visible `:focus-visible`, respect `prefers-reduced-motion` |
| Documentation | Mandatory HTML comment header as first lines (see `docs/DOCUMENTATION.md`) |

**CSS class naming:** BEM — `block__element--modifier` (e.g. `hero__title`, `hero__canvas`).

---

## 4. CSS rules

### 4.1 `variables.css` — brand colors only

- **Only file** where color values appear (`#`, `rgb()`, `hsl()`, named colors).
- Define on `:root` as custom properties: `--color-bg`, `--color-text`, `--color-accent`, etc.
- **Forbidden elsewhere:** hardcoded colors in any other `.css` file.
- Everywhere else: use `var(--color-*)` only.

### 4.2 `tokens.css` — design tokens (no colors)

Typography, spacing, radii, shadows, z-index, durations, breakpoints.

### 4.3 Import order (mandatory)

Import chain per page entry (via TS or a single page CSS bundle), never scattered `@import` in component files:

1. `variables.css`
2. `tokens.css`
3. `base.css`
4. `layout.css`
5. `components/*.css`
6. `pages/<page>.css`

### 4.4 Other CSS rules

- One component = one file in `styles/components/`.
- No IDs for styling.
- Mobile-first (`min-width` media queries).
- Prefer `rem` for typography and spacing.
- Canvas/WebGL visual pixels are styled in TS/canvas, not with brand colors in random files.

---

## 5. TypeScript rules

| Rule | Detail |
|------|--------|
| Files | `.ts` only under `src/` |
| Public API | Each feature exports `initX(root: HTMLElement): () => void` (cleanup function) |
| No editorial HTML in TS | No `innerHTML` for content; OK for technical/canvas setup |
| No CSS in TS | Except canvas/WebGL drawing |
| DOM | Scope with `root.querySelector`; always handle `null` |
| Types | Use `*.types.ts` next to complex features |
| Three.js | Only in `features/three-scene/`; dynamic `import()` when section is visible |
| Documentation | File header + JSDoc on every public export (see `docs/DOCUMENTATION.md`) |

---

## 6. HTML ↔ CSS ↔ TS mapping

Example — hero reveal:

| Layer | File |
|-------|------|
| HTML | `pages/index.html` — structure, text, `data-hero-reveal` |
| CSS | `src/styles/components/hero.css` — layout and non-canvas visuals |
| TS | `src/scripts/features/hero-reveal/hero-reveal.ts` — canvas brush |

TS **enhances** existing markup; it does not generate the hero from scratch.

---

## 7. File naming (English, kebab-case)

| Type | Pattern | Example |
|------|---------|---------|
| HTML pages | `kebab-case.html` | `index.html`, `projects.html`, `about.html` |
| CSS component | matches BEM block | `hero.css` → `.hero` |
| CSS page | `pages/<page>.css` | `home.css` |
| TS entry | same stem as page | `home.ts` ↔ `index.html` (document mapping in header) |
| Feature | `features/<name>/<name>.ts` | `hero-reveal/hero-reveal.ts` |
| Types | `<name>.types.ts` | `hero-reveal.types.ts` |
| Data | plural noun | `projects.ts`, `site-meta.ts` |
| Assets | `context-description.ext` | `hero-portrait.webp` |

**Forbidden:** `utils.ts`, `helpers.ts`, `misc.ts`, `final-v2.css`, `IMG_1234.jpg`, camelCase or snake_case file names.

**`data-*` attributes:** English kebab-case, aligned with feature name.

---

## 8. Data & assets

- Structured **public** content in `src/data/*.ts` with exported types.
- Images in `src/assets/` when processed by Vite; `public/` only for fixed paths (favicon, `robots.txt`, `_headers`, default `og` image).
- **Private** media (evaluator: video, 3D, full-res) → Supabase Storage only — never `public/` or Git (see `docs/SECURITY.md`).

---

## 8.1 Hybrid deployment (public + evaluator)

| Zone | Hosting | Data |
|------|---------|------|
| Public pages | Netlify static (`dist/`) | `src/data/`, public assets |
| Evaluator area | Same front; dynamic fetch post-auth | Supabase DB + Storage |

Netlify serves the front; Supabase enforces auth and access. Compatible — see `docs/SECURITY.md`.

---

## 9. Performance

1. No Three.js on pages without a 3D section.
2. Hero brush only on pages that include `[data-hero-reveal]`.
3. Dynamic `import()` for large libraries.
4. `loading="lazy"` and explicit dimensions for below-the-fold images.
5. Fonts: `woff2`, `font-display: swap`.

---

## 10. Security & Git

**Full rules:** `docs/SECURITY.md` (mandatory).

- Root `.gitignore` is mandatory; never commit secrets, `.env`, `dist/`, `node_modules/`.
- Commit `.env.example` with variable names only, no values.
- `public/_headers` — security headers for Netlify (keep updated).
- Supabase: RLS on all private tables; private Storage buckets; anon key only in front.
- See `.gitignore` for the full list.

---

## 11. Forbidden

- Hardcoded colors outside `variables.css`
- Inline `<script>` / `<style>` in HTML
- French or accented **file/folder** names
- Monolithic `main.ts` growing without split
- Loading Three.js globally on every page
- Skipping file documentation headers
- Ignoring `AGENTS.md`, `docs/SECURITY.md`, or this document
- `service_role` or secrets in client code or Git
- Private Supabase tables without RLS
- Private evaluator media in `public/` or static bundle imports

---

## 12. Deployment

- Build: `npm run build` → `dist/`
- Host: Netlify or GitHub Pages (static files only)
- Env vars (Supabase): Netlify dashboard — never in Git
- Configure Vite `rollupOptions.input` for each page in `pages/`

---

## 13. Page ↔ entry mapping

| HTML | TS entry | Page CSS |
|------|----------|----------|
| `pages/index.html` | `src/scripts/entries/home.ts` | `src/styles/pages/home.css` |

Document any stem mismatch in both file headers.
