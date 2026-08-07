# Architecture — Portfolio (source of truth)

**Version:** 1.1  
**Stack:** Vite + Vanilla TypeScript + CSS (MPA) · **Supabase** (evaluator area — users/assets TBD)  
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
8. **Decisions already taken win** — e.g. the 3D fractured-bust hero on home (`features/three-scene/`) is source of truth; do not replace with legacy patterns. The previous canvas-brush hero is not deleted (see `pages/hero-legacy.html`), but it is no longer the home hero.
9. **Legacy reference only** — `reference/legacy-portfolio/` may inspire undecided content/sections; it must never override architecture, stack, or decided UI (hero, nav, DA).

---

## 1.1 Product positioning & public IA

- **Positioning:** Creative developer by conviction — Bac+2 infographie webdesign + Bac+3 développement web; front-end focus, back basics (Spring Boot, Symfony).
- **Visual DA (fil rouge):** Marble + Greco-Roman atmosphere + paint / fusain splashes **across the whole site**, not only the hero. Dark charcoal base — colors only in `variables.css`. Continuity between section blocks via recurring motifs and motion (see `docs/ROADMAP.md` Phase D).
- **Canvas decor layer (home):** the homepage reads as one painting — SVG-noise canvas grain (`.home-grain`), chalk/fusain sketches in the margins (bust, ionic column, laurel) and ember splashes (`.home-decor--*` in `src/styles/pages/home.css`). Assets in `src/assets/decor/`: black-background PNGs blended with `mix-blend-mode: screen` on the charcoal page; white-background `marble-touches.png` blended with `multiply` on marble plaques. Decor is `aria-hidden`, hidden or faded on small screens, drift animation disabled under `prefers-reduced-motion`.
- **Interactive cursor brush (home):** `features/home-brush/` draws a continuous multi-bristle chalk stroke along the cursor (pressure from speed → width, human jitter, multi-pigment `--color-splash-*` + ember). No PNG stamp. Z-index sandwich: section content (`1`) < brush (`--z-home-brush: 40`) < hero stage / bust (`--z-hero-stage: 60`). Canvas uses `mix-blend-mode: screen`. Accumulates for the visit; no-ops under `prefers-reduced-motion`.
- **Skills presentation:** Dark atelier background + suspended marble plaques (moodboard `marble-presentation`) with black cloud veils top/bottom — `.skills-gallery` / `.marble-slab`. Reference assets in `src/assets/moodboard/` and `Assets/Moodboard/`.
- **Motion:** GSAP (planned) in `src/scripts/features/page-motion/` — page-scoped / lazy; respect `prefers-reduced-motion`. Do not load heavy animation on pages that do not need it.
- **Typography:** Ubuntu (`--font-body` / `--font-heading`) + Updock (`--font-display`, Creative / flourish only). Self-hosted via Fontsource (`src/styles/fonts.css`) so CSP stays `style-src 'self'`.
- **Public navigation:**

| Label (FR) | Route | Status |
|------------|-------|--------|
| Accueil (logo) | `pages/index.html` | Hero **3D fractured bust** (`features/three-scene/`) **defined** |
| Mes projets | `pages/projects.html` | Listing + filter |
| Mon CV | `pages/cv.html` | PDF → `public/documents/cv.pdf` |
| Contact | `pages/contact.html` | Netlify Forms |
| Mon univers | Section `#univers` on home | Not a separate route |

Evaluator area remains private: `pages/evaluator.html` (not in public nav).

`pages/hero-legacy.html` is not in public nav either: it archives the previous canvas-brush hero
(`features/hero-reveal/`) so nothing was deleted when the home hero was replaced — `noindex`,
unlisted, reachable only by direct URL.

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
│   ├── SUPABASE.md              # ★ Supabase setup + official doc links
│   └── ROADMAP.md               # Todo / project status
├── reference/
│   └── legacy-portfolio/        # Old static site — visual reference ONLY (not in Vite build)
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
│   │   └── features/            # hero-reveal, three-scene, home-brush, auth, evaluator (private)
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

Example — 3D bust hero (home):

| Layer | File |
|-------|------|
| HTML | `pages/index.html` — structure, text, `data-hero-3d`, `data-hero-3d-canvas`, static `<img data-hero-3d-fallback>` |
| CSS | `src/styles/components/hero-3d.css` — layout, headline overlay, fallback/`prefers-reduced-motion` visibility |
| TS | `src/scripts/features/three-scene/bust-hero*.ts` — Three.js scene, GLTF/Draco load, Rapier force field + spring-back, right-click-drag camera orbit with a delayed spring-back (`bust-hero-orbit.ts`) |

TS **enhances** existing markup; it does not generate the hero from scratch. The `<img>`
fallback is real markup (visible by default), not `noscript`: it covers no-JS, slow-load and
WebGL-unavailable cases without any inline script/style.

Example — cursor brush (home, whole page):

| Layer | File |
|-------|------|
| HTML | `pages/index.html` — `<canvas class="home-brush" data-home-brush>`, first child of `<main>` |
| CSS | `src/styles/pages/home.css` + `hero-3d.css` — brush above sections (`--z-home-brush: 40`), hero/bust above brush (`--z-hero-stage: 60`), `mix-blend-mode: screen` |
| TS | `src/scripts/features/home-brush/*.ts` — pointer tracking, stroke interpolation, canvas resize preserving accumulated content |

Archived example — canvas-brush hero (now `pages/hero-legacy.html`, not the home hero):

| Layer | File |
|-------|------|
| HTML | `pages/hero-legacy.html` — `data-hero-reveal` |
| CSS | `src/styles/components/hero.css` |
| TS | `src/scripts/features/hero-reveal/hero-reveal.ts` |

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
| Data | plural noun | `skills.ts`, `site-meta.ts` |
| Assets | `context-description.ext` | `hero-portrait.webp` |

**Forbidden:** `utils.ts`, `helpers.ts`, `misc.ts`, `final-v2.css`, `IMG_1234.jpg`, camelCase or snake_case file names.

**`data-*` attributes:** English kebab-case, aligned with feature name.

---

## 8. Data & assets

- Editorial content (headings, project copy, timeline) is **authored in HTML** so crawlers index it without running scripts.
- `src/data/*.ts` holds only the typed values behaviour needs (e.g. the skills taxonomy driving the projects filter), with exported types.
- Images in `src/assets/` when processed by Vite; `public/` only for fixed paths (favicon, `robots.txt`, `_headers`, default `og` image).
- **Private** media (evaluator: video, 3D, full-res) → **Supabase Storage** + `project_assets` table — **not** Git / `public/` (see `docs/SUPABASE.md` §0)
- **Public** portfolio media → `src/assets/` or Vite imports; keep lightweight for the static site

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
| `pages/projects.html` | `src/scripts/entries/projects.ts` | `src/styles/pages/projects.css` |
| `pages/cv.html` | `src/scripts/entries/cv.ts` | `src/styles/pages/cv.css` |
| `pages/contact.html` | `src/scripts/entries/contact.ts` | `src/styles/pages/contact.css` |
| `pages/evaluator.html` | `src/scripts/entries/evaluator.ts` | `src/styles/pages/evaluator.css` |
| `pages/hero-legacy.html` (unlisted) | `src/scripts/entries/hero-legacy.ts` | `src/styles/components/hero.css` (no page-specific CSS) |

Document any stem mismatch in both file headers.
