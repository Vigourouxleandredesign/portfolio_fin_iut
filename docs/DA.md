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

## 6. Pigment : gouache en relief & lavis

Les gestes reprennent les **6 références peinture fournies par Léandre** (coup de brosse chargé, raclée verticale multicolore, empâtement multicolore, éclaboussure, floraison aquarelle, tache à coulures). Les formes sont **originales** (générées, pas décalquées) mais suivent la structure de chaque référence. Deux registres :

- **Empâtement (gouache en relief)** : départ chargé et arrondi, stries de brosse, bords qui accrochent la lumière, queue qui s’effiloche en poils secs + éclats. Lumière du haut gauche, petit reflet ivoire `--color-light-beam` sur les crêtes, ombre portée douce.
- **Lavis (aquarelle)** : aplat translucide, pigment qui s’accumule sur le bord (liseré plus sombre), granulation, rayons/gouttes et coulures terminées par une perle.

**Vocabulaire (fichiers prêts à l’emploi dans `src/assets/decor/paint/`) :**

| Référence | Geste | Texture (`.webp`, relief inclus) |
|-----------|-------|-----------------------------------|
| Coup de brosse bleu | Coup de brosse chargé, horizontal | `swipe-copper`, `swipe-gold`, `swipe-phtalo` |
| (dérivé) | Soulignement | `underline-copper`, `underline-phtalo` |
| Raclée rose/turquoise | Raclée verticale 3 pigments, bas émietté | `smear-vertical-trio` |
| Empâtement multicolore | Grappe de coups de brosse diagonaux + trait ivoire + éclats — **pièce signature** | `impasto-cluster` |
| Éclaboussure rose | Éclaboussure aquarelle (corps, rayons, 2 fouets, embruns) | `splat-copper`, `splat-phtalo` |
| Floraison multicolore | Floraisons superposées phtalo → cuivre → or | `bloom-trio` |
| Tache jaune à coulures | Tache + coulures à perle (or → cuivre) | `drip-gold`, `drip-copper` |
| (ponctuation) | Gouttes | `droplets-gold` |

Chaque geste existe aussi en **silhouette vectorielle** : `src/assets/decor/paint/silhouettes/<nom>.svg` (un seul chemin, `fill="currentColor"`). Usages : `mask-image` (révéler une image ou un dégradé dans la forme d’une tache), icône inline recolorée au pigment du projet, animation `clip-path`/`mask-position` au survol.

**Règles d’emploi :**
- Texture : `<img src="…/swipe-copper.webp" alt="" aria-hidden="true" loading="lazy" decoding="async">` ou `background-image`. **Jamais** de `mix-blend-mode: screen` (la gouache est opaque).
- Phtalo : ajouter le reflet néon discret `filter: drop-shadow(0 0 14px color-mix(in srgb, var(--color-pigment-phtalo-glint) 28%, transparent))`.
- Silhouette recolorée : `background: var(--color-pigment-…); mask: url(…/silhouettes/x.svg) center / contain no-repeat;`.
- Régénérer / ajouter un geste : `npm run decor:paint` (`scripts/generate-paint-decor.py` — Python 3 + numpy, opencv-python, scikit-image, pillow).
- Hérité DA v2, **à retirer lors de la migration de l’accueil** : `src/assets/decor/*-sketch.png`, `stroke-chalk.png`, `splash-ember.png`, `marble-touches.png`.

**Où :** sur le marbre et les bustes, en marge, sous un mot Updock, au survol d’une carte, et via le pinceau du curseur.
**Jamais :** sous un paragraphe, en fond de page, en rouge, texture trouée/craie sèche, plus de 2 pigments par zone.

**Pinceau du curseur (évolution) :** palette = `--color-splash-*` (repointés vers cuivre/or/phtalo dans `variables.css`) ; cible : trait plein qui s’affine en début/fin de geste (largeur pilotée par la vitesse), couleur qui glisse cuivre → or → phtalo, `mix-blend-mode: normal` (plus de `screen`), léger relief (ombre portée 1 px).

---

## 7. Composants (cible)

| Composant | Règle |
|-----------|-------|
| Bouton principal | Pilule `--color-ember`, texte `--color-bg`, Ubuntu 700 capitales `0.12em`, hauteur ≥ 48 px |
| Bouton secondaire | Pilule contour `--color-border`, texte `--color-marble` |
| Lien fort | Texte craie + `underline-copper.webp` dessous (apparition au survol) |
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
