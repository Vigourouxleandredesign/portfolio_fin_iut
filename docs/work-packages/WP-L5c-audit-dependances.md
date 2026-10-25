# L5c — Audit des dépendances obligatoire dans la CI/CD

**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 à 2 h · **Dépend de :** rien (à fusionner **avant** L5b et L6) · **Branche :** `wp/L5c-audit`
**Décision de Léandre (25/10) :** l'audit des paquets fait partie du pipeline, **obligatoire et bloquant**. Des failles sont publiées et corrigées presque chaque jour : une dépendance vulnérable doit casser la CI, pas passer inaperçue.

## Périmètre

`package.json` · `package-lock.json` · `.github/workflows/ci.yml` · créer `.github/dependabot.yml` · `docs/TESTING.md` · `docs/SECURITY.md` (section dépendances). Rien dans `src/`, `pages/` ou `tests/`, sauf si une mise à jour de dépendance impose une adaptation (à signaler dans le rapport).

## Étapes

1. **État des lieux** : `npm audit` (toutes les dépendances) et `npm audit --omit=dev` ; `npm outdated`. Noter les résultats bruts pour le rapport.
2. **Corriger les vulnérabilités existantes**, dans cet ordre :
   1. `npm audit fix` (**jamais** `--force`).
   2. Ce qui reste et touche une dépendance **directe** : `npm install <paquet>@<version corrigée>`, un paquet à la fois, avec `npm run ci` vert entre chaque mise à jour.
   3. Ce qui reste et touche une dépendance **transitive** : bloc `overrides` dans `package.json`, qui force la version corrigée, puis `npm run ci`.
   4. S'il n'existe aucune version corrigée : **ne rien contourner**. Documenter dans `docs/SECURITY.md` (paquet, avis GHSA/CVE, gravité, dev ou prod, présent ou non dans `dist/`) et le signaler en TODO du rapport : le chef de projet décide.
3. **Mettre à jour** : versions patch et mineures de toutes les dépendances, en respectant les épinglages exacts (`three` reste `0.185.x`). Les montées de version **majeures** ne se font que si `npm run ci` reste vert sans modifier de code ; sinon, les lister dans le rapport sans les faire.
4. **Rendre l'audit bloquant** dans `package.json` :
   - `"audit:ci": "npm audit --audit-level=high && npm audit signatures"` (échec sur une faille haute ou critique, dépendances de dev comprises puisqu'elles tournent sur ta machine et dans la CI ; vérification des signatures du registre npm) ;
   - l'ajouter **en premier** dans `"ci"` : `"ci": "npm run audit:ci && npm run ci:static && npm run gate && npm run test:e2e"` ;
   - garder `"audit:prod"` pour le rapport.
   Le hook pre-commit lance `npm run ci` : l'audit a besoin du réseau. Hors ligne, on attend le réseau ; aucun contournement (`--no-verify`, `HUSKY=0`).
5. **CI GitHub** (`ci.yml`) :
   - ajouter un déclencheur planifié quotidien : `schedule: - cron: '0 18 * * *'` (05:00 à Nouméa), pour qu'une faille publiée un jour sans commit fasse quand même échouer la CI ;
   - garder `npm ci` (lockfile strict) ;
   - vérifier que les versions d'actions utilisées existent bien (`actions/checkout`, `actions/setup-node`, `actions/upload-artifact`) et que le dernier run sur `main` est vert : `gh run list --branch main --limit 3`. Corriger les versions si un run échoue sur « unable to resolve action ».
6. **Dependabot** (`.github/dependabot.yml`) : écosystèmes `npm` (répertoire `/`) et `github-actions`, vérification hebdomadaire, mises à jour patch et mineures **groupées** en une PR, alertes et mises à jour de sécurité activées. Chaque PR Dependabot passe par la même CI.
7. **Documentation** :
   - `docs/TESTING.md` : la ligne A5 devient « **obligatoire, bloquant** — `npm run audit:ci` en tête de `npm run ci` et chaque jour dans GitHub Actions » ;
   - `docs/SECURITY.md` : section « Dépendances » (règle, seuil `high`, procédure de correction des étapes 2.1 à 2.4, pas de `--force`, Dependabot) .
8. `npm run ci` vert, commit, fusion `--no-ff`, puis `git push origin main` (exception au protocole, autorisée pour ce lot : la CI distante doit être vérifiée verte).

## Critères d'acceptation

- [ ] `npm audit --audit-level=high` sort en 0 ; `npm audit signatures` OK.
- [ ] `npm run ci` commence par l'audit ; un test volontaire (ex. installer temporairement une version vulnérable connue dans une branche jetable, **sans la commiter**) fait bien échouer `npm run audit:ci`, puis tout est remis en état.
- [ ] CI GitHub : déclenchement quotidien ajouté, dernier run vert.
- [ ] Dependabot configuré ; docs à jour.

## Prompt à coller

```
Tu es exécutant du lot L5c (audit des dépendances obligatoire dans la CI/CD) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md, puis docs/work-packages/WP-L5c-audit-dependances.md étape par étape. N'utilise jamais npm audit fix --force, --no-verify ni HUSKY=0. Si une faille n'a pas de correctif, ne la contourne pas : documente-la et signale-la. Ne lis et n'affiche jamais de fichier .env. Termine par le rapport au format du README, avec la sortie de npm audit avant et après, la liste des paquets mis à jour (ancienne → nouvelle version) et les montées majeures non faites.
```
