# L9 — Captures AR Micro-monde + correctifs rapides de la red team

**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ journée · **Dépend de :** `main` à jour (red team du 25/10 fusionnée) · **Branche :** `wp/L9-micromonde-redteam`
**À livrer avant la mise en production du mercredi 28/10.**

## Partie 0 — Documents du chef de projet

Sur `main`, avant de créer la branche : `git add docs/ && git commit -m "docs: point du 26/10, lot L9"` (uniquement `docs/`, vérifier avec `git diff --cached --name-status`).

## Partie A — Captures AR Micro-monde (fournies par Léandre le 26/10)

Les images sont **déjà préparées** par le chef de projet dans `src/assets/projects/micromonde/shots/` : barre Safari, heure, bandeau « Powered by Netlify » rognés, WebP q80, métadonnées supprimées. Ne pas les retraiter.

| Fichier | Format | Contenu |
|---|---|---|
| `micromonde-ar-hibiscus.webp` | 1600×1000 (paysage) | Hibiscus 3D devant sa fresque, boutons ronds de l'interface visibles |
| `micromonde-ar-loriquet.webp` | 1600×1000 (paysage) | Loriquet 3D en vol devant la fresque du Patio, téléphone en main |
| `micromonde-ar-loriquet-mobile.webp` | 900×1200 (portrait) | Même scène, cadrage vertical |
| `micromonde-ar-tortue-avant.webp` | 1600×1200 | Fresque de la tortue vue dans l'application, avant détection |
| `micromonde-ar-tortue-apres.webp` | 1600×1200 | Même point de vue : la tortue 3D est apparue devant la fresque |
| `micromonde-ar-tortue-mobile.webp` | 900×1200 (portrait) | Tortue 3D devant la fresque, cadrage vertical |

**Attention : presque tout est en paysage.** Ne pas utiliser la variante `project-story__visual--phone` (cadre téléphone vertical) pour ces images.

1. **Récit III « Une interface à hauteur de mur »** : retirer `project-story__block--no-visual` et le commentaire `<!-- TODO L6 captures AR … -->` ; ajouter le visuel `micromonde-ar-hibiscus.webp` (cadre paysage du gabarit, `.graded-image`, légende « Les boutons ronds, ancrés sur la fresque, ouvrent les panneaux »).
2. **Nouveau bloc « En situation »** (entre le récit et « Essayer sur votre téléphone ») :
   - une paire **avant / après** côte à côte en desktop, empilée sous 48 rem : `micromonde-ar-tortue-avant.webp` (légende « Avant : la fresque vue par le téléphone ») et `micromonde-ar-tortue-apres.webp` (légende « Après : la fresque est reconnue, la tortue apparaît ») ;
   - en dessous, pleine largeur, le loriquet en **direction artistique responsive** : `<picture>` avec `micromonde-ar-loriquet-mobile.webp` pour `(max-width: 48rem)` et `micromonde-ar-loriquet.webp` sinon ; légende « Le loriquet prend son envol devant la fresque du Patio ».
   - Réutiliser les classes de galerie du gabarit (`project-gallery__*`) ; une seule règle CSS ajoutée au besoin, dans le CSS de page, couleurs par variables uniquement.
3. `micromonde-ar-tortue-mobile.webp` : non utilisé pour l'instant (réserve) ; ne pas l'importer s'il n'est pas utilisé.
4. `alt` descriptifs, factuels, sans répéter la légende mot pour mot ; `width`/`height` exacts ; `loading="lazy"`.
5. Brief : dans `docs/content/projects/micromonde.md`, remplacer la note « captures téléphone reportées » par la liste des fichiers ci-dessus ; dans `docs/content/assets-kit.md`, Micro-monde → captures AR ✅.
6. Test feature : les 5 images utilisées sont présentes dans `micromonde.html`, plus aucun `TODO L6` dans la page.

## Partie B — Correctifs rapides de la red team (`docs/REDTEAM-2026-10-25.md`)

