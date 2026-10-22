# HyperLoop NC — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `hyperloop` · `/projects/hyperloop` → `pages/projects/hyperloop.html` (à **réécrire**) |
| Statut | Secondaire n° VI |
| Pigment | `--color-project-secondary` |
| Année · contexte | 2026 · Devoir Angular, LP MIAW |
| Démo | Aucune en ligne (lancement local `npm start` → `localhost:4200/fr/`) |
| Sources | `Liste des projets/Projet HyperLoop/Devoir_Hyperloop/README.md`, `Projet Hyperloop NC.pdf` |

## Contenu prêt à coller

**Cartel :** `N° VI · 2026 · Devoir Angular — LP MIAW` · stack `Angular · TypeScript · i18n (@angular/localize) · Vitest`

**H1 :** HyperLoop NC

**Accroche :**
> Et si un train à très grande vitesse reliait la Grande Terre et les îles ? Un site vitrine Angular, traduit en six langues, pour un réseau imaginaire mais crédible.

**En bref**
- **Le brief** — Afficher les tarifs selon le trajet et la classe, présenter chaque classe en images, les horaires au départ de chaque ville et plusieurs lignes, à partir de données JSON — et penser au tourisme.
- **Ce que j’ai fait** — Un site Angular avec des données JSON par ligne, des pages classes, tarifs et horaires, et une internationalisation native.
- **Le résultat** — Six langues : français, anglais, espagnol, japonais, vietnamien et chinois, avec un sélecteur de langue fonctionnel.

**Récit (2 blocs)**
1. **Penser au visiteur étranger** — L’i18n native d’Angular (`@angular/localize`) génère une version par langue ; le sélecteur bascule de `/fr/` à `/en-US/`, `/es/`, `/ja/`, `/vi/` ou `/zh/`.
2. **Le parcours avant l’illustration** — Le devoir portait sur le code, la structure, le parcours utilisateur et l’intégration, pas sur l’esthétique : les classes Standard, Confort et Premium sont mises en scène avec des visuels générés par IA, pour concentrer le travail sur une UX/UI propre et une navigation claire.

## Visuels (`src/assets/projects/hyperloop/`)

Hero : `reference-train.webp` · Galerie : `classe-standard.webp`, `classe-confort.webp`, `classe-premium.webp`, `accueil-agent.webp` · Mobile : `shots/hyperloop-home-mobile.webp`. **Supprimer** les anciens `class-premium.jpg`, `welcome-agent.jpg`, `cover.jpg` après remplacement (lot L0).
Mention sous la galerie (obligatoire) : « Tous les visuels sont générés par IA ou issus de banques d’images libres, elles-mêmes générées par IA : le devoir portait sur le code et le parcours, pas sur l’illustration. »

## Interdits

Ne pas présenter HyperLoop comme un vrai projet client.
