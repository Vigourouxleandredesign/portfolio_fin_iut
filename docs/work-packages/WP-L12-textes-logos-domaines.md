# L12 : textes sans tics d'IA, logos des technos, section « domaines » utile

**Exécutant :** Claude Code **Sonnet** · **Durée :** ½ journée · **Dépend de :** `main` à jour, **relecture de Léandre** sur `docs/content/relecture-textes.md` · **Branche :** `wp/L12-textes-logos-domaines`
**À livrer avant la mise en production du mercredi 28/10.** Un commit par partie.

## Partie 0 : documents

Sur `main`, avant la branche : `git add docs/ && git commit -m "docs: relecture des textes, lot L12"` (uniquement `docs/`).

## Partie A : textes (`docs/content/relecture-textes.md`)

1. Appliquer **chaque ligne** du tableau de la section 2 selon sa décision : ✅ = colonne « Après » ; ✏️ = colonne « Après » telle que Léandre l'a réécrite ; ❌ = ne rien changer. Ne réécrire **aucun** autre texte, ne pas « améliorer » au passage.
2. Les règles globales G-01 à G-08 s'appliquent à toutes les pages (`pages/**/*.html`), y compris `title`, `meta description`, `og:description`, `twitter:description`, `alt`, `aria-label`, légendes.
3. MM-03 et VJ-04 : masquer les deux blocs « Ce que j'en retiens » comme sur les autres pages (commentaire `<!-- TODO : texte de Léandre -->`, aucun texte d'attente).
4. Citations des fiches dans l'espace jury (`« … »`) : **intactes**, même si elles contiennent un tiret.
5. Le trait d'union reste partout où le français l'exige (`a-t-il`, `peut-être`, `front-end`, `2021-2022`, `c'est-à-dire`, `Nouvelle-Calédonie`…) : seul le tiret long `—` (U+2014) est supprimé.
6. Mettre à jour les tests qui figent les anciens textes (titres jury, cartels, liens des cartes…) **dans le même commit**, en vérifiant le nouveau texte exact, jamais en affaiblissant le test.

## Partie B : logos officiels des technos

Décision de Léandre (26/10) : sur les cartes, le carrousel et les plaques de domaines, les technos s'affichent par leur **logo officiel, dans ses couleurs officielles**.

