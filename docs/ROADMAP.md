# Roadmap — reprise du projet

**Dernière mise à jour :** 2026-08-07  
**Stack :** Vite + Vanilla TypeScript + CSS (MPA) · Netlify · Supabase (évaluateurs)  
**Positionnement :** Creative developer par conviction — Bac+2 infographie webdesign + Bac+3 développement web (front par intérêt, bases back Spring Boot / Symfony)

Lire avant toute reprise : `AGENTS.md` · `docs/ARCHITECTURE.md` · `docs/SECURITY.md` · `docs/SUPABASE.md`

---

## Comment reprendre (5 min)

1. Lire les **priorités** et la **DA figée** ci-dessous.
2. Lancer `npm install` puis `npm run dev` → `/pages/index.html`.
3. Prendre la **prochaine phase non cochée** (actuellement **Phase D — DA & fil rouge**).
4. Ne pas importer le legacy tel quel ; ne pas casser le hero 3D (buste fracturé).

```bash
npm install
npm run dev
npm run build
```

| Route | Fichier |
|-------|---------|
| Accueil | `/pages/index.html` |
| Projets | `/pages/projects.html` |
| CV | `/pages/cv.html` |
| Contact | `/pages/contact.html` |
| Évaluateur (privé) | `/pages/evaluator.html` |
| Legacy (réf. seule) | `reference/legacy-portfolio/` + `npx serve .` |

---

## Priorités (non négociables)

1. **Architecture** — Vite MPA, HTML / CSS / TS séparés (`docs/ARCHITECTURE.md`).
2. **Décisions déjà prises** — hero 3D (buste fracturé + force field), nav, typo Ubuntu + Updock, logo SVG.
3. **Legacy** — `reference/legacy-portfolio/` = inspiration contenu seulement.
4. **DA & fil rouge** — marbre / antique + splash peinture ou fusain **tout du long** (voir ci-dessous).
5. **Sécurité** — pas de secrets front ; évaluateurs = Supabase RLS + Storage (plus tard).

---

## DA figée (fil rouge visuel)

L’esthétique part du hero et doit **irriguer tout le site**, pas seulement l’accueil.

| Élément | Intention |
|---------|-----------|
| **Marbre** | Texture, matière, bustes / fragments — référence au hero |
| **Antique (romain / grec)** | Composition, typo display (Updock), sobriété monumentale |
| **Splash peinture / fusain** | Accents organiques (couleur ou chalk) qui rythment les sections |
| **Fond** | Sombre / charcoal premium (`variables.css`) |
| **Continuité** | Malgré des blocs HTML, un **fil rouge fluide** : transitions, motifs récurrents, pas d’effet « pages déconnectées » |
| **Motion** | Animations fluides entre sections / pages — **GSAP** (ScrollTrigger, etc.), lazy / page-scoped ; respecter `prefers-reduced-motion` |

### Moodboard (`Assets/Moodboard/` → `src/assets/moodboard/`)

| Fichier | Usage prévu |
|---------|-------------|
| `idea marble presentation.jpg` | Réf. originale (plaque + texte) |
| `marble-atelier-empty.jpg` | **Fond compétences** — même pièce, sans plaque / texte |
| `column-white-1.jpg` / `column-white-2.jpg` | Colonnes antiques (transitions / décors) |
| `column-black.jpg` | Colonne sombre (variante / contraste) |

### Compétences — présentation figée

Inspirée de `idea marble presentation.jpg` :

1. **Fond atelier** = `marble-atelier-empty.jpg` (pièce vide + projecteur central).
2. **6 compétences** en grille **3×2** desktop (2×2 tablette, 1 col mobile), plaques suspendues.
3. **Fondu au noir** haut et bas (voile type « nuage noir »).
4. Plus tard (GSAP) : entrée des plaques au scroll, léger sway.

Composant : `.skills-gallery` + `.marble-slab` (`src/styles/components/skills-gallery.css`).

**À ne pas faire :** dashboard générique, cartes partout, purple glow, crème + serif terracotta (biais IA), casser le hero 3D.

---

## Navigation publique (figée)

