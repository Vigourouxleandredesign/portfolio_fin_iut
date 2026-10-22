# Gabarit commun — pages projet (DA v3)

Toutes les pages `pages/projects/<slug>.html` suivent cette structure. Chaque brief `docs/content/projects/<slug>.md` donne le **contenu** ; ce fichier donne la **forme**.

## Ordre des sections

1. **Hero « salle d’exposition »** — fond nuit, faisceau `.light-beam` haut gauche, visuel principal en `.graded-image`, geste de pigment du projet (texture `.webp` de `docs/DA.md` §6, couleur = pigment attitré).
   - Cartel (`.cartel.cartel--<slug>`) : `N° <romain> · <année> · <contexte>` + stack en `Ubuntu Mono`.
   - H1 = nom du projet (Ubuntu 700) ; **un seul** mot Updock maximum (`.section-title__gesture`), optionnel.
   - Accroche (1–2 phrases), CTA principal (démo ou site) + lien « Retour aux projets ».
2. **En bref** — 3 puces maximum (problème · ce que j’ai fait · résultat).
3. **Récit** — 2 à 4 blocs courts (titre H2 + 1 paragraphe + visuel), alternés image/texte, images toujours en `.graded-image` avec `alt` descriptif.
4. **Galerie / démo** — mockups, captures `shots/`, showcase 3D si prévu.
5. **Ce que j’en retiens** — 1 paragraphe (ton personnel, sans copier la fiche réflexive).
6. **Navigation projets** — `← projet précédent · Tous les projets · projet suivant →` (ordre du catalogue).

## Règles

- Textes : **copier tel quel** le contenu « prêt à coller » des briefs. `[À CONFIRMER]` = ne pas publier la phrase tant que Léandre n’a pas répondu (laisser un commentaire HTML `<!-- TODO … -->`).
- Images : uniquement `src/assets/projects/<slug>/` ; `width`/`height` explicites ; `loading="lazy"` sauf l’image du hero ; `decoding="async"`.
- Captures `*-full` : cadre fixe (ratio 16/10 desktop, 9/19,5 mobile) + `object-fit: cover; object-position: top` ; défilement au survol autorisé (CSS seulement, désactivé en `prefers-reduced-motion`).
- Liens externes : `target="_blank" rel="noopener noreferrer"` + mention visible « (nouvel onglet) » en `visually-hidden`.
- Aucun lien vers les PDF du jury depuis une page projet (la page jury pointe vers la page projet, pas l’inverse).
- Méta : `<title>` = `<Projet> — Léandre Vigouroux`, `<meta name="description">` = l’accroche, `og:title` / `og:description` identiques, `og:image` = visuel hero (chemin build).
- Pigments : Lab Horizon = phtalo glint · MagicalLab = cuivre · Micro-monde = or patiné · Vill’âge Jeunes = braise · Visualcom = marbre · secondaires (HyperLoop, Spring Boot, Pacific Dataviz, Borne) = `--color-project-secondary`.

## Catalogue (`pages/projects.html`) — ordre et statut

| N° | Slug | Statut | Catégorie filtre |
|---|---|---|---|
| I | `lab-horizon` | Vedette (page à **créer**) | Développement web |
| II | `magicallab` | Vedette | Développement web · 3D |
| III | `micromonde` | Vedette | Dispositifs interactifs · 3D |
| IV | `village-jeunes` | Vedette | Développement web |
| V | `visualcom` | Majeur (alternance) | Développement web |
| VI | `hyperloop` | Secondaire | Développement web |
| VII | `back-springboot` | Secondaire | Développement web |
| VIII | `pacific-dataviz` | Bonus | Webdesign & UI/UX |
| IX | `borne-2bealive` | Bonus | Design produit · 3D |

Accueil : carrousel des 4 vedettes (I → IV).
