# L3a — Gabarit page projet + Lab Horizon + catalogue

**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 journée · **Dépend de :** L1 · **Branche :** `wp/L3a-gabarit`

## Objectif

Poser le gabarit DA v3 des pages projet (que L3b/c/d appliqueront sans toucher au CSS partagé), créer la page **Lab Horizon**, et remettre le catalogue en ordre.

## Sources

`docs/content/projects/_TEMPLATE.md` (forme) · `docs/content/projects/lab-horizon.md` (contenu) · `docs/content/assets-kit.md` · skill `portfolio-da`.

## Périmètre

- Gabarit : `src/styles/components/project-detail.css`, `src/styles/pages/project-detail.css`, `src/scripts/entries/project-detail.ts` (+ composant de navigation projet précédent/suivant si besoin : `src/scripts/components/project-nav.ts`, mais **préférer du HTML statique**).
- Lab Horizon : créer `pages/projects/lab-horizon.html` ; `public/_redirects` (ajouter `/projects/lab-horizon  /pages/projects/lab-horizon.html  200`).
- Catalogue : `pages/projects.html`, `src/styles/pages/projects.css`, `src/styles/components/project-card.css`, `src/data/skills.ts` (catégories du filtre si besoin).
- Tests : `tests/feature/catalog-and-headers.test.ts` (ajout `lab-horizon` à `PROJECT_SLUGS`), `tests/feature/projects-pages.test.ts` (carte Lab Horizon), nouveau `tests/feature/project-template.test.ts`.

## Étapes

1. **Gabarit** : implémenter la structure de `_TEMPLATE.md` (sections 1 → 6) dans le CSS partagé, avec des classes BEM documentées en tête de `project-detail.css` (liste des blocs disponibles : `.page-hero`, `.project-brief`, `.project-story`, `.project-gallery`, `.project-takeaway`, `.project-nav`). Les classes déjà testées par C5 (Visualcom) et MagicalLab **restent** valides.
2. **Lab Horizon** : créer la page en appliquant le gabarit et en copiant le contenu de `lab-horizon.md`. Les phrases `[À CONFIRMER]` → `<!-- TODO: … -->`, non affichées. Captures `shots/lab-horizon-accueil-*` absentes → prévoir l’emplacement avec l’image de repli `unc-recherche.webp` et un `<!-- TODO L6 -->`.
3. **Catalogue** : ordre et statut de `_TEMPLATE.md` (I → IX), carte Lab Horizon ajoutée en premier, cartes en « œuvres » (`.graded-image` + cartel au pigment + survol de `docs/DA.md` §7). Années corrigées (MagicalLab 2026, Pacific Dataviz 2025). Filtre conservé.
4. **Navigation** `project-nav` en bas de chaque page projet existante (ordre du catalogue, boucle) — HTML ajouté dans les 9 pages **uniquement** pour ce bloc.
5. **Tests** `project-template.test.ts` : chaque page de `PROJECT_SLUGS` a un `.cartel`, un `h1` unique, un `<meta name="description">`, un bloc `.project-nav` avec 2 liens, et aucune image sans `alt`.
6. Gate + E2E + captures 1440/390 de `lab-horizon` et `projects`.

## Critères d’acceptation

- [ ] `pages/projects/lab-horizon.html` conforme au brief, route `/projects/lab-horizon` fonctionnelle.
- [ ] Catalogue de 9 projets dans l’ordre, filtre OK, cartes DA v3.
- [ ] Tests C5 (Visualcom) et MagicalLab toujours verts ; nouveaux tests verts.
- [ ] Le gabarit est documenté en tête de `project-detail.css` (L3b/c/d s’en servent sans modifier le CSS).

## Prompt à coller (Claude Code, Sonnet)

```
Tu es exécutant du lot L3a (gabarit des pages projet, page Lab Horizon, catalogue) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis AGENTS.md, docs/DA.md, la skill portfolio-da, docs/content/projects/_TEMPLATE.md, docs/content/projects/lab-horizon.md, docs/content/assets-kit.md puis docs/work-packages/WP-L3a-gabarit-lab-horizon.md. Le gabarit doit être réutilisable tel quel par trois autres exécutants qui n'auront pas le droit de modifier le CSS partagé : documente les blocs disponibles en tête de project-detail.css. Ne publie aucune phrase marquée [À CONFIRMER]. Termine par le rapport au format du README.
```
