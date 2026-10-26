# Rapport de recette — L8 (25/10/2026)

**Périmètre testé :** build de `main` (`dist/`) servi localement avec les en-têtes réels de `public/_headers` et les règles de `public/_redirects` — 19 pages × 2 viewports (1440 et 390 px). **Pas encore testé :** le site déployé (L7 non fait : il faut le compte Netlify, le mot de passe jury et l'URL).

## Synthèse

| Domaine | Résultat | Détail |
|---|---|---|
| Accessibilité (axe WCAG A/AA) | ✅ | 0 violation sur les 19 pages, sauf **Pacific Dataviz** (3 boutons sans nom + 1 contraste) : tout vient du **site Figma intégré** (iframe externe), pas de nos pages. |
| Clavier / reduced-motion | ✅ | Focus visible sur boutons, liens, matrice ; animations coupées en `prefers-reduced-motion` (testé en mode réduit). |
| Liens | ✅ | 0 lien interne cassé (pages, PDF, images). Externes : visualcom.nc, magicallab.netlify.app, micromonde-ar.netlify.app, villagejeunes.nc, leandredatavizchallenge.figma.site, Sketchfab ×2, creativecommons (non vérifiés en ligne). |
| Images | ✅ | 0 image cassée, 0 `<img>` sans `alt`, 0 défilement horizontal (1440 et 390). |
| Sécurité — bundle | ✅ | Aucun texte jury dans `dist/assets/*.js` ; `check:secrets` OK ; seuls e-mail et téléphone prévus publiés. |
| Sécurité — jury | ✅ (local) | `inject-jury-auth` ajoute 3 blocs Basic-Auth (`/jury`, `/jury/*`, `/pages/jury/*`) ; `robots.txt` et `noindex` OK. **401 réels à vérifier après L7.** |
| Sécurité — dépendances | ✅ | `npm audit` : 3 critiques + 1 modérée (dev) → **0** ; audit bloquant dans la CI (L5c). |
| CSP / console | ✅ après correctif | Voir B1. Console propre sur les 19 pages (restent des avertissements GPU du navigateur de test). |
| Performance (Lighthouse mobile) | ⚠️ | Voir M4 : accueil 31-40 avant correctifs. Autres pages 81-99. |
| Bonnes pratiques / SEO / a11y (Lighthouse) | ✅ | 100 / 100 / 100 (jury : SEO 58 voulu — `noindex`, pas de description). |
| Contenu ↔ briefs | ✅ | Aucun `[À CONFIRMER]` affiché ; aucun texte d'attente ; `TODO` uniquement en commentaires HTML (9 emplacements, voir M1/M5). |

## Anomalies

### Bloquantes — toutes corrigées

| # | Anomalie | Lot | Correctif |
|---|---|---|---|
| B1 | La CSP `connect-src 'self'` **bloquait le décodage des textures** des modèles 3D (`blob:`) : MagicalLab (portail, robot) et Borne s'affichaient sans textures en production. | L8 (hérité L3c/L3d) | `connect-src 'self' blob:` (aucune origine tierce ajoutée), documenté dans `SECURITY.md` §4, test `perf-guards`. |
| B2 | Décalage de mise en page de **0,16** sur mobile à chaque page (menu déplié jusqu'au JavaScript, polices en swap). | L1 (en-tête) | Menu fermé par défaut en CSS, polices Ubuntu 400/700 préchargées. Mesuré : **0 à 0,025**. |

### Majeures

| # | Anomalie | Lot / décision | Correctif proposé |
|---|---|---|---|
| M1 | **Captures** : Lab Horizon ✅ faites le 2026-10-25 (accueil desktop/mobile, recherche desktop ; aucun identifiant visible). Restent Spring Boot et AR Micro-monde (reportée) : visuels de repli en place. | L6 — Lab Horizon fait (image backend reconstruite : l’ancienne écoutait sur 80 au lieu de 8080). | Spring Boot : lancer l’app + connexion manuelle de Léandre, puis capture. Non bloquant pour la mise en ligne. |
| M2 | **Visualcom : texte contradictoire.** La fiche conservée dit « piste HTTP + compte éditeur non finalisée », alors que le bloc ajouté (brief) décrit comptes nominatifs et skill Claude en place. | Décision Léandre | Choisir la formulation à garder (texte validé = intouché par l'exécutant). |
| M3 | **Image de secours du buste** (`bust-designer.jpg`) : éclaboussure rose/turquoise, couleurs interdites par la DA (§3). Visible pendant le chargement de la 3D (≈ 1-2 s) et si WebGL est indisponible. | L2 / asset | Fournir/générer une version sans éclaboussure (buste sur fond nuit) à poser au même chemin. **✅ Clos : validé par Léandre le 26/10** (exception DA, `DA.md` §3). |
| M4 | **Accueil lourd** : 13 Mo (buste 7,7 Mo, physique 2,2 Mo, three 0,7 Mo). Lighthouse mobile 31-40 (LCP 12 à 63 s en 4G lente simulée, CPU ×4). | L2 | Déjà fait : images du hero déclarées dans le HTML, 3D lancée seulement au repos après `load`, fond d'atelier 1,3 Mo → 27 Ko. **Mesuré après :** FCP 1,6 s, LCP ≈ 5 s, CLS 0 (mêmes conditions). Pour viser ≥ 85 : alléger `bust.glb` (compression Draco/meshopt, textures) et la physique — décision de fond, après la mise en ligne. |
| M5 | **Open Graph des pages projet** : 4 pages (Lab Horizon, Micro-monde, Vill'âge Jeunes, Pacific Dataviz) ont un `og:image` **relatif** ; les autres pointent vers le placeholder de domaine. | L7 (déjà prévu) | À rendre absolus avec l'URL finale (étape 5 de L7). |

### Mineures

| # | Constat | Suite |
|---|---|---|
| m1 | « Ce que j'en retiens » absent (bloc masqué sans texte) : Lab Horizon, HyperLoop, Spring Boot, Pacific Dataviz, Borne. | Q7 — textes de Léandre, mise à jour à chaud possible. |
| m2 | Pacific Dataviz : violations d'accessibilité **dans** l'iframe Figma (externe). Le lien « Ouvrir la réalisation » reste disponible. | Aucune action possible côté portfolio. |
| m3 | Aucun geste de pigment propre à MagicalLab/Visualcom dans la zone hero (le pied de page en porte un) — positions occupées par le portail / le mockup. | À voir en retouche DA si souhaité. |
| m4 | Impression d'une page compétence du jury : feuille de style `@media print` en place, non revue visuellement à l'impression réelle. | À essayer une fois (Ctrl+P). |

## À vérifier après le déploiement (L7)

`/` 200 · `/jury`, `/pages/jury/index.html`, `/jury/fiches/visualcom/mission-reflection.pdf` **401** sans mot de passe · 200 avec (commande tapée par Léandre) · en-têtes CSP / HSTS / X-Frame-Options · URL inexistante → **404 personnalisée** · `sitemap.xml` : 13 `<loc>` · `PLAYWRIGHT_BASE_URL=<url> npm run test:e2e:prod` · dernier run GitHub Actions vert, y compris le run quotidien (non consultable depuis ce poste : dépôt privé, pas de `gh`).

## Verdict

Aucun bloquant restant côté code. **Prêt pour L7 (préprod Netlify).** M1 (captures), M2 et M3 demandent une décision ou un fichier de Léandre ; M4 est une amélioration de fond, pas un frein à la mise en ligne.
