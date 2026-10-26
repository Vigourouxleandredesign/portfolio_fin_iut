# L10 — Préparation de la mise en production (mardi 27/10)

**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ à 1 journée · **Dépend de :** L9 fusionné et poussé · **Branche :** `wp/L10-pre-prod`
**Source :** `docs/REDTEAM-2026-10-25.md` (P1-1 b, P2-1, P2-2, P2-5, P3-1). Un commit par partie. **Gel du contenu à la fin de ce lot.**

## Ordre et priorités

Faire les parties dans l'ordre. Si le temps manque, s'arrêter **après la partie 3** : les parties 4 et 5 peuvent glisser au 29/10 (mise à jour à chaud), pas les trois premières.

## 1. Déployer seulement ce qui passe les contrôles (P2-5) — XS

Netlify publie aujourd'hui avant la fin de la CI GitHub. Dans `netlify.toml` :
`command = "npm run audit:ci && npm run gate && node scripts/inject-jury-auth.mjs"` (`gate` contient déjà le build).
Conséquence voulue : une faille haute/critique ou un test rouge **bloque le déploiement** ; le site en ligne reste sur la dernière version saine. Garder `HUSKY = "0"`. Mettre à jour `docs/SECURITY.md` et `docs/TESTING.md` (une ligne chacun).

## 2. Une seule URL par page (P2-2) — S

- Liens internes (nav, pied de page, cartes, carrousel, `project-nav`, fil d'Ariane, CTA, 404, jury) → URL canoniques : `/`, `/projects`, `/projects/<slug>`, `/cv`, `/contact`, `/jury`, `/jury/<compétence>`.
- `public/_redirects` : **301** de `/pages/index.html`, `/pages/projects.html`, `/pages/projects/<slug>(.html)`, `/pages/cv(.html)`, `/pages/contact(.html)` vers l'URL canonique (règles explicites, **avant** les règles de réécriture 200 et avant la 404 finale). **Ne pas** rediriger les chemins jury (l'Edge Function doit continuer à les voir et à répondre 401).
- `vite preview` local : le plugin de `vite.config.ts` doit continuer à servir `/` ; ajouter au besoin la réécriture des URL propres pour que les E2E locaux passent.
- Tests : feature « aucun `href` interne en `/pages/` » ; E2E prod (fichier `*.prod.spec.ts`) « `/pages/projects/visualcom.html` → 301 vers `/projects/visualcom` ».

## 3. Accueil lisible sans JavaScript (P2-1) — S

- Les 17 images de l'accueil sans `src` (logos clients, couvertures du carrousel) : `src` écrit dans le HTML (chemins `/src/assets/...` résolus par Vite), le JS ne fait plus que les améliorer.
- Contenu visible par défaut : les animations « reveal » et le voile ne s'appliquent que si une classe `js` est posée sur `<html>` par le script d'entrée (`<html class="no-js">` remplacé au démarrage). Sans JS : aucun bloc à opacité 0, pas de voile.
- Test E2E : accueil avec `javaScriptEnabled: false` → toutes les images ont un `src` chargé, aucun élément de `main` à `opacity: 0`.

## 4. MagicalLab plus léger (P1-1 b) — M

- `robot.glb` (1,1 Mo, non compressé) et `magic_portal.glb` : même traitement que le buste (L-perf du 25/10) — textures en WebP 1024 px + Draco ; comparer le rendu avant/après en capture, rien ne doit changer à l'œil.
- `glb-showcase` : ne charger et n'initialiser chaque modèle qu'à l'approche de l'écran (`IntersectionObserver`, marge 200 px) ; au tactile, même règle que l'accueil (décision du 26/10) : image fixe du modèle si une capture existe (`shots/magicallab-scene-mobile.webp`), sinon chargement au clic sur un bouton « Afficher le modèle 3D ».
- Test de budget : poids max des deux GLB ; Lighthouse mobile MagicalLab (médiane de 3) dans le rapport.

## 5. Typographie française (P3-1) — S

- Script `scripts/fix-french-typography.mjs` : dans les nœuds **texte** des `pages/**/*.html` uniquement (jamais dans les attributs, `<script>`, `<style>`, `<code>`, `<pre>`, URL), insérer une espace fine insécable (U+202F) avant `; : ! ?` et à l'intérieur des « guillemets », espace insécable (U+00A0) entre un nombre et son unité (`500 inscriptions` reste tel quel ; `1,2 Mo`, `2 h`, `30 s`…). Idempotent.
- L'exécuter une fois, relire le diff (aucune URL ni heure `10:30` touchée), puis ajouter un test garde-fou qui échoue si une ponctuation double n'est pas précédée de l'espace attendue.

## Fin de lot

- `npm run ci` vert ; `git push origin main` (autorisé) ; après déploiement : `PLAYWRIGHT_BASE_URL=https://vigourouxleandre.netlify.app npm run test:e2e:prod` vert (jury 401 compris).
- Lighthouse mobile **et** desktop (médiane de 3) : accueil, MagicalLab, Lab Horizon, CV → tableau dans le rapport.
- Mettre à jour `docs/REDTEAM-2026-10-25.md` (statut de chaque point traité) et `docs/ROADMAP.md` (état « gel du contenu »).

## Prompt à coller

```
Tu es exécutant du lot L10 (préparation de la mise en production) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis docs/REDTEAM-2026-10-25.md puis docs/work-packages/WP-L10-pre-production.md et traite les parties 1 à 5 dans l'ordre, un commit par partie. Si une partie dépasse son effort prévu, termine proprement la partie en cours, arrête-toi après la partie 3 au plus tôt et rapporte ce qui reste. Ne touche jamais aux chemins jury ni à l'Edge Function, sauf pour vérifier qu'ils répondent toujours 401. Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport au format du README (lignes AUDIT et Lighthouse comprises).
```
