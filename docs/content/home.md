# Accueil — brief (DA v3)

**Fichier :** `pages/index.html` + `src/scripts/entries/home.ts` + `src/styles/pages/home.css`. **Ordre des sections inchangé**, contenu et habillage mis à jour. Les textes non cités ci-dessous restent **tels quels**.

## 1. Hero — buste 3D (conservé)

- Garder `bust-hero` (physique, orbite, chargement) **sans modification de logique**. Seulement : lumières selon `docs/DA.md` §5 (`createLights()` : key `--color-light-fire`, rim `--color-light-steel`) — lire les couleurs depuis les CSS variables au démarrage (pas de hex dans le TS).
- Titre conservé : « Creative / Developer ». « Creative » peut devenir le **seul** mot Updock de l’écran (discret, dégradé cuivre doux) ; « Developer » en Ubuntu 700.
- Sous-titre à ajouter sous le titre : `Léandre Vigouroux — développeur web & webdesigner, Nouméa`.
- Indication d’usage conservée (« Clic gauche : peindre — Clic droit : tourner le buste »), en cartel `Ubuntu Mono`.
- Ambiance : `hero-atmosphere.jpg` en `.graded-image`, faisceau `.light-beam` + poussière, un geste `impasto-cluster.webp` en bas à droite **derrière** le buste (pièce signature, une seule fois sur le site).
- **Supprimer** les décors DA v2 de l’accueil : `*-sketch.png`, `stroke-chalk.png`, `splash-ember.png`, `marble-touches.png` (classes `.home-decor--*`) → remplacés par les gestes §6 (max. 1 par section).

## 2. Pinceau du curseur (conservé, évolué)

Recette `docs/skills/portfolio-da/SKILL.md` › « Pinceau du curseur » : trait plein et opaque, largeur liée à la vitesse avec effilement début/fin, couleur cuivre → or → phtalo le long du trait, `mix-blend-mode: normal`. Garder l’API `initHomeBrush`, la désactivation `prefers-reduced-motion`, et le test `home-brush.test.ts`.

## 3. « Projets récents » — 4 vedettes

- Titre : `Projets` + mot geste `récents` (déjà en place, passer au style « collision » de la skill).
- Carrousel (`[data-project-carousel]`, composant existant) avec **4** diapositives dans cet ordre : **Lab Horizon, MagicalLab, Micro-monde, Vill’âge Jeunes**.
- Chaque diapositive = `.graded-image` + cartel au pigment du projet :

| Projet | Image | Cartel méta | Badge | Ligne |
|---|---|---|---|---|
| Lab Horizon | `projects/lab-horizon/hero-laboratoire.webp` | `N° I · 2026 · SAE 501` | React | La recherche calédonienne rendue lisible. |
| MagicalLab | `projects/magicallab/scene-portal.jpg` | `N° II · 2026 · Projet IUT` | React | Laboratoire 3D immersif en React Three Fiber. |
| Micro-monde | `projects/micromonde/cover.webp` | `N° III · 2026 · Nuit de la Science` | Blender | Des fresques qui s’animent en réalité augmentée. |
| Vill’âge Jeunes | `projects/village-jeunes/cover.webp` | `N° IV · 2026 · Alternance` | JS | 500 inscriptions dès le premier mois. |

- Mettre à jour `tests/feature/home-featured-carousel.test.ts` : 4 projets (ajout `lab-horizon`), toujours ni Visualcom ni Pacific Dataviz.

## 4. Collaborations (bandeau logos)

Conserver. Logos en niveaux de gris clair (`filter: grayscale(1) brightness(1.4)` + opacité 0,7), couleur au survol. Animation coupée en `prefers-reduced-motion`.

## 5. « Mon univers »

Remplacer le chapeau par :
> Infographiste webdesigner diplômé et développeur en licence professionnelle Applications web. Creative developer par conviction : le front par intérêt, la 3D par passion, des bases back (Spring Boot, Symfony) pour dialoguer avec toute la chaîne.

Les 3 cartes (Concevoir / Développer / Animer) restent ; style cartel + numéros `Ubuntu Mono`.

## 6. « Compétences » — plaques de marbre

Conserver les 6 plaques et leurs textes. Fond `marble-atelier-empty.jpg` en `.graded-image` ; supprimer les références au moodboard retiré. Un geste `smear-vertical-trio.webp` en marge gauche (masqué < 48rem).

## 7. CTA « Un projet en tête ? »

Conserver le texte. Geste `underline-copper.webp` sous « projet ».

## 8. Footer (toutes les pages)

Ajouter dans « Plan du site » : `Espace jury` → `/jury` + `<span class="visually-hidden"> (accès protégé par mot de passe)</span>`.
