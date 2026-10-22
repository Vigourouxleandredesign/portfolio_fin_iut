# L3d — Pages secondaires et bonus

**Exécutant :** Cursor (agent) ou Claude Code Sonnet · **Durée :** ½ journée · **Dépend de :** L3a · **En parallèle de :** L3b, L3c · **Branche :** `wp/L3d-secondaires`
**Priorité :** la plus basse — si le planning glisse, ce lot est coupé en premier (les pages actuelles restent en ligne).

## Périmètre (strict)

`pages/projects/hyperloop.html`, `back-springboot.html`, `pacific-dataviz.html`, `borne-2bealive.html` · leurs dossiers d’images · `public/_headers` **uniquement si** une origine d’iframe change (normalement non) · tests dédiés `tests/feature/secondary-pages.test.ts`.
**Interdit :** CSS partagé.

## Étapes

1. Appliquer gabarit + contenu des briefs `hyperloop.md`, `back-springboot.md`, `pacific-dataviz.md`, `borne-2bealive.md`.
2. **Borne** : supprimer l’iframe et le lien vers `precommande-borne-2b-alive` ; showcase 3D `borne.glb` via `[data-glb-showcase]` (même attributs que MagicalLab, chargement paresseux, image de repli).
3. **Pacific Dataviz** : « finaliste » (jamais « primée »), année 2025, supprimer le texte « Production / borne / Taïwan ».
4. **Spring Boot** : aucune donnée de `HELP.md` (identifiants) ; captures absentes → `<!-- TODO L6 -->` + bloc texte seul.
5. Tests `secondary-pages.test.ts` : pas de `precommande-borne` ; pas de « primée » ; pas de `michel`/`admin`/`root` dans `back-springboot.html` ; Borne contient `data-glb-showcase`.
6. Gate + E2E + captures 1440/390 des 4 pages.

## Prompt à coller

```
Tu es exécutant du lot L3d (pages HyperLoop, Spring Boot, Pacific Dataviz, Borne) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/projects/_TEMPLATE.md, le bloc de documentation en tête de src/styles/components/project-detail.css, les quatre briefs docs/content/projects/{hyperloop,back-springboot,pacific-dataviz,borne-2bealive}.md puis docs/work-packages/WP-L3d-secondaires.md. Aucun CSS partagé, aucune phrase inventée, aucun identifiant publié. Termine par le rapport au format du README avec git diff --stat main.
```
