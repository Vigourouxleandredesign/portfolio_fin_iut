# L7s — URGENT : protection réelle de l'espace jury (Edge Function)

**Exécutant :** Claude Code **Sonnet** · **Durée :** 1 h · **Priorité : bloquante, avant tout autre lot** · **Branche :** `wp/L7s-protection-jury`

## Constat (chef de projet, 25/10, 17 h 50, site https://vigourouxleandre.netlify.app)

Sans identifiants, et même avec de **faux** identifiants, `/jury`, `/jury/developpement-front`, `/pages/jury/index.html`, `/pages/jury/` et les PDF `/jury/fiches/**` répondent **200**. Les en-têtes `X-Robots-Tag` et `Cache-Control: private` injectés par `_headers` sont bien servis, mais **pas** l'authentification.

**Cause :** la règle `Basic-Auth` de `_headers` n'est appliquée par Netlify que sur les offres **Pro et Enterprise** (doc Netlify « Basic authentication with custom HTTP headers »). Le site est sur l'offre gratuite : la ligne est ignorée en silence. Erreur de conception du chef de projet, pas des exécutants.

## Solution

Une **Netlify Edge Function** (disponible sur l'offre gratuite) qui exige l'authentification HTTP Basic sur les chemins du jury, avant le cache, à chaque requête. La variable `JURY_BASIC_AUTH` (déjà créée par Léandre) reste la seule source du mot de passe.

## Périmètre

Créer `netlify/edge-functions/jury-auth.ts`, `netlify/edge-functions/lib/basic-auth.ts` (logique pure, testable), `tests/unit/edge-jury-auth.test.ts`, `tests/e2e/jury-protection.prod.spec.ts`. Modifier `netlify.toml` (déclaration de la fonction si nécessaire), `scripts/inject-jury-auth.mjs` (commentaire uniquement : la règle `_headers` reste, mais n'est plus la protection principale), `tsconfig*.json` / `eslint.config.js` seulement si le nouveau dossier doit y être inclus ou exclu, `docs/SECURITY.md` (§0 et §7), `docs/TESTING.md`. **Aucune nouvelle dépendance** : pas de paquet `@netlify/edge-functions`, typer localement le strict nécessaire (`declare const Netlify: { env: { get(name: string): string | undefined } }`).

## Étapes

1. **Logique pure** (`lib/basic-auth.ts`), sans dépendance à Deno ni à Netlify :
   - `parseBasicAuth(header: string | null): string | null` : renvoie `user:password` décodé depuis `Basic <base64>`, `null` si absent, mal formé ou base64 invalide (jamais d'exception) ;
   - `safeEqual(a: string, b: string): boolean` : comparaison en temps constant (parcours de la longueur max, XOR des codes, longueur comparée à la fin) ;
   - `isAuthorized(header, expected): boolean` : `false` si `expected` est vide ou absent.
2. **Edge Function** (`jury-auth.ts`) :
   - lit `Netlify.env.get("JURY_BASIC_AUTH")` ; si absente → **503** `Cache-Control: no-store` (jamais de passage en clair) ;
   - autorisé → `context.next()`, puis ajoute `Cache-Control: private, no-store` et `X-Robots-Tag: noindex, nofollow` à la réponse ;
   - sinon → **401**, corps texte court en français, en-têtes `WWW-Authenticate: Basic realm="Espace jury", charset="UTF-8"` et `Cache-Control: no-store` ;
   - `export const config = { path: ["/jury", "/jury/*", "/pages/jury", "/pages/jury/*"] }` ; ne **pas** activer de cache sur la fonction.
3. **Tests unitaires** (Vitest) : en-tête absent, mauvais schéma (`Bearer`), base64 invalide, mauvais mot de passe, mot de passe d'une longueur différente, bon couple → autorisé ; `expected` vide → refusé. Le mot de passe de test est une valeur factice générée dans le test, pas un vrai secret (règle `check:secrets`).
4. **Test E2E post-déploiement** (`jury-protection.prod.spec.ts`, ignoré si `PLAYWRIGHT_BASE_URL` est absent) : avec l'API `request` de Playwright, **sans** identifiants, chacun de ces chemins doit répondre 401 : `/jury`, `/jury/`, `/jury/developpement-front`, `/pages/jury/`, `/pages/jury/index.html`, `/pages/jury/developpement-front.html`, `/jury/fiches/visualcom/mission-reflection.pdf`, `/jury/fiches/village-jeunes/project-sheet.pdf` ; avec de **faux** identifiants (`nobody:wrong`) : 401 aussi ; et `/`, `/projects`, `/cv` : 200. Le test n'utilise **jamais** le vrai mot de passe.
5. **Docs** : `SECURITY.md` §0 (la protection est l'Edge Function ; `_headers` Basic-Auth ne fonctionne que sur Pro ; scope de la variable), §7 (procédure de vérification) ; `TESTING.md` (nouveaux tests).
6. `npm run ci` vert, commit `fix(security): enforce jury Basic-Auth with a Netlify Edge Function`, fusion `--no-ff`, **`git push origin main`** (exception autorisée : correctif de sécurité en production).
7. Après le déploiement Netlify : `PLAYWRIGHT_BASE_URL=https://vigourouxleandre.netlify.app npx playwright test tests/e2e/jury-protection.prod.spec.ts` → tout vert. Rapporter la sortie.

## Action de Léandre (avant l'étape 7)

Netlify › *Site configuration* › *Environment variables* › `JURY_BASIC_AUTH` › *Edit* › **Scopes : All scopes** (au minimum *Builds* + *Functions*), sinon l'Edge Function ne voit pas la variable et répondra 503.

## Critères d'acceptation

- [ ] Les 8 chemins jury → 401 sans identifiants et avec de faux identifiants ; 200 avec les vrais (vérifié par Léandre dans son navigateur).
- [ ] Pages publiques inchangées (200) ; tests unitaires et E2E prod verts.
- [ ] Aucun mot de passe réel dans le code, les tests, les logs ou le rapport.

## Prompt à coller

```
URGENT — Tu es exécutant du lot L7s (protection réelle de l'espace jury) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md puis docs/work-packages/WP-L7s-protection-jury.md, étapes 1 à 6. N'ajoute aucune dépendance. Ne lis et n'affiche jamais de fichier .env ni la valeur de JURY_BASIC_AUTH ; n'écris jamais de vrai mot de passe dans un fichier, un test ou le terminal. Après le push, dis-moi de vérifier le scope de la variable sur Netlify, attends ma confirmation que le déploiement est terminé, puis fais l'étape 7. Termine par le rapport au format du README.
```
