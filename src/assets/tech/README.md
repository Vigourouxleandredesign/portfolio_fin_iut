# Logos des technologies

Logos affichés sur les cartes de projets, le carrousel et les plaques de domaines (`.tech-logo`).

| Fichier | Marque | Origine |
|---|---|---|
| `react.svg`, `laravel.svg`, `docker.svg`, `threedotjs.svg` (Three.js), `blender.svg`, `javascript.svg`, `wordpress.svg`, `springboot.svg` (Spring Boot), `figma.svg` | React, Laravel, Docker, Three.js, Blender, JavaScript, WordPress, Spring Boot, Figma | [Simple Icons](https://simpleicons.org) **16.36.0**, licence **CC0 1.0** (paquet npm `simple-icons`, copié sans dépendance : `npm pack`, puis seuls les SVG utiles sont gardés) |
| `angular.svg` | Angular | Logo officiel fourni par Léandre (dégradé d'origine, métadonnées C2PA retirées) |

- Les SVG de Simple Icons sont monochromes : ils servent de masque (`mask-image`) et la couleur officielle de chaque marque est un jeton dans `src/styles/variables.css` (`--color-brand-*`).
- Les noms et logos sont des marques de leurs propriétaires respectifs ; ils ne servent ici qu'à désigner les technologies utilisées dans les projets.
- Ajouter un logo : copier le SVG ici, ajouter son jeton de couleur, sa règle dans `src/styles/components/tech-logo.css` et son entrée dans `tests/feature/tech-logos.test.ts`. Aucun fichier de ce dossier ne doit rester inutilisé (test).
