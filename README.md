# Portfolio de Léandre Vigouroux

Portfolio de fin de licence professionnelle Métiers de l’informatique : applications web (LP MIAW), IUT de Nouvelle-Calédonie, 2026.

- **Site en ligne :** https://vigourouxleandre.netlify.app
- **Espace jury :** https://vigourouxleandre.netlify.app/jury (protégé par mot de passe, communiqué à part)

Site statique multipage, sans backend : neuf projets présentés comme les salles d’un musée de nuit, un buste 3D interactif sur ordinateur, un CV et un espace jury qui regroupe les fiches réflexives classées par compétence du référentiel.

## Stack

| Domaine | Choix |
|---|---|
| Build | Vite, TypeScript strict, une entrée par page (MPA) |
| Interface | HTML sémantique, CSS natif (variables de couleur centralisées), aucune bibliothèque d’interface |
| 3D | Three.js et Rapier (physique), chargés à la demande, jamais sur écran tactile |
| Polices | Ubuntu, Ubuntu Mono, Updock, auto-hébergées (`@fontsource`) |
| Hébergement | Netlify : en-têtes de sécurité, redirections, Edge Function d’authentification du jury |

## Démarrer

Prérequis : Node.js 20 ou plus (22 recommandé, voir `.nvmrc`), npm.

```bash
npm install          # installe aussi les hooks Git (Husky)
npm run dev          # http://localhost:5173/pages/index.html
npm run build        # build de production dans dist/
npm run preview      # prévisualise dist/
```

## Qualité et contrôle

Chaque commit passe par un hook pre-commit qui lance `npm run ci`, la même chaîne que GitHub Actions. Un contrôle rouge bloque le commit.

| Commande | Contenu |
|---|---|
| `npm run audit:ci` | Audit des dépendances, bloquant dès une faille haute ou critique |
| `npm run ci:static` | Prettier, ESLint (zéro avertissement), Stylelint |
| `npm run gate` | Typecheck, recherche de secrets, tests Vitest, build |
| `npm run test:e2e` | Tests Playwright (pages, parcours, accessibilité avec axe) |
| `npm run ci` | Tout ce qui précède, dans cet ordre |

GitHub Actions rejoue la chaîne à chaque push et chaque nuit, et Dependabot propose les mises à jour. Netlify ne publie que si l’audit et la gate passent.

## Sécurité

- Aucun secret dans le dépôt : le mot de passe du jury vit dans une variable d’environnement Netlify (`JURY_BASIC_AUTH`). Sans elle, la zone jury reste fermée (le build échoue).
- La zone `/jury` est protégée par une Edge Function (`netlify/edge-functions/jury-auth.ts`) qui normalise le chemin (casse, encodage, doubles barres) avant de vérifier l’authentification. Des tests de bout en bout vérifient le refus sur la production.
- Politique de sécurité du contenu stricte, HSTS, `X-Frame-Options: DENY`, `nosniff` (`public/_headers`).
- Détail : [docs/SECURITY.md](docs/SECURITY.md).

## Structure

```
pages/          HTML de chaque page (contenu en français, SEO)
  projects/     une page par projet
  jury/         espace jury (servi seulement après authentification)
src/
  styles/       CSS (couleurs dans variables.css uniquement)
  scripts/      TypeScript : une entrée par page, composants, fonctionnalités (3D, pinceau…)
  assets/       visuels importés par Vite
public/         en-têtes, redirections, CV, fiches PDF du jury, modèles 3D
netlify/        Edge Function d’authentification du jury
tests/          tests unitaires, de fonctionnalité et de bout en bout
scripts/        outils (vérification de secrets, captures, typographie française)
docs/           architecture, direction artistique, sécurité, tests, journal du projet
```

## Documentation

| Document | Contenu |
|---|---|
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architecture et conventions de code |
| [docs/DA.md](docs/DA.md) | Direction artistique |
| [docs/SECURITY.md](docs/SECURITY.md) | Sécurité |
| [docs/TESTING.md](docs/TESTING.md) | Stratégie de test |
| [docs/RECETTE.md](docs/RECETTE.md) | Recette avant mise en production |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Journal des décisions du projet |
| [AGENTS.md](AGENTS.md) | Règles suivies par les assistants IA sur ce dépôt |

## Méthode

Le projet a été mené avec des assistants IA encadrés : règles communes versionnées (`AGENTS.md`, `.cursor/rules/`), règles d’écriture vérifiées par un test, et une chaîne de contrôle automatique qui ne dépend pas de l’agent. Les contrôles qui tournent sur des machines restent l’arbitre final.
