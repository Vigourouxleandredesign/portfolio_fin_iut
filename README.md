# Portfolio — Léandre Vigouroux · Vite + Vanilla TypeScript

Site portfolio statique (MPA) de creative developer : hero 3D (buste marbre fracturé + force field curseur, Three.js/Rapier), pinceau-curseur, DA « Le Sanctuaire nocturne » (nuit, lumière de feu, pigments cuivre / or / vert phtalo). Aucun backend.

## Documentation obligatoire

| Fichier | Contenu |
|---------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Charte d’architecture (référence unique) |
| [docs/DA.md](docs/DA.md) | **Direction artistique** (source de vérité) — recettes : [docs/skills/portfolio-da/SKILL.md](docs/skills/portfolio-da/SKILL.md) |
| [docs/SECURITY.md](docs/SECURITY.md) | **Sécurité obligatoire** (site statique, headers, site enseignants protégé) |
| [docs/TESTING.md](docs/TESTING.md) | Gate anti-régression |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **Todo / reprise** — ce qui est fait et ce qui reste |
| [docs/content/assets-kit.md](docs/content/assets-kit.md) | Inventaire des visuels projets prêts à intégrer |
| [AGENTS.md](AGENTS.md) | Instructions obligatoires pour les IA |

**Toute contribution (humaine ou IA) doit respecter ces documents.**

## Prérequis

- Node.js 20+
- npm

## Commandes

```bash
npm install
npm run dev      # http://localhost:5173/pages/index.html
npm run gate     # typecheck + secrets + tests + build (avant chaque commit)
npm run build    # build production → dist/
npm run preview  # prévisualiser dist/
node scripts/capture-project-shots.mjs          # captures des démos en ligne
node scripts/generate-paint-decor.mjs           # régénère les SVG de peinture
```

**Routes :** `/` (→ `/pages/index.html`), `/projects`, `/projects/<slug>`, `/cv`, `/contact` — voir `public/_redirects`.

**Fiches réflexives :** sur un **second** site Netlify protégé par mot de passe (jamais dans ce repo) — voir [docs/SECURITY.md](docs/SECURITY.md) §0 et `docs/content/teacher-site.md`.

## Structure rapide

```
pages/                 → HTML (SEO, contenu FR)
src/styles/            → CSS (couleurs → variables.css uniquement)
src/scripts/           → TypeScript (entries par page, components, features)
src/assets/            → Visuels importés par Vite (projects/<slug>/, decor/paint/, hero/)
public/                → _headers, _redirects, favicon, draco/
docs/                  → Charte, DA, sécurité, briefs projets
```

Les sources lourdes (PSD, .blend, références) vivent **hors du repo**, dans le dossier `Sources/` voisin.

## Déploiement

Build `dist/` puis déploiement statique sur **Netlify** (`npm ci && npm run build`, publish `dist`).

## IA (Cursor / Claude Code)

Règles dans `.cursor/rules/` (`alwaysApply: true`). Lire `AGENTS.md` puis `docs/DA.md` avant toute modification visuelle.
