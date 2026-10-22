# Vill’âge Jeunes — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `village-jeunes` · `/projects/village-jeunes` → `pages/projects/village-jeunes.html` (squelette à **réécrire**) |
| Statut | Vedette n° IV |
| Pigment | braise (`--color-project-village-jeunes`) |
| Année · contexte | 2026 · Alternance Visualcom — client : Vill’âge Jeunes, association rattachée à la DDEC |
| Démo | https://villagejeunes.nc/ (lien vers le site public uniquement) |
| Sources | `Fiche réflexive/Fiche projet Village Jeunes.docx`, fiche de réflexion (PDF jury) |

## ⚠ Confidentialité (client en production)

Uniquement l’accueil public et l’écran de connexion vide fournis. **Aucun** écran de l’espace staff, aucune donnée d’adhérent, aucune URL interne, aucun nom de personne.

## Contenu prêt à coller

**Cartel :** `N° IV · 2026 · Alternance Visualcom — client Vill’âge Jeunes (DDEC)` · stack `HTML · CSS · JavaScript (vanilla) · Documentation.js`

**H1 :** Vill’âge Jeunes

**Accroche :**
> Dématérialiser les inscriptions d’une association pour rendre du temps à l’humain. Une application web livrée en production, utilisée chaque jour par toute l’équipe.

**En bref**
- **Le besoin** — Les inscriptions et la gestion des adhérents se faisaient sur papier ; l’équipe voulait se concentrer sur l’accompagnement.
- **Mon rôle** — Maquette, UX/UI et développement front-end, au sein d’une équipe avec un chef de projet et un développeur full stack.
- **Le résultat** — Une V1 stable, utilisée par tout le staff : plus de 500 inscriptions dès le premier mois.

**Récit**
1. **Partir du terrain** — Cahier des charges avec le client, puis visite sur place pour valider le besoin et écouter les adhérents et le staff. Quelques questions simples (« quelles tâches vous pèsent aujourd’hui ? ») ont évité un parcours séduisant sur le papier mais inutilisé.
2. **Du papier au code** — Parcours dessiné à la main, zoning, wireframes puis maquette validée par le client. Les formulaires d’inscription ont été codés en premier : ils portent l’essentiel des données, ce qui a permis au back d’avancer en parallèle.
3. **Une interface par rôle** — Connexion, accueil selon le rôle, suivi des inscriptions en temps réel, accès rapide aux fiches adhérents et statistiques lisibles.
4. **Documenter pour passer le relais** — En alternance, je n’étais pas toujours là : j’ai documenté le front et le back (Documentation.js, en-tête dans chaque fichier) pour que l’équipe puisse reprendre le code sans moi.

**Ce que j’en retiens :**
> Le versioning et la documentation se décident au premier jour, pas quand le projet grossit. Et la suite est déjà pensée : une V2 en PWA, avec notifications pour les adhérents.

## Visuels (`src/assets/projects/village-jeunes/`)

| Emplacement | Fichier |
|---|---|
| Hero | `shots/village-jeunes-accueil-desktop.webp` dans le mockup laptop+phone (mode `shots`, comme Visualcom) avec `shots/village-jeunes-accueil-mobile.webp` |
| Récit 3 | `shots/village-jeunes-connexion-mobile-fourni.webp` (cadre téléphone) |
| Carrousel accueil | `cover.png` → convertir en `cover.webp` (lot L0) |

## DA spécifique

Braise : `underline-copper` sous le chiffre « 500 inscriptions » (mis en avant en grand, Ubuntu 700 + cartel). Ton humain, chaleureux.

## Interdits

Pas de lien vers le dépôt, pas de capture d’écran staff, pas de nom de personne. Ne pas lier la fiche jury depuis la page.
