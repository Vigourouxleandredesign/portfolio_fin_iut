# MagicalLab — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `magicallab` · `/projects/magicallab` → `pages/projects/magicallab.html` (**page existante, contenu validé**) |
| Statut | Vedette n° II |
| Pigment | cuivre (`--color-project-magicallab`) |
| Année · contexte | 2026 · Projet front IUT (LP MIAW) |
| Démo | https://magicallab.netlify.app/ (dépôt GitHub public, accepté) |
| Stack réelle | React 19 · React Three Fiber · drei · Rapier · postprocessing · Leva · Vite |

## Intention (inchangée)

Projet académique → place au côté artistique et à l’expression du style. Refléter le côté un peu fou du projet (et du profil), pas une case study corporate.

## Ce qui est déjà en place (garder)

- Hero : fond `scene-portal.jpg`, titre Magical / Lab, portail 3D (`public/documents/elements/magic_portal.glb`, `[data-glb-showcase]`) comme accès à la démo — **pas** de mockup Mac (test C).
- Robot 3D (`robot.glb`) dans le corps ; crédit Sketchfab du portail : Nick Broad, *Magic Portal*, CC BY 4.0. Robot : **Komov (Sketchfab)** → afficher `Modèle 3D du robot : Komov, Sketchfab.` (décision de Léandre, 25/10 : citer la provenance, **sans lien**).
- Récit « un petit robot traverse une lumière… », commandes clavier (flèches, F), tests `magicallab-page.test.ts`.

## Migration DA v3

- Cartel : `N° II · 2026 · Projet front — IUT` · stack ci-dessus.
- Titre : Ubuntu 700 « Magical » + **un seul** mot Updock discret (« Lab ») au lieu d’un gros titre manuscrit ; dégradé cuivre doux.
- Gestes cuivre : `swipe-copper` derrière le titre, `splat-copper` en coin de la galerie.
- Images en `.graded-image` (les scènes sont déjà sombres : étalonnage léger).
- Nouvelle galerie « Dans la scène » : `shots/magicallab-scene-desktop.jpg` + `shots/magicallab-scene-mobile.jpg` (convertir en WebP au passage), plus `scene-lab-shelf.jpg`, `scene-ritual.jpg`.
- Année : passer de 2025 à **2026** (cohérence avec le carrousel).

## Hors scope

Pas de fiche de réflexion pour ce projet.
