# Portfolio — Léandre Vigouroux · Vite + Vanilla TypeScript

Site portfolio statique (MPA) de creative developer : hero 3D (buste marbre fracturé + force field curseur, Three.js/Rapier), pinceau-curseur, DA « Le Sanctuaire nocturne » (nuit, lumière de feu, pigments cuivre / or / vert phtalo). Aucun backend.

## Documentation obligatoire

| Fichier | Contenu |
|---------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Charte d’architecture (référence unique) |
| [docs/DA.md](docs/DA.md) | **Direction artistique** (source de vérité) — recettes : [docs/skills/portfolio-da/SKILL.md](docs/skills/portfolio-da/SKILL.md) |
| [docs/SECURITY.md](docs/SECURITY.md) | **Sécurité obligatoire** (site statique, headers, site enseignants protégé) |
| [docs/TESTING.md](docs/TESTING.md) | Gate anti-régression |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **État, planning, décisions, questions ouvertes** |
| [docs/work-packages/](docs/work-packages/README.md) | **Lots exécutants** : protocole, prompts, critères d’acceptation |
| [docs/content/](docs/content/) | Contenus prêts à intégrer (briefs projets, accueil, CV, espace jury) |
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
npm run decor:paint                             # régénère les taches de peinture (Python : numpy, opencv-python, scikit-image, pillow)
```

**Routes :** `/` (→ `/pages/index.html`), `/projects`, `/projects/<slug>`, `/cv`, `/contact` — voir `public/_redirects`.

**Fiches réflexives :** zone **`/jury`** du même site, protégée par mot de passe Netlify (variable `JURY_BASIC_AUTH`, jamais dans le repo) — voir [docs/SECURITY.md](docs/SECURITY.md) §0 et `docs/content/teacher-site.md`. Le repo GitHub doit rester **privé**.

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

Netlify lit `netlify.toml` : `npm run build && node scripts/inject-jury-auth.mjs`, publish `dist`. Définir `JURY_BASIC_AUTH` dans les variables d’environnement Netlify.

## IA (Cursor / Claude Code)

Règles dans `.cursor/rules/` (`alwaysApply: true`). Lire `AGENTS.md` puis `docs/DA.md` avant toute modification visuelle.