| Menu (FR) | Route | Notes |
|-----------|-------|--------|
| Accueil (logo) | `/` → `pages/index.html` | Hero 3D (buste fracturé + force field) défini |
| Mes projets | `/projects.html` | Filtre par domaine |
| Mon CV | `/cv.html` | PDF → `public/documents/cv.pdf` |
| Contact | `/contact.html` | Netlify Forms + liens |

**Mon univers** : section `#univers` sur l’accueil (pas de page dédiée).

Zone privée (hors menu) : `/evaluator.html`.

### Compétences (ordre figé)

1. Dispositifs interactifs  
2. Développement web  
3. Webdesign & UI/UX  
4. Design produit  
5. Création 3D  
6. Animation 2D/3D  

Taxonomie filtre : `src/data/skills.ts`.

---

## Déjà en place (V1 structure)

| Zone | Détail |
|------|--------|
| Architecture, sécurité, Supabase schéma | Docs + RLS prêts ; users/assets plus tard |
| Hero 3D | `features/three-scene/bust-hero*` — buste fracturé (GLTF/Draco) + Rapier + force field curseur + orbite caméra clic droit |
| Hero brush (archivé) | `features/hero-reveal` — conservé sur `pages/hero-legacy.html` (non indexé, hors nav) |
| Brush curseur (accueil) | `features/home-brush` — trait craie continu (pression / largeur variable, multi-pigments) |
| Typo | Ubuntu + Updock (Fontsource, CSP-safe) |
| Logo + favicon | `public/logo-leandre.svg`, `public/favicon.svg` |
| Pages publiques | Accueil, projets (+ filtre), CV, contact |
| Contenu éditorial | Dans le **HTML** (SEO) ; pas de rendu JS pour le texte critique |

---

## Phase D — DA & fil rouge *(priorité maintenant)*

Objectif : une continuité visuelle et animée sur tout le portfolio, dans le vocabulaire marbre / antique / splash.

### D1. Système visuel
- [x] Tokens marbre (`--color-marble*`, `--color-atelier`) dans `variables.css`
- [x] Section compétences type moodboard (atelier + plaques + veils noirs)
- [ ] Affiner texture marbre réelle (photo crop / normal map CSS) si le CSS seul ne suffit pas
- [x] Motifs récurrents : grain, splash fusain/peinture, colonnes moodboard — **fait sur l’accueil** (couche `home-decor` : grain SVG, buste/colonne/laurier esquissés, splashes ember, traces sur plaques marbre ; assets `src/assets/decor/`)
- [x] Brush curseur interactif (accueil, **livré 2026-08-07**) — `features/home-brush/` : smudge chalk (`--color-accent`) + splash multicolore fréquent et volumineux (7 teintes `--color-splash-*` + ember/or, forme irrégulière avec gouttelettes satellites) au passage du curseur, accumulés sur tout `<main>` (pas de fondu), canvas derrière le buste (`--z-home-brush: 0`, hero transparent, `mix-blend-mode: screen` pour lisibilité sur le charcoal)
- [ ] Appliquer le fil rouge sur **projets, CV, contact** (pas seulement l’accueil) — réutiliser les assets `src/assets/decor/` et envisager d'étendre `home-brush` aux autres pages
- [ ] Cohérence header / footer avec la DA antique + splash

### D2. Motion (GSAP)
- [ ] Ajouter **GSAP** (+ ScrollTrigger si besoin) — *demander validation avant `npm install`*
- [ ] Feature dédiée `src/scripts/features/page-motion/` (pas de GSAP global lourd sur toutes les pages sans lazy)
- [ ] Transitions fluides entre **blocs** (reveal, scrub léger, handoff hero → univers)
- [ ] Continuité entre **pages** (entrée / sortie cohérente, même langage)
- [ ] Remplacer ou enrichir `reveal-on-scroll` actuel avec GSAP, sans casser le SEO
- [ ] `prefers-reduced-motion` : skip / versions statiques

### D3. Hero (affinage dans la DA)
- [x] Hero 3D — buste fracturé (`src/assets/hero/bust-fractured.glb`) + force field (voir Phase E)
- [x] Rotation caméra au clic droit maintenu + glisser, retour en douceur après 5s d'immobilité (**livré 2026-08-07** — voir Phase E, `bust-hero-orbit.ts`)
- [ ] Affiner éclairage / matière marbre du buste 3D (environment map ?)
- [x] Vérifier que les splashs du hero dialoguent avec ceux des sections suivantes — répondu par le brush curseur interactif (D1) qui prolonge le geste du hero sur toute la page

