# Portfolio — Vite + Vanilla TypeScript

Site portfolio statique (MPA) : creative developer (designer & développeur), hero 3D (buste marbre fracturé + force field curseur, Three.js/Rapier), DA sombre/fusain. Supabase pour l’espace évaluateur.

## Documentation obligatoire

| Fichier | Contenu |
|---------|---------|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Charte d’architecture (référence unique) |
| [docs/SECURITY.md](docs/SECURITY.md) | **Sécurité obligatoire** (auth, RLS, storage, Netlify) |
| [docs/SUPABASE.md](docs/SUPABASE.md) | **Supabase** — configuration + documentation officielle |
| [docs/ROADMAP.md](docs/ROADMAP.md) | **Todo / reprise** — ce qui est fait et ce qui reste |
| [docs/DOCUMENTATION.md](docs/DOCUMENTATION.md) | En-têtes de fichiers & génération de doc |
| [AGENTS.md](AGENTS.md) | Instructions obligatoires pour les IA |

**Toute contribution (humaine ou IA) doit respecter ces documents.**

## Prérequis

- Node.js 20+
- npm

## Commandes

```bash
npm install
npm run dev      # http://localhost:5173/pages/index.html
npm run build    # build production → dist/
npm run preview  # prévisualiser dist/
```

**Routes :**
- Public : `/` ou `/pages/index.html` (redirect Netlify via `public/_redirects`)
- Évaluateurs : `/evaluator.html` — voir [docs/SUPABASE.md](docs/SUPABASE.md)

**Supabase (local) :** copier `.env.example` → `.env` et renseigner `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`.

## Structure rapide

```
pages/                         → HTML (SEO, contenu FR)
src/styles/                    → CSS (couleurs → variables.css uniquement)
src/scripts/                   → TypeScript (entries par page, features)
src/data/                      → Données typées
reference/legacy-portfolio/    → Ancien site (inspiration visuelle, hors build Vite)
```

## Déploiement

Build `dist/` puis déploiement sur **Netlify** ou **GitHub Pages** (fichiers statiques).

## IA (Cursor)

Les règles projet sont dans `.cursor/rules/` (`alwaysApply: true`). Lire `AGENTS.md` avant toute modification.
