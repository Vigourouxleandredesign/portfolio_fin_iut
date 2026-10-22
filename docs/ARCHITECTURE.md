# Architecture — Portfolio (source of truth)

**Version:** 1.2 (2026-10-21 — backend removed, DA v3)  
**Stack:** Vite + Vanilla TypeScript + CSS (MPA) · one static Netlify site (public + `/jury` behind Basic-Auth) · no backend  
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
7. **Security first** — No secrets in front or Git; the only private zone is `/jury` (reflective sheets), locked server-side by Netlify Basic-Auth injected at build (see `docs/SECURITY.md` §0).
8. **Decisions already taken win** — e.g. the 3D fractured-bust hero on home (`features/three-scene/`) is source of truth; do not replace with legacy patterns. The previous canvas-brush reveal hero was removed on 2026-10-21 (git history keeps it).
9. **DA is frozen** — `docs/DA.md` (v3 « Le Sanctuaire nocturne ») is the visual source of truth; recipes in `docs/skills/portfolio-da/SKILL.md`. Old references (legacy portfolio, moodboards) now live outside the repo in `../Sources/` and never override it.

---

## 1.1 Product positioning & public IA

- **Positioning:** Creative developer by conviction — Bac+2 infographie webdesign + Bac+3 développement web; front-end focus, back basics (Spring Boot, Symfony).
- **Visual DA (fil rouge):** see **`docs/DA.md`** — night background, one fire light source, gouache pigment gestures (copper / patinated gold / phtalo green), marble kept, « Odyssée » image grade, museum cartels. Colors only in `variables.css`. The two bullets below describe the **current implementation**, to be migrated to DA v3 (ROADMAP).
- **Canvas decor layer (home):** the homepage reads as one painting — SVG-noise canvas grain (`.home-grain`), chalk/fusain sketches in the margins (bust, ionic column, laurel) and ember splashes (`.home-decor--*` in `src/styles/pages/home.css`). Assets in `src/assets/decor/`: black-background PNGs blended with `mix-blend-mode: screen` on the charcoal page; white-background `marble-touches.png` blended with `multiply` on marble plaques. Decor is `aria-hidden`, hidden or faded on small screens, drift animation disabled under `prefers-reduced-motion`.
- **Interactive cursor brush (home):** `features/home-brush/` draws a continuous multi-bristle chalk stroke along the cursor (pressure from speed → width, human jitter, multi-pigment `--color-splash-*` + ember). No PNG stamp. Z-index sandwich: section content (`1`) < hero atmosphere (`--z-hero-atmosphere: 20`, sibling `.hero-3d-backdrop`) < brush (`--z-home-brush: 40`) < hero bust stage (`--z-hero-stage: 60`). Canvas uses `mix-blend-mode: screen`. Accumulates for the visit; no-ops under `prefers-reduced-motion`.
- **Skills presentation:** Dark atelier background + suspended marble plaques (moodboard reference, now in `../Sources/`) with black cloud veils top/bottom — `.skills-gallery` / `.marble-slab`. Background: `src/assets/moodboard/marble-atelier-empty.jpg`.
- **Motion:** GSAP (planned) in `src/scripts/features/page-motion/` — page-scoped / lazy; respect `prefers-reduced-motion`. Do not load heavy animation on pages that do not need it.
- **Typography:** Ubuntu (`--font-body` / `--font-heading`) + Updock (`--font-display`, 1–2 discreet words only) + Ubuntu Mono (`--font-mono`, cartels) — see `docs/DA.md` §4. Self-hosted via Fontsource (`src/styles/fonts.css`) so CSP stays `style-src 'self'`.
- **Public navigation:**

| Label (FR) | Route | Status |
|------------|-------|--------|
| Accueil (logo) | `pages/index.html` | Hero **3D fractured bust** → **projets** (`#projets`) → collaborations → teaser `#univers` → `#competences` → CTA contact |
| Mes projets | `pages/projects.html` | Listing + filter → `pages/projects/<slug>.html` case studies (moodboard temple backdrop `bg-projets`) |
| Mon CV | `pages/cv.html` | PDF → `public/documents/cv.pdf` |
| Contact | `pages/contact.html` | Netlify Forms |
| Mon univers | Section `#univers` on home (after projects) | Not a separate route |