1. **Source** : jeu **Simple Icons** (licence CC0, logos des marques sous leur forme officielle). Ne pas l'ajouter comme dépendance : `npm pack simple-icons@<dernière version>` dans un dossier temporaire, copier uniquement les SVG utiles dans `src/assets/tech/`, puis supprimer le dossier temporaire. Créer `src/assets/tech/README.md` : source, version exacte, licence CC0, rappel que les marques appartiennent à leurs propriétaires.
   **Angular** : utiliser le logo officiel fourni par Léandre (dégradé), `src/assets/tech/angular.svg`, **déjà déposé** par le chef de projet (le garder tel quel ; ses couleurs de dégradé deviennent des tokens dans `variables.css` si la règle des couleurs l'exige, sinon le documenter comme exception « logo de marque » dans le test de couleurs).
2. **Correspondance** (étiquette actuelle → logo) : React → `react` · Laravel → `laravel` · Docker → `docker` · « 3D web » (MagicalLab) → `threedotjs` · Blender → `blender` · « Vanilla JS » → `javascript` · WordPress → `wordpress` · Angular → `angular` (fichier de Léandre) · Spring Boot → `springboot` · Dataviz (Pacific Dataviz) → `figma`. Les étiquettes qui ne sont pas des marques (`AR`, `UI/UX`, `Motion`, `3D`, `UI`) restent en **texte**, dans la même pastille que les logos.
3. **Couleurs** : la couleur officielle de chaque marque (valeur hex fournie par Simple Icons) devient un token dans `src/styles/variables.css` (`--color-brand-react`, etc.) : la règle « couleurs uniquement dans variables.css » reste respectée. Les SVG Simple Icons sont monochromes : les intégrer en `<svg>` inline avec `fill="currentColor"` (ou en `mask-image`) et la couleur via le token. Pour que les logos noirs ou sombres (Three.js, Angular) restent lisibles sur fond nuit, chaque logo est posé sur une pastille claire (`--color-marble-*`), coins arrondis, 28 à 32 px.
4. **Accessibilité** : chaque logo porte le nom de la techno (`<title>` dans le SVG ou `role="img"` + `aria-label="React"`), et le nom apparaît au survol et au focus (infobulle CSS, pas d'attribut `title` seul). La liste reste une `<ul>` lisible par les lecteurs d'écran.
5. Tests : chaque carte du catalogue et du carrousel affiche au moins un logo ; chaque logo a un nom accessible ; aucun fichier de `src/assets/tech/` n'est inutilisé.

## Partie C : section « Ce que je sais faire » utile (décision B du 26/10)

1. **5 plaques** = les 5 catégories du filtre du catalogue : Dispositifs interactifs, Développement web, Webdesign et UI/UX, Design produit, Création 3D. La plaque « Animation 2D/3D » est fusionnée dans Création 3D (texte ACC-20). Disposition 3 + 2 centrée en desktop, une colonne en mobile.
2. Chaque plaque devient un **lien** vers le catalogue filtré : `/projects?domaine=<slug-de-catégorie>`. Contenu : titre, texte de la relecture (ACC-16 à ACC-20), **nombre de projets** du domaine (ex. « 3 projets », calculé à partir des catégories du catalogue et vérifié par un test), et jusqu'à 3 logos des technos de ces projets (partie B).
3. **Catalogue** : au chargement, le filtre lit `?domaine=` et sélectionne la catégorie (valeur inconnue → « Tout ») ; quand le visiteur change de filtre, l'URL est mise à jour avec `history.replaceState`. Le bouton actif garde `aria-pressed="true"`.
4. **Supprimer la bande vide** : l'image d'atelier ne doit plus occuper un écran entier au-dessus du titre. Elle reste en fond de la section, derrière les plaques, et la section prend la hauteur de son contenu.
5. Plaques : effet de survol et de focus visible (léger soulèvement + liseré cuivre), cible entière cliquable, ordre de tabulation logique.
6. Tests : 5 plaques, 5 liens valides, nombres corrects ; E2E : clic sur « Création 3D » → catalogue filtré sur 3D avec les bons projets.

## Partie D : retouche mobile de l'accueil

Sur téléphone (sans 3D), supprimer le grand vide (environ 150 px) entre « Creative » et l'image du buste : l'image prend la place de l'ancien canvas, le titre reste lisible. Vérifier à 375, 390 et 768 px.

## Partie E : garde-fous et règle d'écriture

1. Test feature `writing-guards.test.ts` sur le texte visible de `pages/**/*.html` (nœuds texte, `title`, `meta`, `alt`, `aria-label`), citations `« … »` de l'espace jury exclues : aucun `—` (U+2014), aucun ` & ` dans un texte, aucune graphie `UX/UI`.
2. `AGENTS.md` : ajouter une section « Règles d'écriture » reprenant le tableau « Règle retenue » de la section 1 de `docs/content/relecture-textes.md` (zéro tiret long, « et » au lieu de « & », pas de formule slogan ni d'antithèse « X, pas Y », pas d'adjectif emphatique, vouvoiement, minuscules sauf noms propres, aucun texte à la première personne inventé pour Léandre).

## Fin de lot

- `npm run ci` vert ; captures 1440 et 390 px de l'accueil, du catalogue (avec `?domaine=creation-3d` par exemple), de Visualcom et d'une page jury, **ouvertes et vérifiées**.
- `git push origin main` (autorisé) ; après déploiement : `PLAYWRIGHT_BASE_URL=https://vigourouxleandre.netlify.app npm run test:e2e:prod` vert.
- Rapport au format du README, avec la liste des lignes de relecture appliquées (✅/✏️) et ignorées (❌).

## Prompt à coller

```
Tu es exécutant du lot L12 (textes sans tics d'IA, logos des technos, section domaines) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/relecture-textes.md puis docs/work-packages/WP-L12-textes-logos-domaines.md, et traite les parties 0, A, B, C, D et E dans l'ordre, un commit par partie. Pour les textes, applique uniquement le tableau de relecture selon la décision de chaque ligne, sans réécrire autre chose. Ne lis et n'affiche jamais de fichier .env ni de mot de passe. Termine par le rapport au format du README (ligne AUDIT comprise).
```
