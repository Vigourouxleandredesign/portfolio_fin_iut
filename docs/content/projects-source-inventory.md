# Inventaire sources projets — `Liste des projets/`

**Statut :** reachable (vérifié 2026-10-01)  
**Chemin :** `../Liste des projets/` (sibling du repo portfolio)  
**Règle :** ne jamais importer code lourd / `node_modules` / `dist` / GLB massifs — uniquement **picks** → `src/assets/projects/<slug>/` + copy HTML.

Voir aussi : catalogue & démos Netlify dans [`docs/ROADMAP.md`](../ROADMAP.md).

---

## Vue d’ensemble

| Dossier source | Slug | Contenu disque | Priorité picks |
|----------------|------|----------------|----------------|
| `Refonte Visualcom + MCP WordPress` | `visualcom` | Riche (docs, logos, mockup HTML) | Logos + mockup + DA |
| `Projet MagicalLab` | `magicallab` | Code R3F + GLB | Captures scène + `hero.png` |
| `Projet Micro-monde` | `micromonde` | **Le plus riche** (PDF, fresques, targets) | PDF + PNGs + capture AR |
| `Projet HyperLoop` | `hyperloop` | Assets + PDF + MP4 | PDF + hero assets |
| `JAVA (SpringBoot)` | `back-springboot` | Code only | `HELP.md` + **screenshots à faire** |
| `Village Jeunes` | `village-jeunes` | **Vide** | Sources ailleurs à trouver |
| `Projet SAE` | — | **Vide** | — |

**Absents de ce dossier :** Pacific Dataviz, Borne 2BeAlive → legacy portfolio / autre emplacement.

**Démos live (hors dossier, déjà connues) :**

| Projet | URL |
|--------|-----|
| MagicalLab | https://magicallab.netlify.app/ |
| MicroMonde AR | https://micromonde-ar.netlify.app/ |
| Visualcom | https://visualcom.nc/ |

---

## 1. `Refonte Visualcom + MCP WordPress` → `visualcom`

**Contexte :** refonte thème WP + plugins / MCP ; docs DA + archi déjà utiles.

### Utilisable maintenant

| Relatif au dossier | Usage portfolio |
|--------------------|-----------------|
| `docs/Logos/VISUALCOM-LOGO-ss-fond.webp` | Logo / branding fiche |
| `docs/Logos/Logo visualcom oeil pour 404.svg` | Accent / galerie |
| `docs/Logos/Logo Visualcom blanc.svg` | Variante claire |
| `docs/DA.md`, `docs/ARCHITECTURE.md` | Contexte rédaction |
| `plugins-docs/**/ORAL.md` | Notes orales / pitch |
| `visualcom-site-v3 1.html` | Ouvrir → **captures** mockup |

### Skip

Thème PHP complet, zips, fonts licenses (sauf crédit).

### Déjà dans le portfolio

`pages/projects/visualcom.html` + `src/assets/projects/visualcom/` (desktop/mobile/mockup).

---

## 2. `Projet MagicalLab` → `magicallab`

**Contexte :** React + Vite + R3F + Rapier (`React TD2/`) — labo 3D (portal, robot, laboratory).

### Utilisable maintenant

| Relatif | Usage |
|---------|--------|
| `React TD2/src/assets/hero.png` | Cover légère |
| `React TD2/public/favicon.svg` / `icons.svg` | Option branding |

### À produire (pas dans le dossier)

- 2–4 **captures WebGL** de https://magicallab.netlify.app/ (portal, robot, lab)
- Éventuel court enregistrement d’interaction

### Source only (ne pas shipper)

`React TD2/public/models/*.glb` (laboratory, robot, magic_portal) + `node_modules` / `dist`.

### Déjà dans le portfolio

Lien + iframe mockup Mac sur `pages/projects/magicallab.html` ; CSP `frame-src` OK.

---

## 3. `Projet Micro-monde` → `micromonde` *(candidat)*

**Contexte :** parcours AR fresques UNC (Nuit de la Science) — 8th Wall / Three / map Leaflet. Live mobile-only.

### Utilisable maintenant (picks prioritaires)

| Relatif | ~taille | Usage |
|---------|---------|--------|
| `Capture d'écran 2026-08-05 085534.png` | ~1.3 MB | Visuel principal / mockup phone |
| `Dossier Trajectoire Micro-monde V2.pdf` | ~16 MB | Contexte / extraire pages clés en JPG |
| `Tortue.png`, `Loriquet.png` | ~0.4–0.6 MB | Galerie mascottes / fresques |
| `icone son.png` | léger | UI / détail |
| `Code/micromonde-parcours-ar/image-targets/poc-tortue_thumbnail.png` | | Target galerie |
| `…/poc-peruche_thumbnail.png` ou `_luminance.png` | | Idem |
| `…/poc-hibiscus_thumbnail.png` ou `_luminance.png` | | Idem (éviter PNG hibiscus 13–22 MB) |
| `Code/micromonde-parcours-ar/README.md`, `DA.md` | | Copy technique / intention |