Reflective sheets for the jury live under **`/jury`** (pages `pages/jury/*.html`, PDFs `public/jury/fiches/`), password-protected by Netlify (`docs/content/teacher-site.md`). Not in the public nav; one « Espace jury » link in footer + CV.

---

## 2. Folder structure

```
portfolio/
├── AGENTS.md                    # Mandatory AI instructions
├── .cursor/rules/               # Cursor agent rules (alwaysApply)
├── docs/
│   ├── ARCHITECTURE.md          # This file
│   ├── DOCUMENTATION.md         # File headers & doc generation
│   ├── SECURITY.md              # ★ Mandatory security (static site, headers, teacher pack)
│   ├── DA.md                    # ★ Art direction (source of truth)
│   ├── skills/portfolio-da/     # DA recipes for executors (SKILL.md)
│   ├── content/                 # Project briefs, assets kit, teacher-site spec
│   └── ROADMAP.md               # Todo / project status
├── pages/                       # One HTML file = one route (MPA)
│   ├── index.html, projects.html, cv.html, contact.html
│   └── projects/<slug>.html     # Case studies
├── scripts/                     # Node tooling (captures, paint decor, secrets guard)
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
│   │   └── features/            # three-scene, home-brush
│   ├── assets/                  # Images imported via Vite — projects/<slug>/, decor/paint/, hero/
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
| TS hooks | Use `data-*` attributes, e.g. `data-hero-3d`, `data-home-brush` |
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
| TS | `src/scripts/features/three-scene/bust-hero*.ts` — GLTF/Draco (`bust.glb`): all meshes → Rapier fragments; three-point lighting; optional atmosphere plate in HTML/CSS; Tweakpane lazy-loaded with `?debug` |

Example — home featured projects carousel:

| Layer | File |
|-------|------|
| HTML | `pages/index.html` — `#projets` / `[data-project-carousel]` slides + SEO titles |
| CSS | `src/styles/components/project-carousel.css` |
| TS | `src/scripts/components/project-carousel.ts` — prev/next + tilt (no external deps) |

TS **enhances** existing markup; it does not generate the hero from scratch. The `<img>`
fallback is real markup (visible by default), not `noscript`: it covers no-JS, slow-load and
WebGL-unavailable cases without any inline script/style.

Example — cursor brush (home, whole page):

| Layer | File |
|-------|------|
| HTML | `pages/index.html` — `<canvas class="home-brush" data-home-brush>`, first child of `<main>` |
| CSS | `src/styles/pages/home.css` + `hero-3d.css` — brush above sections (`--z-home-brush: 40`), hero/bust above brush (`--z-hero-stage: 60`), `mix-blend-mode: screen` |
| TS | `src/scripts/features/home-brush/*.ts` — pointer tracking, stroke interpolation, canvas resize preserving accumulated content |

---

## 7. File naming (English, kebab-case)

| Type | Pattern | Example |
|------|---------|---------|
| HTML pages | `kebab-case.html` | `index.html`, `projects.html`, `about.html` |
| CSS component | matches BEM block | `hero-3d.css` → `.hero-3d` |
| CSS page | `pages/<page>.css` | `home.css` |
| TS entry | same stem as page | `home.ts` ↔ `index.html` (document mapping in header) |
| Feature | `features/<name>/<name>.ts` | `home-brush/home-brush.ts` |
| Types | `<name>.types.ts` | `home-brush.types.ts` |
| Data | plural noun | `skills.ts`, `site-meta.ts` |
| Assets | `context-description.ext` | `hero-portrait.webp` |

**Forbidden:** `utils.ts`, `helpers.ts`, `misc.ts`, `final-v2.css`, `IMG_1234.jpg`, camelCase or snake_case file names.

**`data-*` attributes:** English kebab-case, aligned with feature name.

---

## 8. Data & assets

