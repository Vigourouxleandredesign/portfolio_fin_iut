# L5b — Finitions après inspection du 25/10

**Exécutant :** Claude Code **Sonnet** (ou Cursor agent) · **Durée :** ½ journée · **Dépend de :** L1–L5 (fusionnés) · **Branche :** `wp/L5b-finitions`
**Origine :** inspection du chef de projet le 25/10 (navigateur, 1440 px et 375 px, 19 pages). Chaque point indique la page, le constat et la correction attendue.

## Périmètre

`pages/projects.html` · `pages/projects/*.html` (blocs cités uniquement) · `pages/index.html` · CSS de page concernés (`src/styles/pages/home.css`, `project-detail.css` ou CSS de la page Visualcom) · `src/data/*` si le filtre du catalogue y est défini · tests feature correspondants. Suppression du dossier parasite `--version/` à la racine (créé par un `npx husky --version`, ignoré par git, inutile).

## 1. Visualcom — bloquant

1. **Supprimer** la carte « Fiche réflexion (évaluateurs) » et son texte « L’accès authentifié évaluateur … espace privé (Phase B) » (vestige de l’ère Supabase, faux aujourd’hui), ainsi que la mention « Phase B » du commentaire d’en-tête du fichier. Aucun lien vers `/jury` ni vers un PDF ne doit la remplacer (règle C12).
2. **Hero** : l’ambiance `project-stage__atmosphere` affiche `desktop.png` (capture du site Visualcom) — ses gros titres et sa barre de navigation (« Actualités, Nos solutions… ») apparaissent derrière le fil d’Ariane et le H1, à 1440 comme à 375 px. Remplacer l’image d’ambiance par un visuel **sans texte** (ex. `src/assets/hero/hero-atmosphere.jpg` — l’ambiance de l’accueil — en `.graded-image`, comme le gabarit des autres pages projet), ou à défaut flouter (`filter: blur()` ≥ 12 px) + assombrir jusqu’à rendre le texte illisible. Le mockup laptop + téléphone reste inchangé (tests C5).
3. **Version longue (accordéon « Lire la version longue »)** : appliquer les corrections de `docs/content/reflective-sheets-inventory.md` (tableaux Visualcom) au texte public — au minimum : « J’aurais donc 1 semaine … je pourrais » → « J’avais donc une semaine … je pouvais » ; « non-développer » → « non-développeurs » ; « fallut » → « fallu » ; « theme » → « thème » ; « j’ai du » → « j’ai dû » ; « a branch main » → « la branche main » ; « Viens maintenant » → « Viennent maintenant » ; « tout les jours » → « tous les jours » ; « été pluriel » → « été plurielle » ; « réfléchi différemment » → « réfléchie différemment » ; « les même contraintes » → « les mêmes contraintes ». Faire une recherche de chaque « Texte actuel » des tableaux et corriger toutes les occurrences présentes. Ne rien réécrire d’autre.

## 2. Accueil — majeur (mobile)

À 375 px, le buste 3D recouvre le sous-titre « Léandre Vigouroux — développeur web & webdesigner, Nouméa » (le socle du buste passe devant « Vigouroux — dé… »). Corriger en CSS (`home.css`) : sous-titre au-dessus du canvas (`position: relative; z-index`) **et** léger fond/ombre portée de lisibilité, ou réduire la hauteur du canvas sous 48 rem. Vérifier aussi 390 et 768 px. Ne pas toucher à la logique de `bust-hero`.

## 3. Catalogue et navigation — majeur (cohérence)

Les cartes du catalogue et la navigation « projet précédent / suivant » utilisent encore les anciens titres et descriptions. Aligner sur les pages :

