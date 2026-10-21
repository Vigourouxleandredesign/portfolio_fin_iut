# Direction artistique — « Le Sanctuaire nocturne » (v3, validée le 2026-10-21)

**Statut :** source de vérité visuelle. Obligatoire pour toute modification de `pages/`, `src/styles/`, `src/assets/` ou d’un visuel.
**Planche de référence (claude.ai, privée) :** « Planche DA — Portfolio Léandre » — 6 planches : manifeste, palette, lumière, typographie, pigment, application.
**Ordre de priorité si conflit :** `docs/SECURITY.md` → `docs/ARCHITECTURE.md` → **ce fichier** → `AGENTS.md`.

Skill opérationnel pour les agents : `docs/skills/portfolio-da/SKILL.md` (checklist + recettes prêtes à coller ; copie à placer dans `.claude/skills/portfolio-da/` pour que Claude Code le charge automatiquement).

---

## 1. Concept

Un temple antique abandonné, la nuit. Un seul faisceau de lumière (lueur de feu) tombe sur le marbre ; la poussière danse dedans. Sur la pierre, quelqu’un a peint à la **gouache épaisse** : cuivre, or patiné, vert phtalo.

- **Le marbre = le Developer** : l’ordre, la structure, la grille, les cartels, Ubuntu.
- **Le pigment = le Creative** : le geste, la matière, Updock, le pinceau du curseur.
- Le site raconte la rencontre des deux. Ton : surréaliste, sombre, premium, jamais gore, jamais criard.

**Règle d’or :** chaque écran est une scène → **un fond sombre + une source de lumière + un coup de pinceau**.

**Références :** Love, Death & Robots · Warhammer « Next Level » (clair-obscur, poussière, jets de lumière) · peinture expressive (inspiration Fortiche / Arcane **sans copier** : pas de néon rose/bleu, pas de graffiti) · Nolan, *L’Odyssée* (étalonnage pellicule 65 mm : feu ambré, ombres acier, désaturé, grain).

---

## 2. Éléments conservés (non négociables)

| Élément | Décision |
|---------|----------|
| Hero accueil | **Buste 3D fracturé** (`features/three-scene/bust-hero*`) conservé. On peut retravailler lumière, fond, ambiance. Ne pas le remplacer. |
| Pinceau du curseur | **Conservé** (`features/home-brush/`). Le concept reste : l’utilisateur peint sur la page. Rendu à faire évoluer vers la gouache (§6). |
| Logo | Monogramme LV en **or du logo** (`--color-logo`). C’est la seule signature : **pas de nom manuscrit**. |
| Typos | Ubuntu + Updock conservées, + **Ubuntu Mono** (nouveau) pour les métadonnées. |
| Projet mis en avant à l’accueil | Projets les plus **esthétiques** d’abord (Lab Horizon, MagicalLab, Micro-monde). |

---

## 3. Palette (tokens dans `src/styles/variables.css`)

| Famille | Token | Hex | Usage |
|---------|-------|-----|-------|
| Nuit | `--color-abyss` | `#060608` | Fonds les plus profonds, vignettes |
| | `--color-bg` | `#0c0b0e` | Fond de page |
| | `--color-surface` | `#151318` | Cartes, panneaux |
| | `--color-surface-elevated` | `#211e25` | Survols, éléments levés |
| | `--color-border` | `#2e2a33` | Filets |
| Texte | `--color-text` | `#f0eee9` | Texte principal |
| | `--color-text-muted` | `#a29e98` | Texte secondaire (7,4:1) |
| | `--color-text-faint` | `#8a858d` | Légendes décoratives uniquement |
| Lumière | `--color-light-fire` | `#e89e5c` | Clé : faisceau, poussière, reflets chauds |
| | `--color-light-beam` | `#f3e6cc` | Faisceau neutre (variante) |
| | `--color-light-steel` | `#789baf` | Contre-jour froid sur le bord opposé |
| Action | `--color-ember` | `#b8956c` | Boutons principaux (fond), liens forts |
| Marque | `--color-logo` | `#b78b1d` | Logo uniquement |
| Marbre | `--color-marble` / `-deep` / `-vein` / `-ink` | `#ece8e1` … | Plaques, buste, cartels clairs |
| Pigments | `--color-pigment-copper` (+ `-light` / `-dark`) | `#c8743f` | Gouache cuivre |
| | `--color-pigment-gold` (+ `-light` / `-dark`) | `#d9ae52` | Gouache or patiné |
| | `--color-pigment-phtalo` (+ `-light` / `-deep`) | `#0b4840` | Gouache vert phtalo (sombre) |
| | `--color-pigment-phtalo-glint` | `#3df2c0` | **Reflet néon** du phtalo : halos, liserés, puces |

