# L1 — Socle DA (composants partagés, polices, footer, garde-fous)

**Exécutant :** Claude Code **Sonnet** (Opus si dispo) · **Durée :** ½ journée · **Dépend de :** L0 · **Branche :** `wp/L1-socle`

## Objectif

Créer **une fois** les briques visuelles de la DA v3 que tous les lots suivants réutilisent, et poser des tests qui empêchent les dérives de couleur et de structure. Après L1, les autres lots **ne créent plus de composant partagé**.

## Périmètre

- Créer : `src/styles/components/graded-image.css`, `cartel.css`, `section-title.css` (collision + `.ghost-word`), `light-beam.css` (+ poussière), `paint.css` (gestes de pigment), `page-hero.css` (hero « salle d’exposition » commun aux pages internes).
- Modifier : `src/styles/fonts.css`, `src/styles/components/button.css`, `site-header.css`, `site-footer.css`, `clients-marquee.css` (uniquement les `#000` du masque → mot-clé `black`), toutes les entrées `src/scripts/entries/*.ts` (imports CSS), le **footer** de chaque page `pages/**/*.html`, `package.json` / `package-lock.json` (une dépendance).
- Tests : `tests/feature/design-guards.test.ts` (nouveau).
- **Ne pas** modifier le contenu des pages (sauf footer), `variables.css`, `tokens.css`, ni la logique TS.

## Étapes

1. **Police mono** : `npm i @fontsource/ubuntu-mono` (validé par Léandre le 22/10), importer les graisses 400 et 700 dans `src/styles/fonts.css`. Les fichiers sont **auto-hébergés** (copiés par Vite dans `dist/`, aucun appel à Google Fonts — la CSP l’interdirait). Variante acceptée si Léandre fournit ses propres `.woff2` : les placer dans `src/assets/fonts/` avec un `@font-face` (`font-display: swap`) dans `fonts.css` — vérifier d’abord que la licence autorise l’usage web (Ubuntu Font Licence : oui). `--font-mono` existe déjà dans `tokens.css`.
2. **Composants** — implémenter exactement les recettes de `docs/skills/portfolio-da/SKILL.md` :
   - `.graded-image` / `.graded-image__img` (étalonnage Odyssée, survol +0,15 de luminosité) ;
   - `.cartel` + modificateurs `--lab-horizon --magicallab --micromonde --visualcom --village-jeunes --secondary` (via `--cartel-pigment`) ;
   - `.section-title`, `.section-title__main`, `.section-title__gesture` (Updock, rotation −5°, dégradé cuivre via tokens), `.ghost-word` (masqué < 48rem) ;
   - `.light-beam` + `.light-beam__dust` (points `--color-light-fire`, dérive 6–14 s, **désactivée** en `prefers-reduced-motion`) ;
   - `.paint` (positionnement absolu, `pointer-events: none`, `aria-hidden` côté HTML), variantes de taille `--sm --md --lg`, `.paint--phtalo` (drop-shadow glint de `docs/DA.md` §6), `.paint-mask` (silhouette recolorée : `background: var(--paint-color); mask: var(--paint-mask) center / contain no-repeat;` avec `-webkit-mask`), masqué ou réduit < 48rem ;
   - `.page-hero` (gabarit hero des pages internes : fond nuit, faisceau, image `.graded-image`, zone cartel + titre + accroche + CTA ; 1 colonne < 48rem).
3. **Boutons** (`button.css`) : principal = pilule `--color-ember`, texte `--color-bg`, Ubuntu 700 capitales `0.12em`, hauteur ≥ 48 px ; secondaire = pilule contour `--color-border`, texte `--color-marble`. Focus visible.
4. **Header / footer** : DA v3 (fond `--color-abyss`, filet `--color-border`, logo or). Dans le footer de **chaque** page (`pages/index.html`, `projects.html`, `cv.html`, `contact.html`, `pages/projects/*.html`), colonne « Plan du site », ajouter :
   `<li><a href="/jury">Espace jury<span class="visually-hidden"> (accès protégé par mot de passe)</span></a></li>`
   + un geste de pigment discret dans le footer (`underline-copper.webp`, `aria-hidden`).
5. **Imports** : chaque entrée `src/scripts/entries/*.ts` importe `fonts.css`, `variables.css`, `tokens.css`, `base.css`, `layout.css`, puis les nouveaux composants dont la page a besoin (au minimum `graded-image`, `cartel`, `section-title`, `paint`, `button` ; `page-hero` + `light-beam` pour les pages internes). Ordre : variables → tokens → base → layout → components → pages.
6. **Garde-fous** — `tests/feature/design-guards.test.ts` :
   - C10 : aucun `#hex`, `rgb(`, `rgba(`, `hsl(` dans `src/styles/**/*.css` **sauf** `variables.css` ;
   - C11 : aucune page `pages/**/*.html` ne contient `style="`, `<style` ou un `<script` sans `src` ;
   - C12 : chaque page publique (hors `pages/jury/`) contient `href="/jury"` dans son footer et **aucun** lien vers `/jury/fiches/` ;
   - C13 : `fonts.css` importe Ubuntu, Updock et Ubuntu Mono.
7. `npm run gate` + `npm run test:e2e` (axe : contrastes des nouveaux boutons) + captures 1440/390 de l’accueil et d’une page projet (seul le footer/boutons doivent avoir changé).

## Critères d’acceptation

- [ ] Les 6 fichiers composants existent, sans couleur en dur, chacun avec en-tête JSDoc ligne 1.
- [ ] C10–C13 verts, gate et E2E verts.
- [ ] Lien « Espace jury » dans le footer de toutes les pages publiques.
- [ ] Aucune régression visuelle hors header/footer/boutons.

## Prompt à coller (Claude Code, Sonnet)

```
Tu es exécutant du lot L1 (socle DA) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis AGENTS.md, docs/SECURITY.md, docs/DA.md (§3 à §9), utilise la skill portfolio-da (docs/skills/portfolio-da/SKILL.md) puis suis docs/work-packages/WP-L1-socle-da.md étape par étape. Tu crées uniquement les composants partagés, le footer avec le lien Espace jury et les tests garde-fous ; tu ne refais aucune page (les lots suivants s'en chargent). Toute couleur passe par les tokens de src/styles/variables.css. Termine par le rapport au format du README.
```