| Carte | Titre | Ligne de description |
|---|---|---|
| I | Lab Horizon | La recherche calédonienne, enfin lisible : catalogue de publications vulgarisées et espace chercheur. |
| II | MagicalLab | Un laboratoire 3D immersif en React Three Fiber : entrez par le portail. |
| III | Micro-monde | Des fresques qui s’animent en réalité augmentée, directement dans le navigateur du téléphone. |
| IV | Vill’âge Jeunes | Dématérialiser les inscriptions d’une association : plus de 500 inscriptions dès le premier mois. |
| V | Visualcom | Refonte WordPress sur mesure et ouverture sécurisée à l’IA (Claude / MCP). |
| VI | HyperLoop NC | Un site vitrine Angular traduit en six langues, pour un réseau imaginaire mais crédible. |
| VII | Bibliothèque Spring Boot | Côté serveur : rôles, mots de passe chiffrés et rendu serveur en Spring Boot. |
| VIII | Pacific Dataviz Challenge | Finaliste 2025 : le réchauffement climatique et ses conséquences dans le Pacifique Sud, en données. |
| IX | Borne tactile 2BeAlive | Du croquis à l’usine : une borne à ticket conçue de bout en bout. |

- Mêmes titres dans le carrousel d’accueil (supprimer « (DDEC) » du titre de la carte ; il reste dans le cartel de la page projet) et dans tous les blocs `project-nav` (« HyperLoop » → « HyperLoop NC », « Projet Back (Spring Boot) » → « Bibliothèque Spring Boot », « Visualcom » partout).
- Filtre : ajouter les catégories **3D** et **Design produit** prévues par `docs/content/projects/_TEMPLATE.md` (§ Catalogue), avec l’affectation de ce tableau ; le filtre doit rester utilisable au clavier.
- `<title>` : suffixe `— Léandre Vigouroux` partout (à corriger : `projects.html`, `magicallab.html`, `visualcom.html` — titre Visualcom : `Visualcom — Léandre Vigouroux`).

## 4. Corrections de texte — mineur

- MagicalLab (2 occurrences) : « laisser cours à mon imagination » → « laisser libre cours à mon imagination ».
- Borne : légendes « Rendu 1 … Rendu 4 » → légendes descriptives d’après l’image (ex. « Borne en situation, point de vente », « Vue de face », …) — décrire ce qui est visible, ne rien inventer ; mêmes textes dans les `alt`.

## 5 bis. Poids des pages — relevé dans le build Netlify du 25/10

- `splash-ember.png` (720 ko) est encore dans le build alors que le brief d'accueil demandait de supprimer les décors DA v2 (`.home-decor--*`). Trouver la référence restante (`grep -rn "splash-ember" src pages`), la supprimer, puis supprimer le fichier s'il n'est plus utilisé.
- `logo-visualcom.png` (492 ko) : le remplacer par `logo-visualcom-blanc.svg` s'il convient, sinon le redimensionner à sa taille d'affichage ×2 et le convertir en WebP.
- `desktop.png` (449 ko) disparaît avec le point 1.2 si plus aucune page ne l'utilise.
- Ne pas toucher à `bust.glb` (7,9 Mo) ni à Rapier : ils sont mesurés en L8 (Lighthouse mobile) avant toute décision.

## 5. Tests

- Mettre à jour les tests feature qui figent les anciens titres (`projects-pages`, `home-featured-carousel`, `secondary-pages`, `project-template`) **en renforçant** : titres exacts du tableau §3, absence de « Phase B » et « évaluateur » dans `visualcom.html`, absence de « (DDEC) » dans le carrousel.
- Gate + E2E verts ; captures 1440 et 375 px de l’accueil, du catalogue et de Visualcom, ouvertes et vérifiées.

## Critères d’acceptation

- [ ] Plus aucun texte « Phase B / évaluateur » ni texte de capture lisible derrière le hero Visualcom.
- [ ] Sous-titre de l’accueil lisible à 375 px.
- [ ] Titres identiques entre catalogue, carrousel, navigation et H1 ; filtre à 5 catégories + « Tout ».
- [ ] Corrections de texte appliquées ; tests renforcés, gate + E2E verts.

## Prompt à coller

```
Tu es exécutant du lot L5b (finitions) du portfolio de Léandre. Applique le protocole commun de docs/work-packages/README.md. Lis la skill portfolio-da, docs/content/projects/_TEMPLATE.md, docs/content/reflective-sheets-inventory.md puis docs/work-packages/WP-L5b-finitions.md, et traite les points 1 à 5 dans l'ordre (un commit par point). Ne modifie aucun texte qui n'est pas cité dans le WP. Vérifie chaque correction visuelle sur des captures 1440 et 375 px que tu ouvres réellement. Termine par le rapport au format du README avec git diff --stat main.
```