| # | À faire |
|---|---|
| **P1-1 a** (décision Léandre 26/10 : accessibilité et UX d'abord) | **Pas de buste 3D sur appareil tactile.** La 3D (three.js, Rapier, Draco, `bust.glb`) n'est chargée **que** si `matchMedia('(hover: hover) and (pointer: fine)')` est vrai **et** `prefers-reduced-motion` n'est pas `reduce`. Sinon : l'image `bust-designer.jpg` (déjà l'image de secours du héros) reste affichée comme visuel définitif, **aucun** import dynamique de la 3D n'est déclenché. Sur tactile, masquer l'indication « Clic gauche : peindre — Clic droit : tourner le buste » (elle ne s'applique pas au doigt) ; le pinceau du curseur reste désactivé au tactile s'il l'est déjà. Logique de `bust-hero` inchangée sur desktop. Tests : unitaire (aucun import de la 3D quand le pointeur est grossier ou en mouvement réduit) + E2E mobile (aucune requête vers `bust-*.glb` ni `rapier-*.js` en viewport 390 px avec `hasTouch`). |
| P1-2 | Voile d'ouverture : sur appareil tactile (`(hover: none) and (pointer: coarse)`) ou connexion lente (`navigator.connection.saveData` / `effectiveType` 2g-3g), ne **pas** attendre la 3D ; plafond 1,5 s. Desktop inchangé. Test unitaire. |
| P2-3 | `public/_headers` : `/draco/*` → `Cache-Control: public, max-age=604800` ; `/og/*`, `/og-cover.jpg`, `/favicon.svg`, `/logo-leandre.svg` → `max-age=86400`. Rien sur `/jury*` ni `/documents/*`. |
| P2-4 | Boutons du carrousel : contour de focus 2 px visible (même règle que les autres liens) ; liens d'en-tête : cible ≥ 24 px de haut. |
| P2-6 | Tests E2E rejouables en prod : smoke MagicalLab `/magicallab(\.html)?$/` ; `a11y.spec` ignore les pages jury quand `PLAYWRIGHT_BASE_URL` est défini. |
| P2-7 | CSP : `frame-src` → `https://leandredatavizchallenge.figma.site` à la place de `https://*.figma.site` (vérifier que l'iframe Pacific Dataviz s'affiche toujours). |

| P1-3 | **Décision Léandre 26/10 : `bust-designer.jpg` est validé tel quel** (éclaboussure comprise). Ne pas modifier l'image. Ajouter dans `docs/DA.md` §3 une ligne « Exception validée : l'image du buste `src/assets/hero/bust-designer.jpg` conserve son éclaboussure d'origine (œuvre de Léandre) » et clore M3 (`RECETTE.md`) et P1-3 (`REDTEAM-2026-10-25.md`) avec la mention « validé par Léandre le 26/10 ». |

**Hors périmètre de ce lot (ne pas faire) :** P2-5 (réglage Netlify, fait par Léandre), M2 Visualcom, tout le lot L10.

## Partie C — Fin de lot

- `npm run ci` vert ; captures 1440 et 390 px de `/projects/micromonde` et de l'accueil **ouvertes et vérifiées** (aucune image déformée ; à 390 px l'accueil affiche le buste en image, sans indication de clic).
- Lighthouse mobile de l'accueil (3 passages, médiane) avant / après P1-1 a, dans le rapport.
- Commit(s), fusion `--no-ff`, **`git push origin main`** (autorisé : préparation de la mise en production). Le commit local `82c53d5` (rapport red team) part avec.
- Après le déploiement Netlify : `PLAYWRIGHT_BASE_URL=https://vigourouxleandre.netlify.app npx playwright test tests/e2e/jury-protection.prod.spec.ts` → vert.

## Prompt à coller

```
Tu es exécutant du lot L9 (captures AR Micro-monde + correctifs rapides de la red team) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/REDTEAM-2026-10-25.md puis docs/work-packages/WP-L9-micromonde-ar-et-red-team.md, et traite les parties 0, A, B et C dans l'ordre. Les images de la partie A sont déjà prêtes : ne les retraite pas. Ne fais rien de la liste « Hors périmètre ». Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport au format du README (avec la ligne AUDIT).
```
