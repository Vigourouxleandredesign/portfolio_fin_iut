# L3c — Visualcom + MagicalLab (migration DA v3)

**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ journée · **Dépend de :** L3a · **En parallèle de :** L3b, L3d · **Branche :** `wp/L3c-vc-ml`

## Périmètre (strict)

`pages/projects/visualcom.html` · `pages/projects/magicallab.html` · images de `src/assets/projects/visualcom/` et `magicallab/` · `src/scripts/features/three-scene/glb-showcase.ts` (**uniquement** les couleurs des lumières : les lire depuis les CSS variables, comme `createLights` en L2) · tests `tests/feature/projects-pages.test.ts` (C5), `tests/feature/magicallab-page.test.ts`.
**Interdit :** CSS partagé ; logique 3D autre que les couleurs de lumière.

## Étapes

1. **Visualcom** — `docs/content/projects/visualcom.md` : migration DA (cartel, hero `.page-hero`, `.graded-image`), **texte existant conservé**, ajout du bloc « Ouvrir WordPress à l’IA, sans ouvrir de brèche » + puces « Ce que j’ai livré » (sans doublon). Garder toutes les classes et fichiers testés par C5. Ajouter la galerie « long page » (`shots/*-full.webp` dans un cadre, défilement au survol, coupé en reduced-motion).
2. **MagicalLab** — `docs/content/projects/magicallab.md` : migration DA (cartel cuivre, titre Ubuntu + un mot Updock, gestes cuivre), galerie « Dans la scène » avec les captures WebP, année 2026, crédit robot `Modèle 3D du robot : Komov, Sketchfab.` Showcase portail/robot conservés. **H1** : le nom accessible doit rester exactement « MagicalLab » (correctif L0 : `aria-label` sur le `<h1>`, spans `aria-hidden` — le `display:flex` + `gap` de `glb-showcase.css` insère sinon un espace) ; conserver ce correctif ou le remplacer par un équivalent, test E2E smoke inchangé.
3. `glb-showcase.ts` : remplacer les `0x…` des lumières par des couleurs lues dans les tokens (`--color-light-fire`, `--color-light-beam`, `--color-light-steel`) ; garder des intensités identiques.
4. Tests : C5 intact ; MagicalLab → ajout « pas de mockup Mac » (déjà), présence du crédit Nick Broad / CC BY 4.0, année 2026.
5. Gate + E2E + captures 1440/390.

## Critères d’acceptation

- [ ] C5 et tests MagicalLab verts sans avoir été affaiblis.
- [ ] Aucun texte validé supprimé ; bloc IA Visualcom ajouté.
- [ ] `glb-showcase.ts` sans `0x` de couleur.

## Prompt à coller

```
Tu es exécutant du lot L3c (migration DA v3 des pages Visualcom et MagicalLab) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/projects/_TEMPLATE.md, le bloc de documentation en tête de src/styles/components/project-detail.css, docs/content/projects/visualcom.md, docs/content/projects/magicallab.md puis docs/work-packages/WP-L3c-visualcom-magicallab.md. Ces deux pages ont un contenu déjà validé et testé : tu changes l'habillage, tu ajoutes uniquement ce que les briefs demandent, et les tests existants doivent rester verts sans être modifiés à la baisse. Termine par le rapport au format du README avec git diff --stat main.
```
