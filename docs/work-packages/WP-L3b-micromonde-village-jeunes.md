# L3b — Micro-monde + Vill’âge Jeunes

**Exécutant :** Claude Code **Sonnet** ou Cursor (agent) · **Durée :** ½ journée · **Dépend de :** L3a · **En parallèle de :** L3c, L3d · **Branche :** `wp/L3b-mm-vj`

## Périmètre (strict)

`pages/projects/micromonde.html` · `pages/projects/village-jeunes.html` · images de `src/assets/projects/micromonde/` et `village-jeunes/` · tests dédiés `tests/feature/micromonde-page.test.ts`, `tests/feature/village-jeunes-page.test.ts`.
**Interdit :** modifier un CSS partagé (`src/styles/components/*`, `src/styles/pages/project-detail.css`). Besoin d’un style manquant → l’écrire dans le rapport.

## Étapes

1. Réécrire `micromonde.html` avec le gabarit (`docs/content/projects/_TEMPLATE.md`) et le contenu de `docs/content/projects/micromonde.md` (crédit Kuby Kolor **obligatoire** ; bloc « Essayer sur votre téléphone » avec QR + lien ; pas d’iframe).
2. Réécrire `village-jeunes.html` avec `docs/content/projects/village-jeunes.md` (mockup laptop+téléphone en mode `shots`, chiffre « 500 inscriptions » mis en avant ; aucune capture staff).
3. Tests : Micro-monde → présence du crédit « Kuby Kolor », lien `micromonde-ar.netlify.app` en `target="_blank" rel="noopener noreferrer"`, aucune `<iframe>` ; Vill’âge Jeunes → lien `villagejeunes.nc`, présence de « 500 inscriptions », aucune image hors `village-jeunes/`.
4. Gate + E2E + captures 1440/390 des deux pages.

## Critères d’acceptation

- [ ] Contenu identique aux briefs (aucune phrase inventée) ; checklist DA §9.
- [ ] Aucun fichier hors périmètre modifié (`git diff --stat main` le prouve dans le rapport).

## Prompt à coller

```
Tu es exécutant du lot L3b (pages Micro-monde et Vill'âge Jeunes) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/projects/_TEMPLATE.md, le bloc de documentation en tête de src/styles/components/project-detail.css, puis docs/content/projects/micromonde.md, docs/content/projects/village-jeunes.md et docs/work-packages/WP-L3b-micromonde-village-jeunes.md. Tu n'as le droit de modifier que les deux pages HTML, leurs images et leurs tests : aucun CSS partagé. Textes copiés des briefs, sans invention. Termine par le rapport au format du README avec git diff --stat main.
```
