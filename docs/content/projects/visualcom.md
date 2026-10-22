# Visualcom — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `visualcom` · `/projects/visualcom` → `pages/projects/visualcom.html` (**page existante, contenu validé**) |
| Statut | Majeur n° V (alternance) |
| Pigment | marbre (`--color-project-visualcom`) |
| Année · contexte | 2026 · Alternance Visualcom (Nouméa) |
| Site | https://visualcom.nc/ |
| Sources | page actuelle, `docs/content/visualcom-public.md`, fiches Visualcom (jury), `Liste des projets/Refonte Visualcom + MCP WordPress/docs/` |

## Ce qui change

**Le texte actuel de la page est conservé** (déjà validé, tests C5). Le travail est une **migration DA v3** :
- hero en « salle d’exposition » (cartel, faisceau, pigment marbre : `swipe-gold` très discret ou silhouette `smear-vertical-trio` recolorée `--color-marble-*`) ;
- toutes les captures en `.graded-image` ;
- **conserver** le mockup laptop+téléphone (`data-preview-mode="shots"`, `laptop-iphone-marble.png`, `mockup-screens.png`) et les classes testées (`project-stage`, `project-stage__compose`, `project-detail__mockup--laptop-phone`) ;
- ajouter un bloc « Le défi IA » avec le contenu ci-dessous (après « En bref »).

## Contenu à ajouter

**Cartel :** `N° V · 2026 · Alternance Visualcom` · stack `WordPress · thème sur mesure · PHP · GitHub · Claude / MCP`

**Bloc « Le défi IA » (H2 : Ouvrir WordPress à l’IA, sans ouvrir de brèche)**
> L’équipe voulait publier ses actualités depuis Claude. Les plugins IA testés exigeaient des droits administrateur : je les ai écartés. À la place, chaque membre a son propre compte, sa propre clé, un profil d’éditeur **sans droit de suppression**. Le serveur reste la seule source de vérité ; un skill Claude, pensé comme une interface, guide l’équipe vers les bonnes pratiques (SEO, accessibilité, images légères) avant même d’envoyer une demande.

**Puces « Ce que j’ai livré »** (vérifier qu’elles ne doublonnent pas le texte existant) :
- Thème WordPress sur mesure à la place d’Astra, blocs métier modifiables dans Gutenberg.
- Plugin de mise à jour du thème en un clic depuis la branche `main` du dépôt GitHub.
- Centaine d’actualités existantes conservées, nouvelles pages métier.
- Comptes nominatifs, clés d’application individuelles, droits limités.

## Visuels (`src/assets/projects/visualcom/`)

Existants (garder) : `desktop.png`, `mobile.png`, `mockup-screens.png`, `section-cap-pilote.png`, `section-expertises.png`. Nouveaux disponibles : `shots/visualcom-home-desktop(-full).webp`, `shots/visualcom-home-mobile(-full).webp` (scroll « long page » au survol), `logo-visualcom-blanc.svg` (cartel).

## Interdits

Ne pas nommer les collègues. Ne pas exposer de détail d’infrastructure (URL staging `refonte.visualcom.nc`, noms de clés, plugins de sécurité). Ne pas casser les tests C5.
