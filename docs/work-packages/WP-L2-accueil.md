# L2 — Accueil DA v3

**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 journée · **Dépend de :** L1 · **En parallèle de :** L4 · **Branche :** `wp/L2-accueil`

## Objectif

Faire de l’accueil la vitrine de la DA « Le Sanctuaire nocturne » en conservant le buste 3D et le pinceau, et mettre en avant les 4 projets vedettes.

## Sources

`docs/content/home.md` (contenu, **à suivre section par section**) · `docs/DA.md` · skill `portfolio-da`.

## Périmètre

`pages/index.html` · `src/styles/pages/home.css` · `src/styles/components/hero-3d.css`, `project-carousel.css`, `clients-marquee.css`, `skill-card.css`, `skills-gallery.css`, `section.css` · `src/scripts/entries/home.ts` · `src/scripts/features/three-scene/bust-hero-scene.ts` (**fonction `createLights` uniquement**) · `src/scripts/features/home-brush/*` · `tests/feature/home-featured-carousel.test.ts`, `tests/unit/home-brush.test.ts` · suppression des PNG de décor DA v2 quand plus aucune page ne les importe (`src/assets/decor/*-sketch.png`, `stroke-chalk.png`, `splash-ember.png`, `marble-touches.png`).

## Étapes

1. Hero : `docs/content/home.md` §1 (lumières via CSS variables lues au démarrage, sous-titre, `impasto-cluster.webp`, faisceau + poussière, retrait des `.home-decor--*`).
2. Pinceau : §2. Supprimer les couleurs hex de repli dans `home-brush.ts` (lire les tokens ; si un token manque, ne rien peindre plutôt qu’un hex). Adapter `home-brush.test.ts`.
3. Projets récents : §3 — 4 diapositives (ajouter Lab Horizon en premier ; image `../../assets/projects/lab-horizon/hero-laboratoire.webp`), cartels, `.graded-image`. Mettre à jour `home-featured-carousel.test.ts` (4 liens dont `/pages/projects/lab-horizon.html` ; la page sera créée en L3a — le test vérifie seulement le lien).
4. Collaborations §4, Mon univers §5, Compétences §6, CTA §7.
5. Vérifier `prefers-reduced-motion` (poussière, dérive, pinceau, marquee) et 390 px (décors masqués, pas de scroll horizontal).
6. Gate + E2E + captures 1440/390 (hero, projets, compétences).

## Critères d’acceptation

- [ ] Checklist `docs/DA.md` §9 cochée pour l’accueil.
- [ ] Buste, physique et orbite inchangés (seules les lumières changent).
- [ ] 4 projets vedettes, dans l’ordre I → IV, chacun avec cartel au bon pigment.
- [ ] Plus aucun décor DA v2 importé ; plus aucun hex dans `home-brush.ts`.
- [ ] Gate + E2E verts ; LCP raisonnable (image hero ≤ 250 Ko, `fetchpriority="high"`).

## Prompt à coller (Claude Code, Sonnet)

```
Tu es exécutant du lot L2 (accueil) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis AGENTS.md, docs/DA.md, la skill portfolio-da, puis docs/content/home.md et docs/work-packages/WP-L2-accueil.md. Implémente l'accueil section par section en réutilisant les composants créés en L1 (graded-image, cartel, section-title, paint, light-beam) sans en créer de nouveaux partagés. Le buste 3D et le pinceau sont conservés : tu ne touches qu'à createLights() et au rendu du trait. Textes : copie ceux de home.md, garde les autres tels quels. Termine par le rapport au format du README.
```