**Dosage par écran :** ~80 % nuit · ~12 % lumière & marbre · ~6 % cendre (action) · **≤ 2 % pigment**.

**Interdits :** rose/fuchsia néon, bleu électrique, violet, **rouge sang** (le cramoisi est supprimé), aplats de pigment derrière du texte, plus de 2 pigments dans une même zone, couleurs hors `variables.css`.

### Pigment attitré par projet

| Projet | Token | Couleur |
|--------|-------|---------|
| Lab Horizon | `--color-project-lab-horizon` | reflet phtalo `#3df2c0` |
| MagicalLab | `--color-project-magicallab` | cuivre |
| Micro-monde | `--color-project-micromonde` | or patiné |
| Visualcom | `--color-project-visualcom` | marbre / craie |
| Vill’âge Jeunes | `--color-project-village-jeunes` | cendre |
| Projets secondaires (HyperLoop, Spring Boot, Pacific Dataviz, Borne) | `--color-project-secondary` | gris |

Le pigment du projet colore : le liseré du cartel, l’anneau/halo au survol de la carte, le coup de brosse du titre de sa page.

---

## 4. Typographie

| Voix | Police | Rôle | Règles |
|------|--------|------|--------|
| Structure (marbre) | **Ubuntu** 300/400/500/700 | Titres, texte, UI | Titres en 700 ; mots-structure en 300 capitales espacées (`letter-spacing ≥ 0.14em`) |
| Geste (pigment) | **Updock** | 1 à 2 mots décoratifs | ≥ 48 px ; **discret par défaut** : fin, légère inclinaison (-4° à -8°), cuivre/or/phtalo doux, opacité ~0,85 ; jamais un paragraphe, jamais un nom propre/signature |
| Cartel (étiquette d’œuvre) | **Ubuntu Mono** 400/700 | Dates, stack, numéros, labels | Capitales espacées `0.12–0.22em`, 12–14 px |

**Jeux typographiques validés :**
- **A · Collision** — un mot Updock chevauche un mot Ubuntu Bold (titres de section : « PROJETS *récents* »).
- **B · Gravure fantôme** — mot géant Ubuntu Bold en contour 1 px (`-webkit-text-stroke`, couleur `--color-border`), quasi invisible, derrière le titre (« SALLE I », « ATELIER »). `aria-hidden="true"`.
- **C · Lettres éclairées** — dégradé `background-clip: text` : la lumière touche le début du mot, la fin reste dans l’ombre (grands titres de page).
- **D · Cartel de musée** — bloc Ubuntu Mono avec liseré gauche au pigment du projet : `N° I — LAB HORIZON / 2026 · SAE 501 / React · Laravel · Docker`.
- **E · Numéros romains** — sections et étapes numérotées I, II, III en Ubuntu 300 très grand.

**Accessibilité :** le vrai texte reste en HTML (h1/h2). Un mot Updock décoratif dupliquant un titre porte `aria-hidden="true"` si le titre complet existe déjà en texte lisible.

---

## 5. Lumière & étalonnage « Odyssée »

1. **Une seule source** par écran : faisceau diagonal depuis le haut gauche, couleur `--color-light-fire`, flouté (`filter: blur`), `mix-blend-mode: screen`.
2. **Poussière** uniquement dans le faisceau, qui dérive lentement ; coupée sous `prefers-reduced-motion`.
3. **Contre-jour acier** (`--color-light-steel`) sur le bord opposé pour détacher le sujet.
4. **Vignette** : coins noyés au noir + brume au sol.
5. **Grain argentique** visible et irrégulier (8–13 %, overlay) sur toutes les pages (`.home-grain` à généraliser).

**Étalonnage des images** (toutes les photos/captures de projets, même en plein jour) :
`filter: brightness(.6–.75) contrast(1.2) saturate(.55–.6) sepia(.12)` + voile `linear-gradient` ambre en haut → bleu pétrole en bas (`mix-blend-mode: soft-light`). Au survol : +0,15 de luminosité.

**Buste 3D :** la lumière clé passe de `--color-ember` à `--color-light-fire`, ajout d’un rim `--color-light-steel` ; tone mapping ACES conservé.

---

## 6. Pigment : gouache en relief

**Matière :** gouache épaisse, coups de pinceau réels — arêtes en relief, stries de brosse, bords nets, **aucun trou**, extrémités effilées et épaisseur irrégulière. Lumière du haut gauche qui accroche les crêtes. Sur le phtalo, un **reflet néon** (`--color-pigment-phtalo-glint`) en halo discret.

