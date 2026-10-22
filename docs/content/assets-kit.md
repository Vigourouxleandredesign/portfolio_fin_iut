# Kit d’assets — visuels prêts à intégrer

**Mis à jour :** 2026-10-21 · **Règle :** une page projet n’utilise **que** `src/assets/projects/<slug>/` (+ décor `src/assets/decor/paint/`). Toute image de projet passe par `.graded-image` (étalonnage « Odyssée », `docs/DA.md` §5).

Formats : WebP (q≈82), largeur max 1920, EXIF retiré. Les captures `shots/` sont reproductibles : `npm run shots` (`scripts/capture-project-shots.mjs`).  
Les `*-full` font jusqu’à 5400 px (desktop) / 10 800 px (mobile @2x) de haut : **les recadrer en CSS** (`object-fit: cover; object-position: top`) dans un cadre, jamais les afficher en entier.

---

## Par projet

### Lab Horizon (SAE 501) — `lab-horizon/` · pigment **phtalo glint**

| Fichier | Taille | Usage conseillé |
|---------|--------|-----------------|
| `hero-laboratoire.webp` | 1920×1080 | Hero de la page / carte d’accueil |
| `hero-biodiversite.webp` | 1920×1080 | Bandeau secondaire |
| `unc-recherche.webp` | 1600×1067 | Contexte (UNC, recherche) |
| `domaines/{biologie,chimie,geoscience,histoire,informatique,mathematiques,physique}.webp` | 600×337 | Grille « 7 domaines » |
| `logo-lab-horizon.svg` | — | Cartel / en-tête |
| `shots/lab-horizon-domaine-mobile.webp` | 277×599 | Écran mobile (fourni) |

**Manque :** captures desktop/mobile de l’app → lancer `docker compose up -d` dans *Projet SAE 501*, puis `npm run shots -- lab-horizon` (cibles `localhost:8080/` et `/recherche`). Ne jamais montrer d’écran avec identifiants.

### MagicalLab — `magicallab/` · pigment **cuivre**

Existant : `cover.jpg`, `cover-featured.jpg`, `scene-*.jpg` + GLB `public/documents/elements/{magic_portal,robot}.glb`.  
**Manque :** captures WebGL → `npm run shots -- magicallab --headed` sur ton PC (le headless rend un canvas noir).

### Micro-monde (AR) — `micromonde/` · pigment **or patiné**

| Fichier | Taille | Usage |
|---------|--------|-------|
| `modele-tortue.webp` | 706×440 | Galerie « modèles 3D » |
| `modele-loriquet.webp` | 1200×654 | Galerie « modèles 3D » |
| `fresques-propositions-kuby-kolor.webp` | 1000×1431 | Contexte fresques — **créditer l’artiste Kuby Kolor** |

Existant : `cover.png` (1,3 Mo → à convertir en WebP lors de l’intégration).  
**Manque :** capture du parcours AR **prise sur téléphone** (sur desktop le site n’affiche que le QR « Scan to continue » d’8th Wall — utilisable seulement comme vignette « Essayer sur mobile »).

**Rôle de Léandre (confirmé 2026-10-21) :** création des assets 3D, animation, intégration dans 8th Wall (calage sur les fresques, AR) ; direction artistique de l’expérience (typo, couleurs, ton, iconographie) ; conception de l’interface. Les **fresques** sont de l’artiste **Kuby Kolor** — à créditer sur la page.

### Vill’âge Jeunes — `village-jeunes/` · pigment **braise**

| Fichier | Taille | Usage |
|---------|--------|-------|
| `shots/village-jeunes-accueil-desktop.webp` | 1440×900 | Mockup desktop |
| `shots/village-jeunes-accueil-mobile.webp` | 780×1688 | Mockup mobile |
| `shots/village-jeunes-connexion-mobile-fourni.webp` | 273×600 | Écran connexion (fourni, sans données) |

Existant : `cover.png`. Client en production : **captures publiques uniquement**, rien de l’espace membre.

### Visualcom (alternance) — `visualcom/` · pigment **marbre**

| Fichier | Taille | Usage |
|---------|--------|-------|
| `shots/visualcom-home-desktop.webp` / `-full` | 1440×900 / 1440×5400 | Mockup + scroll « long page » |
| `shots/visualcom-home-mobile.webp` / `-full` | 780×1688 / 780×10800 | Mockup mobile |
| `logo-visualcom-blanc.svg`, `logo-oeil-visualcom.svg` | — | Cartel / en-tête |

Existant (page déjà montée) : `desktop.png`, `mobile.png` (sources de `scripts/bake-dual-mockup-screens.py`), `mockup-screens.png`, `section-*.png`.

### HyperLoop (secondaire) — `hyperloop/`

| Fichier | Taille | Usage |
|---------|--------|-------|
| `reference-train.webp` | 1920×1279 | Hero |
| `classe-{standard,confort,premium}.webp` | 1536×1024 | Galerie classes |
| `accueil-agent.webp` | 1536×1024 | Galerie |
| `shots/hyperloop-home-mobile.webp` | 274×599 | Écran mobile |

