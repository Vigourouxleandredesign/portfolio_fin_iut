# L0 — Préparation & nettoyage

**Exécutant :** Claude Code **Haiku** · **Durée :** 20 min · **Dépend de :** rien · **Branche :** `wp/L0-prep`

## Objectif

Repartir d’un repo propre : supprimer les fichiers périmés, convertir les dernières images lourdes, installer la skill DA pour Claude Code. **Aucune décision de design.**

## Périmètre (seuls fichiers autorisés)

- Suppressions listées ci-dessous · `src/scripts/entries/home.ts` (2 imports) · `pages/projects/hyperloop.html` (chemins d’images) · `.claude/skills/portfolio-da/SKILL.md` (copie) · nouveaux `.webp` listés.

## Étapes

1. Supprimer :
   - `../prompt-haiku-nettoyage.md`
   - `scripts/generate-paint-decor.mjs` (remplacé par `scripts/generate-paint-decor.py`)
   - les **15 anciens SVG** à la racine de `src/assets/decor/paint/` : `dots-gold.svg drips-copper.svg drips-gold.svg knife-gold-pair.svg knife-phtalo-cluster.svg ring-phtalo.svg smear-copper-vertical.svg splatter-copper.svg splatter-phtalo.svg swipe-copper.svg swipe-gold.svg swipe-phtalo.svg swipe-trio.svg underline-copper.svg underline-phtalo.svg`
   - ⚠ **Ne pas toucher** `src/assets/decor/paint/silhouettes/` ni les `.webp`.
2. Convertir en WebP (qualité 82, largeur max 1600, Pillow : `pip install pillow` si besoin) :
   - `src/assets/projects/micromonde/cover.png` → `cover.webp`
   - `src/assets/projects/village-jeunes/cover.png` → `cover.webp`
   - `src/assets/projects/magicallab/shots/magicallab-scene-desktop.jpg` et `-mobile.jpg` → `.webp`
   Puis mettre à jour les 2 imports de `src/scripts/entries/home.ts` (`cover.png` → `cover.webp`) et supprimer les `.png`/`.jpg` d’origine.
3. HyperLoop : dans `pages/projects/hyperloop.html`, remplacer `cover.jpg` → `reference-train.webp`, `class-premium.jpg` → `classe-premium.webp`, `welcome-agent.jpg` → `accueil-agent.webp` (mêmes dossiers) ; mettre à jour `width`/`height` si présents ; supprimer les 3 anciens fichiers.
4. Copier `docs/skills/portfolio-da/SKILL.md` vers `.claude/skills/portfolio-da/SKILL.md` (créer le dossier).
5. Vérifier qu’aucune référence morte ne subsiste :
   `grep -rnE "cover\.png|class-premium\.jpg|welcome-agent\.jpg|hyperloop/cover\.jpg|generate-paint-decor\.mjs|paint/[a-z-]+\.svg" pages src tests scripts package.json docs` → seules lignes acceptées : `paint/silhouettes/…svg` et des mentions dans `docs/`.
6. `npm run gate` puis `npm run test:e2e`.
7. Commit `chore(L0): remove stale paint svgs and old generator, webp conversions, install DA skill` puis fusion dans `main`.

## Critères d’acceptation

- [ ] Gate et E2E verts.
- [ ] `src/assets/decor/paint/` ne contient plus que 13 `.webp` + `silhouettes/` (13 `.svg`).
- [ ] Plus aucun `.png` de couverture Micro-monde / Vill’âge Jeunes ; images HyperLoop en `.webp`.
- [ ] `.claude/skills/portfolio-da/SKILL.md` présent.

## Prompt à coller (Claude Code, modèle Haiku, à la racine du repo)

```
Tu es exécutant du lot L0 du portfolio. Lis docs/work-packages/README.md (protocole commun) puis docs/work-packages/WP-L0-preparation.md, et exécute les étapes 1 à 7 dans l'ordre, sans rien faire d'autre. Tu ne prends aucune décision de design. Si une étape échoue, note-la et passe à la suivante, sauf le gate : s'il est rouge, tente une seule correction (référence vers un fichier supprimé ou renommé), puis arrête-toi. Termine par le rapport au format du README.
```