- Editorial content (headings, project copy, timeline) is **authored in HTML** so crawlers index it without running scripts.
- `src/data/*.ts` holds only the typed values behaviour needs (e.g. the skills taxonomy driving the projects filter), with exported types.
- Images in `src/assets/` when processed by Vite; `public/` only for fixed paths (favicon, `robots.txt`, `_headers`, default `og` image).
- **Private** media (reflective PDFs) → `public/jury/fiches/` only, behind Basic-Auth; jury text only in `pages/jury/*.html`, never in TS/JSON bundles (`docs/SECURITY.md` §0).
- **Public** portfolio media → `src/assets/` or Vite imports; keep lightweight for the static site
- **Project page briefs (authoring):** `docs/content/projects/<slug>.md` — one brief per case-study page (DA + copy intent). Not served as public site content.
- **Ready-to-use project visuals:** `src/assets/projects/<slug>/` (WebP, `shots/` = screenshots from `scripts/capture-project-shots.mjs`) — inventory in `docs/content/assets-kit.md`.
- **Heavy sources (outside this repo):** `../Sources/` (PSD, .blend, raw GLB, references) and `../Liste des projets/` (project code, DOCX). **Never** copy whole project builds into the portfolio — curate only display-ready images/copy into `src/assets/projects/<slug>/`. See `docs/ROADMAP.md` catalogue + Netlify demos.
- **Device mockups / stage CTAs (case studies):**
  - Flat Mac marble (`mac-marble.png`) → live `<iframe>` or shot mode when a desktop site needs a device frame.
  - Angled laptop + phone (`laptop-iphone-marble.png`) → **static** perspective overlays (`.project-detail__mockup-screens`, `data-preview-mode="shots"`). Source shots live under `src/assets/projects/<slug>/desktop.png` + `mobile.png`; bake with `scripts/bake-dual-mockup-screens.py` into `mockup-screens.png`.
  - **MagicalLab:** portal GLB (`[data-glb-showcase]`, `features/three-scene/glb-showcase`) as stage CTA — not a Mac mockup. Public display GLBs may live under `public/documents/elements/` with source credit on the page.
  - **Mobile-only / AR demos** (e.g. MicroMonde) → no live iframe; phone mockup + captures / QR + “open on mobile” CTA.

---

## 8.1 Deployment (one site, public + jury area)

| Zone | Source | Access |
|------|--------|--------|
| Public pages | `pages/*.html`, `pages/projects/*.html` | Open |
| Jury area | `pages/jury/*.html` + `public/jury/fiches/**.pdf` | Netlify Basic-Auth on `/jury`, `/jury/*`, `/pages/jury/*` — injected into `dist/_headers` by `scripts/inject-jury-auth.mjs` from env `JURY_BASIC_AUTH` (`netlify.toml`) |

GitHub repo must stay **private** while PDFs are committed. There is no app auth in this repo.

---

## 9. Performance

1. No Three.js on pages without a 3D section.
2. Cursor brush only on pages that include `[data-home-brush]`.
3. Dynamic `import()` for large libraries.
4. `loading="lazy"` and explicit dimensions for below-the-fold images.
5. Fonts: `woff2`, `font-display: swap`.

---

## 10. Security & Git

**Full rules:** `docs/SECURITY.md` (mandatory).

- Root `.gitignore` is mandatory; never commit secrets, `.env`, `dist/`, `node_modules/`.
- Commit `.env.example` with variable names only, no values.
- `public/_headers` — security headers for Netlify (keep updated).
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
- Jury password anywhere but the Netlify env var; jury text imported in TS/JSON bundles
- Re-adding a backend SDK (Supabase…) without a new decision in `docs/SECURITY.md` §0

---

## 12. Deployment

- Build: `npm run build` → `dist/`
- Host: Netlify or GitHub Pages (static files only)
- No env var is required; any future one goes in the Netlify dashboard — never in Git
- Configure Vite `rollupOptions.input` for each page in `pages/`

---

## 13. Page ↔ entry mapping

| HTML | TS entry | Page CSS |
|------|----------|----------|
| `pages/index.html` | `src/scripts/entries/home.ts` | `src/styles/pages/home.css` |
| `pages/projects.html` | `src/scripts/entries/projects.ts` | `src/styles/pages/projects.css` |
| `pages/projects/*.html` | `src/scripts/entries/project-detail.ts` | `src/styles/pages/project-detail.css` + `components/project-detail.css` |
| `pages/cv.html` | `src/scripts/entries/cv.ts` | `src/styles/pages/cv.css` |
| `pages/contact.html` | `src/scripts/entries/contact.ts` | `src/styles/pages/contact.css` |

Document any stem mismatch in both file headers.