**À remplacer puis supprimer :** `class-premium.jpg` (2,4 Mo), `welcome-agent.jpg` (1,9 Mo), `cover.jpg` → pointer `hyperloop.html` vers les WebP ci-dessus.  
Captures desktop optionnelles : `ng serve` puis décommenter la cible dans le script.

### Pacific Dataviz (bonus) — `pacific-dataviz/`

| Fichier | Taille | Usage |
|---------|--------|-------|
| `shots/pacific-dataviz-home-{desktop,mobile}.webp` (+ `-full`) | 1440×900 / 780×1688 | Mockups |
| `fond-ocean.webp`, `fond-logos.webp`, `visuel-fichier-2.webp` | ~736×1308 | Visuels du challenge |
| `logo-pacific-dataviz.svg`, `logo-blue-pacific-2050-blanc.svg`, `medaille.svg` | — | Cartel / récompense |

### Borne 2BeAlive (bonus) — `borne-2bealive/`

| Fichier | Taille | Usage |
|---------|--------|-------|
| `croquis.webp` | 1400×787 | Process (croquis) |
| `rendu-1..4.webp` | 1200×612 | Rendus 3D |
| `mockup-borne.webp` | 1600×900 | Visuel principal |
| `borne.glb` | 815 Ko | Showcase 3D (`[data-glb-showcase]`, comme MagicalLab) |

**⚠ Lien mort :** l’iframe de `borne-2bealive.html` pointe sur `visualcom.nc/precommande-borne-2b-alive/` (404). Remplacer par `mockup-borne.webp` + le GLB.

### Spring Boot (secondaire) — `back-springboot/`

**Manque tout :** lancer l’app (`localhost:8080`), décommenter la cible dans `scripts/capture-project-shots.mjs`, `npm run shots -- back-springboot`. Écran de login + une liste suffisent.

---

## Décor peinture (DA §6) — `src/assets/decor/paint/`

Générés par `npm run decor:paint` à partir des 6 références peinture (détail et règles : `docs/DA.md` §6). Chaque geste = texture `<nom>.webp` (relief/lavis inclus) + silhouette `silhouettes/<nom>.svg` (masque recolorable).

| Famille | Fichiers | Usage type |
|---------|----------|-----------|
| Coups de brosse | `swipe-copper`, `swipe-gold`, `swipe-phtalo` | Derrière un titre de section, transition entre blocs |
| Soulignés | `underline-copper`, `underline-phtalo` | Sous un mot-clé, un titre de carte, lien fort |
| Raclée verticale | `smear-vertical-trio` | Bord de page / colonne, à côté du buste |
| Empâtement (signature) | `impasto-cluster` | Une seule fois par page : hero, intro projets, 404 |
| Éclaboussures | `splat-copper`, `splat-phtalo` | Coin de carte (silhouette au pigment du projet), fin de section |
| Floraison | `bloom-trio` | Fond de la section compétences / page jury (opacité ≤ 0,35) |
| Coulures | `drip-gold`, `drip-copper` | Haut d’une image (cartel), bas du hero |
| Gouttes | `droplets-gold` | Puces, numéro de projet |

Toujours décoratif (`alt=""`, `aria-hidden="true"`, `loading="lazy"`), **sans** `mix-blend-mode: screen`.

---------|----------|-----------|
| Coups de brosse | `swipe-copper`, `swipe-phtalo`, `swipe-gold`, `swipe-trio` | Derrière un titre de section, transition entre blocs |
| Trait vertical | `smear-copper-vertical` | Bord de page / colonne |
| Soulignés | `underline-copper`, `underline-phtalo` | Sous un mot-clé, un titre de carte |
| Éclaboussures | `splatter-phtalo`, `splatter-copper` | Coin de carte, fin de section |
| Coulures | `drips-gold`, `drips-copper` | Haut d’une image (cartel), bas du hero |
| Couteau | `knife-phtalo-cluster`, `knife-gold-pair` | Accents géométriques |
| Ponctuation | `dots-gold`, `ring-phtalo` | Puces, numéro de projet |

Toujours en `<img src="…" alt="" aria-hidden="true">` décoratif ou `background-image`, **sans** `mix-blend-mode: screen`.

---

## Hero — `src/assets/hero/`

`bust.glb` (modèle du hero), `bust-designer.jpg` (fallback statique), `hero-atmosphere.jpg` (plaque d’ambiance).

---

## À fournir par Léandre

- [x] CV PDF → `public/documents/cv.pdf` (v2 du 2026-10-21)
- [ ] Captures GPU : `npm run shots -- magicallab --headed` et `npm run shots -- micromonde --headed`
- [ ] Captures locales : Lab Horizon (Docker) et Spring Boot
- [x] Rôle Micro-monde + crédit Kuby Kolor (voir section Micro-monde)
- [ ] URL publique Lab Horizon s’il y en a une (sinon : captures seulement)