### D4. Contenu & médias (en parallèle possible)
- [ ] Déposer `public/documents/cv.pdf`
- [ ] Dates / écoles exactes sur `pages/cv.html`
- [ ] Visuels projets (marbre / fusain / photos) — plus de placeholders initiaux

---

## Phase A — Reste front (après ou pendant D)

- [ ] Responsive fin + a11y pass
- [ ] Perf images (formats, tailles, lazy hors hero)
- [ ] SEO meta / OG image de marque

---

## Phase E — Three.js *(hero fracturé + force field — livré 2026-08-07)*

**Décision (2026-08-04, livrée 2026-08-07) :** le hero canvas-brush est remplacé par un objet 3D
fracturé (buste marbre en éclats), un champ de force léger qui suit le curseur pousse les
fragments (rigid bodies dynamiques, damping élevé + rappel doux vers la position/rotation de
repos — voir note terminologie ci-dessous), paramétrable en dev via un panneau GUI. **Reste 100%
vanilla TS — pas de React** (cohérent avec la décision stack ci-dessus) : Leva écarté (lib React),
**Tweakpane** retenu à la place. L'ancien hero (canvas brush) n'a pas été supprimé : il vit sur
`pages/hero-legacy.html` (non indexé, hors nav) — voir tableau "Déjà en place" ci-dessus.

### Dépendances installées

| Paquet | Version | Type | Pourquoi |
|--------|---------|------|----------|
| `three` | `0.185.1` (exact, pas de `^`) | dependency | Moteur de rendu 3D. Pinné en dur : breaking changes fréquents sur les `examples/` (loaders, controls) entre versions mineures. |
| `@types/three` | `^0.185.3` | devDependency | Three.js ne fournit plus ses propres types depuis r126 (déplacés vers DefinitelyTyped) — requis pour la complétion TS. |
| `@dimforge/rapier3d-compat` | `^0.19.3` | dependency | Moteur physique (WASM). Build `-compat` choisi spécifiquement : évite les soucis de top-level `await` avec Vite. |
| `tweakpane` | `^4.0.5` | dependency | Panneau de paramétrage vanilla (alternative à Leva, qui est React-only). |
| `@tweakpane/core` | `^2.0.5` | devDependency | **Requis par Tweakpane lui-même** pour les types TS (`Pane` étend des classes définies dans ce paquet) — comportement documenté par le mainteneur, pas une dépendance qu'on a choisi d'ajouter. Types uniquement, absent du bundle final. |

`npm audit` : 0 vulnérabilité après installation initiale (un correctif transitif `postcss`/`nanoid`
hérité de Vite a été appliqué au passage via `npm audit fix`, sans changement de version directe).
**À revérifier** après l'ajout de `@tweakpane/core` (`npm install` puis `npm audit` — voir note
shell cassé plus bas).

### Terminologie physique — à ne pas confondre

