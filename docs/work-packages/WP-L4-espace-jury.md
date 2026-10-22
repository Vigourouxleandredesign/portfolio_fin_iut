# L4 — Espace jury protégé (`/jury`)

**Exécutant :** Cursor (agent) ou Claude Code **Sonnet** · **Durée :** ½ journée · **Dépend de :** L1 · **En parallèle de :** L2 · **Branche :** `wp/L4-jury`

## Objectif

Construire les 5 pages de l’espace jury (matrice + 4 compétences) dans le même site, protégées par le mot de passe Netlify déjà prévu (`scripts/inject-jury-auth.mjs`, `netlify.toml`).

## Sources

`docs/content/teacher-site.md` (spec UX/DA/sécurité) · `docs/content/jury-content.md` (**texte exact**) · `docs/SECURITY.md` §0 et §7 · PDF déjà présents : `public/jury/fiches/{visualcom,village-jeunes}/{project-sheet,mission-reflection}.pdf`.

## Périmètre

Créer : `pages/jury/index.html`, `pages/jury/developpement-front.html`, `qualite-securite-performance.html`, `client-gestion-projet.html`, `strategie-analyse.html` · `src/scripts/entries/jury.ts` · `src/styles/pages/jury.css` · `tests/feature/jury-pages.test.ts`.
Modifier : `vite.config.ts` (entrées `pages/jury/*.html`, même principe que `projectDetailPageInputs`), `public/_redirects` (lignes ci-dessous), `public/robots.txt`.
**Interdit :** modifier `scripts/inject-jury-auth.mjs`, `netlify.toml`, `public/_headers` ; mettre du texte jury dans un `.ts`/`.json` ; lier un PDF depuis une page publique.

## Étapes

1. Pages HTML : gabarit commun de `jury-content.md` (fil d’Ariane, cartel, H1, compétences référentiel en Mono, argumentaire, un `<article id="<slug>">` par projet, navigation ← · tableau · →). `<meta name="robots" content="noindex, nofollow">` sur chaque page. DA sobre de `teacher-site.md` (accent or, corps 18 px, mesure 68 ch, `@media print`).
2. Matrice : vrai `<table>` avec `<caption>`, `<th scope="col|row">`, cellules ● = liens vers `/jury/<compétence>#<projet>` avec texte accessible.
3. Liens PDF : `target="_blank" rel="noopener"`, libellé + « (PDF, n pages) ».
4. `jury.ts` : imports CSS + header/footer communs **uniquement** (aucun texte).
5. `vite.config.ts` : fonction `juryPageInputs()` (clés `jury-<stem>`).
6. `public/_redirects` (avant toute règle générique) :
   ```
   /jury                              /pages/jury/index.html                          200
   /jury/developpement-front          /pages/jury/developpement-front.html            200
   /jury/qualite-securite-performance /pages/jury/qualite-securite-performance.html   200
   /jury/client-gestion-projet        /pages/jury/client-gestion-projet.html          200
   /jury/strategie-analyse            /pages/jury/strategie-analyse.html              200
   ```
   (pas de joker `/jury/*` : il masquerait les PDF).
7. `public/robots.txt` : ajouter `Disallow: /jury` et `Disallow: /pages/jury`.
8. Tests `jury-pages.test.ts` :
   - les 5 pages existent, ont `noindex` et un `h1` ;
   - chaque lien `/jury/fiches/…pdf` pointe vers un fichier existant dans `public/` ;
   - chaque page compétence a les liens précédent/suivant/tableau (boucle complète) ;
   - **aucun fichier** `src/**/*.ts` ne contient « Fiche de réflexion » ni un extrait de citation (garde-fou « texte jury hors bundle ») ;
   - `_redirects` contient les 5 routes et pas de `/jury/*` ;
   - aucune page publique (hors `pages/jury/`) ne contient `/jury/fiches/`.
9. Vérification locale : `npm run build` puis `JURY_BASIC_AUTH=jury:TestLocal-1234567890 CONTEXT=dev node scripts/inject-jury-auth.mjs` → `dist/_headers` contient 3 blocs `Basic-Auth` ; puis `grep -rl "Compétences du référentiel" dist/assets` → **aucun** résultat.
10. Gate + E2E (ajouter `/pages/jury/index.html` aux routes axe de `tests/e2e/a11y.spec.ts`) + captures 1440/390 + aperçu impression d’une page compétence.

## Critères d’acceptation

- [ ] 5 pages conformes, navigation complète au clavier, matrice accessible.
- [ ] Texte identique à `jury-content.md`.
- [ ] Aucun texte jury dans `dist/assets/*.js` ; aucun lien PDF depuis une page publique.
- [ ] Gate + E2E verts.

## Prompt à coller

```
Tu es exécutant du lot L4 (espace jury protégé) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis docs/SECURITY.md (§0 et §7, non négociables), docs/content/teacher-site.md, docs/content/jury-content.md, la skill portfolio-da puis docs/work-packages/WP-L4-espace-jury.md. Le texte des pages est celui de jury-content.md, mot pour mot, et il vit uniquement dans les fichiers HTML. Tu ne touches ni au script de mot de passe, ni à netlify.toml, ni à public/_headers. Termine par le rapport au format du README, en joignant la sortie des vérifications de l'étape 9.
```
