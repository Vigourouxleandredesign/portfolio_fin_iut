# L7 — Déploiement Netlify

**Exécutant :** **Léandre** (dashboard Netlify, GitHub) + Claude Code **Haiku** (vérifications) · **Durée :** 1 h · **Dépend de :** L1–L5 fusionnés · **Branche :** `main`

## Pré-requis

- [ ] Dépôt GitHub `Vigourouxleandredesign/portfolio_fin_iut` **privé** (contient `public/jury/fiches/*.pdf`).
- [x] PDF des fiches corrigés en place (22/10). Facultatif : réexport Word, **mêmes noms**.
- [ ] `main` : gate + E2E verts.

## Étapes (Léandre)

1. `git push origin main`.
2. Netlify › *Add new site* › *Import from GitHub* › le dépôt. Build lu depuis `netlify.toml` (ne rien saisir à la main).
3. *Site configuration › Environment variables* › `JURY_BASIC_AUTH` = `jury:<mot de passe d’au moins 16 caractères, sans espace>` — portée **Builds**. Générer le mot de passe avec un gestionnaire ; ne l’écrire nulle part ailleurs.
4. Relancer le déploiement. Un échec « JURY_BASIC_AUTH is not set » = la variable manque (c’est voulu).
5. Nom du site / domaine : noter l’URL finale ; remplacer `https://REMPLACER-PAR-LE-DOMAINE` (sitemap, robots, canonical, og) — commit `chore(L7): set production domain`.

## Vérifications (Haiku, après déploiement)

```bash
URL=https://<site>.netlify.app
curl -sI $URL/ | head -1                                         # 200
curl -sI $URL/jury | head -1                                     # 401
curl -sI $URL/pages/jury/index.html | head -1                    # 401
curl -sI $URL/jury/fiches/visualcom/mission-reflection.pdf | head -1   # 401
curl -sI -u "jury:<mdp>" $URL/jury | head -1                     # 200 (Léandre tape la commande, le mot de passe ne passe pas par l’IA)
curl -sI $URL/ | grep -iE "content-security-policy|strict-transport|x-frame-options|cross-origin-opener"
curl -sI $URL/n-existe-pas | head -1                             # 404
curl -s  $URL/sitemap.xml | grep -c "<loc>"                      # 13
```

Puis `PLAYWRIGHT_BASE_URL=$URL npm run test:e2e:prod`.

## Critères d’acceptation

- [ ] Public en 200, jury en 401 sans mot de passe (3 chemins), 200 avec.
- [ ] En-têtes de sécurité présents ; 404 personnalisée.
- [ ] E2E sur la préprod verts.

## Prompt à coller (Haiku, après l’étape 4 de Léandre)

```
Tu es exécutant du lot L7 (vérifications de déploiement) du portfolio de Léandre. L'URL du site est <URL>. Exécute uniquement la section « Vérifications » de docs/work-packages/WP-L7-deploiement.md, sauf la commande avec mot de passe que je taperai moi-même. N'écris jamais de mot de passe dans un fichier ni dans le terminal. Rapporte chaque code HTTP obtenu face au code attendu, puis le résultat de npm run test:e2e:prod.
```