### Mise en avant recommandée

Pas d’iframe desktop. Phone mockup + captures + CTA « Ouvrir sur téléphone » (+ QR) → https://micromonde-ar.netlify.app/

### Skip / source only

`.blend`, GLB lourds, `poc-hibiscus.png` full-res, `node_modules`, `dist`.

---

## 4. `Projet HyperLoop` → `hyperloop`

**Contexte :** vitrine Angular Hyperloop NC (i18n) — devoir MIAW.

### Utilisable maintenant

| Relatif | Usage |
|---------|--------|
| `Devoir_Hyperloop/Projet Hyperloop NC.pdf` | Brief / récit |
| `Devoir_Hyperloop/README.md` | Stack / run |
| `Devoir_Hyperloop/public/assets/Hyperloop_image_reference.jpg` | Cover |
| `Devoir_Hyperloop/public/assets/Color Palette _ Grey _ Black _ Orange _ Blue.jpg` | DA |
| `Devoir_Hyperloop/public/assets/classes/{standard,confort,premium}.jpg` | Galerie (lourds ~2 MB — compresser) |
| `Devoir_Hyperloop/public/assets/contact/welcome-agent.jpg` | Galerie |
| `Devoir_Hyperloop/public/assets/hero_arrivee_train.mp4` | Hero motion (1 copie seulement) |

### À produire

Captures UI live (`localhost:4200/fr/` ou build) : home, carte, tarifs.

### Skip

`node_modules`, `dist/` multi-locales (~75 MB), icônes Leaflet.

---

## 5. `JAVA (SpringBoot)` → `back-springboot`

**Contexte :** CRUD Spring Boot + Thymeleaf + Security + MySQL (`tdSpringBoot`).

### Utilisable maintenant

| Relatif | Usage |
|---------|--------|
| `tdSpringBoot/HELP.md` | Contexte run / rôles |

### À produire (rien de visuel sur disque)

Screenshots `localhost:8080` : login, listes livres/auteurs, détail.

### Skip

Arbre Maven, `target/`.

---

## 6. `Village Jeunes` → `village-jeunes`

**État dossier liste :** vide (0 fichier).  
**Décision (2026-10-02) :** clone Git **possible** mais **projet entreprise / client en production** — extrême prudence.

### Règles de curatelle (non négociables)

- **Ne pas** committer le repo client, `.env`, secrets, dumps DB, comptes, URL staging internes.
- **Ne pas** montrer données personnelles / contenus métier sensibles du client.
- **OK :** captures UI anonymisées, stack (Vanilla JS…), pitch, captures d’écrans génériques.
- **Narratif :** aussi dans `../Fiche réflexive/` (`Fiche projet Village Jeunes.docx`, `Fiche de reflexion mission Village jeunes.docx`) — pour copy HTML publique **après** relecture (pas de copier-coller aveugle de secrets éventuels).

### Utilisable pour showcase

| Source | Usage |
|--------|--------|
| Clone local (hors portfolio) | Captures UI seulement |
| DOCX fiches réflexives | Texte public curaté + PDF privé Storage |

### Skip

Code métier complet, configs serveur, tout ce qui identifierait des utilisateurs ou données client.

---

## 7. `Projet SAE`

**État :** dossier **vide**. Pas de slug catalogue pour l’instant.

---

## Workflow de récupération (standard)

1. Ouvrir ce fichier + la fiche `pages/projects/<slug>.html`.
2. Copier **uniquement** les picks listés → `src/assets/projects/<slug>/` (kebab-case, compressés WebP/JPG si > 500 KB).
3. Pour 3D / AR / apps lourdes : **captures** plutôt que modèles.
4. Rédiger le HTML à la main (pas d’`innerHTML` depuis docs externes).
5. Si démo Netlify desktop-friendly → iframe mockup + whitelist `public/_headers` `frame-src`.
6. Si mobile/AR only → mode shots / QR / CTA mobile (pas d’iframe).

### Checklist prochaines actions

| Slug | Action immédiate |
|------|------------------|
| `visualcom` | Déjà avancé — compléter si besoin depuis logos/ORAL |
| `magicallab` | Captures Netlify → assets |
| `micromonde` | Créer fiche + copier picks (validé livraison) |
| `hyperloop` | Copier PDF/hero + compresser classes JPG |
| `back-springboot` | Lancer app → screenshots |
| `pacific-dataviz` / `borne-2bealive` | Chercher hors `Liste des projets` (legacy) |
| `village-jeunes` | Clone curaté (client prod) + copy depuis fiches DOCX |