Un rigid body **"Passive"** (Blender) / **"Fixed"** (Rapier) ne bouge jamais, même sous une force.
Pour que le champ de force pousse les fragments, il faut des bodies **Dynamic**, avec un
damping linéaire/angulaire élevé (pour qu'ils reviennent vite au repos, effet visuel "léger")
+ une force de rappel douce vers la position d'origine. Le champ de force n'ajoute qu'une
impulsion ponctuelle par-dessus (voir détail algorithme dans l'historique de conversation).

### Implémentation (`src/scripts/features/three-scene/`)

| Fichier | Rôle |
|---------|------|
| `bust-hero.types.ts` | Types partagés (options, params physiques, fragment) |
| `bust-hero-scene.ts` | Renderer/caméra/lumières Three.js, chargement GLTF+Draco, recentrage + aplatissement des 50 éclats |
| `bust-hero-physics.ts` | Monde Rapier (gravité nulle), un rigid body **sans collider** par éclat (masse posée explicitement via `setAdditionalMass` — pas de collision inter-éclats, effet décoratif "flottant"), ressort linéaire + angulaire vers la position/rotation de repos, impulsion de poussée curseur |
| `bust-hero-orbit.ts` | Orbite caméra au clic droit maintenu + glisser (yaw/pitch libres, pitch cliqué), rappel exponentiel vers la position de face après un **délai de 5s** d'immobilité une fois relâché — **livré 2026-08-07** |
| `bust-hero-controls.ts` | Panneau Tweakpane (opt-in `?debug` uniquement) : dossiers *Force field* et *Orbit* |
| `bust-hero.ts` | Orchestration : chargement, boucle de rendu, raycast curseur → plan, resize, fallback `prefers-reduced-motion` / WebGL indisponible, dispose |

Les éclats ne se déforment jamais (mesh rigide inchangé) : seule leur transform (position +
rotation) bouge, et elle relaxe toujours vers le repos via les deux ressorts (linéaire + angulaire).

**Orbite caméra (2026-08-07) :** seule la caméra tourne autour du buste — les fragments et leur
simulation Rapier restent inchangés (aucune conversion d'espace nécessaire pour le champ de force).
Choix documenté : faire tourner un `bustGroup` parent aurait cassé la correspondance 1:1 monde
Three.js ↔ monde Rapier (ressorts de rappel qui luttent contre la rotation, plan de curseur qui ne
suit plus les fragments). Le champ de force est mis en pause pendant le drag (`hasCursor = false`)
pour ne pas cumuler les deux interactions.

### CSP (voir `docs/SECURITY.md` §7)

`public/_headers` : `script-src` gagne `'wasm-unsafe-eval'` (WASM Rapier/Draco, pas `eval()` JS) ;
nouvelle directive `worker-src 'self' blob:` (le Worker Blob interne de `DRACOLoader`). Décodeur
Draco self-hosté dans `public/draco/gltf/` (copié depuis `three/examples/jsm/libs/draco/gltf/`,
pas de CDN).

### Todo restant

- [x] `features/three-scene/` — lazy `import()` depuis `home.ts`, une scène (le hero)
- [x] Modèle 3D fracturé du buste — `src/assets/hero/bust-fractured.glb` (50 éclats, Draco, 7.57 Mo)
- [x] Chargement `GLTFLoader` + un rigid body Rapier dynamique par éclat
- [x] Champ de force cursor-follow (raycast → plan, falloff quadratique, impulsion + rappel position/rotation)
- [x] Panneau Tweakpane (opt-in `?debug` uniquement — masqué par défaut)
- [x] Modèle public dans `src/assets/hero/`
- [x] Rotation caméra clic droit + glisser, rappel doux après 5s d'immobilité (`bust-hero-orbit.ts`, `springBackDelaySeconds`)
- [ ] Cohérent avec la DA (marbre / objet antique / borne) — éclairage/matière à affiner (voir D3)
- [ ] Privé / lourd → Supabase Storage (évaluateurs) — sans objet ici, le modèle reste public/léger
- [x] `prefers-reduced-motion` : fallback statique (image, pas de scène/simulation)

### Vérification en attente

```bash
npm install          # installe @tweakpane/core (déjà dans package.json)
npm run build         # tsc --noEmit && vite build — à vérifier après l'ajout de l'orbite caméra et du brush curseur
```

À lancer avant de considérer la Phase E (+ extension orbite) et le brush curseur (Phase D1)
entièrement clos.

---

## Phase B — Évaluateurs *(plus tard)*

- [ ] Comptes Auth + `profiles.role = evaluator`
- [ ] Upload Storage + lignes `project_assets`
- [ ] Checklist `docs/SECURITY.md` §10

---

## Phase C — Déploiement

- [ ] Netlify branché + env `VITE_*`
- [ ] Test prod `_headers` / `_redirects` / formulaire contact
- [ ] Domaine + HTTPS

---

## Règle médias

| Contenu | Où |
|---------|-----|
| Public | `src/assets/` (préféré) ou `Assets/` en attendant renommage |
| Logo / favicon | `public/` |
| Privé (évaluateurs) | Supabase Storage + `project_assets` |
| Legacy | Inspiration only |

---

## Décisions ouvertes (à trancher plus tard)

- Intensité des splashs (discret vs signature forte)
- GSAP page transitions MPA (View Transitions API vs overlay GSAP)
- « Mon univers » reste une section ou devient une page si le contenu grossit
