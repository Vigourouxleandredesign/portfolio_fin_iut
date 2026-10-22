# Micro-monde — brief page projet

| Champ | Valeur |
|---|---|
| Slug / route | `micromonde` · `/projects/micromonde` → `pages/projects/micromonde.html` (squelette existant à **réécrire**) |
| Statut | Vedette n° III |
| Pigment | or patiné (`--color-project-micromonde`) |
| Année · contexte | 2026 · Nuit de la Science (7 octobre 2026), fresques du campus de l’UNC |
| Démo | https://micromonde-ar.netlify.app/ — **mobile uniquement** (AR caméra) |
| Sources | `Liste des projets/Projet Micro-monde/Code/micromonde-parcours-ar/README.md`, `DA.md`, `Dossier Trajectoire Micro-monde V2.pdf` |

## Rôle de Léandre (confirmé 2026-10-21)

Création des assets 3D, animation, intégration dans 8th Wall pour qu’ils se calent sur les fresques et tiennent en réalité augmentée ; direction artistique de l’expérience (typographie, couleurs, ton, iconographie) ; conception de l’interface. Les fresques sont l’œuvre de l’artiste **Kuby Kolor**.

## Contenu prêt à coller

**Cartel :** `N° III · 2026 · Nuit de la Science — UNC` · stack `Blender · 8th Wall · Three.js · Vite · TypeScript`

**H1 :** Micro-monde

**Accroche :**
> Scannez une fresque, et un petit monde en sort. Une tortue, un loriquet, un hibiscus prennent vie en 3D sur les murs du campus — directement dans le navigateur du téléphone.

**En bref**
- **Le défi** — Faire apparaître des modèles 3D animés sur des fresques réelles, qui restent ancrés quand on tourne autour, sans application à installer.
- **Mon rôle** — Modélisation et animation 3D, intégration dans 8th Wall, direction artistique et interface.
- **Le résultat** — Un parcours en réalité augmentée présenté à la Nuit de la Science 2026, avec carte des fresques et contenus scientifiques par œuvre.

**Récit**
1. **Des fresques qui s’animent** — Les fresques de Kuby Kolor servent de cibles : le téléphone les reconnaît, puis le suivi de l’espace (SLAM) garde le modèle en place pendant qu’on se déplace.
2. **Modéliser léger** — Chaque animal est modélisé et animé dans Blender, puis allégé en low-poly pour rester fluide sur un téléphone, en plein air.
3. **Une interface à hauteur de mur** — Autour du modèle, quatre boutons ronds ancrés sur l’image ouvrent un panneau « molécule », « histoire » ou « science », avec lecture audio. Une carte situe les fresques sur le campus.
4. **Une identité bois et nature** — Palette olive, taupe et bois, titres manuscrits (Fleur De Leah) et texte en Quicksand : une DA douce, pensée pour des visiteurs de tous âges.

**Ce que j’en retiens :**
> Passer de la 3D « pour l’écran » à la 3D posée dans le réel change tout : poids des modèles, lisibilité en plein soleil, gestes simples. C’est ce projet qui m’a appris à concevoir pour un lieu.

**Crédits (obligatoires, sous la galerie) :** `Fresques : Kuby Kolor. Modèles 3D, animation, intégration AR, direction artistique et interface : Léandre Vigouroux.`

## Visuels (`src/assets/projects/micromonde/`)

> **22/10 :** captures téléphone du parcours AR **reportées** — intégrer la page avec les visuels existants ci-dessous ; laisser un `<!-- TODO L6 captures AR -->` à l’emplacement prévu, sans image vide ni texte « à venir » visible.

| Emplacement | Fichier |
|---|---|
| Hero | `cover.png` → **convertir en `cover.webp`** (lot L0) |
| Récit 1 | `fresques-propositions-kuby-kolor.webp` (légende : « Propositions de fresques — Kuby Kolor ») |
| Récit 2 | `modele-tortue.webp`, `modele-loriquet.webp` |
| Récit 3 | capture téléphone du parcours AR → `shots/micromonde-parcours-ar-mobile.jpg` (**à fournir par Léandre**, photo d’écran sur place) ; en attendant : `shots/micromonde-parcours-mobile.jpg` (QR 8th Wall) utilisé **uniquement** comme vignette « Essayer sur mobile » |
| Démo | bloc « Essayer sur votre téléphone » : QR (capture existante recadrée sur le QR) + lien texte vers la démo |

## DA spécifique

Or patiné : `drip-gold` en haut de la galerie, cartel liseré or. Pas d’iframe (AR mobile). La DA du projet (olive/bois) n’apparaît **que** dans les captures, jamais dans le CSS du portfolio.

## Interdits

Ne pas s’attribuer les fresques. Pas d’iframe desktop. Ne pas embarquer de `.glb` lourds (les GLB restent hors repo).