**Vocabulaire (gestes autorisés) :**

| Geste | Fichier prêt à l’emploi (`src/assets/decor/paint/`) |
|-------|------------------------------------------------------|
| Coup de brosse chargé (départ épais, queue qui s’effiloche en poils secs + éclats) | `swipe-copper.svg`, `swipe-phtalo.svg`, `swipe-gold.svg`, `swipe-trio.svg` (cuivre + or + phtalo, pièce signature) |
| Raclée verticale au couteau, bords granuleux | `smear-copper-vertical.svg` |
| Soulignement | `underline-copper.svg`, `underline-phtalo.svg` |
| Éclaboussure (tache + pointes + gouttelettes) | `splatter-copper.svg`, `splatter-phtalo.svg` |
| Tache & coulures terminées par une goutte | `drips-gold.svg`, `drips-copper.svg` |
| Carrés au couteau | `knife-phtalo-cluster.svg`, `knife-gold-pair.svg` |
| Points & cercles | `dots-gold.svg`, `ring-phtalo.svg` |
| Craie / fusain (existant) | `src/assets/decor/*-sketch.png`, `stroke-chalk.png` |

Rendu : les coups de brosse et carrés ont un relief de gouache (filtre `impasto`) ; éclaboussures et coulures ont un rendu de tache marbrée plus plat (filtre `stain`). Le phtalo garde son halo néon.

Ces SVG contiennent leur propre filtre de relief et leurs dégradés : on les pose en `<img src alt="" aria-hidden="true">` ou en `background-image`, **sans** `mix-blend-mode: screen` (la gouache est opaque). Pour en créer d’autres : ajouter une entrée dans `scripts/generate-paint-decor.mjs` puis `node scripts/generate-paint-decor.mjs`.

**Où :** sur le marbre et les bustes, en marge, sous un mot Updock, au survol d’une carte, et via le pinceau du curseur.
**Jamais :** sous un paragraphe, en fond de page, en rouge, texture trouée/craie sèche, plus de 2 pigments par zone.

**Pinceau du curseur (évolution) :** palette = `--color-splash-*` (repointés vers cuivre/or/phtalo dans `variables.css`) ; cible : trait plein qui s’affine en début/fin de geste (largeur pilotée par la vitesse), couleur qui glisse cuivre → or → phtalo, `mix-blend-mode: normal` (plus de `screen`), léger relief (ombre portée 1 px).

---

## 7. Composants (cible)

| Composant | Règle |
|-----------|-------|
| Bouton principal | Pilule `--color-ember`, texte `--color-bg`, Ubuntu 700 capitales `0.12em`, hauteur ≥ 48 px |
| Bouton secondaire | Pilule contour `--color-border`, texte `--color-marble` |
| Lien fort | Texte craie + `underline-copper.svg` dessous (apparition au survol) |
| Carte projet (« œuvre ») | Image étalonnée (§5) + faisceau en coin haut gauche + vignette ; cartel Mono dessous (liseré pigment du projet) ; survol : carte qui se soulève de 10 px, liseré 1 px + halo au pigment du projet, coup de brosse au pigment qui apparaît en bas de l’image |
| Titre de section | Jeu A (collision) + gravure fantôme B optionnelle ; eyebrow en Mono cendre |
| Hero page projet | Image d’ambiance étalonnée plein cadre + titre Updock/Ubuntu (comme MagicalLab) + cartel + CTA démo |
| Footer / 404 | Logo or + un geste de pigment |

---

## 8. Registre « musée »

Projets = **œuvres** ; métadonnées = **cartels** ; sections = **salles** numérotées en romains. À doser : pas plus d’une mention « salle » par écran ; les libellés de navigation restent simples (« Mes projets », « Mon CV », « Contact »).

---

## 9. Checklist de recette DA (avant de valider une page)

- [ ] Fond nuit, une seule source de lumière visible, au moins un geste de pigment.
- [ ] Aucune couleur hors `variables.css` ; aucun rose/bleu/violet/rouge.
- [ ] Images projets étalonnées (désaturées, ambre/acier) — cohérentes entre elles.
- [ ] Updock : ≤ 2 mots, discret, jamais seul porteur d’information.
- [ ] Cartel Mono présent sur chaque projet (N°, année, contexte, stack).
- [ ] Contrastes texte ≥ 4,5:1 ; `prefers-reduced-motion` respecté (poussière, dérive, pinceau).
- [ ] Mobile (390 px) : décor réduit ou masqué, pas de scroll horizontal.
