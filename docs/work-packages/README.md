# Lots exécutants — mode d’emploi

**Chef de projet :** Claude (cette conversation) · **Product owner :** Léandre · **Livraison : vendredi 30/10/2026**
Chaque lot (`WP-*.md`) contient : objectif, dépendances, périmètre de fichiers, étapes, critères d’acceptation et **un prompt prêt à coller**.

---

## Planning (heure de Nouméa)

| Jour | Lots | Exécutant conseillé | Parallèle ? |
|---|---|---|---|
| **Jeu 22/10** (soir) | L0 Préparation | Claude Code — **Haiku** | — |
| **Ven 23/10** | L1 Socle DA | Claude Code — **Sonnet** (ou Opus) | Non (fondation) |
| **Sam 24/10** | L2 Accueil · L4 Espace jury | L2 : Claude Code Sonnet · L4 : Cursor (agent) | **Oui** (branches séparées) |
| **Dim 25/10** | L3a Gabarit projet + Lab Horizon + catalogue | Claude Code Sonnet | Non (pose le gabarit) |
| **Lun 26/10** | L3b · L3c · L3d | 3 exécutants (Claude Code / Cursor) | **Oui** |
| **Lun 26/10** (soir) | L6 Captures restantes | Haiku + Léandre (téléphone) | Oui |
| **Mar 27/10** | L5 CV, contact, 404, SEO | Cursor ou Sonnet | — |
| **Mer 28/10** | L7 Déploiement Netlify (préprod) | Léandre + Haiku | — |
| **Jeu 29/10** | L8 Recette + corrections | Claude (chef de projet) + exécutant pour les correctifs | — |
| **Ven 30/10** | Mise en production + envoi du lien et du mot de passe jury | Léandre | — |

**Marge :** le jeudi 29 est la seule journée tampon. Si un lot glisse, on coupe d’abord L3d (pages bonus), jamais L4 (jury) ni L7 (déploiement).

## Graphe des dépendances

```
L0 → L1 → ┬→ L2 ─────────────┐
          ├→ L4 ─────────────┤
          └→ L3a → ┬→ L3b ───┤
                   ├→ L3c ───┼→ L5 → L7 → L8
                   └→ L3d ───┤
L6 (captures) ───────────────┘  (alimente L3a/L3d, peut arriver après : images remplacées à chaud)
```

---

## Protocole commun (s’applique à **tous** les lots)

1. **Avant de coder** : lire `AGENTS.md`, `docs/SECURITY.md`, `docs/DA.md`, la skill `docs/skills/portfolio-da/SKILL.md` (ou `/portfolio-da`), puis le WP et les briefs qu’il cite.
2. **Branche** : `git switch main && git pull --ff-only 2>/dev/null; git switch -c wp/<id>` (ex. `wp/L1-socle`). **Un commit quand le lot est terminé** (au minimum ; davantage si le WP découpe en étapes), message `feat(<id>): …` / `fix(<id>): …` / `test(<id>): …`. Le hook pre-commit lance `npm run ci` (≈ 70 s) : appeler `git commit` et `git merge` avec un timeout de 10 min (`timeout: 600000`).
3. **Périmètre** : ne modifier **que** les fichiers listés dans le WP. Besoin d’un autre fichier ? S’arrêter et l’écrire dans le rapport (« Hors périmètre demandé »).
4. **Interdits permanents** : couleurs hors `variables.css` ; `style=""` / `<style>` / `<script>` inline ; nouvelle dépendance non listée ; texte inventé (utiliser les briefs mot pour mot, `[À CONFIRMER]` → commentaire `<!-- TODO -->` et rien d’affiché) ; secrets ; supprimer ou affaiblir un test pour le faire passer.
5. **Tests** : tout comportement nouveau = au moins un test (Vitest dans `tests/feature` ou `tests/unit`). Un test qui fige une ancienne décision se met à jour **dans le même commit**, avec la raison dans le message.
6. **Gate (automatique)** : chaque commit et chaque fusion passent par le hook pre-commit = `npm run ci` (format, ESLint, Stylelint, typecheck, secrets, Vitest, build, E2E), le même pipeline que la CI GitHub. Avant de commiter : `npm run fix` puis `npm run ci`. Commit refusé → lire l’erreur, corriger, `git add`, recommiter (jamais `--amend` ; `--no-verify`, `-n`, `HUSKY=0` sont bloqués). Indexer **tous** les fichiers modifiés : le hook refuse les modifications non indexées. 2 tentatives max, puis s’arrêter et rapporter.
7. **Contrôle visuel** : `npm run dev`, capture 1440 px et 390 px des pages touchées (Playwright ou navigateur), comparées à la planche DA (`https://claude.ai/artifact/EHwa84DzhKMHbwXA9VuPUJ`, boards 05 et 06) et à la checklist `docs/DA.md` §9.
8. **Fusion** : si tout est vert, `git switch main && git merge --no-ff wp/<id>`. Conflit → **ne pas résoudre à l’aveugle** : s’arrêter et rapporter. Pas de `git push` (sauf L7).

## Format du rapport (à coller à Claude chef de projet)

```
LOT        : <id> — <titre>
BRANCHE    : wp/<id> (fusionnée : oui/non)
FAIT       : liste des étapes ✔ / ✘
FICHIERS   : créés / modifiés / supprimés
TESTS      : ajoutés / modifiés (+ raison)
GATE       : vert/rouge (+ erreur complète si rouge) · E2E : vert/rouge/non lancé
VISUEL     : chemins des captures 1440/390
TODO       : [À CONFIRMER] rencontrés, hors périmètre demandé, doutes
```

## Lots

| Id | Fichier | Titre |
|---|---|---|
| L0 | `WP-L0-preparation.md` | Préparation & nettoyage |
| L1 | `WP-L1-socle-da.md` | Socle DA (composants, polices, footer, garde-fous) |
| L2 | `WP-L2-accueil.md` | Accueil DA v3 |
| L3a | `WP-L3a-gabarit-lab-horizon.md` | Gabarit page projet + Lab Horizon + catalogue |
| L3b | `WP-L3b-micromonde-village-jeunes.md` | Micro-monde + Vill’âge Jeunes |
| L3c | `WP-L3c-visualcom-magicallab.md` | Visualcom + MagicalLab (migration) |
| L3d | `WP-L3d-secondaires.md` | HyperLoop, Spring Boot, Pacific Dataviz, Borne |
| L4 | `WP-L4-espace-jury.md` | Espace jury protégé |
| L5 | `WP-L5-cv-contact-404-seo.md` | CV, contact, 404, SEO |
| L6 | `WP-L6-captures.md` | Captures restantes |
| L7 | `WP-L7-deploiement.md` | Déploiement Netlify |
| L8 | `WP-L8-recette.md` | Recette finale |
