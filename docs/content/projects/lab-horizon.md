# Lab Horizon (SAE 501) — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `lab-horizon` · `/projects/lab-horizon` → `pages/projects/lab-horizon.html` (**à créer**) |
| Statut | Vedette n° I (accueil + catalogue) |
| Pigment | phtalo glint (`--color-project-lab-horizon`) |
| Année · contexte | 2026 · SAE 501, LP MIAW — IUT de Nouvelle-Calédonie |
| Démo | **Aucune URL publique** (Netlify non à jour) → pas de bouton démo ; captures uniquement |
| Sources | `../../Projet SAE 501/README.md`, `docs/passation/*`, `docs/cahier_des_charges_v2.md`, `docs/project-map.md` |

## Intention

Montrer un vrai produit d’équipe, complet et sérieux, mais habillé comme une salle de musée scientifique : la recherche calédonienne rendue lisible. C’est la pièce « développeur » la plus solide du portfolio.

## Contenu prêt à coller

**Cartel :** `N° I · 2026 · SAE 501 — IUT de Nouvelle-Calédonie` · stack `React 19 · TypeScript · Laravel 12 · MySQL · Docker`

**H1 :** Lab Horizon

**Accroche :**
> La recherche calédonienne, enfin lisible. Un catalogue public de publications vulgarisées, un espace chercheur pour les relire, et toute la plateforme qui se relance en une commande.

**En bref**
- **Le problème** — Les travaux des chercheurs de Nouvelle-Calédonie sont publiés dans des canaux peu accessibles au grand public.
- **Ce que j’ai fait** — Développement front, UX/UI (maquettes, parcours utilisateur), architecture et documentation ; mise en place des outils anti-régression pour le développement assisté par IA et d’un processus de vérification sécurité avant la mise en production, inspiré de la CI/CD.
- **Le résultat** — Une plateforme livrée avec son dossier de passation : catalogue par domaine, fiche publication vulgarisée, espace chercheur et contrôles anti-régression.

**Récit**
1. **Rendre la science lisible** — Chaque publication a sa fiche : un résumé vulgarisé, une grille « Quoi / Qui / Quand / Labo » et le lien vers le document source. Le visiteur explore par domaine — biologie, chimie, géosciences, histoire, informatique, mathématiques, physique… — sans créer de compte.
2. **Un produit, pas une maquette** — Front React + TypeScript, API Laravel 12 avec authentification Sanctum, MySQL et Redis : tout tourne dans Docker derrière une seule adresse. Les publications peuvent être importées depuis HAL, l’archive ouverte nationale.
3. **Penser à l’équipe suivante** — Le projet est remis avec un dossier de passation (lancer, maintenir, faire évoluer). Avant chaque livraison, une commande `npm run gate` vérifie types, secrets, couleurs, tests et build : un garde-fou pensé comme une petite CI, qui empêche aussi le code produit avec une IA de faire régresser le projet.
4. **Ce qui reste à venir** — L’assistant conversationnel (RAG) et la PWA sont cadrés pour une V2 : la V1 se concentre sur un catalogue fiable.

**Ce que j’en retiens :** *(facultatif — phrase de Léandre attendue ; si elle n’est pas dans ce brief au moment du lot L3, **ne pas afficher ce bloc**, ne rien inventer)*

## Visuels (`src/assets/projects/lab-horizon/`)

| Emplacement | Fichier |
|---|---|
| Hero | `hero-laboratoire.webp` (1920×1080) |
| Récit 1 | grille `domaines/{biologie,chimie,geoscience,histoire,informatique,mathematiques,physique}.webp` (7 vignettes, légende = nom du domaine) |
| Récit 2 | `shots/lab-horizon-accueil-desktop.jpg` + `-mobile.jpg` (**à produire**, lot captures) |
| Récit 3 | `unc-recherche.webp` |
| Bandeau | `hero-biodiversite.webp` |
| Mobile | `shots/lab-horizon-domaine-mobile.webp` |
| Cartel | `logo-lab-horizon.svg` |

Captures : `docker compose up -d --build` dans `C:\Users\Léandre\Desktop\MIAW\Projet SAE 501`, puis `npm run shots -- lab-horizon` (cibles `/` et `/recherche`). **Jamais** l’écran de connexion rempli ni le compte seed.

## DA spécifique

Phtalo glint en accent (liserés de cartel, `drop-shadow` du pigment), geste `splat-phtalo` en coin du hero, grille des domaines en « vitrine » (fond `--color-surface`, filet `--color-border`, survol = halo phtalo).

## Interdits

Pas d’URL Netlify (obsolète). Ne pas citer `test@labhorizon.nc` ni aucun identifiant. Ne pas promettre le RAG/PWA comme livrés.
